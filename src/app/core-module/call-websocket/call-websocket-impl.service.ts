import {Subject} from 'rxjs';
import {Observable} from 'rxjs/src/internal/Observable';
import {Component, ElementRef, Injectable, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PCMPlayer} from '../../../assets/js/pcm/pcm-player.js';
import {flat, compress, encodePCM} from '../../../assets/js/pcm/pcm.js';
import {NoticeMusicService} from '../../shared-module/util/notice-music.service';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {CommonLanguageInterface} from '../../../assets/i18n/common/common.language.interface';
import {ModalButtonOptions, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {environment} from '../../../environments/environment';
import {LanguageEnum} from '../../shared-module/enum/language.enum';
import {ExportMessagePushService} from '../../shared-module/service/message-push/message-push.service';
import {ApplicationInterface} from '../../../assets/i18n/application/application.interface';

declare var WEBSOCKET_PROTOCOL;
const RECONNECT_COUNT = 4;

/**
 * Created by wh1709040 on 2019/2/13.
 */
@Injectable({
  providedIn: 'root'
})
export class CallWebsocketImplService {
  // 国际化处理
  commonLanguage: CommonLanguageInterface;
  public language: ApplicationInterface;
  // 通过订阅的方式拿到消息
  subscribeMessage: Observable<any>;
  // 重连次数
  private reconnectCount = RECONNECT_COUNT;
  private socket;
  private node;
  private stream;
  private context;
  private player;
  private oscillator;
  private soundcardSampleRate;
  // 心跳检测时间 默认半分钟发起一次心跳检测
  private heartCheckTime = 30000;
  private mySampleRate = 8000;
  private myBitRate = 16;
  private chunkSize = 4096;
  // 心跳定时器
  private heartCheckTimer;
  private userName;
  private sipPassword;
  private domain;
  // 关闭定时器
  private closeTimer;
  // 消息订阅流
  private messageTopic;
  private callModal;
  // 重连锁
  private lockReconnect: boolean = false;
  private socketConnected: boolean = false;
  private micAccessAllowed: boolean = false;
  private isAnswered: boolean = false;

  // 重连定期器
  private reconnectTimer;
  private extra;

  constructor(private $noticeMusicService: NoticeMusicService,
              private $message: FiLinkModalService,
              public $modal: NzModalService,
              private $nzI18n: NzI18nService,
              private $exportMessagePush: ExportMessagePushService) {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  /**
   * 连接
   */
  public connect(): void {
    this.lockReconnect = false;
    this.messageTopic = new Subject<any>();
    this.subscribeMessage = this.messageTopic.asObservable();
    if (this.socketConnected) {
      console.log('客户端已连接');
      return;
    }
    if ('WebSocket' in window) {
      // 部署服务器地址
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      let wsProtocol;
      if (location.protocol === 'http:') {
        wsProtocol = 'ws';
      } else {
        wsProtocol = 'wss';
      }
      if (environment.production) {
        this.socket = new WebSocket(`${wsProtocol}://${location.host}` + '/sip/websocket/' + userInfo.id);
      } else {
        this.socket = new WebSocket(`${wsProtocol}://39.99.186.219:4200` + '/sip/websocket/' + userInfo.id);
        // this.socket = new WebSocket(`${wsProtocol}://10.18.22.11:14200` + '/sip/websocket/' + userInfo.id);
      }
      this.socket.onopen = () => {
        console.log('callwebsocket 连接成功');
        // this.createModal();
        // 开启心跳检测
        this.heartCheckStart();
        this.reconnectCount = RECONNECT_COUNT;
        this.socketConnected = true;
      };
      this.socket.onmessage = (event) => {
        this.heartCheckStart();
        this.messageTopic.next(event);
        this.receiveData(event.data);
      };
      this.socket.onclose = () => {
        console.log('连接关闭');
        this.socketConnected = false;
        this.reconnect();
      };
      this.socket.onerror = () => {
        console.log('连接失败, 发生异常了');
        this.reconnect();
      };
    } else {
      console.log('您的浏览器不支持WebSocket');
    }

  }

  /**
   * 关闭
   */
  public close(): void {
    if (this.socket) {
      this.clearTimer(this.heartCheckTimer);
      this.clearTimer(this.closeTimer);
      this.clearTimer(this.reconnectTimer);
      this.socket.close();
      this.messageTopic.next();
      this.messageTopic.complete();
      this.lockReconnect = true;
      this.reconnectCount = 0;
    }
  }

  /**
   * 获取数据（可能存在隐患）
   * 建议适用订阅的方式获取数据
   * param {(event) => {}} fn
   */
  public getMessage(fn: (event) => {}): void {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        if (fn) {
          fn(event);
        }
      };
    }
  }

  /**
   * 重新连接
   */
  private reconnect(): void {
    if (this.lockReconnect) {
      return;
    }
    this.lockReconnect = true;
    this.clearTimer(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      console.log('重连剩余次数' + this.reconnectCount);
      if (this.reconnectCount === 0) {
        return;
      }
      this.reconnectCount--;
      this.connect();
    }, 4000);
  }

  /**
   * 清空定时器
   * param timer
   */
  private clearTimer(timer: number): void {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  /**
   * 心跳开始
   */
  private heartCheckStart(): void {
    this.clearTimer(this.heartCheckTimer);
    this.clearTimer(this.closeTimer);
    this.heartCheckTimer = setTimeout(() => {
      this.socket.send('ping');
      console.log('正在ping服务器。。。。。。。');
      this.closeTimer = setTimeout(() => {
        console.log('关闭服务');
        this.socket.close();
      }, 5000);
    }, this.heartCheckTime);

  }

  public receiveData(data) {
    const that = this;
    if (typeof (data) === 'string') { // json字符串消息
      if (data === 'alive') {
        console.log('call websocket has alive');
      } else {
        const json = JSON.parse(data);
        const type = json.type;
        const code = json.code;
        const errorMsg = json.msg;
        switch (type) {
          case 'REGIST': // 注册
            if (code === '1') { // 成功
              console.log('用户注册成功');
              that.socketConnected = true;
            } else { // 失败
              console.log('用户注册失败');
              that.$exportMessagePush.messagePush({
                title: this.commonLanguage.systemMsg,
                msg: errorMsg,
                button: [{
                  text: '重新注册',
                  handle: (closeNz) => {
                    that.registCommand();
                    closeNz.emit();
                  }
                }]
              });
              // this.$message.info(errorMsg);
            }
            break;
          case 'UNREGIST': // 注销
            if (code === '1') { // 成功
              console.log('用户注销成功');
              // this.close();
            } else { // 失败
              console.log('用户注销失败');
            }
            break;
          case 'CALL': // 呼叫
            if (code === '1') { // 成功
              console.log('呼叫成功');
            } else { // 失败
              this.$message.info(errorMsg);
            }
            break;
          case 'HANGUP': // 挂断
            if (code === '1') { // 成功
              console.log('挂断成功');
              this.$message.info('已挂断');
              this.isAnswered = false;
              // 挂断后置为呼叫状态
              // callState();
              that.stopTalking();
            } else if (code === '2') { // 主动挂断
              this.$message.info(errorMsg);
              this.isAnswered = false;
              that.stopTalking();
            } else { // 失败
              this.$message.info(errorMsg);
            }
            break;
          case 'ACCEPT': // 接听
            if (code === '1') { // 成功
              console.log('接听成功');
              this.isAnswered = true;
              this.$exportMessagePush.messagePush({
                title: this.commonLanguage.systemMsg,
                msg: '开始对讲',
                button: []
              });
              setTimeout(function () {
                that.startTalking();
              }, 1000);
            } else { // 失败
              this.isAnswered = false;
              console.log('接听失败');
              this.$message.info(errorMsg);
            }
            break;
          case 'CALL_INCOMING': // 来电
            const obj = JSON.parse(json.msg);
            // 放在全局监听
            this.createModal(obj);
            this.$noticeMusicService.noticeMusic();
            break;
          case 'REMOTE_ACCEPT': // 被叫接听
            console.log('对方已接听');
            this.$exportMessagePush.messagePush({
              title: this.commonLanguage.systemMsg,
              msg: '对方已接听',
              button: []
            });
            setTimeout(function () {
              that.startTalking();
            }, 1000);
            break;
          case 'REMOTE_HANGUP': // 被叫挂断
            // 提示框消失;
            that.stopTalking();
            this.isAnswered = false;
            if (this.callModal) {
              this.callModal.destroy();
            }
            break;
          case 'REMOTE_RINGING': // 被叫响铃
            console.log('对方正在响铃');
            break;
          default:
            break;
        }
      }
    } else { // 二进制消息
      if (this.micAccessAllowed) {
        const buffer = (new Response(data)).arrayBuffer();
        if (!that.player) {
          this.player = new PCMPlayer({
            encoding: '16bitInt',
            channels: 1,
            sampleRate: 8000,
            flushingTime: 2000
          });
        }
        buffer.then(function (buf) {
          const feed = new Uint8Array(buf);
          that.player.feed(feed);
        });
      }
    }
  }

  public registCommand() {
    if (this.socket) {
      const sipInfo = JSON.parse(localStorage.getItem('sipUserInfo'));
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.extra = {
        userId: userInfo.id,
        userName: userInfo.userName,
        userCode: userInfo.userCode,
        roleId: userInfo.roleId,
        roleName: userInfo.role.roleName,
        tenantId: userInfo.tenantId,
        token: userInfo.token,
      };
      this.userName = sipInfo.sipUsername;
      this.sipPassword = sipInfo.sipPassword;
      this.domain = sipInfo.domain;
      const request = {
        commandId: 'REGIST',
        userName: JSON.stringify(this.userName),
        password: this.sipPassword,
        domain: this.domain,
        extra: this.extra
      };
      console.log(request, '注册');
      this.socket.send(JSON.stringify(request));
    }
  }

  public inviteCommand(id) {
    const localRegist = localStorage.getItem('isRegist');
    let isRegist = false;
    isRegist = localRegist && localRegist === 'true';
    if (!isRegist) {
      this.$message.warning('请激活sip账号!');
      return;
    }
    const inviteTarget = 'sip:' + id + '@10.99.20.200:5060';
    if (this.socket) {
      const request = {
        'commandId': 'INVITE',
        'target': inviteTarget
        // 'target': 'sip:{}@10.99.20.200:5060'
      };
      this.socket.send(JSON.stringify(request));
    } else {
      this.$message.info(this.commonLanguage.callRetryMsg);
    }
  }

  public hangupCommand() {
    if (this.socket) {
      const request = {
        'commandId': 'HANGUP',
      };
      window.clearInterval();
      this.socket.send(JSON.stringify(request));
      CallIncomingComponent.prototype.clearTimeInterval();
    }
  }

  public acceptCommand() {
    if (this.socket) {
      const request = {
        'commandId': 'ACCEPT',
      };
      console.log(request, '接听');
      this.socket.send(JSON.stringify(request));
    }
  }

  public startTalking() {
    const that = this;
    if (this.hasGetUserMedia()) {
      that.context = new window['AudioContext'] || new window['webkitAudioContext'];
      that.soundcardSampleRate = that.context.sampleRate; // 输入采样率,声卡采集设备
      navigator.getUserMedia = (navigator.getUserMedia || navigator['webkitGetUserMedia'] || navigator['mozGetUserMedia'] || navigator['msGetUserMedia']);
      navigator.getUserMedia({audio: true}, function (s) {
        that.micAccessAllowed = true;
        that.stream = s;
        const liveSource = that.context.createMediaStreamSource(that.stream);
        if (!that.context.createScriptProcessor) {
          that.node = that.context.createJavaScriptNode(that.chunkSize, 1, 1);
        } else {
          that.node = that.context.createScriptProcessor(that.chunkSize, 1, 1);
        }

        that.node.onaudioprocess = function (e) {
          const inData = e.inputBuffer.getChannelData(0);
          const outData = e.outputBuffer.getChannelData(0);
          // TODO压缩编码
          let data = flat(inData);
          // 根据输入输出比例 压缩或扩展
          data = compress(data, that.soundcardSampleRate, that.mySampleRate);
          if (!that.socketConnected) {

          } else {
            // 按采样位数重新编码
            that.socket.send(encodePCM(data, that.myBitRate, true));
          }
        };
        liveSource.connect(that.node);

        that.node.connect(that.context.destination);
      }, function (err) {
        console.log(err);
      });
    } else {
      alert('getUserMedia() is not supported in your browser');
    }
  }

  public stopTalking() {
    if (this.node) {
      this.node.disconnect();
      this.node = null;
    }
    if (this.stream && this.stream.getTracks) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.context && this.context.close && this.context.state !== 'closed') {
      this.context.close();
      this.context = null;
    }
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }

  public hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator['webkitGetUserMedia'] ||
      navigator['mozGetUserMedia'] || navigator['msGetUserMedia']);
  }

  /**
   *  处理入数据消息
   */
  private createModal(msg: any): void {
    const footer: ModalButtonOptions[] = [{
      label: '接听',
      type: 'primary',
      show: true,
      onClick: (comp) => {
        comp.$message.$modalService.openModals[0].nzFooter[0].show = false;
        if (!this.isAnswered) {
          this.acceptCommand();
          CallIncomingComponent.prototype.setTimeInterval(msg);
        } else {
          this.$message.warning('暂不支持该操作');
        }
      }
    },
      {
        label: '挂断',
        type: 'danger',
        onClick: () => {
          this.isAnswered = false;
          this.hangupCommand();
          this.callModal.destroy();
        }
      }];
    this.callModal = this.$modal.create({
      nzTitle: '来电',
      nzContent: CallIncomingComponent,
      nzOkText: '接听',
      nzOkDisabled: true,
      nzCancelDisabled: true,
      nzCancelText: '拒绝',
      nzWidth: 550,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzComponentParams: {
        boxWidth: '500'
      },
      nzOnCancel: () => {
        // 如果还没接听就关闭窗口则挂断
        if (!this.isAnswered) {
          this.hangupCommand();
        } else {
          // 如果接听了关闭窗口则最小化
          this.incomingMinimize();
          this.isAnswered = true;
        }
        this.callModal.destroy();
      },
      nzFooter: footer
    });
  }

  public unregistCommand() {
    if (this.socket) {
      const request = {
        'commandId': 'UNREGIST',
      };
      console.log(request, '注销');
      this.socket.send(JSON.stringify(request));
    }
  }

  public sendAudioData(data) {
    if (this.socket) {
      this.socket.send(data);
    }
  }

  /** 给父组件传达开始执行最小化*/
  public minimizeMessage(): void {
    this.messageTopic.next('minimize');
  }

  /** 给父组件传达停止监听*/
  public minimizeStopListen(): void {
    this.messageTopic.next('stopListen');
  }

  /** 给父组件传达来电最小化*/
  public incomingMinimize(): void {
    this.messageTopic.next('incomingMinimize');
  }
}

