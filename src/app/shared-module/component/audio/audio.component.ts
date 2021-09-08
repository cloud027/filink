import {Component, EventEmitter, OnInit, Output} from '@angular/core';

/**
 * 播放组件
 */
@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit {
  // 停止播放
  @Output() stopAudio = new EventEmitter();
  // 当前播放次数
  public start;
  // 总播放次数
  public times = 1;
  // audio标签元素
  public audioElem;

  constructor() {
  }

  /**
   * 告警播放音乐
   */
  public alarmMusic(data?): void {
    this.audioElem = document.querySelector('#audio');
    this.start = 0;
    if (data.msg.alarmMessage.playCount) {
      this.times = data.msg.alarmMessage.playCount;
    }
    if (data.msg.alarmMessage.prompt) {
      this.audioElem.src = `assets/audio/${data.msg.alarmMessage.prompt}`;
      this.audioElem.play().catch(err => {
      });
    }
  }

  /**
   * 告警播放音乐 结束时
   */
  public audioEnded(): void {
    this.start++;
    if (this.start < this.times) {
      this.audioElem.play().catch(err => {
      });
    } else {
      this.stopAudio.emit();
    }
  }

  ngOnInit() {
  }

}
