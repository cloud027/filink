import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ApplicationService} from '../../../../../business-module/application-system/share/service/application.service';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {CallOperateTypeEnum, CallTableEnum} from '../../../../../business-module/application-system/share/enum/call.enum';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {ResultModel} from '../../../../model/result.model';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {CallWebsocketImplService} from '../../../../../core-module/call-websocket/call-websocket-impl.service';
import {SessionUtil} from '../../../../util/session-util';
import {ExportMessagePushService} from '../../../../service/message-push/message-push.service';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {compress, flat} from '../../../../../../assets/js/pcm/pcm.js';
import * as lodash from 'lodash';
import {CallTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';

@Component({
  selector: 'app-call-time-meter',
  templateUrl: './call-time-meter.component.html',
  styleUrls: ['./call-time-meter.component.scss']
})
export class CallTimeMeterComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  // 一键呼叫设备id
  @Input() equipmentId: string;
  @Input() equipmentName: string; // 设备名称
  @Input() sequenceId: string;
  @Input() equipmentModelType: string;
  @Input() boxWidth: string;
  @Input() callData: any;
// 地图
  @ViewChild('micaudio') micaudio: ElementRef;
  @ViewChild('canvasBox') canvasBox: ElementRef;
  public TimeBar: any; // 定时器对象

//   public timer = 0; // 时间
  public hour = 0;  // 小时
  public minute = 0; // 分钟
  public second = 0; // 秒
  public dateContent: string = ''; // 计时

  public isLISTEN: boolean = false;
  // 已呼叫
  public isCall: boolean = false;
  // 已监听
  public isListening: boolean = false;
  public hangupEnable: boolean = false;
  // 是否显示取消监听
  public showCancelListen: boolean = false;
  public callOperateTypeEnum = CallOperateTypeEnum;
  public callTableEnum = CallTableEnum;
  public calltype: any;
  // 对讲
  private node;
  private stream;
  private context;
  private player;
  private oscillator;
  private soundcardSampleRate;
  private mySampleRate = 8000;
  private myBitRate = 16;
  private chunkSize = 4096;
  private micAccessAllowed: boolean = false;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  // 国际化语言枚举
  public languageEnum = LanguageEnum;
  public commonLanguage: CommonLanguageInterface;
  // 设备类型枚举
  public callTypeEnum = CallTypeEnum;
  // 声波画布相关变量
  public micCanvas;
  public micCanvasContext;
  public micCanvasColor;
  public callingId: string = '';
  public listeningId: string = '';
  public handleResize = lodash.debounce((event) => {
    this.calcHeight();
  }, 200);
  // sip账号的注册状态
  public isRegist = false;

  /**
   * @param $applicationService 后台接口服务
   * @param $message 信息提示服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService,
    private $nzI18n: NzI18nService,
    private callWebsocketImplService: CallWebsocketImplService,
    private $exportMessagePush: ExportMessagePushService
  ) {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    window.addEventListener('resize', this.handleResize);
    this.hideTimeItem();
    // 判断连接是否是正常挂断
    let wsState = false;
    this.callWebsocketImplService.subscribeMessage.subscribe(msg => {
      const that = this;
      if (msg && typeof (msg.data) === 'string') { // json字符串消息
        if (msg.data !== 'alive') {
          const json = JSON.parse(msg.data);
          const type = json.type;
          const code = json.code;
          switch (type) {
            case 'REMOTE_ACCEPT': // 被叫接听
              console.log('对方已接听');
              wsState = true;
              this.calltype = this.language.callWorkbench.calltype3;
              if (code === '1') { // 成功
                this.callingId = this.equipmentId;
                this.hangupEnable = true;
                this.isCall = true;
                this.isListening = false;
                that.showTimeItem();
                setTimeout(function () {
                  that.startTalking();
                }, 1000);
              }
              break;
            case 'ACCEPT': // 被叫接听
              console.log('接听成功');
              if (code === '1') { // 成功
                this.calltype = this.language.callWorkbench.calltype3;
                this.hangupEnable = true; // 可挂断
                this.isCall = true;
                this.isListening = false;
                that.hideTimeItem();
                that.showTimeItem();
                setTimeout(function () {
                  that.startTalking();
                }, 1000);
              } else {
                this.isCall = false;
                this.isListening = false;
              }
              break;
            case 'CALL': // 呼叫
              if (code === '1') { // 成功
                console.log('呼叫');
                this.calltype = this.language.callWorkbench.calltype1;
                this.hangupEnable = true;
                // 禁止再次点击呼叫按钮
                // this.isCall = true;
                // } else { // 失败
                // this.isCall = false;
              }
              break;
            case 'HANGUP': // 挂断
              if (code !== '0') {
                wsState = true;
                this.calltype = null;
                this.isCall = false;
                this.isListening = false;
                this.hangupEnable = false;
                this.callingId = '';
                this.listeningId = '';
                this.hideTimeItem();
                that.stopTalking();
                sessionStorage.removeItem('callTime');
                sessionStorage.removeItem('callData');
              }
              break;
            case 'REMOTE_HANGUP': // 被叫挂断
              // 挂断后置为可呼叫、可监听；
              if (code !== '0') {
                wsState = true;
                this.calltype = null;
                this.isCall = false;
                this.isListening = false;
                this.hangupEnable = false;
                this.hideTimeItem();
                this.callingId = '';
                this.listeningId = '';
                that.stopTalking();
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
        if (!wsState && msg !== 'minimize' && msg !== 'stopListen') {
          // 连接中断或连接不正常
          this.calltype = null;
          this.hideTimeItem();
          that.stopTalking();
          this.isCall = false;
          this.isListening = false;
          this.hangupEnable = false;
          this.callingId = '';
          this.listeningId = '';
          sessionStorage.removeItem('callTime');
          sessionStorage.removeItem('callData');
          this.$message.error('连接中断');
        } else if (msg === 'stopListen') {
          this.handleCommand('STOP_LISTEN');
        }
      }
    });
  }

  /** 给父组件传达开始执行最小化信息*/
  public minimizeMessage(): void {
    this.callWebsocketImplService.minimizeMessage();
  }

  /**
   * 显示计时
   */
  public showTimeItem(): void {
    this.setTimeInterval();
  }

  /**
   * 关闭计时
   */
  public hideTimeItem(): void {
    this.clearTimeInterval();
  }

  /**
   * 开启定时器
   */
  public setTimeInterval(): void {
    // 如果定时器为空 并且设备正在通话或者正在监听
    if (!this.TimeBar && (this.equipmentId === this.callingId || this.calltype === this.language.stateListening)) {
      let callTime = {
        hour: this.hour,
        minute: this.minute,
        second: this.second,
        dateContent: this.dateContent,
        callingId: this.callingId,
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
        this.dateContent = hour + ':' + minute + ':' + second;
        callTime = {
          hour: this.hour,
          minute: this.minute,
          second: this.second,
          dateContent: this.dateContent,
          callingId: this.callingId,
        };
        sessionStorage.setItem('callTime', JSON.stringify(callTime));
      }, 1000);
    }
    this.callData = {
      equipmentName: this.equipmentName,
      equipmentId: this.equipmentId,
      sequenceId: this.sequenceId,
      equipmentModelType: this.equipmentModelType,
      calltype: this.calltype,
      hangupEnable: this.hangupEnable,
      isCall: this.isCall,
      isListening: this.isListening,
      callingId: this.callingId,
    };
    sessionStorage.setItem('callData', JSON.stringify(this.callData));
  }

  /**
   * 监听选择设备变化
   */
  public ngOnChanges(changes: SimpleChanges): void {
    const callTime = JSON.parse(sessionStorage.getItem('callTime'));
    // 如果有正在通话的设备
    if (callTime) {
      // 先初始化
      this.calltype = null;
      this.isCall = false;
      this.isListening = false;
      this.hangupEnable = false;
      // 如果选择的设备是正在通话的设备
      if (changes.equipmentId.currentValue === callTime.callingId) {
        // 赋值
        console.log(this.callData);
        Object.keys(this.callData).forEach((d) => {
          this[d] = this.callData[d];
        });
        this.hour = callTime.hour;
        this.minute = callTime.minute;
        this.second = callTime.second;
        this.dateContent = callTime.dateContent;
        if (!this.TimeBar) {
          this.showTimeItem();
        }
        this.startTalking();
      }
    } else {
      // 点击其他设备
      if (changes.equipmentId && changes.equipmentId.previousValue) {
        console.log('变化');
        this.calltype = null;
        this.isCall = false;
        this.isListening = false;
        this.hangupEnable = false;
        this.hideTimeItem();
      } else {
        console.log('没变化');
      }
    }
    // 监听
    if (this.listeningId === this.equipmentId && this.isLISTEN) {
      this.showCancelListen = true;
      this.calltype = this.language.stateListening;
    } else {
      this.showCancelListen = false;
    }
  }

  /**
   * 关闭定时器
   */
  public clearTimeInterval(): void {
    window.clearInterval(this.TimeBar);
    this.TimeBar = undefined;
    // this.timer = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.dateContent = '00:00:00';
  }

  /**
   * 操作一键呼叫设备
   */
  public onCallOperate(operateType: string, permissionCode: string): void {
    const localRegist = localStorage.getItem('isRegist');
    this.isRegist = localRegist && localRegist === 'true';
    if (!this.isRegist) {
      this.$message.warning('请激活sip账号!');
      return;
    }
    if (!this.equipmentId && this.calltype !== this.language.callWorkbench.callIncoming) {
      this.$message.warning('请选中设备!');
      return;
    }
    let commandId = '';
    const calltype = `calltype${operateType}`;
    const hasRole = this.checkHasRole(permissionCode);
    if (hasRole) {
      switch (operateType) {
        case this.callOperateTypeEnum.CALL:
          commandId = 'CALL';
          if (!this.callingId) {
            if (this.listeningId) {
              this.$message.warning('正在监听，暂不支持该操作！');
            } else {
              this.calltype = this.language.callWorkbench[calltype];
              // 呼叫中、监听中都不可点击
              if (this.isCall || this.isListening) {
                this.$message.warning('暂不支持该操作');
              } else {
                // this.isCall = true;
                // 不可监听，可挂断
                this.isListening = false;
                this.hangupEnable = true;
                this.callingId = this.equipmentId;
                this.callWebsocketImplService.inviteCommand(this.sequenceId);
              }
            }
          } else {
            this.$message.warning('暂不支持该操作');
          }
          break;
        case this.callOperateTypeEnum.LISTEN:
          commandId = 'LISTEN';
          // 呼叫中不支持监听
          if (this.isCall || this.isListening || this.calltype === this.language.callWorkbench.calltype1) {
            this.$message.warning('暂不支持该操作');
          } else {
            this.calltype = this.language.callWorkbench[calltype];
            this.dateContent = null;
            // this.isListening = true;
            this.isCall = true;
            if (this.listeningId) {
              this.$message.warning('存在已监听的设备，暂不支持该操作！');
            } else {
              this.handleCommand(commandId);
            }
          }
          break;
        case this.callOperateTypeEnum.STOP_LISTEN:
          commandId = 'STOP_LISTEN';
          if (this.isCall) {
            this.$message.warning('暂不支持该操作');
          } else {
            this.handleCommand(commandId);
          }
          break;
        case this.callOperateTypeEnum.ACCEPT_CALL:
          commandId = 'ACCEPT_CALL';
          this.callingId = this.equipmentId;
          this.calltype = this.language.callWorkbench[calltype];
          this.callWebsocketImplService.acceptCommand();
          break;
        case this.callOperateTypeEnum.STOP_CALL:
          commandId = 'STOP_CALL';
          // 呼叫中，可以挂断
          if (this.callingId === this.equipmentId) {
            this.calltype = null;
            this.callWebsocketImplService.hangupCommand();
            this.stopTalking();
            this.hideTimeItem();
            sessionStorage.removeItem('callTime');
            sessionStorage.removeItem('callData');
          } else {
            this.$message.warning('暂不支持该操作');
          }
          break;
        default:
      }
    }

  }

  public handleCommand(commandId) {
    this.$applicationService.callingEquipmentinstructDistribute({
      commandId: commandId,
      equipmentIds: [this.equipmentId],
    }).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (commandId === 'LISTEN') {
          this.isLISTEN = true;
          this.calltype = this.language.stateListening;
          this.isListening = true;
          this.isCall = false;
          this.$exportMessagePush.messagePush({
            title: this.commonLanguage.systemMsg,
            msg: '监听成功',
            button: []
          });
          this.listeningId = this.equipmentId;
          this.showCancelListen = true;
          this.showTimeItem();
        } else {
          this.isLISTEN = false;
          this.calltype = '';
          this.dateContent = null;
          this.isListening = false;
          this.isCall = false;
          this.listeningId = '';
          this.showCancelListen = false;
          this.$exportMessagePush.messagePush({
            title: this.commonLanguage.systemMsg,
            msg: '已取消监听',
            button: []
          });
          this.hideTimeItem();
          sessionStorage.removeItem('callTime');
          sessionStorage.removeItem('callData');
        }
      } else {
        this.$message.error(result.msg);
      }
    }, error => {
      this.isCall = false;
      if (commandId === 'LISTEN') {
        this.calltype = '';
      }
    });
  }

  public checkHasRole(appAccessPermission: string): boolean {
    // 从用户信息里面获取权限列表
    const userInfo: any = SessionUtil.getUserInfo();
    let role: any[];
    if (userInfo.role && userInfo.role.permissionList) {
      role = userInfo.role.permissionList.map(item => item.id);
    }
    return role.includes(appAccessPermission);
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

        // that.oscillator = that.context.createOscillator();
        // that.oscillator.type = 'sine';
        // that.oscillator.frequency.value = 440; // value in hertz

        // create a ScriptProcessorNode
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

        // Lowpass
        // const biquadFilter = that.context.createBiquadFilter();
        // biquadFilter.type = 'lowpass';
        // biquadFilter.frequency.value = 3000;
        //
        // that.oscillator.connect(biquadFilter);
        // //oscillator.start();
        //
        // liveSource.connect(biquadFilter);
        //
        // //Dynamic Compression
        // const dynCompressor = that.context.createDynamicsCompressor();
        // dynCompressor.threshold.value = -25;
        // dynCompressor.knee.value = 9;
        // dynCompressor.ratio.value = 8;
        // dynCompressor.reduction.value = -20;
        // dynCompressor.attack.value = 0.0;
        // dynCompressor.release.value = 0.25;
        //
        // biquadFilter.connect(dynCompressor); //biquadFilter infront
        // dynCompressor.connect(that.node);
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
    this.callWebsocketImplService.stopTalking();
    // 清除画布
    this.clearLine();
  }

  public hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator['webkitGetUserMedia'] ||
      navigator['mozGetUserMedia'] || navigator['msGetUserMedia']);
  }

  public drawLine(data) {
    this.micCanvas = this.micaudio.nativeElement;
    this.micCanvasContext = this.micaudio.nativeElement.getContext('2d');
    this.micCanvasContext.fillStyle = '#FF0000';
    this.micCanvas.width = this.boxWidth;
    this.micCanvasContext.clearRect(0, 0, this.micCanvas.width, this.micCanvas.height);
    for (let i = 0; i < data.length; i++) {
      this.micCanvasContext.fillRect(i, data[i] * 100 + 100, 1, 1);
    }
  }

  public clearLine() {
    this.micCanvasContext.clearRect(0, 0, this.micCanvas.width, this.micCanvas.height);
  }

  public ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
    if (this.calltype === this.language.callWorkbench.calltype3 || this.calltype === this.language.stateListening) {
      this.callWebsocketImplService.minimizeMessage();
    }
  }

  public ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.calcHeight();
    });
  }

  calcHeight() {
    const dom = document.getElementById('canvasBox');
    if (dom) {
      this.micCanvas = this.micaudio.nativeElement;
      this.micCanvasContext = this.micaudio.nativeElement.getContext('2d');
      // console.log(this.micCanvas.width, this.micCanvas.height);
      this.micCanvas.width = this.boxWidth;
      // console.log(this.micCanvas.width, this.micCanvas.height, '修改后');
    }
  }
}

