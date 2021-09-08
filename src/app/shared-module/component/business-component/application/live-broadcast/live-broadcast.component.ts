import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import * as flvjs from '../../../../../../assets/js/flv/flv.js';
import {PassagewayModel} from '../../../../../business-module/application-system/share/model/passageway.model';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import { NzI18nService } from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../enum/language.enum';
import {CommonUtil} from '../../../../util/common-util';

@Component({
  selector: 'app-live-broadcast',
  templateUrl: './live-broadcast.component.html',
  styleUrls: ['./live-broadcast.component.scss']
})
export class LiveBroadcastComponent implements OnDestroy {

  /** 当一个页面有多个视频播放器时使用*/
  @Input() videoId: string = 'video';
  /** 视频容器宽高配置项*/
  @Input() options = {width: '1280px', height: '720px'};
  /** 通道数据*/
  @Input() channelData: PassagewayModel;
  /** 字体*/
  @Input() playIcon: number;
  /**
   * 播放停止的权限码
   */
  @Input() operatePermission: string;

  /** 直播流地址*/
  @Input() set url(value: string) {
    this.videoId = CommonUtil.getUUid();
    this._url = value || '';
    if (value) {
      if (this.flvPlayer) {
        this.stop();
      }
      this.initPlayer();
      this.isPlay = true;
    } else {
      if (this.flvPlayer) {
        this.stop();
      }
      if (!this.flvPlayer) {
        this.loadVideo();
      }
      this.isPlay = false;
    }
  }

  get url() {
    return this._url;
  }

  // 开始播放
  @Output() public startPlay = new EventEmitter();
  // 停止播放
  @Output() public stopPlay = new EventEmitter();
  /** 当前的播放器*/
  player: any;
  /** 创建flvjs的对象*/
  flvPlayer: any;
  /** 是否在播放   false没有播放  true正在播放*/
  isPlay: boolean = false;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  private _url: string = '';

  constructor(private $nzI18n: NzI18nService) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  loadVideo() {
    Promise.resolve().then(() => {
      this.player = document.getElementById(this.videoId);
      if (flvjs.default.isSupported() && this.player) {
        // 创建flvjs对象
        this.flvPlayer = flvjs.default.createPlayer({
          type: 'flv',        // 指定视频类型
          isLive: true,       // 开启直播
          hasAudio: false,    // 关闭声音
          cors: true,         // 开启跨域访问
          url: this.url,      // 指定流链接
        });

        // 将flvjs对象和DOM对象绑定
        this.flvPlayer.attachMediaElement(this.player);
      }
    });
  }

  initPlayer() {
    Promise.resolve().then(() => {
      this.player = document.getElementById(this.videoId);
      if (flvjs.default.isSupported() && this.player) {
        // 创建flvjs对象
        this.flvPlayer = flvjs.default.createPlayer({
          type: 'flv',        // 指定视频类型
          isLive: true,       // 开启直播
          hasAudio: false,    // 关闭声音
          cors: true,         // 开启跨域访问
          url: this.url,      // 指定流链接
        });

        // 将flvjs对象和DOM对象绑定
        this.flvPlayer.attachMediaElement(this.player);
        // 加载视频
        this.flvPlayer.load();
        // 播放视频
        this.flvPlayer.play().then(event => {
          console.log(event);
        }).catch(error => {
          console.log(error);
        });
        this.flvPlayer.on('error', err => {
          console.log(err);
        });
      }
    });
  }

  unload() {
    this.flvPlayer.unload();
  }

  load() {
    // 加载视频
    this.flvPlayer.load();
  }

  play() {
    // 播放视频
    this.flvPlayer.play().then(event => {
      console.log(event);
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    if (this.flvPlayer) {
      this.stop();
    }
  }

  pause(): void {
    this.flvPlayer.pause();
  }

  stop(): void {
    // this.flvPlayer.pause();
    // this.flvPlayer.unload();
    // 卸载DOM对象
    this.flvPlayer.detachMediaElement();
    // 销毁flvjs对象
    this.flvPlayer.destroy();

    this.flvPlayer = null;
  }

  playVideo() {
    this.startPlay.emit(this.channelData);
  }

  stopVideo() {
    // 销毁flvjs对象
    // this.flvPlayer.destroy();
    this.stopPlay.emit(this.channelData);
    this.isPlay = false;
  }

}
