import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {NzI18nService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {AlarmForCommonService} from '../core-module/api-service/alarm';
import {NativeWebsocketImplService} from '../core-module/websocket/native-websocket-impl.service';
import {AlarmStoreService} from '../core-module/store/alarm.store.service';
import {QueryConditionModel} from '../shared-module/model/query-condition.model';
import {CurrentAlarmMissionService} from '../core-module/mission/current-alarm.mission.service';
import {FiLinkModalService} from '../shared-module/service/filink-modal/filink-modal.service';
import {CommonLanguageInterface} from 'src/assets/i18n/common/common.language.interface';
import {SessionUtil} from '../shared-module/util/session-util';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {BusinessWebsocketMsgService} from './business-websocket-msg.service';
import {UpdateUserNameService} from '../core-module/mission/update-username-service';
import {CommonUtil} from '../shared-module/util/common-util';
import {IndexLanguageInterface} from '../../assets/i18n/index/index.language.interface';
import {EventManager} from '@angular/platform-browser';
import {MenuOpenMissionService} from '../core-module/mission/menu-open.mission';
import {ResultModel} from '../shared-module/model/result.model';
import {SystemForCommonService} from '../core-module/api-service/system-setting';
import {AlarmCardLevelEnum} from '../core-module/enum/alarm/alarm-card-level.enum';
import {UserForCommonService} from '../core-module/api-service/user';
import {AlarmLevelColor} from '../core-module/const/alarm/alarm-level-color.const';
import {MenuModel} from '../core-module/model/system-setting/menu.model';
import {LanguageEnum} from '../shared-module/enum/language.enum';
import {OrderUserModel} from '../core-module/model/work-order/order-user.model';
import {AlarmLevelModel} from '../core-module/model/alarm/alarm-level.model';
import {AlarmLevelColorModel} from '../core-module/model/alarm/alarm-level-color.model';
import {DisplaySettingsModel} from '../core-module/model/alarm/display-settings.model';
import {SystemLanguageEnum} from '../core-module/enum/alarm/system-language.enum';
import {SliderPanelModel} from '../shared-module/model/slider-panel.model';
import {LanguageModel} from '../core-module/model/alarm/language.model';
import {AlarmQueryTypeEnum} from '../core-module/enum/alarm/alarm-query-type.enum';
import {AlarmRoleEnum} from '../core-module/enum/alarm/alarm-role.enum';
import {DefaultAlarmColor} from '../core-module/const/alarm/default-alarm-color.const';
import {AudioMusicService} from '../shared-module/service/audio-music/audio-music.service';
import {UserLanguageInterface} from '../../assets/i18n/user/user-language.interface';
import {AlarmLevelCardModel} from '../core-module/model/alarm/alarm-level-card.model';
import {IsInitialPasswordEnum, PasswordStatusEnum} from '../shared-module/enum/user.enum';
import {ADMIN_USER_ID} from '../core-module/const/common.const';
import {ResultCodeEnum} from '../shared-module/enum/result-code.enum';
import * as lodash from 'lodash';
import {MessageCountMission} from '../core-module/mission/message-count.mission';
import {LoginUtil} from './login/share/util/login.util';
import {MenuSearchService} from '../shared-module/service/menu-search/menu-search.service';
import {ApplicationSystemForCommonService} from '../core-module/api-service/application-system';
import {ChannelCode} from '../core-module/enum/channel-code';
import {WebsocketMessageModel} from '../core-module/model/websocket-message.model';
import {InstructionModel} from '../core-module/model/instruction-model';
import {OperatorEnum} from '../shared-module/enum/operator.enum';
// 一键呼叫websocket
import {CallWebsocketImplService} from '../core-module/call-websocket/call-websocket-impl.service';
import {CallService} from '../core-module/api-service/application-system/call/call.service';
import {SipRoleEnum} from '../core-module/enum/alarm/sip-role-enum';
import {ApplicationInterface} from '../../assets/i18n/application/application.interface';

/**
 * 业务模块入口组件
 */
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit, OnDestroy {

  constructor(public $router: Router,
              public $alarmStoreService: AlarmStoreService,
              public $currentAlarmService: CurrentAlarmMissionService,
              private $alarmService: AlarmForCommonService,
              private $userService: UserForCommonService,
              private el: ElementRef,
              private $nzNotificationService: NzNotificationService,
              private $wsService: NativeWebsocketImplService,
              private callWebsocketImplService: CallWebsocketImplService,
              private $message: FiLinkModalService,
              private $i18n: NzI18nService,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef,
              private $businessWebsocketMsgService: BusinessWebsocketMsgService,
              private $nzModalService: NzModalService,
              private $updateUserNameService: UpdateUserNameService,
              private $audioMusicService: AudioMusicService,
              private eventManager: EventManager,
              private $systemParameterService: SystemForCommonService,
              private $menuOpenMissionService: MenuOpenMissionService,
              private $messageCountMission: MessageCountMission,
              public $nzI18n: NzI18nService,
              private $menuSearchService: MenuSearchService,
              private $applicationSystemForCommonService: ApplicationSystemForCommonService,
              private $callWsService: CallWebsocketImplService,
              private callService: CallService) {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.navigation = $nzI18n.getLocaleData(LanguageEnum.navigation);
    this.$currentAlarmService.getMessage().subscribe(res => {
      if (res === AlarmQueryTypeEnum.level) {
        // 查询总数
        this.queryAlarmCount();
      } else if (res === AlarmQueryTypeEnum.count) {
        // 查询等级
        this.queryAlarmLevel();
      }
    });

    this.$updateUserNameService.getMessage().subscribe(res => {
      if (res) {
        localStorage.setItem('userName', res);
        this.userName = localStorage.getItem('userName');
      }
    });
    // 监听消息大厅的未读消息数量
    this.$messageCountMission.messageCountChangeHook.subscribe(count => {
      // 更新未读消息的数量
      this.count = count;
    });
  }

  // 首页搜索
  @ViewChild('searchTemplate') searchTemplate: TemplateRef<any>;
  // 菜单栏搜索
  @ViewChild('searchInput') searchInput: ElementRef;
  // 内容
  @ViewChild('content') content: ElementRef<Element>;
  @ViewChild('answerModal') answerModal: TemplateRef<Element>;
  // 是否折叠
  public isCollapsed: boolean = true;
  // 用户信息
  public userInfo: OrderUserModel;
  // 用户名称
  public userName: string = '';
  // 主页面菜单配置
  public menuList: MenuModel[] = [];
  public newMenuLsit = [];
  // 修改密码弹出框控制
  public isUpdatePassword: boolean = false;
  // 分页
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 告警级别对象
  public alarmColorObj: AlarmLevelColorModel = new AlarmLevelColorModel;
  // 告警等级颜色
  public colorInfo: {};
  public language: CommonLanguageInterface;
  public languageApp: ApplicationInterface;
  // 首页查询结果列表
  public indexSearchList: MenuModel[] = [];
  // 首页查询
  public searchValue: string = '';
  // 显示设置
  public displaySettings: DisplaySettingsModel = new DisplaySettingsModel;
  // 默认logo路径
  public defaultLogoUrl: string = '../../assets/img/layout/FiLink_logo1.png';
  // logo路径
  public logoUrl: string = '';
  public overlayRef: OverlayRef;
  player1: any;
  // 登入维护定时器
  public loginTimer = null;
  // 退出确认框
  public confirmModal: NzModalRef;
  // 菜单路由
  public navigation;
  // 语言枚举
  public systemLanguageEnum = SystemLanguageEnum;
  // 系统语言
  public typeLg: string;
  // 告警等级数据
  public panelData: SliderPanelModel[] = [];
  // 获取所有下拉语言
  public languageAll: LanguageModel[] = [];
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 用户国际化
  public userLanguage: UserLanguageInterface;
  // 定时器
  public queryAlarmCountTimer: NodeJS.Timer;
  // 告警等级设置权限
  public alarmLevelSetRole: boolean;
  // 当前告警列表权限
  public alarmListRole: boolean;
  // 未读消息总数
  public count: number = 0;
  // 是否显示租户列表
  public showTenantList: boolean = false;
  // 系统title
  public systemTitle: string = '';
  // 强制修改密码弹窗中的提示信息
  public tips: string = '';
  // 是否是强制修改密码
  public isForceChangePwd: boolean = false;
  // 用户权限ID
  public roleId: string;
  // 切换管理员视角的文字是否可点击
  public switchToAdminDisabled: boolean = false;
  // 指令通知数量
  public noticeCount: number = 0;
  // 是否显示指令通知卡片
  public isShowNoticeCard: boolean = false;
  // 指令通知数据
  public instructionData: InstructionModel[];
  // 是否可以看到指令下发通知图标
  public canSeeInstruction: boolean = false;
  public isAnswered: boolean = false;
  public sipRole: boolean = false;
  public isRegist: boolean = false;
  // 呼叫弹框
  public callModal: NzModalRef;
  // 一键呼叫最小化
  minimize: boolean = false;
  // 一键呼叫最小化收缩
  shrinkage: boolean = false;
  // 一键呼叫最小化数据
  equipmentName: string;
  callTime: string;
  callInterval: any;
  calltype: string;
  /**
   * 切换到管理员菜单 防抖
   */
  public switchToAdminDebounced = lodash.debounce(this.switchToAdmin, 200, {leading: false, trailing: true});

  public commonLanguage: CommonLanguageInterface;

  /**
   * 初始化
   */
  public ngOnInit(): void {
    sessionStorage.clear();
    this.languageApp = this.$nzI18n.getLocaleData(LanguageEnum.application);
    // 全局禁用confirm弹框的enter事件
    this.eventManager.addGlobalEventListener('window', 'keydown', (event) => {
      if (event.target.parentElement.className === 'ant-modal-confirm-btns') {
        event.target.blur();
      }
    });
    // 告警等级设置权限
    this.alarmLevelSetRole = SessionUtil.checkHasRole(AlarmRoleEnum.alarmLevelSet);
    // 当前告警列表权限
    this.alarmListRole = SessionUtil.checkHasRole(AlarmRoleEnum.alarmList);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.$wsService.connect();
    // 一键呼叫websocket连接
    this.$callWsService.connect();
    this.initAlarmColor();
    this.language = this.$i18n.getLocaleData(LanguageEnum.common);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    if (!SessionUtil.getToken()) {
      this.$router.navigate(['/login']).then();
      return;
    }
    this.getMenuList();
    this.userInfo = SessionUtil.getUserInfo();
    this.roleId = SessionUtil.getRoleId();
    localStorage.setItem('userName', localStorage.getItem('userName') ? localStorage.getItem('userName') : this.userInfo.userName);
    this.userName = localStorage.getItem('userName');
    this.queryAlarmLevel();
    this.queryAlarmCount();
    // 5分钟查询一次告警级别的值
    this.queryAlarmCountTimer = setInterval(() => {
      this.queryAlarmCount();
    }, 60 * 1000 * 5);
    this.$wsService.subscibeMessage.subscribe(msg => {
      this.$businessWebsocketMsgService.messageShunt(msg);
      this.alarmHint(msg);
      this.instructionMessage(msg);
    });
    this.createOverlayRef();
    this.initDisplaySettings();
    this.queryPasswordSecurity();
    // 当清除缓存的时候 则退出登入
    this.$businessWebsocketMsgService.loginTimer = setInterval(() => {
      if (!SessionUtil.getToken()) {
        console.log('检测缓存');
        this.$wsService.close();
        this.$callWsService.close();
        this.$router.navigate(['/login']).then();
        this.$message.warning(this.language.beOffOrTimeOut);
        this.$businessWebsocketMsgService.clearTimer();
      }
    }, 1000);
    this.queryLanguage();
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    // 查询sip账号密码
    this.availableSipUser();
    // 导航后功能区域置顶
    this.$router.events.subscribe((event: NavigationEnd) => {
      if (event instanceof ActivationEnd) {
        // 当导航成功结束时执行
        this.content.nativeElement.scrollTop = 0;
        // 如果当前页为消息通知页，则不显示未读消息数
        if (this.$router.url === '/business/message-notification') {
          this.count = 0;
        }
      }
    });
    // 初始化加载时，如果当前页为消息通知页，则不显示未读消息数
    if (this.$router.url === '/business/message-notification') {
      this.count = 0;
    } else {
      this.queryMessageCount();
    }

    this.$menuSearchService.eventEmit.subscribe((value) => {
      if (value.menuShow === false) {
        this.searchValue = '';
        this.indexSearchList = [];
        this.overlayRef.detach();
      }
    });
    this.isCanSeeInstruction();
    this.closeNotice();
    localStorage.setItem('isRegist', 'false');
  }

  /**
   * 告警提示音
   */
  public alarmHint(msg) {
    if (!(msg && msg.data)) {
      return;
    }
    const alarmMsg = JSON.parse(msg.data);
    if (alarmMsg.channelKey === 'alarm') {
      // 判断推送的消息当前用户是否有权限id为'1'是超级管理员默认有所以权限
      // 获取租户id
      const tenantId = SessionUtil.getTenantId();
      if (alarmMsg.channelId === tenantId) {
        // 获取用户id
        const userId = SessionUtil.getUserId();
        // 是否是租户管理员
        const isAdmin = SessionUtil.getUserInfo().tenantAdmin;
        // 1、首先判断是否是同一租户下
        // 2、在判断是否是租户管理员或者userId是否存在
        if (alarmMsg.msg.userIdList) {
          if (alarmMsg.msg.userIdList.includes(userId) || isAdmin) {
            const levelCode = alarmMsg.msg.alarmMessage.alarmLevelCode;
            const resultCardData = this.panelData;
            if (resultCardData && resultCardData.length > 0) {
              resultCardData.forEach(itemPanel => {
                if (itemPanel.sign === levelCode) {
                  itemPanel.sum = itemPanel.sum as number + 1;
                }
              });
            }
            if (alarmMsg.msg.alarmMessage.isPrompt === '1') {
              // 判断是否播放
              this.$audioMusicService.playAudio(alarmMsg);
              this.$nzNotificationService.config({
                nzPlacement: 'bottomRight',
                nzMaxStack: 1,
                nzDuration: SessionUtil.getMsgSetting().retentionTime * 3000,
              });
              const json_alarmMsg = typeof alarmMsg.msg === 'object' ? alarmMsg.msg : JSON.parse(alarmMsg.msg);
              // 提示框消息
              if (!json_alarmMsg.deviceName && json_alarmMsg.alarmName === this.language.orderOutOfTime) {
                // 来源是工单超时
                this.$nzNotificationService.blank(this.language.alarmMsg, json_alarmMsg.alarmName);
              } else {
                const mag = ` ${this.indexLanguage.deviceName}：${json_alarmMsg.deviceName} <br/>
               ${this.indexLanguage.equipmentName}：${json_alarmMsg.equipmentName} <br/>
               ${this.indexLanguage.alarmTypeName}：${json_alarmMsg.alarmName}`;
                this.$nzNotificationService.blank(this.language.alarmMsg, mag);
              }
            }
          }
        }
      }
    }
  }

  /**
   * 获取菜单配置
   */
  public getMenuList(): void {
    let menuList = [];
    if (JSON.parse(localStorage.getItem('userInfo')).menuTemplateAndMenuInfoTree.menuInfoTrees ||
      JSON.parse(localStorage.getItem('userInfo')).tenantInfo) {
      menuList = JSON.parse(localStorage.getItem('userInfo')).admin ? JSON.parse(localStorage.getItem('userInfo')).menuTemplateAndMenuInfoTree.menuInfoTrees
        || [] : JSON.parse(localStorage.getItem('userInfo')).tenantInfo || [];
    }
    this.newMenuLsit = menuList;
    this.menuDataRecursion(this.newMenuLsit);
    this.menuList = this.newMenuLsit;
  }

  /**
   * 菜单数据递归
   */
  menuDataRecursion(list) {
    this.deleteMenuData(list);
    list.forEach(item => {
      if (item.children && item.children.length) {
        this.menuDataRecursion(item.children);
      }
    });
  }

  /**
   * 删除
   * isShow === false，菜单不显示
   */
  public deleteMenuData(list) {
    lodash.remove(list, (item) => {
      if (item.isShow === '0') {
        return true;
      } else {
        return false;
      }
    });
  }

  /**
   * 修改密码
   */
  public updatePassword(): void {
    this.isUpdatePassword = true;
  }

  /**
   * 退出登入
   */
  public logout(): void {
    this.confirmModal = this.$nzModalService.confirm({
      nzTitle: this.language.logOutMsg,
      nzOkText: this.language.cancelText,
      nzCancelText: this.language.okText,
      nzOkType: 'danger',
      nzKeyboard: false,
      nzOnCancel: () => {
        return new Promise((resolve, reject) => {
          const userInfo = SessionUtil.getUserInfo();
          const data = {
            userid: userInfo.id,
            token: SessionUtil.getToken(),
          };
          this.$userService.logout(data).subscribe(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.clearInterval();
            this.$wsService.close();
            this.$callWsService.unregistCommand();
            this.$callWsService.close();
            this.$router.navigate(['']).then();
            resolve();
          }, () => {
            localStorage.clear();
            sessionStorage.clear();
            window.clearInterval();
            this.$wsService.close();
            this.$callWsService.unregistCommand();
            this.$callWsService.close();
            this.$router.navigate(['']).then();
            reject();
          });
        });

      },
    });
  }

  /**
   * 切换语言
   */
  public languageCheck(item: LanguageModel): void {
    const nowLanguage = JSON.parse(localStorage.getItem('localLanguage'));
    // 判断是否是相同
    if (item.languageType === nowLanguage) {
      return;
    }
    // 前端切换中英文
    if (item.languageType === SystemLanguageEnum.us || item.languageType === SystemLanguageEnum.en) {
      this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('en_US').language);
      localStorage.setItem('localId', 'en_US');
    } else {
      this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('zh_CN').language);
      localStorage.setItem('localId', 'zh_CN');
    }
    // 获取用户信息缓存
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || [];
    // 过去当前角色
    const roleId = userInfo.tenantRoleId ? userInfo.tenantRoleId : userInfo.role.id;
    // 获取切换的国际化
    let language = '';
    if (item.languageType === SystemLanguageEnum.us) {
      language = SystemLanguageEnum.en;
    } else {
      language = item.languageType;
    }
    // 获取租户Id
    const tenantId = userInfo.tenantId;
    // 查询切换语言配置菜单
    this.$systemParameterService.queryTenantMenuById(tenantId, language, roleId).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (userInfo.admin) {
          userInfo.menuTemplateAndMenuInfoTree.menuInfoTrees = result.data.menuInfoTrees;
        } else {
          userInfo.tenantInfo = result.data.menuInfoTrees;
        }
        // 覆盖菜单缓存
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        // 加载菜单
        this.getMenuList();
      }
      // 页面刷新
      window.location.reload();
      // 替换国际化缓存
      localStorage.setItem('localLanguage', JSON.stringify(item.languageType));
    });


  }

  /**
   * 查询告警数量
   * 1 是紧急  2 是主要 3 是次要 4 提示
   */
  public queryAlarmCount(): void {
    // 卡片告警
    this.panelData = [];
    const userInfo: any = SessionUtil.getUserInfo();
    if (userInfo.id !== '1' || !userInfo.admin) {
      if (this.alarmLevelSetRole || this.alarmListRole) {
        this.$alarmService.queryAlarmStatistics(1).subscribe((result: ResultModel<AlarmLevelCardModel[]>) => {
          if (result.code === 0) {
            const data = result.data;
            const resultData = ['urgency', 'serious', 'secondary', 'prompt'];
            resultData.forEach(item => {
              const type = data.find(el => el.statisticObj === item);
              const color = this.$alarmStoreService.getAlarmColorByLevel(AlarmCardLevelEnum[item]);
              this.panelData.push({
                sum: type ? type.statisticNum : 0,
                color: color ? color.backgroundColor : null,
                sign: item === 'urgency' ? 'urgent' : (item === 'serious' ? 'main' : item),
              });
            });
          }
        });
      }
    }
  }

  /**
   * 查询所有告警级别
   */
  public queryAlarmLevel(): void {
    // 告警等级颜色默认值
    this.$alarmStoreService.alarm = DefaultAlarmColor;
    if (this.alarmLevelSetRole || this.alarmListRole) {
      this.$alarmService.queryAlarmLevelList(this.queryCondition).subscribe((res: ResultModel<AlarmLevelModel[]>) => {
        const data = res.data;
        if (res.code === 0 && data && data[0]) {
          this.$alarmStoreService.alarm = data.map(item => {
            item.color = this.alarmColorObj[item.alarmLevelColor];
            return item;
          });
        }
        this.colorInfo = this.$alarmStoreService.getAlarmColorStyleObj();
      });
    }
  }

  /**
   * 初始化告警颜色
   */
  public initAlarmColor(): void {
    AlarmLevelColor.forEach(item => {
      this.alarmColorObj[item.value] = item;
    });
  }

  /**
   * 首页搜索
   */
  public searchChange(): void {
    if (this.searchValue) {
      this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
      this.indexSearchList = this.findUrl(this.searchValue, this.menuList, []);
      this.showSearchList();
    } else {
      this.indexSearchList = [];
      this.overlayRef.detach();
    }
  }

  /**
   * 查找符合条件的菜单列表
   */
  public findUrl(name: string, menuList: MenuModel[], arr: MenuModel[]): MenuModel[] {
    for (let i = 0; i < menuList.length; i++) {
      const setName = menuList[i].menuName.indexOf(name) >= 0;
      if (setName && menuList[i].menuHref && menuList[i].menuHref.length > 6) {
        if (arr.length < 5) {
          arr.push(menuList[i]);
        } else {
          break;
        }
      }
      if (menuList[i].children && menuList[i].children.length > 0) {
        this.findUrl(name, menuList[i].children, arr);
      }
    }
    return arr;
  }

  /**
   * 首页收索跳转
   * param url
   */
  public linkTo(url: string): void {
    this.overlayRef.detach();
    this.$router.navigate([url]).then();
  }

  /**
   * 菜单搜索
   */
  public clickSearchItem(url: string, name: string): void {
    this.searchValue = name;
    this.linkTo(url);
  }

  /**
   * 创建收索模板链接
   */
  public createOverlayRef(): void {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.searchInput).withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      }]);
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: strategy,
    });
    // 当点击其他位置时隐藏处理
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach();
    });
  }

  /**
   * 初始化显示配置
   */
  public initDisplaySettings(): void {
    if (localStorage.getItem('displaySettings') !== 'undefined') {
      this.displaySettings = JSON.parse(localStorage.getItem('displaySettings'));
    }
    if (this.displaySettings && this.displaySettings.systemLogo === 'local') {
      this.logoUrl = this.defaultLogoUrl;
    } else {
      this.logoUrl = this.displaySettings.systemLogo || this.defaultLogoUrl;
    }
    // 将系统logo转成base64位
    CommonUtil.getUrlBase64(this.logoUrl, (res) => {
      this.logoUrl = res;
    });
    // 系统title设置
    this.systemTitle = this.displaySettings.systemTitle;
  }

  /**
   * 查询密码安全策略
   */
  public queryPasswordSecurity(): void {
    const userInfo = SessionUtil.getUserInfo();
    // 当密码状态为停用即密码到期，强制修改密码弹窗弹出
    if (userInfo.passwordStatus === PasswordStatusEnum.disable && userInfo.id !== ADMIN_USER_ID) {
      this.isUpdatePassword = true;
      this.isForceChangePwd = true;
      this.tips = this.userLanguage.otherTip;
    }
    // 当判断密码为被重置的密码且不是超级管理员时，强制修改密码弹窗弹出
    if (userInfo.isInitialPassword === IsInitialPasswordEnum.initialPassword && userInfo.id !== ADMIN_USER_ID) {
      this.isUpdatePassword = true;
      this.isForceChangePwd = true;
      this.tips = this.userLanguage.tip;
    }
  }

  /**
   * 点击跳转可跳转的第一个菜单
   */
  public goIndex(): void {
    const url = LoginUtil.findLink(this.menuList);
    this.$router.navigate([url]).then();
  }

  /**
   * 获取语言设置
   */
  public queryLanguage(): void {
    this.$systemParameterService.queryLanguage().subscribe((result: ResultModel<LanguageModel[]>) => {
      this.languageAll = result.data;
      this.languageAll.forEach(item => {
        item.label = item.languageName;
        item.value = item.languageType;
      });
    });
  }

  /**
   * 菜单是折叠
   */
  public triggerMenu(): void {
    this.isCollapsed = !this.isCollapsed;
    this.$menuOpenMissionService.menuOpenChange(this.isCollapsed);
  }

  /**
   * 逐渐销毁时 清除定时器
   */
  public ngOnDestroy(): void {
    // 清理缓存
    localStorage.removeItem('userName');
    sessionStorage.clear();
    this.$businessWebsocketMsgService.clearTimer();
    if (this.queryAlarmCountTimer) {
      clearInterval(this.queryAlarmCountTimer);
    }
    // 关闭所有的模态框
    this.$nzModalService.closeAll();
    this.queryAlarmCountTimer = null;
  }

  /**
   * 切换到管理员菜单
   */
  public switchToAdmin(): void {
    if (this.switchToAdminDisabled) {
      return;
    }
    if (JSON.parse(localStorage.getItem('userInfo')).admin) {
      this.$message.info(this.language.switchAdminTip);
      return;
    }
    this.switchToAdminDisabled = true;
    const nowLanguage = JSON.parse(localStorage.getItem('localLanguage'));
    // 管理员不展示告警灯
    this.panelData = [];
    this.$systemParameterService.switchAccountToSuper(nowLanguage).subscribe((result) => {
      this.switchToAdminDisabled = false;
      if (result.code === ResultCodeEnum.success) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || [];
        // 角色状态切换为超级管理员
        userInfo.admin = true;
        userInfo.tenantId = result.data.user.tenantId;
        userInfo.tenantElement = result.data.user.tenantElement;
        // 缓存保存新的权限
        userInfo.role.permissionList = result.data.user.role.permissionList;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.swicthPerspectives();
        this.$message.success(this.language.switchAdminSuccessfully);
      } else {
        this.$message.error(this.language.switchAdminFailed);
      }
    }, () => this.switchToAdminDisabled = false);
  }


  /**
   * 是否展示租户列表
   */
  public isShowTenantList(): void {
    this.showTenantList = true;
  }

  /**
   * 切换到租户视角
   */
  public isShowTenantListEmit(event: boolean): void {
    // 重新获取告警灯相关配置
    this.queryAlarmLevel();
    this.queryAlarmCount();
    this.swicthPerspectives();
    this.showTenantList = !this.showTenantList;
  }

  /**
   * 租户弹窗点击取消按钮，改变弹窗显示状态
   */
  public clickCancelEmit(event: boolean): void {
    this.showTenantList = !this.showTenantList;
  }

  /**
   * 清空指令消息通知
   *
   */
  public EmptyNotice() {
    const obj = {
      id: '',
      isAllRead: true
    };
    this.onReadMessage(obj);
  }

  /**
   * 已读
   * @param e 点击事件
   * @param id 指令id
   */
  public readOneMessage(e, id?: string) {
    this.instructionData.forEach(item => {
      if (item.id === id) {
        if (item.isRead) {
          // 已读过不再发请求
          return;
        } else {
          const paramObj = {
            id: item.id,
            isAllRead: false
          };
          this.onReadMessage(paramObj, id);
        }
      }
    });
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * 点击指令通知图标事件
   */
  public showNotice(): void {
    this.isShowNoticeCard = !this.isShowNoticeCard;
    this.getNoticeList();
  }

  /**
   * 查看更多
   */
  public showMoreNotice(): void {
    this.linkTo('/business/system/log/instruction');
    this.isShowNoticeCard = false;
  }

  /**
   * 切换租户和管理员视角后执行相关事件
   */
  private swicthPerspectives() {
    // 当前租户或者管理员已激活sip，则注销sip
    if (this.isRegist) {
      this.$callWsService.unregistCommand();
    }
    // 切换为租户时再次获取菜单配置
    this.getMenuList();
    // 重新获取显示设置相关信息
    this.queryDisplaySettings();
    // 跳转到菜单的第一层可跳转url
    let link = '';
    if (this.menuList && this.menuList.length) {
      link = LoginUtil.findLink(this.menuList);
    }
    // 当路由相同时，组件不会重新加载，所以需要跳转到菜单的第二个可跳转的url，然后再跳转到当前路由
    if (link === this.$router.url) {
      const tempUrl = LoginUtil.findLink(this.menuList, this.$router.url);
      this.$router.navigate([tempUrl]).then(() => {
        this.$router.navigate([link]).then();
      });
    } else {
      this.$router.navigate([link]).then();
    }
    this.isCanSeeInstruction();
    // 切换为租户时，重新查询sip权限
    this.checkSipRole();
  }

  /**
   * 路由跳转
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 显示查询模板
   */
  private showSearchList(): void {
    if (this.indexSearchList.length > 0) {
      if (!this.overlayRef.hasAttached()) {
        this.overlayRef.attach(new TemplatePortal(this.searchTemplate, this.viewContainerRef));
      }
    } else {
      this.overlayRef.detach();
    }
  }

  /**
   * 获取消息未读数
   */
  private queryMessageCount(): void {
    // 获取消息未读数量
    this.$userService.queryCountUnread(SessionUtil.getUserId()).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data) {
          this.count = res.data.countUnread;
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 管理员和租户视角切换后重新获取显示设置信息和消息提示信息
   */
  private queryDisplaySettings() {
    this.$systemParameterService.selectDisplaySettingsParamByTenant().subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        // 显示设置配置
        localStorage.setItem('displaySettings', JSON.stringify(res.data.displaySettings));
        // 消息提示设置
        localStorage.setItem('messageNotification', JSON.stringify(res.data.messageNotification));
        this.initDisplaySettings();
      }
    });
  }

  /**
   * 获取指令通知
   */
  private getNoticeList(): void {
    const queryCondition = new QueryConditionModel();
    queryCondition.filterConditions = [
      {
        filterField: 'isRead',
        filterValue: false,
        operator: OperatorEnum.eq,
      },
      {
        filterField: 'operator',
        filterValue: JSON.parse(localStorage.getItem('userInfo')).userName,
        operator: OperatorEnum.eq,
      }
    ];
    queryCondition.bizCondition = {
      operator: JSON.parse(localStorage.getItem('userInfo')).userName
    };
    // 获取最近10条指令下发消息
    this.$applicationSystemForCommonService.getInstructionNoticeList(queryCondition).subscribe((res: ResultModel<InstructionModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.noticeCount = res.totalCount;
        this.instructionData = res.data || [];
        this.instructionData.forEach(item => {
          item.replyTime = this.dateFormat(item.replyTime);
          item.notice = `${item.commandName}指令下发${item.success ? '成功' : '失败'}`;
        });
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * websocket获取指令下发结果消息未读数
   */
  private instructionMessage(message: MessageEvent): void {
    if (!message || !message.data) {
      return;
    }
    const data: WebsocketMessageModel = JSON.parse(message.data);
    if (data.channelKey === ChannelCode.instructResult) {
      const instructionMsg = JSON.parse(data.msg);
      this.noticeCount = instructionMsg.noReadCount;
      // 指令卡片显示的情况下收到更新 刷新数据
      if (this.isShowNoticeCard) {
        this.getNoticeList();
      }
    }
  }

  /**
   * 消息置为已读
   */
  private onReadMessage(obj, id?): void {
    this.$applicationSystemForCommonService.onReadInstruction(obj).subscribe((res: ResultModel<InstructionModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        // 指令置为已读
        if (id) {
          // 单条已读
          this.instructionData.forEach(item => {
            if (item.id === id) {
              item.isRead = true;
            }
          });
          this.noticeCount = this.noticeCount ? this.noticeCount - 1 : 0;
        } else {
          // 清空未读
          this.instructionData = [];
          this.noticeCount = 0;
        }
      }
    });
  }

  /**
   * 后台传的时间格式处理
   * @param time 时间
   */
  private dateFormat(time) {
    const date = new Date(time).toJSON();
    return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
  }

  /**
   * 是否显示指令下发消息通知图标
   */
  private isCanSeeInstruction(): void {
    if (JSON.parse(localStorage.getItem('userInfo')).roleId === 'superAdmin' && JSON.parse(localStorage.getItem('userInfo')).tenantId === '1') {
      // 非租户视角的超级管理员不可见
      this.canSeeInstruction = false;
    } else {
      // 是租户登录或管理员切换的租户视角,指令下发可见
      this.canSeeInstruction = true;
      // 获取未读的指令下发消息数量
      this.getNoticeList();
    }
  }

  /**
   * 监听 点击指令通知外隐藏div
   */
  private closeNotice(): void {
    const noticeDiv = document.getElementById('notice-container');
    noticeDiv.addEventListener('click', e => {
      e.stopPropagation();
    });
    // 点击指令下发通知div外隐藏
    document.addEventListener('click', (e) => {
      this.isShowNoticeCard = false;
    });
  }

  /**
   * 查询sip账号
   */
  availableSipUser() {
    this.callService.availableSipUser(null).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data) {
          localStorage.setItem('sipUserInfo', JSON.stringify(result.data));
          this.checkSipRole();
        }
      }
    });
  }

  checkSipRole() {
    this.sipRole = SessionUtil.checkHasRole(SipRoleEnum.call)
      || SessionUtil.checkHasRole(SipRoleEnum.listen)
      || SessionUtil.checkHasRole(SipRoleEnum.hangup);
    // if (this.sipRole) {
    //   this.$callWsService.registCommand();
    // } else {
    //   if (this.isRegist) {
    //     this.$callWsService.unregistCommand();
    //   }
    // }
  }

  regist(): void {
    this.callWebsocketImplService.subscribeMessage.subscribe(msg => {
      // 传达最小化指令
      if (msg === 'minimize' || msg === 'incomingMinimize' && !this.minimize) {
        const callData = JSON.parse(sessionStorage.getItem('callData'));
        const callTime = JSON.parse(sessionStorage.getItem('callTime'));
        this.callTime = callTime.dateContent;
        this.equipmentName = callData.equipmentName;
        if (msg === 'minimize') {
          this.calltype = callData.isListening ? this.languageApp.callWorkbench.calltype5 : this.languageApp.callWorkbench.calltype4;
        } else {
          this.calltype = this.languageApp.callWorkbench.calltype4;
        }
        this.minimize = true;
        this.callInterval = setInterval(() => {
          // 如果本地存储的有，说明通话/监听还在继续
          if (JSON.parse(sessionStorage.getItem('callTime'))) {
            this.callTime = JSON.parse(sessionStorage.getItem('callTime')).dateContent;
          } else {
            // 否则就当做关闭
            this.minimize = false;
            this.shrinkage = false;
            window.clearInterval(this.callInterval);
            sessionStorage.removeItem('callTime');
            sessionStorage.removeItem('callData');
          }
        }, 1000);
      }
      if (msg && typeof (msg.data) === 'string') {
        if (msg.data !== 'alive') {
          const json = JSON.parse(msg.data);
          const type = json.type;
          const code = json.code;
          switch (type) {
            case 'CALL_INCOMING': // 来电
              // this.createModal();
              // this.$noticeMusicService.noticeMusic();
              break;
            case 'REMOTE_HANGUP': // 被叫挂断
              this.$message.info('对方已挂断');
              // 置为呼叫状态
              // callState();
              this.minimize = false;
              window.clearInterval(this.callInterval);
              // 提示框消失;
              this.callWebsocketImplService.stopTalking();
              if (this.callModal) {
                this.callModal.destroy();
              }
              break;
            case 'REGIST': // 注册
              if (code === '1') { // 成功
                localStorage.setItem('isRegist', 'true');
                this.isRegist = true;
              } else { // 失败
                localStorage.setItem('isRegist', 'false');
                this.isRegist = false;
              }
              break;
            case 'UNREGIST': // 注销
              if (code === '1') { // 成功
                localStorage.setItem('isRegist', 'false');
                this.isRegist = false;
                this.minimize = false;
              }
              break;
          }
        }
      } else if (msg && msg.data && msg.data.type === '') {
        // 通话中
      } else {
        // 连接中断或连接不正常
        // this.callWebsocketImplService.stopTalking();
        // if (this.callModal) {
        //   this.callModal.destroy();
        // }
        // this.$message.error('连接中断');
      }
    });
    if (!this.isRegist) {
      this.$callWsService.registCommand();
    }
  }

  public stopCall(): void {
    const callData = JSON.parse(sessionStorage.getItem('callData'));
    if (callData.isListening) {
      // 取消监听
      this.callWebsocketImplService.minimizeStopListen();
    } else {
      // 挂断
      this.callWebsocketImplService.hangupCommand();
      this.callWebsocketImplService.stopTalking();
    }
    this.minimize = false;
    this.shrinkage = false;
    window.clearInterval(this.callInterval);
    sessionStorage.removeItem('callTime');
    sessionStorage.removeItem('callData');
  }
}
