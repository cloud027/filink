import {Component, OnDestroy, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationService} from '../../../share/service/application.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ApplicationFinalConst, RouterJumpConst, SwitchActionConst} from '../../../share/const/application-system.const';
import {BroadcastTableEnum, CallTableEnum, LightTableEnum, ReleaseTableEnum, SecurityEnum} from '../../../share/enum/auth.code.enum';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {DistributeModel} from '../../../share/model/distribute.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {FilterValueConst} from '../../../share/const/filter.const';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {EquipmentModel} from '../../../share/model/equipment.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {IrregularData} from '../../../../../core-module/const/common.const';
import {InstructConfig} from '../../../share/config/instruct.config';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {SliderValueConst} from '../../../share/const/slider.const';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {BusinessStatusEnum} from '../../../share/enum/camera.enum';
import {PerformDataModel} from '../../../../../core-module/model/group/perform-data.model';
import {FacilityForCommonService} from '../../../../../core-module/api-service';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {SelectFacilityChangeService} from '../../../share/service/select-facility-change.service';
import {SelectTableEquipmentChangeService} from '../../../share/service/select-table-equipment-change.service';
import {CallTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {EnergyApiService} from '../../../../energy/share/service/energy/energy-api.service';
import {CallWebsocketImplService} from '../../../../../core-module/call-websocket/call-websocket-impl.service';

/**
 * 设备列表-设备列表
 */

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit, OnDestroy {
  @Input() public isSecurity: boolean = false;
  // 勾选设备数据改变
  @Output() selectDataChange = new EventEmitter();
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 业务状态
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // 业务状态
  @ViewChild('remarkTable') remarkTable: TemplateRef<HTMLDocument>;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 表格多语言
  public language: OnlineLanguageInterface;
  // 设施语言包
  public equipmentLanguage: FacilityLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 设备列表数据集合
  public dataSet: EquipmentListModel[] = [];
  // 已选择设施数据
  public selectFacility: FacilityListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  public audioPageBean: PageModel = new PageModel();
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 过滤框显示设施名
  public filterDeviceName: string = '';
  public selectEquipmentId: string = '';
  public equipmentName: string = '';
  public sequenceId: string = '';
  public equipmentModelType: string = '';
  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 表格配置
  public tableConfig: TableConfigModel;
  // 批量选中的亮度数据
  public dimmingLight: EquipmentListModel[] = [];
  // 批量选中的音量数据
  public volumeList: EquipmentListModel[] = [];
  public selectedEquipmentData: EquipmentListModel[] = [];
  // 设备状态集合
  public equipmentTypeList = [];
  public equipmentList = [];
  // 录音设备集合
  public recordEquipmentList = [];
  // 亮度显隐
  public isBrightness: boolean = false;
  public isVolume: boolean = false;
  public isOnline: boolean = false;
  public isInsert: boolean = false;
  public isCall: boolean = false;
  // 设施过滤
  public filterValue: FilterCondition;
  // 亮度值
  public dimmingLightValue: number = 0;
  public volumeValue: number = 0;
  public sourceId: string;
  public sourceName: string;
  public onlineVolumeValue: number = 0;
  public insertVolumeValue: number = 0;
  public insertType: number = 0;
  // 表格查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  public audioQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 业务状态枚举
  public businessStatusEnum = BusinessStatusEnum;
  public equipmentStatusList;
  // 关闭订阅流
  public destroy$ = new Subject<void>();
  // 是否需要查询设备指令下发模式
  private isNeedCheckMode: boolean = false;
  public boxWidth = 500;
  public isStop: boolean = false;
  // 广播状态
  radioStatus: boolean = false;
  callStatus: string = '';
  callData: any;

  constructor(
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 路由
    private $router: Router,
    // 提示
    private $message: FiLinkModalService,
    // 接口服务
    private $applicationService: ApplicationService,
    // 接口服务
    private $facilityCommonService: FacilityForCommonService,
    private $selectFacilityChangeService: SelectFacilityChangeService,
    private $selectTableEquipmentChangeService: SelectTableEquipmentChangeService,
    private $energyApiService: EnergyApiService,
    private callWebsocketImplService: CallWebsocketImplService
  ) {
    this.language = $nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = $nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.equipmentStatusList = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, this.languageEnum.facility);
    this.equipmentStatusList = this.equipmentStatusList.filter(item => item.code !== EquipmentStatusEnum.dismantled);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
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
            case 'CALL': // 呼叫开始
              if (code === '1') { // 成功
                this.callStatus = 'CALL';
              }
              break;
            case 'REMOTE_RINGING': // 对方响铃
              if (code === '1') { // 成功
                this.callStatus = 'REMOTE_RINGING';
              }
              break;
            case 'REMOTE_ACCEPT': // 对方已接听
              wsState = true;
              if (code === '1') { // 成功
                this.callStatus = 'REMOTE_ACCEPT';
              }
              break;
            case 'HANGUP': // 挂断
              if (code !== '0') {
                wsState = true;
                this.callStatus = 'HANGUP';
                sessionStorage.removeItem('callTime');
                sessionStorage.removeItem('callData');
              }
              break;
            case 'REMOTE_HANGUP': // 对方挂断
              if (code !== '0') {
                wsState = true;
                this.callStatus = 'REMOTE_HANGUP';
                sessionStorage.removeItem('callTime');
                sessionStorage.removeItem('callData');
              }
              break;
            default:
              break;
          }
        }
      }
    });
    const url = this.$router.url;
    let permission;
    if (url.includes(ApplicationFinalConst.lighting)) {
      // 照明设备列表code码枚举
      permission = LightTableEnum;
    } else if (url.includes(ApplicationFinalConst.release)) {
      // 信息屏设备列表code码枚举
      permission = ReleaseTableEnum;
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      // 广播设备列表code码枚举
      permission = BroadcastTableEnum;
      // 广播发布列表页面查询话筒
      this.queryEquipmentList();
    } else {
      // 安防设备列表code码枚举
      permission = SecurityEnum;
    }
    // 监听地图选中设备变化
    this.$selectFacilityChangeService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.equipmentIds && value.equipmentIds.length) {
        // 联动列表筛选条件改变
        this.queryCondition.filterConditions = [new FilterCondition('equipmentId', OperatorEnum.in, value.equipmentIds)];
      } else {
        this.queryCondition.filterConditions = [new FilterCondition()];
      }
      this.refreshData();
    });
    this.initTableConfig(permission);
    this.refreshData();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.equipmentTypeTemp = null;
    this.equipmentStatusFilterTemp = null;
    this.equipmentStatusFilterTemp = null;
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 改变滑块值的辩护
   * @ param event
   */
  public handleSlider(event: number): void {
    this.dimmingLightValue = event;
  }

  /**
   * 改变音量滑块值的变化
   * @ param event
   */
  public handleVolumeSlider(event, type) {
    if (type === 0) {
      // 音量弹窗
      this.volumeValue = event;
    } else {
      // 插播
      this.onlineVolumeValue = event;
    }
  }

  public handleSource(sourceId: string) {
    this.sourceId = sourceId;
  }

  /**
   * 分页查询
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   *  取消操作
   */
  public handleCancel(): void {
    if (this.callStatus === 'CALL' || this.callStatus === 'REMOTE_RINGING') {
      this.$message.warning('呼叫中，请稍后');
      return;
    } else if (this.callStatus === 'REMOTE_ACCEPT') {
      this.callWebsocketImplService.minimizeMessage();
    }
    this.isBrightness = false;
    this.isVolume = false;
    this.isOnline = false;
    this.isInsert = false;
    this.isCall = false;
  }

  /**
   * 亮度调整
   */
  public handleOk(): void {
    this.dimmingLightValue = this.dimmingLightValue || 0;
    const params: DistributeModel = {
      equipmentIds: this.dimmingLight.map(item => item.equipmentId),
      commandId: ControlInstructEnum.dimming,
      param: {
        lightnessNum: this.dimmingLightValue
      }
    };
    this.isBrightness = false;
    this.instructDistribute(params);
  }

  /**
   * 音量调整
   */
  public confirmVolume(): void {
    const params: DistributeModel = {
      equipmentIds: this.volumeList.map(item => item.equipmentId),
      commandId: ControlInstructEnum.broadcastVolumeSave,
      param: {
        volume: this.volumeValue
      }
    };
    this.isVolume = false;
    this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        const volumeParams = {
          commandId: ControlInstructEnum.broadcastVolume,
          equipmentIds: this.volumeList.map(item => item.equipmentId),
          param: {
            volume: this.volumeValue
          }
        };
        this.instructDistribute(volumeParams);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 点击输入框弹出设施选择
   */
  public onShowFacility(value: FilterCondition): void {
    this.filterValue = value;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    } else {
      const deviceNameArr = this.filterValue.filterName.split(',');
      this.selectFacility = this.filterValue.filterValue.map((item, index) => {
        return {deviceId: item, deviceName: deviceNameArr[index]};
      });
    }
    this.facilityVisible = true;
  }

  /**
   * 选择设施数据
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event.map(item => {
        return item.deviceName;
      }).join(',');
    } else {
      this.filterDeviceName = '';
    }
    this.filterValue.filterValue = event.map(item => {
      return item.deviceId;
    }) || [];
    this.filterValue.operator = OperatorEnum.in;
    this.filterValue.filterName = this.filterDeviceName;
  }

  /**
   * 初始化表格配置
   */
  public initTableConfig(permission): void {
    const url = this.$router.url;
    // 状态筛选对应的平台只展示对应的状态
    if (url.includes(ApplicationFinalConst.lighting)) {
      const lightingArr = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => FilterValueConst.lightingFilter[0] === item.code);
      const lightingNewArr = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => FilterValueConst.lightingFilter[1] === item.code);
      this.equipmentTypeList = lightingArr.concat(lightingNewArr);
      this.isNeedCheckMode = true;
    } else if (url.includes(ApplicationFinalConst.release)) {
      this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => item.code === FilterValueConst.informationFilter[0]);
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => item.code === FilterValueConst.broadcastFilter[0]);
    } else if (url.includes(ApplicationFinalConst.call)) {
      this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => item.code === FilterValueConst.callFilter[0]);
    } else {
      this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => item.code === FilterValueConst.securityFilter[0]);
    }
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      primaryKey: permission.primaryKey,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: [],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        // 开
        {
          text: this.languageTable.equipmentTable.switch,
          needConfirm: true,
          canDisabled: true,
          permissionCode: permission.primaryOpenKey,
          iconClassName: 'fiLink-open',
          btnType: 'special',
          confirmContent: `${this.languageTable.equipmentTable.confirmOpen}?`,
          handle: (data: EquipmentListModel[]) => {
            this.switchLight(data, SwitchActionConst.open);
          }
        },
        // 关
        {
          text: this.languageTable.equipmentTable.shut,
          needConfirm: true,
          canDisabled: true,
          permissionCode: permission.primaryShutKey,
          iconClassName: 'fiLink-shut-off',
          btnType: 'special',
          confirmContent: `${this.languageTable.equipmentTable.confirmClose}?`,
          handle: (data: EquipmentListModel[]) => {
            this.switchLight(data, SwitchActionConst.close);
          }
        },
      ],
      // 更多操作
      moreButtons: [
        // 上电
        {
          text: this.languageTable.equipmentTable.upElectric,
          iconClassName: 'fiLink-up-electric',
          canDisabled: true,
          disabled: true,
          permissionCode: permission.primaryUpKey,
          handle: () => {
          }
        },
        // 下电
        {
          text: this.languageTable.equipmentTable.downElectric,
          iconClassName: 'fiLink-down-electric',
          canDisabled: true,
          disabled: true,
          permissionCode: permission.primaryDownKey,
          handle: () => {
          }
        },
        // 亮度
        {
          text: this.languageTable.equipmentTable.light,
          iconClassName: 'fiLink-light',
          canDisabled: true,
          permissionCode: permission.primaryLightKey,
          handle: (data: EquipmentListModel[]) => {
            this.dimmingLight = data;
            // 操作多个设备时  亮度回显为0
            this.dimmingLightValue = 0;
            this.isBrightness = true;
          }
        },
      ],
      operation: [
        // 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: permission.primaryDetailKey,
          handle: (data: EquipmentModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // 上电
        {
          text: this.languageTable.equipmentTable.upElectric,
          className: 'fiLink-up-electric disabled-icon',
          permissionCode: permission.primaryUpKey,
          handle: () => {
          },
        },
        // 下电
        {
          text: this.languageTable.equipmentTable.downElectric,
          className: 'fiLink-down-electric disabled-icon',
          permissionCode: permission.primaryDownKey,
          handle: () => {
          },
        },
        // 开
        {
          text: this.languageTable.equipmentTable.switch,
          className: 'fiLink-open',
          needConfirm: true,
          permissionCode: permission.primaryOpenKey,
          confirmContent: `${this.languageTable.equipmentTable.confirmOpen}?`,
          handle: (currentIndex: EquipmentListModel) => {
            this.switchLight([currentIndex], SwitchActionConst.open);
          }
        },
        // 关
        {
          text: this.languageTable.equipmentTable.shut,
          className: 'fiLink-shut-off',
          needConfirm: true,
          permissionCode: permission.primaryShutKey,
          confirmContent: `${this.languageTable.equipmentTable.confirmClose}?`,
          handle: (currentIndex: EquipmentListModel) => {
            this.switchLight([currentIndex], SwitchActionConst.close);
          }
        },
        // 亮度
        {
          text: this.languageTable.equipmentTable.light,
          className: 'fiLink-light',
          permissionCode: permission.primaryLightKey,
          handle: (data: EquipmentListModel) => {
            this.dimmingLight = [data];
            this.queryEquipmentInfo(data);
          },
        }
      ],
      // 勾选
      handleSelect: (event: EquipmentListModel[]) => {
        this.getPositionMapByEquipmentIds(event);
      },
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
    this.securityShow();
  }

  /**
   * 设备列表勾选设备联动地图
   */
  public getPositionMapByEquipmentIds(event: EquipmentListModel[]): void {
    // 表格勾选数据
    // 发射表格勾选数据变化
    this.$selectTableEquipmentChangeService.eventEmit.emit({type: 'equipment', equipmentData: event});
    this.selectDataChange.emit(event);
  }

  /**
   * 刷新表格数据
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    // 默认查询条件
    this.defaultQuery();
    this.$applicationService.newEquipmentListByPage(this.queryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        const {totalCount, pageNum, size, data} = res;
        this.dataSet = data || [];
        // equipmentFmt(data, this.$nzI18n);
        this.dataSet.forEach(item => {
          // 设置状态样式
          const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
          item.statusIconClass = iconStyle.iconClass;
          item.statusColorClass = iconStyle.colorClass;
          // 获取设备类型的图标
          item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
          // 计算安装时间和当前时间是否超过报废年限
          if (item.installationDate && item.scrapTime) {
            const now = new Date().getTime();
            const tempDate = new Date(Number(item.installationDate));
            tempDate.setFullYear(tempDate.getFullYear() + Number(item.scrapTime));
            item.rowStyle = now > tempDate.getTime() ? IrregularData : {};
          }
        });
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 默认查询条件
   */
  public defaultQuery(): void {
    InstructConfig.defaultQuery(this.$router, this.queryCondition);
  }

  /**
   * 设备开关
   * @ param data 选中的数据
   * @ param type 区分开和关
   */
  public switchLight(data: EquipmentListModel[], type: string): void {
    const action = type === SwitchActionConst.open ? ControlInstructEnum.turnOn : ControlInstructEnum.turnOff;
    const params: DistributeModel = {
      equipmentIds: data.map(item => item.equipmentId),
      commandId: action,
      param: {}
    };
    this.instructDistribute(params);
  }

  /**
   * 指令接口
   * @ param params
   */
  public instructDistribute(params: DistributeModel): void {
    if (this.isNeedCheckMode) {
      // 需查询指令模式
      this.checkEquipmentMode(params.equipmentIds).then(resolve => {
        if (resolve.code === ResultCodeEnum.success) {
          // 模式允许下发指令
          this.canInstructDistribute(params);
        } else {
          // 指令异常弹出指令模式提示,且不下发指令
          this.$message.error(resolve.msg);
        }
      });
    } else {
      this.canInstructDistribute(params);
    }

  }

  /**
   * 允许下发指令，下发指令
   * @param params 操作的设备数据
   */
  public canInstructDistribute(params: DistributeModel): void {
    // 下发指令接口
    this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        // 弹出指令下发成功提示
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
        this.isBrightness = false;
        this.dimmingLightValue = 0;
        this.refreshData();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 设备详情
   */
  public handEquipmentOperation(data: EquipmentModel): void {
    const url = this.$router.url;
    let path;
    if (url.includes(ApplicationFinalConst.lighting)) {
      path = RouterJumpConst.equipmentDetails;
    } else if (url.includes(ApplicationFinalConst.release)) {
      path = RouterJumpConst.releaseDetails;
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      path = RouterJumpConst.broadcastDetails;
    } else if (url.includes(ApplicationFinalConst.call)) {
      path = RouterJumpConst.callDetails;
    } else {
      path = RouterJumpConst.securityDetails;
    }
    this.$router.navigate([path], {
      queryParams: {
        equipmentId: data.equipmentId,
        equipmentType: data.equipmentType,
        equipmentName: data.equipmentName,
        equipmentModel: data.equipmentModel,
        equipmentStatus: data.equipmentStatus,
        equipmentModelType: data.equipmentModelType,
        sequenceId: data.sequenceId,
      }
    }).then();
  }

  /**
   * 查询设备信息
   * 单个设备调整亮度时需要回显亮度
   */
  private queryEquipmentInfo(data: EquipmentListModel): void {
    const queryBody = new PerformDataModel();
    queryBody.equipmentId = data.equipmentId;
    queryBody.equipmentType = data.equipmentType;
    this.$facilityCommonService.queryPerformData(queryBody)
      .subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // 单个设备调整亮度时需要回显亮度
          this.dimmingLightValue = res.data.light || res.data.brightness;
          this.isBrightness = true;
        } else {
          this.$message.error(res.msg);
        }
      });
  }

  /**
   * 安防设备列表中没有开，关，更多操作
   */
  private securityShow(): void {
    const url = this.$router.url;
    if (url.includes(ApplicationFinalConst.security)) {
      this.tableConfig.topButtons = [];
      this.tableConfig.moreButtons = [];
      this.tableConfig.operation = [
        // 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: SecurityEnum.primaryDetailKey,
          handle: (data: EquipmentModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // 上电
        {
          text: this.languageTable.equipmentTable.upElectric,
          className: 'fiLink-up-electric disabled-icon',
          permissionCode: SecurityEnum.primaryUpKey,
          handle: () => {
          },
        },
        // 下电
        {
          text: this.languageTable.equipmentTable.downElectric,
          className: 'fiLink-down-electric disabled-icon',
          permissionCode: SecurityEnum.primaryDownKey,
          handle: () => {
          },
        },
        // 开
        {
          text: this.languageTable.equipmentTable.switch,
          className: 'fiLink-open disabled-icon',
          permissionCode: SecurityEnum.primaryOpenKey,
          handle: () => {
          },
        },
        // 关
        {
          text: this.languageTable.equipmentTable.shut,
          className: 'fiLink-shut-off disabled-icon',
          permissionCode: SecurityEnum.primaryShutKey,
          handle: () => {
          },
        },
      ];
    } else if (url.includes(ApplicationFinalConst.release)) {
      const play = {
        text: this.languageTable.equipmentTable.play,
        iconClassName: 'fiLink-pic-bofang1',
        canDisabled: true,
        permissionCode: ReleaseTableEnum.primaryPlayKey,
        handle: () => {
        }
      };
      this.tableConfig.moreButtons.push(play);
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      this.tableConfig.topButtons = [
        // 插播
        {
          text: this.languageTable.equipmentTable.insertBroadcast,
          className: 'fiLink-filink-chabo-icon',
          canDisabled: true,
          permissionCode: BroadcastTableEnum.primaryInsertKey,
          handle: (data: EquipmentListModel[]) => {
            const radioData = JSON.parse(sessionStorage.getItem('radioData'));
            if (radioData) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            this.selectedEquipmentData = data;
            this.isInsert = true;
            this.insertVolumeValue = 0;
          }
        },
        // 现场广播
        {
          text: this.languageTable.equipmentTable.onlineBroadcast,
          className: 'fiLink-filink-xianchangguangbo-icon',
          canDisabled: true,
          permissionCode: BroadcastTableEnum.primaryOnline,
          handle: (data: EquipmentListModel[]) => {
            const radioData = JSON.parse(sessionStorage.getItem('radioData'));
            if (radioData) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            this.equipmentList = data;
            this.isOnline = true;
            this.onlineVolumeValue = 0;
          }
        },
      ];
      this.tableConfig.moreButtons = [
        // 音量
        {
          text: this.languageTable.equipmentTable.volume,
          iconClassName: 'fiLink-filink-yinliang-icon1',
          canDisabled: true,
          permissionCode: BroadcastTableEnum.primaryVolume,
          handle: (data: EquipmentListModel[]) => {
            this.isVolume = true;
            this.volumeList = data;
            this.volumeValue = 0;
          }
        },
        // 停止插播
        {
          text: this.languageTable.equipmentTable.stopBroadcast,
          className: 'fiLink-suspend',
          canDisabled: true,
          permissionCode: BroadcastTableEnum.primaryShutKey,
          handle: (data: EquipmentListModel[]) => {
            const radioData = JSON.parse(sessionStorage.getItem('radioData'));
            if (radioData) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            const params = {
              commandId: ControlInstructEnum.broadcastStop,
              equipmentIds: data.map(item => item.equipmentId),
              param: {}
            };
            this.instructDistribute(params);
          }
        },
      ];
      this.tableConfig.operation = [
        // 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: BroadcastTableEnum.primaryDetail,
          handle: (data: EquipmentModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // 插播
        {
          text: this.languageTable.equipmentTable.insertBroadcast,
          className: 'fiLink-filink-chabo-icon',
          permissionCode: BroadcastTableEnum.primaryInsertKey,
          handle: (data: EquipmentListModel) => {
            const radioData = JSON.parse(sessionStorage.getItem('radioData'));
            if (radioData) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            this.selectedEquipmentData = [data];
            this.queryBroadcastVolumeById(data.sequenceId);
            this.isInsert = true;
          },
        },
        // 现场广播
        {
          text: this.languageTable.equipmentTable.onlineBroadcast,
          className: 'fiLink-filink-xianchangguangbo-icon',
          permissionCode: BroadcastTableEnum.primaryOnline,
          handle: (data: EquipmentListModel) => {
            const radioData = JSON.parse(sessionStorage.getItem('radioData'));
            if (radioData) {
              this.$message.warning('已有广播正在广播中');
              return;
            }
            this.equipmentList = [data];
            this.isOnline = true;
            this.queryBroadcastVolumeById(data.sequenceId);
          },
        },
        // 音量
        {
          text: this.languageTable.equipmentTable.volume,
          className: 'fiLink-filink-yinliang-icon1',
          permissionCode: BroadcastTableEnum.primaryVolume,
          handle: (data: EquipmentListModel) => {
            this.isVolume = true;
            this.volumeList = [data];
            // TODO 调用接口查询指定设备的
            this.queryBroadcastVolumeById(data.sequenceId);
          },
        },
        // 停止播放
        {
          text: this.languageTable.equipmentTable.stopBroadcast,
          className: 'fiLink-suspend',
          permissionCode: BroadcastTableEnum.primaryShutKey,
          handle: (data: EquipmentModel) => {
            const radioData = JSON.parse(sessionStorage.getItem('radioData'));
            if (radioData) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            const params = {
              commandId: ControlInstructEnum.broadcastStop,
              equipmentIds: [data.equipmentId],
              param: {}
            };
            this.instructDistribute(params);
          },
        },
      ];
    } else if (url.includes(ApplicationFinalConst.call)) {
      // this.tableConfig.topButtons = [
      //   // 呼叫
      //   {
      //     text: this.languageTable.equipmentTable.call,
      //     needConfirm: true,
      //     canDisabled: true,
      //     // permissionCode: CallTableEnum.primaryCallKey,
      //     // permissionCode: '000000',
      //     iconClassName: 'fiLink-filink-hujiao-icon',
      //     btnType: 'special',
      //     disabled: true,
      //     confirmContent: `${this.languageTable.equipmentTable.confirmCall}?`,
      //     handle: (data: EquipmentListModel[]) => {
      //       const params = {
      //         commandId: ControlInstructEnum.callStart,
      //         equipmentIds: data.map(item => item.equipmentId),
      //         param: {}
      //       };
      //       this.instructDistribute(params);
      //     }
      //   },
      //   // 监听
      //   {
      //     text: this.languageTable.equipmentTable.monitor,
      //     needConfirm: true,
      //     canDisabled: true,
      //     disabled: true,
      //     // permissionCode: CallTableEnum.primaryListenKey,
      //     permissionCode: '000000',
      //     iconClassName: 'fiLink-filink-jianting-icon',
      //     btnType: 'special',
      //     confirmContent: `${this.languageTable.equipmentTable.confirmMonitor}?`,
      //     handle: (data: EquipmentListModel[]) => {
      //       const params = {
      //         commandId: ControlInstructEnum.callMonitor,
      //         equipmentIds: data.map(item => item.equipmentId),
      //         param: {}
      //       };
      //       this.instructDistribute(params);
      //     }
      //   },
      // ];
      this.tableConfig.topButtons = [
        // 操作
        {
          text: this.languageTable.frequentlyUsed.operate,
          className: 'fiLink-filink-chabo-icon',
          canDisabled: true,
          permissionCode: CallTableEnum.primaryCallKey,
          handle: (data: EquipmentListModel[]) => {
            if (data.length > 1) {
              this.$message.warning('暂不支持批量操作');
            } else {
              this.isCall = true;
              this.selectEquipmentId = data[0].equipmentId;
              this.sequenceId = data[0].sequenceId;
              this.equipmentModelType = data[0].equipmentModelType;
            }
          }
        },
      ];
      this.tableConfig.moreButtons = [];
      // TODO 操作权限key待补充
      this.tableConfig.operation = [// 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: CallTableEnum.primaryDetail,
          handle: (data: EquipmentModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // 呼叫
        {
          text: this.languageTable.frequentlyUsed.operate,
          className: 'fiLink-filink-hujiao-icon',
          // permissionCode: CallTableEnum.primaryCallKey,
          handle: (data: EquipmentListModel) => {
            this.callData = JSON.parse(sessionStorage.getItem('callData'));
            this.isCall = true;
            this.selectEquipmentId = data.equipmentId;
            this.equipmentName = data.equipmentName;
            this.sequenceId = data.sequenceId;
            this.equipmentModelType = data.equipmentModelType;
          },
        }];
    }
    this.releaseTable();
  }

  /**
   * 信息屏设备列表配置项
   */
  private releaseTable(): void {
    this.tableConfig.columnConfig = [
      { // 选择
        type: 'select',
        fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
      },
      { // 序号
        type: 'serial-number',
        width: 62,
        title: this.language.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      { // 名称
        title: this.languageTable.strategyList.alarmDeviceName,
        key: 'equipmentName',
        width: 150,
        configurable: true,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'},
        fixedStyle: {fixedLeft: true, style: {left: '124px'}}
      },
      { // 资产编码
        title: this.equipmentLanguage.deviceCode,
        key: 'equipmentCode',
        width: 150,
        configurable: true,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 类型
        title: this.equipmentLanguage.type,
        key: 'equipmentType',
        isShowSort: true,
        type: 'render',
        configurable: true,
        width: 160,
        searchable: true,
        renderTemplate: this.equipmentTypeTemp,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: this.equipmentTypeList,
          label: 'label',
          value: 'code'
        }
      },
      { // 状态
        title: this.equipmentLanguage.status,
        key: 'equipmentStatus',
        width: 130,
        type: 'render',
        renderTemplate: this.equipmentStatusFilterTemp,
        configurable: true,
        searchable: true,
        isShowSort: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: this.equipmentStatusList,
          label: 'label',
          value: 'code'
        }
      },
      { //  型号
        title: this.equipmentLanguage.model,
        key: 'equipmentModel',
        width: 124,
        configurable: true,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 供应商
        title: this.equipmentLanguage.supplierName,
        key: 'supplier',
        width: 125,
        configurable: true,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 报废时间
        title: this.equipmentLanguage.scrapTime,
        key: 'scrapTime',
        width: 100,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // 所属设施
        title: this.equipmentLanguage.affiliatedDevice,
        key: 'deviceName',
        searchKey: 'deviceId',
        width: 150,
        configurable: true,
        searchable: true,
        isShowSort: true,
        searchConfig: {
          type: 'render',
          renderTemplate: this.deviceFilterTemplate
        },
      },
      { // 挂载位置
        title: this.equipmentLanguage.mountPosition,
        key: 'mountPosition',
        configurable: true,
        width: 100,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 安装时间日期
        title: this.equipmentLanguage.installationDate,
        width: 200,
        configurable: true,
        isShowSort: true,
        searchable: true,
        pipe: 'date',
        searchConfig: {type: 'dateRang'},
        key: 'installationDate'
      },
      { // 权属公司
        title: this.equipmentLanguage.company, key: 'company',
        searchable: true,
        width: 150,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 业务状态
        title: this.equipmentLanguage.businessStatus, key: 'businessStatus',
        configurable: true,
        type: 'render',
        renderTemplate: this.equipmentBusinessTemp,
        width: 150,
        searchable: true,
        isShowSort: true,
        searchConfig: {
          type: 'select',
          selectInfo: CommonUtil.codeTranslate(BusinessStatusEnum, this.$nzI18n, null, LanguageEnum.facility),
          label: 'label',
          value: 'code'
        }
      },
      { // 区域名称
        title: this.equipmentLanguage.affiliatedArea, key: 'areaName',
        configurable: true,
        width: 150,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'},
      },
      { // 详细地址
        title: this.equipmentLanguage.address, key: 'address',
        configurable: true,
        width: 150,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'},
      },
      { // 所属网关
        title: this.equipmentLanguage.gatewayName, key: 'gatewayName',
        configurable: true,
        width: 150,
        searchable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      { // 备注
        title: this.equipmentLanguage.remarks, key: 'remarks',
        configurable: true,
        width: 200,
        searchable: true,
        isShowSort: true,
        renderTemplate: this.remarkTable,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.operate,
        searchable: true,
        searchConfig: {type: 'operate'},
        key: '',
        width: 200,
        fixedStyle: {fixedRight: false, style: {right: '0px'}}
      },
    ];
  }

  public queryBroadcastVolumeById(id) {
    this.$applicationService.queryBroadcastVolumeById({sequenceId: id}).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.volumeValue = Number(res.data);
        this.insertVolumeValue = Number(res.data);
        this.onlineVolumeValue = Number(res.data);
      } else {
        this.volumeValue = 0;
        this.insertVolumeValue = 0;
        this.onlineVolumeValue = 0;
        this.$message.error(res.msg);
      }
    });
  }

  public handleCloseOnline() {
    if (!this.sourceId) {
      this.isOnline = false;
    } else {
      this.isOnline = false;
      if (this.radioStatus) {
        this.$energyApiService.messageTopic.next({
          type: 1, // 广播类型  1：列表广播  2：分组广播
          radioId: this.sourceId,
          radioName: this.equipmentList.map(item => item.equipmentName).toString(),
        });
      }
    }
    this.sourceId = null;
    this.isStop = false;
  }

  /**
   * 查询是手动控制还是自动
   */
  private checkEquipmentMode(data): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityCommonService.checkEquipmentMode({equipmentIdList: data}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }

  /**
   * 现场广播 开始、停止
   */
  public switchOnlineOperate(type: string) {
    // 校验是否选择录音设备
    if (this.sourceId) {
      const params = {
        commandId: ControlInstructEnum.broadcastOnline,
        equipmentIds: this.equipmentList.map(item => item.equipmentId),
        param: {
          sourceId: this.sourceId, // 录音设备真实id  sequenceId
          isStop: type, //  0 - 开始   1 - 停止.
        }
      };
      if (type === '1') {
        params.commandId = ControlInstructEnum.broadcastOnlineStop;
      }
      this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          const volumeParams = {
            commandId: ControlInstructEnum.broadcastVolume,
            equipmentIds: this.equipmentList.map(item => item.equipmentId),
            param: {
              volume: this.onlineVolumeValue
            }
          };
          this.instructDistribute(volumeParams);
          // 存储广播状态
          this.radioStatus = type === '0';
          this.isStop = type === '0';
          // 存储广播数据
          sessionStorage.setItem('radioData', JSON.stringify(params));
          if (type === '1') {
            sessionStorage.removeItem('radioData');
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      this.$message.warning(this.language.selectDevice);
    }
  }

  public queryEquipmentList() {
    this.audioQueryCondition.filterConditions = [
      {
        filterValue: FilterValueConst.callFilter,
        filterField: 'equipmentType',
        operator: 'in'
      },
      {
        filterValue: CallTypeEnum.microphone,
        filterField: 'equipmentModelType',
        operator: 'eq'
      }
    ];
    this.audioQueryCondition.pageCondition.pageSize = 10;
    this.audioQueryCondition.pageCondition.pageNum = 1;
    this.$applicationService.equipmentListByPage(this.audioQueryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const {totalCount, pageNum, size, data} = res;
        this.recordEquipmentList = data || [];
        this.audioPageBean.Total = totalCount;
        this.audioPageBean.pageIndex = pageNum;
        this.audioPageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }

    });
  }
}