/** 来电弹框*/
@Component({
  template: `
    <nz-row id="canvasBox" style="margin-top: 2px;
    margin-bottom: 2px;
    position: relative;
    background-color: #D8D8D8;
    width: 100%;
    height: 300px;">
      <nz-row style="position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        color: #fff;
        background-color: rgba(43,51,63,0.70);">
        <nz-col *ngIf="calltype" nzSpan="6" style="font-weight: 400;">
          <span style="margin-left: 20px">{{calltype}}</span>
        </nz-col>
        <!--呼叫才显示时间-->
        <nz-col
          *ngIf="calltype === language.callWorkbench.calltype3"
          nzSpan="18" style="text-align: right;
          padding-right: 20px;">
          <i class="iconfont fiLink-time" style="color: #A7CDF8;
              margin-right: 10px;"></i>
          <span style="color: #ffffff">{{dateContent}}</span>
        </nz-col>
      </nz-row>
      <nz-row style="margin:0 auto;
      margin-top: 60px;
      text-align: center;
      width:100%;">
        <canvas #mic width="500" height="200"></canvas>
      </nz-row>
    </nz-row>
  `
})
export class CallIncomingComponent implements OnInit {
  @Input() boxWidth: string;
  @ViewChild('mic') mic: ElementRef;

  /**
   * 国际化
   */
  public language: ApplicationInterface;
  private context;
  private soundcardSampleRate;
  private micAccessAllowed: boolean = false;
  private stream;
  public calltype: any;
  public TimeBar: any; // 定时器对象
  // 对讲
  private node;
  private chunkSize = 4096;
  private mySampleRate = 8000;
  // 声波画布相关变量
  public micCanvas;
  public micCanvasContext;
  private player;
  public hour = 0;  // 小时
  public minute = 0; // 分钟
  public second = 0; // 秒
  public dateContent: string = ''; // 计时
  constructor(private callWebsocketImplService: CallWebsocketImplService,
              private $message: FiLinkModalService,
              private $nzI18n: NzI18nService) {
  }

