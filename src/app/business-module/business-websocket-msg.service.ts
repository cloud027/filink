import {Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {CurrentAlarmMissionService} from '../core-module/mission/current-alarm.mission.service';
import {NzI18nService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {NativeWebsocketImplService} from '../core-module/websocket/native-websocket-impl.service';
import {FiLinkModalService} from '../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../shared-module/util/session-util';
import {MapStoreService} from '../core-module/store/map.store.service';
import {IndexMissionService} from '../core-module/mission/index.mission.service';
import {ExportMessagePushService} from '../shared-module/service/message-push/message-push.service';
import {UpdatePasswordService} from '../core-module/mission/update-password-service';
import {CommonLanguageInterface} from '../../assets/i18n/common/common.language.interface';
import {FacilityMissionService} from '../core-module/mission/facility.mission.service';
import {UpdateUserNameService} from '../core-module/mission/update-username-service';
import {NoticeMusicService} from '../shared-module/util/notice-music.service';
import {ImportMissionService} from '../core-module/mission/import.mission.service';
import {ChannelCode} from '../core-module/enum/channel-code';
import {LanguageEnum} from '../shared-module/enum/language.enum';
import {WebsocketMessageModel} from '../core-module/model/websocket-message.model';
import {MessageCountMission} from '../core-module/mission/message-count.mission';
import {WorkOrderLanguageInterface} from '../../assets/i18n/work-order/work-order.language.interface';
import {HttpClient} from '@angular/common/http';
import {PlanProjectResultService} from '../core-module/mission/plan-project-result.service';
import {EnableStrategyResultService} from '../core-module/mission/enable-strategy-result.service';

/**
 * websocket全局消息提示
 */
@Injectable()
export class BusinessWebsocketMsgService {
  // 国际化处理
  commonLanguage: CommonLanguageInterface;
  // 当前页面的url
  url;
  // 登录超时定时器
  public loginTimer;
  // 工单国际化
  private workOrderLanguage: WorkOrderLanguageInterface;

  constructor(private $router: Router,
              public $http: HttpClient,
              public $currentAlarmService: CurrentAlarmMissionService,
              private $nzNotificationService: NzNotificationService,
              private $wsService: NativeWebsocketImplService,
              private $message: FiLinkModalService,
              private $i18n: NzI18nService,
              private $mapStoreService: MapStoreService,
              private $indexMissionService: IndexMissionService,
              private $modal: NzModalService,
              private $exportMessagePush: ExportMessagePushService,
              private $updatePasswordService: UpdatePasswordService,
              private $refresh: FacilityMissionService,
              private $importService: ImportMissionService,
              private $updateUserNameService: UpdateUserNameService,
              private $messageCountMission: MessageCountMission,
              private $noticeMusicService: NoticeMusicService,
              private $planProjectResultService: PlanProjectResultService,
              private $enableStrategyResultService: EnableStrategyResultService) {
    this.$router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.url = this.$router.url;
      }
    });
    this.commonLanguage = this.$i18n.getLocaleData(LanguageEnum.common);
    this.workOrderLanguage = this.$i18n.getLocaleData(LanguageEnum.workOrder);
  }

  /**
   * 消息分流器
   * 统一对websocket消息进行分流
   * 消息体"{"channelId":"4b18e9f6-c1b4-4b3f-a2e9-edfc1e712431","channelKey":"export","msg":{"code":2100904},"msgType":0}"
   */
  public messageShunt(message: MessageEvent): void {
    if (!message || !message.data) {
      return;
    }
    const data: WebsocketMessageModel = JSON.parse(message.data);
    if (data.msg && typeof (data.msg) === 'string') {
      // 如果消息中有<br>，则转化为\n，实现换行效果
      data.msg = data.msg.replace(/<br>/g, '\n');
    }
    const channelId = data.channelId;
    const channelKey = data.channelKey;
    const tenantId = JSON.parse(localStorage.getItem('userInfo')).tenantId || '';
    // 由于后台开发比较混乱channelId和channelKey分不清、所以按以下两种情况处理
    // 根据channelId来判断的情况
    switch (channelId) {
      case ChannelCode.forceOff:
        this.dealOffLineUser(data, SessionUtil.getToken());
        break;
      case ChannelCode.deleteUser:
        this.dealDeleteUser(data, SessionUtil.getUserInfo());
        break;
      case ChannelCode.deleteTenantUser:
        this.dealDeleteTenantUser(data, SessionUtil.getUserInfo());
        break;
      case ChannelCode.beOffline:
        const id_token = `${SessionUtil.getUserInfo().id}redis_split${SessionUtil.getToken()}`;
        this.dealDeviceLogin(data, id_token);
        break;
      case ChannelCode.auditTempAuth:
        this.dealTempAuthMessage(data, SessionUtil.getUserInfo());
        break;
      // 信息发布
      case ChannelCode.informationRelease:
        // 指派人为当前登录人
        if (SessionUtil.getUserId() === channelKey) {
          this.showMessageNotification(data);
        }
        break;
    }
    // 根据channelKey来判断的情况
    switch (channelKey) {
      case ChannelCode.unlock:
        this.dealLockStatusChange(channelKey, data.msg);
        break;
      case ChannelCode.importResult:
        this.dealImport(data);
        this.$importService.refreshChange(true);
        break;
      case ChannelCode.assetCodeSuccess:
        this.handelAssertCode(data);
        break;
      case ChannelCode.exportKey:
        if (channelId === SessionUtil.getToken() && SessionUtil.isMessageNotification()) {
          this.$noticeMusicService.noticeMusic();
          this.$exportMessagePush.messagePush({
            title: this.commonLanguage.systemMsg,
            msg: data.msg,
            button: [{
              text: this.commonLanguage.go,
              handle: (closeNz) => {
                this.$router.navigate(['/business/download']).then();
                closeNz.emit();
              }
            }]
          });
        }
        break;
      case ChannelCode.menu:
        this.dealMenuUpdate(data);
        break;
      case ChannelCode.alarm:
        break;
      case ChannelCode.countUnRead:
        this.messageCountChange(data.msg, channelId);
        break;
      case ChannelCode.accountExpire:
      case ChannelCode.passwordExpire:
      case ChannelCode.resetPassword:
        // 判断是否给当前登录用户推送该条消息
        if (SessionUtil.getUserId() === channelId) {
          this.showMessageNotification(data);
        }
        break;
      case ChannelCode.troubleAssign:
        // 推送来源为故障指派, 且被指派人为当前登录人
        this.AlarmAndTroubleMessage(data, ChannelCode.troubleAssign);
        break;
      case ChannelCode.unblockOrderAssign:
        // 推送来源为销障工单指派
        this.workOrderAssign(data, ChannelCode.unblockOrderAssign);
        break;
      case ChannelCode.inspectionAssign:
        // 推送来源为巡检工单指派
        this.workOrderAssign(data, ChannelCode.inspectionAssign);
        break;
      case ChannelCode.alarmConfirmAssign:
        // 推送来源为告警确认工单指派
        this.workOrderAssign(data, ChannelCode.alarmConfirmAssign);
        break;
      case ChannelCode.installAssign:
        // 推送来源为安装工单
        this.workOrderAssign(data, ChannelCode.installAssign);
        break;
      case ChannelCode.remoteNotifications:
        // 告警远程通知
        this.AlarmAndTroubleMessage(data, ChannelCode.remoteNotifications);
        break;
      case ChannelCode.electronicLocksCheck:
        // 电子锁临时授权审核
        this.locksChecks(data);
        break;
      // 租户配置修改
      case ChannelCode.againLogin:
        if (tenantId === channelId) {
          this.againLoginMessage(data);
        }
        break;
      case ChannelCode.pointChanging:
        this.$planProjectResultService.refreshChange(true);
        break;
      case ChannelCode.enableStrategy:
        this.$enableStrategyResultService.refreshChange(true);
        break;
      default:
        const facilityNoticeArr = [ChannelCode.addDevice, ChannelCode.updateDevice,
          ChannelCode.deleteDevice, ChannelCode.focusDevice, ChannelCode.unFollowDevice];
        if (facilityNoticeArr.indexOf(channelKey) > -1) {
          this.dealFacilityUpdate(channelKey, data.msg);
        }
        break;
    }

  }

  clearTimer() {
    clearInterval(this.loginTimer);
    this.loginTimer = null;
  }

  /**
   *  处理入数据消息
   */
  private dealImport(data): void {
    if (SessionUtil.isMessageNotification()) {
      this.$noticeMusicService.noticeMusic();
      this.$nzNotificationService.config({
        nzPlacement: 'bottomRight',
        nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000,
        nzMaxStack: 1, // 同一时间可展示的最大提示数量
      });
      this.$nzNotificationService.blank(this.commonLanguage.systemMsg, data.msg, {nzClass: 'menu-blank'});
    }
  }

  /**
   * 处理编码生成消息
   */
  private handelAssertCode(data): void {
    if (SessionUtil.isMessageNotification()) {
      this.$noticeMusicService.noticeMusic();
      this.$nzNotificationService.config({
        nzPlacement: 'bottomRight',
        // nzMaxStack:2,
        nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
      });
      this.$nzNotificationService.info(this.commonLanguage.systemMsg, data.msg, {nzClass: 'menu-blank'});
    }
  }

  /**
   * 处理菜单模板被修改消息弹框
   * param msg
   */
  private dealMenuUpdate(data) {
    if (SessionUtil.isMessageNotification()) {
      this.$noticeMusicService.noticeMusic();
      this.$nzNotificationService.config({
        nzPlacement: 'bottomRight',
        nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
      });
      const node = document.getElementsByClassName('menu-blank');
      const nodeList = Array.from(node);
      nodeList.forEach(item => {
        item.parentNode.removeChild(item);
      });
      this.$nzNotificationService.blank(this.commonLanguage.systemMsg, this.$i18n.translate(`websocketMsg.${data.msg.data}`),
        {nzClass: 'menu-blank'});
    }
  }

  /**
   * 开锁推送
   * param msg
   */
  private dealLockStatusChange(type, msg) {
    if (SessionUtil.isMessageNotification()) {
      this.$noticeMusicService.noticeMusic();
      this.$nzNotificationService.config({
        nzPlacement: 'bottomRight',
        nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
      });
      let _msg;
      const data = msg.data || [];
      // 电子锁开锁
      if (msg.code === 2400101) {
        _msg = this.$i18n.translate(`websocketMsg.${msg.code}`);
        data.forEach((item) => {
          _msg += `${item.doorNum}:${this.$i18n.translate(`websocketMsg.${item.unlockResult}`)},`;
        });
        _msg = _msg.substring(0, _msg.length - 1);
        //  人井开锁
      } else if (msg.code === 2500004) {
        _msg = this.$i18n.translate(`websocketMsg.${msg.code}`);
      }
      this.$nzNotificationService.blank(this.commonLanguage.openLockMsg, _msg);
    }
    if (this.url.startsWith('/business/index')) {
      this.$indexMissionService.facilityChange({type});
    }
    if (this.url.startsWith('/business/facility/facility-detail-view')) {
      this.$refresh.refreshChange(true);
    }
  }

  /**
   * 处理设施的推送
   * param msg
   */
  private dealFacilityUpdate(type: ChannelCode, msg): void {
    try {
      const arr = typeof msg === 'object' ? msg : JSON.parse(msg);
      let items = [];
      if (type === ChannelCode.addDevice || type === ChannelCode.updateDevice) {
        items.push(arr.deviceId);
        this.$mapStoreService.updateMarkerData(arr);
      } else if (type === ChannelCode.deleteDevice) {
        arr.forEach(item => {
          this.$mapStoreService.deleteMarker(item);
        });
        items = arr;
        // 删除时返回数据是ids
      } else if (type === ChannelCode.focusDevice) {
        items = arr;
        // 删除时返回数据是ids
      } else if (type === ChannelCode.unFollowDevice) {
        items = arr;
      }
      if (this.url.startsWith('/business/index')) {
        this.$indexMissionService.facilityChange({type, items});
      }
    } catch (e) {
      console.log(e, '--->设施消息解析出错');
    }
  }

  /**
   * 处理在线用户列表强制下线在线用户
   */
  private dealOffLineUser(data, id_token) {
    Object.keys(data.msg).forEach(item => {
      if (item === id_token) {
        console.log('下线操作');
        this.$message.info(this.commonLanguage.beOffLineMsg);
        this.logout();
      }
    });
  }

  /**
   * 处理用户列表强制删除用户账号
   */
  private dealDeleteUser(data, userInfo) {
    data.msg.forEach(item => {
      if (item === userInfo.id) {
        this.$message.info(this.commonLanguage.beDeleteMsg);
        this.logout();
      }
    });
  }

  /**
   * 处理禁用租户下用户账号
   */
  private dealDeleteTenantUser(data, userInfo) {
    data.msg.forEach(item => {
      if (item === userInfo.id) {
        this.$message.info(this.commonLanguage.accountIsDisabled);
        this.logout();
      }
    });
  }

  /**
   * 处理账号已在其他设备登dealDeviceLogin录
   */
  private dealDeviceLogin(data, id_token) {
    Object.keys(data.msg).forEach(item => {
      if (item === id_token) {
        this.$message.info(this.commonLanguage.deviceBeOffLineMsg);
        this.logout();
      }
    });
  }

  /**
   * 登出操作
   */
  private logout(): void {
    this.$router.navigate(['']).then();
    this.$wsService.close();
    if (this.loginTimer) {
      window.clearInterval(this.loginTimer);
    }
    localStorage.clear();
    // 关闭所有的模态框
    this.$modal.closeAll();
    this.$currentAlarmService.clearMessage();
    this.$updatePasswordService.clearMessage();
    this.$updateUserNameService.clearMessage();
  }

  /**
   * 处理临时授权消息推送
   */
  private dealTempAuthMessage(data, userInfo) {
    if (SessionUtil.isMessageNotification()) {
      if (data.msg) {
        data.msg.forEach(item => {
          if (item === userInfo.id) {
            this.$noticeMusicService.noticeMusic();
            this.$nzNotificationService.config({
              nzPlacement: 'bottomRight',
              nzMaxStack: 1,
              nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
            });
            this.$nzNotificationService.blank(this.commonLanguage.systemMsg, this.commonLanguage.tempAuthMsg);
          }
        });
      }
    }
  }

  /**
   * 租户配置修改消息推送
   */
  private againLoginMessage(data) {
    if (SessionUtil.isMessageNotification()) {
      if (data.msg) {
        this.$noticeMusicService.noticeMusic();
        this.$nzNotificationService.config({
          nzPlacement: 'bottomRight',
          nzMaxStack: 1,
          nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
        });
        this.$nzNotificationService.blank(this.commonLanguage.systemMsg, data.msg);
      }
    }
  }

  /**
   * 消息大厅的未读消息数量推送
   */
  private messageCountChange(count: number, userId: string) {
    if (SessionUtil.getUserId() === userId) {
      if (this.url === '/business/message-notification') {
        count = 0;
      }
      this.$messageCountMission.messageCountChange(count);
    }
  }

  /**
   * 展示消息通知的弹框
   */
  private showMessageNotification(data: WebsocketMessageModel) {
    if (SessionUtil.isMessageNotification()) {
      if (data.msg) {
        this.$noticeMusicService.noticeMusic();
        this.$nzNotificationService.config({
          nzPlacement: 'bottomRight',
          nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
        });
        this.$nzNotificationService.blank(this.commonLanguage.systemMsg, data.msg);
      }
    }
  }

  /**
   *  故障指派消息通知弹窗
   */
  private AlarmAndTroubleMessage(data: WebsocketMessageModel, type: ChannelCode): void {
    // 推送来源为故障指派
    if (type === ChannelCode.troubleAssign) {
      // 且被指派人为当前登录人
      if (SessionUtil.getUserId() === data.channelId && data.msg) {
        let title = `${this.workOrderLanguage.faultAssignMsg}${data.msg.msg}：\n${this.workOrderLanguage.faultCode}- ${data.msg.body}`;
        let buttons = [
          {
            text: this.commonLanguage.receive,
            handle: (closeNz) => {
              /*window.open(data.msg.receive, '_blank');*/
              this.$http.get(data.msg.receive, {responseType: 'text'}).subscribe(res => {
                this.$message.info(res);
              });
              closeNz.emit();
            }
          },
          {
            text: this.commonLanguage.notReceive,
            handle: (closeNz) => {
              /*window.open(data.msg.notReceive, '_blank');*/
              this.$http.get(data.msg.notReceive, {responseType: 'text'}).subscribe(res => {
                this.$message.info(res);
              });
              closeNz.emit();
            }
          },
        ];
        // 2个按钮都存在
        if (data.msg.receive && data.msg.notReceive) {
          title = `${title}，${this.workOrderLanguage.isReceive}`;
        }
        // 只存在接收按钮
        if (data.msg.receive && !data.msg.notReceive) {
          buttons = [{
            text: this.commonLanguage.receive,
            handle: (closeNz) => {
              /*window.open(data.msg.receive, '_blank');*/
              this.$http.get(data.msg.receive, {responseType: 'text'}).subscribe(res => {
                this.$message.info(res);
              });
              closeNz.emit();
            }
          }];
        }
        this.$exportMessagePush.messagePush({
          title: this.commonLanguage.systemMsg,
          msg: title,
          button: buttons
        });
      }
    } else if (type === ChannelCode.remoteNotifications) {
      // 告警远程通知, 可以为多人，转换为数组
      const userIds = JSON.parse(data.channelId);
      if (userIds.includes(SessionUtil.getUserId())) {
        if (SessionUtil.isMessageNotification() && data.msg) {
          this.$noticeMusicService.noticeMusic();
          this.$nzNotificationService.config({
            nzPlacement: 'bottomRight',
            nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
          });
          this.$nzNotificationService.blank(this.commonLanguage.systemMsg, data.msg);
        }
      }
    }
  }

  /**
   *  销障工单/巡检工单指派消息通知弹窗
   */
  private workOrderAssign(data: WebsocketMessageModel, type: string): void {
    let title = '';
    if (type === ChannelCode.unblockOrderAssign) {
      // 销障转派
      if (data.msg.isTurnUser && data.msg.isTurnUser === '1') {
        title = `${this.workOrderLanguage.turnClear}${data.msg.procName}`;
      } else {
        // 销障指派
        title = `${this.workOrderLanguage.clearAssignMsg}${data.msg}`;
      }
    } else if (type === ChannelCode.inspectionAssign) {
      // 巡检工单转派
      if (data.msg.isTurnUser && data.msg.isTurnUser === '1') {
        title = `${this.workOrderLanguage.turnInspect}${data.msg.procName}`;
      } else {
        // 巡检工单指派
        title = `${this.workOrderLanguage.inspectAssignMsg}${data.msg}`;
      }
    } else if (type === ChannelCode.alarmConfirmAssign) {
      // 告警确认工单转派
      if (data.msg.isTurnUser && data.msg.isTurnUser === '1') {
        title = `${this.workOrderLanguage.turnAlarm}${data.msg.procName}`;
      } else {
        // 告警确认工单指派
        title = `${this.workOrderLanguage.alarmOrderAssign}${data.msg}`;
      }
    } else {
      // 安装工单转派
      if (data.msg.isTurnUser && data.msg.isTurnUser === '1') {
        title = `${this.workOrderLanguage.turnInstall}${data.msg.procName}`;
      } else {
        // 安装工单指派
        title = `${this.workOrderLanguage.installOrderAssign}${data.msg}`;
      }
    }
    // 需要转换成数组再判断
    const ids = JSON.parse(data.channelId);
    // 当前登录用户id存于返回的id数组中
    if (SessionUtil.isMessageNotification() && ids.includes(SessionUtil.getUserId())) {
      console.log(title);
      this.$noticeMusicService.noticeMusic();
      this.$nzNotificationService.config({
        nzPlacement: 'bottomRight',
        nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
      });
      this.$nzNotificationService.blank(this.commonLanguage.systemMsg, title);
    }
  }

  /**
   * 电子锁临时授权审核
   */
  private locksChecks(data: WebsocketMessageModel): void {
    const ids = JSON.parse(data.channelId);
    // 当前登录用户id存于返回的id数组中
    if (SessionUtil.isMessageNotification() && ids.includes(SessionUtil.getUserId()) && data.msg) {
      this.$noticeMusicService.noticeMusic();
      this.$nzNotificationService.config({
        nzPlacement: 'bottomRight',
        nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
      });
      this.$nzNotificationService.blank(this.commonLanguage.systemMsg, data.msg);
    }
  }
}
