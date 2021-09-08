import {Injectable} from '@angular/core';
import {SessionUtil} from './session-util';
import {AudioMusicService} from '../service/audio-music/audio-music.service';

@Injectable()
export class NoticeMusicService {

  constructor(private $audioMusicService: AudioMusicService) {
  }

  /**
   * 前端提示音
   */
  public noticeMusic() {
    if (SessionUtil.getMsgSetting().messageRemind === '1' && SessionUtil.getMsgSetting().soundRemind === '1') {
      const data = {
        msg: {
          alarmMessage: {
            prompt: SessionUtil.getMsgSetting().soundSelected
          }
        }
      };
      this.$audioMusicService.playAudio(data);
    }
  }
}