  ngOnInit(): void {
    // 判断连接是否是正常挂断
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    let wsState = false;
    this.callWebsocketImplService.subscribeMessage.subscribe(msg => {
      const that = this;
      if (msg && typeof (msg.data) === 'string') { // json字符串消息
        if (msg.data !== 'alive') {
          const json = JSON.parse(msg.data);
          const type = json.type;
          const code = json.code;
          switch (type) {
            case 'ACCEPT': // 被叫接听
              if (code === '1') { // 成功
                that.calltype = that.language.callWorkbench.calltype3;
                that.clearTimeInterval();
                that.setTimeInterval();
                setTimeout(() => {
                  that.startTalking();
                }, 1000);
              }
              break;
            case 'HANGUP': // 挂断
              if (code !== '0') {
                wsState = true;
                that.calltype = null;
                that.stopTalking();
                that.clearTimeInterval();
                sessionStorage.removeItem('callTime');
                sessionStorage.removeItem('callData');
              }
              break;
            case 'REMOTE_HANGUP': // 被叫挂断
              // 挂断后置为可呼叫、可监听；
              if (code !== '0') {
                wsState = true;
                that.calltype = null;
                that.stopTalking();
                that.clearTimeInterval();
                sessionStorage.removeItem('callTime');
                sessionStorage.removeItem('callData');
              }
              break;
            default:
              break;
          }
        }
      } else if (msg && msg.data && msg.data.type === '') {
        // 通话中
      } else {
        if (!wsState && msg !== 'minimize' && msg !== 'incomingMinimize') {
          // 连接中断或连接不正常
          this.calltype = null;
          that.stopTalking();
          sessionStorage.removeItem('callTime');
          sessionStorage.removeItem('callData');
          this.$message.error('连接中断');
        }
      }
    });
  }

