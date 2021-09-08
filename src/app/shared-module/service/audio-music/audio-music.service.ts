import {ComponentRef, Injectable} from '@angular/core';
import {AudioComponent} from '../../component/audio/audio.component';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

/**
 * 音乐播放服务
 */
@Injectable()
export class AudioMusicService {
  private audioMusic: ComponentRef<AudioComponent> | any;
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {
  }

  playAudio(audioData) {
    this.overlayRef = this.overlay.create();
    this.audioMusic = this.overlayRef.attach(new ComponentPortal(AudioComponent));
    this.audioMusic.instance.alarmMusic(audioData);
    this.audioMusic.instance.stopAudio.subscribe(() => {
      this.audioMusic.destroy();
      this.overlayRef.detach();
    });
  }
}
