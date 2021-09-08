import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import Video from 'video.js';
import zh_CN from './zh_CN';
import en from './en';
import * as $ from 'jquery';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../enum/language.enum';
import {VideoControlEnum} from '../../enum/video-control.enum';

/**
 * 视频播放组件
 */
@Component({
  selector: 'xc-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit, OnDestroy {
  /** 当一个页面有多个视频播放器时使用*/
  @Input() videoId: string = 'video';
  /** 是否需要切换上一条下一条按钮*/
  @Input() hasChangeBtn = false;
  /** 视频容器宽高配置项*/
  @Input() options = {width: '300px', height: '300px'};
  /** 是否父组件控制上一条下一条按钮*/
  @Input() isControl = false;
  @Output() handlePrevChange = new EventEmitter<VideoControlEnum>();
  @Output() handleNextChange = new EventEmitter<VideoControlEnum>();
  public language: CommonLanguageInterface;
  /** 视频源地址*/
  private sources: Array<string> = [];
  /** 当前播放视频的索引*/
  private idx = 0;
  private video;

  constructor(private $message: FiLinkModalService,
              private $i18n: NzI18nService) {
    this.language = this.$i18n.getLocaleData(LanguageEnum.common);
  }

  /** 视频播放源地址*/
  @Input()
  set sourceArray(arr: Array<string>) {
    if (arr.length) {
      this.idx = 0;
      if (this.video) {
        this.video.src(arr[this.idx]);
      }
      this.sources = arr;
    }
  }

  ngAfterViewInit() {
    Video.addLanguage(zh_CN.local, zh_CN);
    Video.addLanguage(en.local, en);
    const languageType = localStorage.getItem('localId') || 'zh_CN';
    this.video = new Video(this.videoId, {
      controls: true,
      loop: false,
      language: languageType,
      controlBar: {
        progressControl: false,
        fullscreenToggle: false,
        pictureInPictureToggle: false,
        volumePanel: false,
        remainingTimeDisplay: false,
        playToggle: true
      }
    });
    this.registerButton();
    if (this.sources.length) {
      this.video.src(this.sources[this.idx]);
    }
  }

  ngOnDestroy() {
    // 组件销毁时销毁video
    this.video.dispose();
  }

  /**
   * 播放上一条
   */
  public changePrev(): void {
    if (this.isControl) {
      this.handlePrevChange.emit(VideoControlEnum.prev);
    } else {
      if (this.idx - 1 < 0) {
        this.$message.warning(this.language.isFirstItem);
      } else {
        this.idx = this.idx - 1;
        this.video.src(this.sources[this.idx]);
        this.video.play();
      }
    }
  }

  /**
   * 播放下一条
   */
  public changeNext(): void {
    if (this.isControl) {
      this.handleNextChange.emit(VideoControlEnum.next);
    } else {
      if (this.idx + 1 >= this.sources.length) {
        this.$message.warning(this.language.isLastItem);
      } else {
        this.idx = this.idx + 1;
        this.video.src(this.sources[this.idx]);
        this.video.play();
      }
    }
  }

  /**
   * 注册上一条下一条按钮
   */
  private registerButton(): void {
    // 播放上一条按钮
    const prevButton = Video.getComponent('button');
    Video.registerComponent('prevButton', Video.extend(prevButton, {
      constructor: function () {
        prevButton.apply(this, arguments);
      },
      handleClick: () => {
        this.changePrev();
      },
      buildCSSClass: () => {
        return this.hasChangeBtn ?
          'vjs-control vjs-button iconfont fiLink-pic-left register-btn register-prev-btn'
          : 'vjs-control vjs-button iconfont fiLink-pic-left register-btn register-prev-btn register-btn-hidden';
      },
      createControlTextEl: button => {
        return $(button).attr('title', this.language.previous);
      }
    }));

    // 播放下一条按钮
    const nextButton = Video.getComponent('button');
    Video.registerComponent('nextButton', Video.extend(nextButton, {
      constructor: function () {
        nextButton.apply(this, arguments);
      },
      handleClick: () => {
        this.changeNext();
      },
      buildCSSClass: () => {
        return this.hasChangeBtn ? 'vjs-control vjs-button iconfont fiLink-pic-right register-btn'
          : 'vjs-control vjs-button iconfont fiLink-pic-right register-btn register-btn-hidden';
      },
      createControlTextEl: button => {
        return $(button).attr('title', this.language.next);
      }
    }));

    this.video.getChild('controlBar').addChild('prevButton', {});
    this.video.getChild('controlBar').addChild('nextButton', {});
  }
}