  public startTalking(): void {
    const that = this;
    if (this.hasGetUserMedia()) {
      that.context = new window['AudioContext'] || new window['webkitAudioContext'];
      that.soundcardSampleRate = that.context.sampleRate; // 输入采样率,声卡采集设备
      navigator.getUserMedia = (navigator.getUserMedia || navigator['webkitGetUserMedia'] || navigator['mozGetUserMedia'] || navigator['msGetUserMedia']);
      navigator.getUserMedia({audio: true}, function (s) {
        that.micAccessAllowed = true;
        that.stream = s;
        const liveSource = that.context.createMediaStreamSource(that.stream);

        if (!that.context.createScriptProcessor) {
          that.node = that.context.createJavaScriptNode(that.chunkSize, 1, 1);
        } else {
          that.node = that.context.createScriptProcessor(that.chunkSize, 1, 1);
        }

        that.node.onaudioprocess = function (e) {
          const inData = e.inputBuffer.getChannelData(0);
          const outData = e.outputBuffer.getChannelData(0);
          that.drawLine(inData);
          // TODO压缩编码
          let data = flat(inData);
          // 根据输入输出比例 压缩或扩展
          data = compress(data, that.soundcardSampleRate, that.mySampleRate);
          // 按采样位数重新编码
          // that.callWebsocketImplService.sendAudioData(encodePCM(data, that.myBitRate, true));
        };
        liveSource.connect(that.node);

        that.node.connect(that.context.destination);
      }, function (err) {
        console.log(err);
      });
    } else {
      alert('getUserMedia() is not supported in your browser');
    }
  }

