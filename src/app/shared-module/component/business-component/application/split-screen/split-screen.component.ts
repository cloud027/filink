import {Component, Input, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultModel} from '../../../../model/result.model';
import {PageCondition, QueryConditionModel} from '../../../../model/query-condition.model';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {NativeWebsocketImplService} from '../../../../../core-module/websocket/native-websocket-impl.service';
import {PassagewayModel} from '../../../../../business-module/application-system/share/model/passageway.model';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {CameraBeUsedEnum} from '../../../../../core-module/enum/camera-be-used.enum';
import {SessionUtil} from '../../../../util/session-util';
import {ApplicationSystemForCommonService} from '../../../../../core-module/api-service/application-system';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {CameraCodeEnum} from '../../../../../business-module/application-system/share/enum/camera-permission.enum';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';

/**
 * 分屏组件
 */
@Component({
  selector: 'app-split-screen',
  templateUrl: './split-screen.component.html',
  styleUrls: ['./split-screen.component.scss']
})
export class SplitScreenComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * 被选中的通道列表 设备详情
   */
  @Input() set selectedList(value: PassagewayModel[]) {
    if (value && value.length) {
      this.selectedPassagewayList = value;
      this.otherModularUsed();
    }
  }

  /**
   * 设备ID
   */
  @Input() equipmentId: string;
  /**
   * 哪儿使用
   */
  @Input() whereUsed: string;
  /**
   * 是否是工作台
   */
  @Input() isWorkbench: boolean = true;
  /**
   * 基础配置组件
   */
  @ViewChild('basicsModel') basicsModel;
  /**
   * 被使用
   */
  public beUsed = CameraBeUsedEnum;
  /**
   * 被选中的通道列表
   */
  public selectedPassagewayList: PassagewayModel[] = [];
  /**
   * 通道列表数据
   */
  public passagewayList: PassagewayModel[] = [];
  /**
   * 通道列表分页
   */
  public passagewayPaging = {size: 10, totalCount: 0, pageNum: 0};

  /**
   * 被选中的通道列表分页 前端分页
   */
  public selectedPassagewayPaging = {size: 1, pageNum: 1, totalPage: 0};
  /**
   * 分屏 one:1-1屏(默认)  two:2-2屏 three:3-3屏 four:4-4屏
   */
  public splitScreen: string = 'one';
  /**
   * 通道列表查询条件
   */
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  /**
   * 播放句柄
   */
  public lRealHandle: number;
  /**
   * 播放句柄
   */
  public channelId: string;
  /**
   * 摄像头指令下发参数
   */
  public params: any = {};

  /**
   * 搜索框绑定值
   */
  public searchValue: string;

  /**
   * 当前展示的通道列表数据
   */
  public liveBroadcastList: PassagewayModel[] = [];

  /**
   * 国际化
   */
  public language: ApplicationInterface;

  /**
   * 字体
   */
  public playIcon: number = 50;

  /**
   * 摄像头权限码枚举
   */
  public cameraCodeEnum = CameraCodeEnum;

  /**
   * @param $nzI18n  国际化服务
   * @param $securityService 后台服务
   * @param $message 提示信息服务
   * @param $router 路由跳转服务
   * @param $wsService socketService服務
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $securityService: ApplicationSystemForCommonService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $wsService: NativeWebsocketImplService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    if (this.isWorkbench) {
      this.queryCondition.filterConditions = [{filterValue: '1', filterField: 'status', operator: 'eq'}];
    } else {
      this.queryCondition.filterConditions = [
        {filterValue: '1', filterField: 'status', operator: 'eq'},
        {filterValue: this.equipmentId, filterField: 'equipmentId', operator: OperatorEnum.eq}
      ];
      // 当不为自己模块时，查出所有该设备下的通道，大小默认为10000
      this.queryCondition.pageCondition = new PageCondition(1, 10000);
    }
    if (this.isWorkbench) {
      this.getSecurityPassagewayList();
    }
  }

  ngAfterViewInit() {
    // 推送消息处理
    this.wsMsgAccept();
  }


  /**
   * 摄像头选择
   * @param index 当前选择的摄像头
   */
  public selectCamera(index: number): void {
    this.liveBroadcastList.forEach(item => {
      item.state = !this.isWorkbench;
    });
    this.liveBroadcastList[index].state = this.isWorkbench;
    this.equipmentId = this.liveBroadcastList[index].equipmentId;
    this.lRealHandle = this.liveBroadcastList[index].lRealHandle;
    this.channelId = this.liveBroadcastList[index].channelId;
    this.params = this.liveBroadcastList[index];
  }

  /**
   * 分割视图
   * @param several 分割级别
   */
  splitView(several: any) {
    // 如果 没有需要播放的视屏直接return
    if (_.isEmpty(this.liveBroadcastList)) {
      return;
    }
    // 如果当前等级与several相同  则直接return不做操作
    if (this.splitScreen === several) {
      return;
    }
    // 分屏等级
    this.splitScreen = several;
    switch (several) {
      case 'one':
        this.computingPagination(1);
        this.playIcon = 50;
        break;
      case 'two':
        this.computingPagination(4);
        this.playIcon = 40;
        break;
      case 'three':
        this.computingPagination(9);
        this.playIcon = 30;
        break;
      case 'four':
        this.computingPagination(16);
        this.playIcon = 20;
        break;
      default:
        break;
    }
  }

  /**
   * 计算分页
   * @param size 分页大小
   */
  private computingPagination(size: number): void {
    this.selectedPassagewayPaging.pageNum = 1;
    this.selectedPassagewayPaging.size = size;
    // 分页总页数为被选中的通道列表数组长度/当前size 且向上取整
    this.selectedPassagewayPaging.totalPage = Math.ceil(this.selectedPassagewayList.length / this.selectedPassagewayPaging.size);
    this.pagingQuery();
  }

  /**
   * @param type 类型 left：分页页码减一 right:分页页码加一   * 分页切换
   */
  public onPagingChange(type: string): void {
    if (type === 'left') {
      // 当分页页码是第一页时  则直接return
      if (this.selectedPassagewayPaging.pageNum <= 1) {
        return;
      }
      this.selectedPassagewayPaging.pageNum = this.selectedPassagewayPaging.pageNum - 1;
    } else {
      // 当分页页码是最后一页时  则直接return
      if (this.selectedPassagewayPaging.pageNum >= this.selectedPassagewayPaging.totalPage) {
        return;
      }
      this.selectedPassagewayPaging.pageNum = this.selectedPassagewayPaging.pageNum + 1;
    }
    this.pagingQuery();
  }

  /**
   * 分页查询事件
   */
  private pagingQuery(): void {
    if (!_.isEmpty(this.selectedPassagewayList)) {
      // 将所选的通道分成若干等分  以分页大小 bisectionArray为数组
      const bisectionArray = _.chunk(this.selectedPassagewayList, this.selectedPassagewayPaging.size);
      // 当前PageNum小于 totalPage 则用pageNum 否则用totalPage
      this.selectedPassagewayPaging.pageNum =
        this.selectedPassagewayPaging.pageNum < this.selectedPassagewayPaging.totalPage ?
          this.selectedPassagewayPaging.pageNum : this.selectedPassagewayPaging.totalPage;
      // 直播数组 为所选数组[当前分页页码-1]
      // this.liveBroadcastList = bisectionArray[this.selectedPassagewayPaging.pageNum - 1];
      this.liveBroadcastList = _.cloneDeep(bisectionArray[this.selectedPassagewayPaging.pageNum - 1]);
      this.selectCamera(0);
    }
  }

  /**
   * 初始化获取通道列表
   */
  private getSecurityPassagewayList(): void {
    this.$securityService.getSecurityPassagewayList(this.queryCondition)
      .subscribe((result: ResultModel<PassagewayModel[]>) => {
          if (result.code === ResultCodeEnum.success) {
            if (this.isWorkbench) {
                this.passagewayList = [...result.data];
                this.passagewayPaging.totalCount = result.totalCount;
              this.passagewayPaging.size = result.size;
              this.passagewayPaging.pageNum = result.pageNum;
              this.mySelfModularUsed();
            } else {
              // 不是当前模块时  所有的通道为相当于已选通道
                this.selectedPassagewayList = [...result.data];
              this.otherModularUsed();
            }
          }
        }
      );
  }

  /**
   * 自己模块使用的初始化
   */
  private mySelfModularUsed(): void {
    if (_.isEmpty(this.selectedPassagewayList)) {
      // 给equipmentList加上状态 用于样式 是否被选择
      this.passagewayList.forEach(item => {
        item.state = false;
      });
      // this.passagewayList数据不为空则会进入
      if (!_.isEmpty(this.passagewayList)) {
        this.passagewayList[0].state = true;
        this.equipmentId = this.passagewayList[0].equipmentId;
        this.selectedPassagewayList.push(this.passagewayList[0]);
      }
    } else {
      // 给equipmentList加上状态 用于样式 是否被选择
      this.passagewayList.forEach(item => {
        item.state = this.selectedPassagewayList.some(k =>
          k.channelId.concat(k.equipmentId) === item.channelId.concat(item.equipmentId));
      });
    }
    // 分页总页数为被选中的通道列表数组长度/当前size 且向上取整
    this.selectedPassagewayPaging.totalPage = Math.ceil(this.selectedPassagewayList.length / this.selectedPassagewayPaging.size);
    this.pagingQuery();
  }

  /**
   * 其他模块使用的初始化
   */
  private otherModularUsed(): void {
    if (!_.isEmpty(this.selectedPassagewayList)) {
      this.equipmentId = this.selectedPassagewayList[0].equipmentId;
      // 分页总页数为被选中的通道列表数组长度/当前size 且向上取整
      this.selectedPassagewayPaging.totalPage = Math.ceil(this.selectedPassagewayList.length / this.selectedPassagewayPaging.size);
      this.pagingQuery();
    }
  }


  /***
   * 获取配置信息  不能删除 build2可能使用
   * @param channelData 通道数据
   */
  private getSecurityConfiguration(channelData: PassagewayModel): void {
    this.$securityService.getSecurityConfiguration(channelData.equipmentId)
      .subscribe((result: ResultModel<PassagewayModel>) => {
        if (result.code === 'Z0031') {
          // 请填写基础配置
          this.$message.warning(`${this.language.securityWorkbench.fillInBasic}!`);
        } else if (result.code === ResultCodeEnum.success) {
          this.getSecurityCamera([channelData]);
        }
      });
  }

  /**
   * 发送获取视频流地址指令
   * @param channelData 需要获取地址的通道数组
   */
  private getSecurityCamera(channelData: PassagewayModel[]): void {
    // 如果 没有需要播放的视屏直接return
    if (_.isEmpty(this.liveBroadcastList)) {
      this.$message.warning(this.language.frequentlyUsed.noPlayableChannel);
      return;
    }
    const param = channelData.map(item => {
      // 填充所有参数 解构通道中onvif参数
      return {
        sDVRIP: item.cameraIp,
        wDVRPort: item.cameraPort,
        sUserName: item.cameraAccount,
        sPassword: item.cameraPassword,
        rtspUrl: item.rtspAddr,
        ...item
      };
    });
    const parameter = {
      commandId: ControlInstructEnum.getVideoStreamAddress,
      equipmentIds: channelData.map(item => item.equipmentId),
      param: {
        channelList: param
      }
    };
    this.$securityService.instructDistribute(parameter).subscribe((result: ResultModel<PassagewayModel[]>) => {
        if (result.code !== ResultCodeEnum.success) {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 切换列表
   * @param index 列表下标
   */
  public changeEquipment(index): void {
    // 判断是否为true
    if (this.passagewayList[index].state) {
      // 状态为true 且已选数组长度为1  则最后一个数组不作操作
      if (this.selectedPassagewayList.length === 1) {
        this.$message.warning(this.language.frequentlyUsed.selectChannel);
        return;
      }
      // 状态为true 则在被选中的通道列表中将其移除  且状态置为false
      this.passagewayList[index].state = false;
      // 当前点击的通道  设备ID和通道ID  来做唯一
      const tempId = `${this.passagewayList[index].channelId}${this.passagewayList[index].equipmentId}`;
      // 返回一个数组  将点击的通道元素删除之后的通道数组
      this.selectedPassagewayList = this.selectedPassagewayList.filter(item => tempId !== `${item.channelId}${item.equipmentId}`);
    } else {
      // 状态为false则push到被选中的通道列表中  且状态置为true
      this.passagewayList[index].state = true;
      this.selectedPassagewayList.push(this.passagewayList[index]);
    }
    // 分页总页数为被选中的通道列表数组长度/当前size 且向上取整
    this.selectedPassagewayPaging.totalPage = Math.ceil(this.selectedPassagewayList.length / this.selectedPassagewayPaging.size);
    // 由于切换时页面刷新很慢 加定时器异步
    setTimeout(() => {
      this.pagingQuery();
    });
  }

  /**
   * 通道列表 分页事件
   * @param pageNum 返回页码
   */
  public nzPageIndexChange(pageNum: number): void {
    this.queryCondition.pageCondition.pageNum = pageNum;
    this.getSecurityPassagewayList();
  }

  /**
   * 通道列表 搜索方法
   */
  public search() {
    if (this.searchValue) {
      this.queryCondition.filterConditions = [
        {filterValue: '1', filterField: 'status', operator: 'eq'},
        {filterValue: this.searchValue, filterField: 'channelName', operator: 'like'}];
    } else {
      this.queryCondition.filterConditions = [{filterValue: '1', filterField: 'status', operator: 'eq'}];
    }
    this.getSecurityPassagewayList();
  }

  /**
   * 全部开启
   */
  public onOpen(): void {
    this.getSecurityCamera(this.liveBroadcastList);
  }


  /**
   * 全部关闭
   */
  public onClose(channelData?: PassagewayModel[]): void {
    // 如果 没有需要播放的视屏直接return
    if (_.isEmpty(this.liveBroadcastList)) {
      return;
    }
    // 判断是否有参数 没有参数则是关闭所有的
    if (!channelData) {
      channelData = this.liveBroadcastList;
    }
    const param = channelData.map(item => {
      return {
        channelId: item.channelId,
        lUserId: item.lUserId,
        lRealHandle: item.lRealHandle,
        equipmentId: item.equipmentId,
        cameraType: item.cameraType,
      };
    });
    const equipmentIds = channelData.map(item => {
      return item.equipmentId;
    });
    const parameter = {
      commandId: ControlInstructEnum.stopRealPlay,
      equipmentIds: equipmentIds,
      param: {
        channelList: param
      }
    };
    this.$securityService.instructDistribute(parameter)
      .subscribe((result: ResultModel<PassagewayModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // 需要关闭的通道数组
          const needClose = channelData.map(item => {
            return `${item.channelId}${item.equipmentId}`;
          });
          // 当前播放数组 循环两数组  将其相等的设备的path置空
          this.liveBroadcastList.forEach(item => {
            item.path = needClose.includes(item.channelId.concat(item.equipmentId)) ? '' : item.path;
            item.lRealHandle = needClose.includes(item.channelId.concat(item.equipmentId)) ? null : item.lRealHandle;
          });
          // 已选数组 循环两数组  将其相等的设备的path置空
          this.selectedPassagewayList.forEach(item => {
            item.path = needClose.includes(item.channelId.concat(item.equipmentId)) ? '' : item.path;
            item.lRealHandle = needClose.includes(item.channelId.concat(item.equipmentId)) ? null : item.lRealHandle;
          });
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    console.log('split-screen 销毁');
    this.cameraLogout();
    // this.$wsService.close();
  }

  /**
   * 摄像头流销毁请求
   */
  cameraLogout() {
    // 所有path不为空的数据 都是开启过视频且没有发送关闭消息
    const closeArray = this.liveBroadcastList.filter(item => item.path);
    // closeArray 不为空则进行销毁
    if (!_.isEmpty(closeArray)) {
      // 页面销毁时  将没有发送关闭的数据  给后台发送
      this.onClose(closeArray);
    }
  }


  /**
   * 跳转通道配置信息
   */
  public goPassageway(): void {
    this.$router.navigate([`business/application/security/workbench/passageway-information`], {
      queryParams: {equipmentId: this.equipmentId}
    }).then();
  }

  /**
   * 跳转基础配置信息
   */
  public goBasics(): void {
    this.$router.navigate([`business/application/security/workbench/basics`], {
      queryParams: {equipmentId: this.equipmentId}
    }).then();
  }

  /**
   * 开始播放
   * @param channelData 通道数据
   */
  public startPlay(channelData: PassagewayModel): void {
    console.log(11);
    this.getSecurityCamera([channelData]);
  }

  /**
   * 开始播放
   * @param channelData 通道数据
   */
  public stopPlay(channelData: PassagewayModel): void {
    this.onClose([channelData]);
  }

  /**
   * 验证是否有权限
   * @param code 权限码
   */
  public hasRole(code: string) {
    return SessionUtil.checkHasRole(code);
  }


  /**
   * webSocket消息监听
   */
  private wsMsgAccept(): void {
    if (!this.$wsService.subscibeMessage) {
      this.$wsService.connect();
    }
    this.$wsService.subscibeMessage.subscribe(msg => {
      const data = JSON.parse(msg.data);
      if (data.channelKey === 'equipmentId') {
        const equipmentData = JSON.parse(data.msg);
        // 给当前通道地址赋值
        this.liveBroadcastList.forEach(item => {
          // 通道ID＋设备ＩＤ是唯一的（通道ＩＤ不是唯一）
          if (`${item.channelId}${item.equipmentId}` === `${equipmentData.channelId}${equipmentData.equipmentId}`) {
            item.path = equipmentData.httpUrl;
            item.lUserId = equipmentData.lUserId;
            item.lRealHandle = equipmentData.lRealHandle;
          }
        });
        // 给当前已选择的通道地址赋值
        this.selectedPassagewayList.forEach(item => {
          if (`${item.channelId}${item.equipmentId}` === `${equipmentData.channelId}${equipmentData.equipmentId}`) {
            item.path = equipmentData.httpUrl;
            item.lUserId = equipmentData.lUserId;
            item.lRealHandle = equipmentData.lRealHandle;
          }
        });
        this.liveBroadcastList = [...this.liveBroadcastList];
        if (this.isWorkbench) {
          this.liveBroadcastList.forEach(item => {
            if (item.state) {
              this.equipmentId = item.equipmentId;
              this.lRealHandle = item.lRealHandle;
              this.channelId = item.channelId;
              this.params = item;
            }
          });
        } else {
          this.selectCamera(0);
        }
      }
    });
  }
}