  public hasGetUserMedia(): boolean {
    return !!(navigator.getUserMedia || navigator['webkitGetUserMedia'] ||
      navigator['mozGetUserMedia'] || navigator['msGetUserMedia']);
  }

  public drawLine(data): void {
    this.micCanvas = this.mic.nativeElement;
    this.micCanvasContext = this.mic.nativeElement.getContext('2d');
    this.micCanvasContext.fillStyle = '#FF0000';
    this.micCanvas.width = this.boxWidth;
    this.micCanvasContext.clearRect(0, 0, this.micCanvas.width, this.micCanvas.height);
    for (let i = 0; i < data.length; i++) {
      this.micCanvasContext.fillRect(i, data[i] * 100 + 100, 1, 1);
    }
  }

  public stopTalking(): void {
    if (this.node) {
      this.node.disconnect();
      this.node = null;
    }
    if (this.stream && this.stream.getTracks) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.context && this.context.close && this.context.state !== 'closed') {
      this.context.close();
      this.context = null;
    }
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    this.callWebsocketImplService.stopTalking();
    // 清除画布
    if (this.micCanvasContext) {
      this.micCanvasContext.clearRect(0, 0, this.micCanvas.width, this.micCanvas.height);
    }
  }

  /**
   * 开启定时器
   */
  public setTimeInterval(msg?: any): void {
    let callTime = {
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      dateContent: this.dateContent,
    };
    sessionStorage.setItem('callTime', JSON.stringify(callTime));
    this.TimeBar = setInterval(() => {
      this.second++;
      if (this.second >= 60) {
        this.second = 0;
        this.minute = this.minute + 1;
      }
      if (this.minute >= 60) {
        this.minute = 0;
        this.hour = this.hour + 1;
      }
      const hour = this.hour < 10 ? '0' + this.hour : this.hour;
      const minute = this.minute < 10 ? '0' + this.minute : this.minute;
      const second = this.second < 10 ? '0' + this.second : this.second;
      const content = hour + ':' + minute + ':' + second;
      this.dateContent = content;
      callTime = {
        hour: this.hour,
        minute: this.minute,
        second: this.second,
        dateContent: this.dateContent,
      };
      sessionStorage.setItem('callTime', JSON.stringify(callTime));
    }, 1000);
    if (msg) {
      const callData = {
        equipmentId: msg.equipmentId,
        equipmentName: msg.equipmentName,
        equipmentModelType: msg.equipmentModelType,
        sequenceId: msg.sequenceId
      };
      sessionStorage.setItem('callData', JSON.stringify(callData));
    }
  }

  /**
   * 关闭定时器
   */
  public clearTimeInterval(): void {
    window.clearInterval(this.TimeBar);
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.dateContent = '00:00:00';
  }
}
