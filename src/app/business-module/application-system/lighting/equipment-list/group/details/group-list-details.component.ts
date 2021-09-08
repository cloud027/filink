import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../../share/service/application.service';
import {ApplicationInterface} from '../../../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {OnlineLanguageInterface} from '../../../../../../../assets/i18n/online/online-language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {InstructConfig} from '../../../../share/config/instruct.config';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {AssetManagementLanguageInterface} from '../../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {DistributeModel} from '../../../../share/model/distribute.model';
import {getDeviceStatus} from '../../../../share/util/application.util';
import {LightTableEnum, BroadcastGroupTableEnum} from '../../../../share/enum/auth.code.enum';
import {FacilityForCommonService} from '../../../../../../core-module/api-service';
import {FacilityListModel} from '../../../../../../core-module/model/facility/facility-list.model';
import {EquipmentListModel} from '../../../../../../core-module/model/equipment/equipment-list.model';
import {FacilityForCommonUtil} from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import {CallTypeEnum, EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../../../core-module/enum/equipment/equipment.enum';
import {ControlInstructEnum} from '../../../../../../core-module/enum/instruct/control-instruct.enum';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../../../core-module/enum/facility/facility.enum';
import {GroupListModel} from '../../../../share/model/equipment.model';
import {FilterValueConst} from '../../../../share/const/filter.const';
import {EnergyApiService} from '../../../../../energy/share/service/energy/energy-api.service';

/**
 * 分组列表-分组详情页面
 */
@Component({
  selector: 'app-group-list-details',
  templateUrl: './group-list-details.component.html',
  styleUrls: ['./group-list-details.component.scss']
})
export class GroupListDetailsComponent implements OnInit, OnDestroy {
  // 设被列表处的设施类型模版
  @ViewChild('deviceTypeRefEquipTemp') deviceTypeRefEquipTemp: TemplateRef<HTMLDocument>;
  // 设施过滤输入框
  @ViewChild('deviceSelectorTemplate') deviceSelectorTemplate: TemplateRef<HTMLDocument>;
  // 设备列表的设施类型模版
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 区分照明，信息屏，安防不同的平台
  @Input() public category: string = '';
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 分组详情地图的高度
  public heightStyle = {height: '100%'};
  public operationList = [];
  public sourceDataList = {
    strategyType: '',
    strategyRefList: []
  };
  // 设施状态
  public deviceStatusCodeEnum = DeviceStatusEnum;
  // 选择的设施名称
  public filterDeviceNameStr: string;
  // 设施列表的表格参数
  public facilityRefGroupTableConfig: TableConfigModel;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设备列表的参数
  public equipmentRefGroupTableConfig: TableConfigModel;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备列表分页参数
  public equipmentRefGroupPageBean: PageModel = new PageModel();
  // 设施的分页参数
  public facilityRefGroupPageBean: PageModel = new PageModel();
  // 设备列表数据集
  public equipmentRefGroupData: EquipmentListModel[] = [];
  // 设施数据集
  public facilityRefGroupData: FacilityListModel[] = [];
  // 设施国际化
  public facilityLanguage: FacilityLanguageInterface;
  // 分组id
  public groupId: string = '';
  // 分组名称
  public groupName: string = '';
  // 备注
  public remark: string = '';
  // 是否显示亮度
  public isBrightness: boolean = false;
  // 设施过滤
  public filterValue: FilterCondition;
  // 表格多语言
  public language: OnlineLanguageInterface;
  // 设施选择器是否显示
  public facilityShow: boolean = false;
  //  公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 资产国际化
  public assetLanguage: AssetManagementLanguageInterface;
  // 设备列表
  @ViewChild('groupList') private groupList;
  // 设备状态
  @ViewChild('equipmentStatusRef') private equipmentStatusRef: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeRef') private equipmentTypeRef: TemplateRef<HTMLDocument>;
  // 设施状态
  @ViewChild('deviceStatusRef') private deviceStatusRef: TemplateRef<HTMLDocument>;
  // 亮度值
  private lightNum: number = 0;
  // 回显的亮度
  private groupLight: number;
  // 查询设备列表的参数
  private queryEquipmentCondition: QueryConditionModel = new QueryConditionModel();
  // 查询设施列表的参数
  private queryFacilityCondition: QueryConditionModel = new QueryConditionModel();
  // 批量选中的音量数据
  public volumeList: GroupListModel[] = [];
  public selectedEquipmentData: GroupListModel[] = [];
  public equipmentList = [];
  // 录音设备集合
  public recordEquipmentList = [];
  public isVolume: boolean = false;
  public isOnline: boolean = false;
  public isInsert: boolean = false;
  public sourceId: string;
  public volumeValue: number = 0;
  public onlineVolumeValue: number = 0;
  public insertType: number = 1;
  public audioQueryCondition: QueryConditionModel = new QueryConditionModel();
  public audioPageBean: PageModel = new PageModel();
  // 广播状态
  public radioStatus: boolean = false;
  public isStop: boolean = false;
  private savePlanThrottle: boolean = false;
  private insertVolumeValue: number;

  constructor(
    // 路由传参
    private $activatedRoute: ActivatedRoute,
    private $energyApiService: EnergyApiService,
    private $groupAipService: FacilityForCommonService,
    // 提示
    private $message: FiLinkModalService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 接口服务
    private $applicationService: ApplicationService,
  ) {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
  }

  public ngOnInit(): void {
    // 照明/信息屏/安防不同的平台
    if (this.category) {
      this.sourceDataList.strategyType = this.category;
    } else {
      this.sourceDataList.strategyType = this.languageTable.policyControl.lighting;
    }
    // 获取分组信息
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      this.groupId = queryParams.groupId;
      this.groupName = queryParams.groupName;
      this.remark = queryParams.remark;
      this.sourceDataList.strategyRefList = [{
        refId: queryParams.groupId,
        refType: '2',
      }];
      this.selectedEquipmentData = [];
      this.selectedEquipmentData.push({groupId: this.groupId, groupName: this.groupName});
    });
    this.queryEquipmentInfo();
    // this.getOperation();
    this.initEquipmentTable();
    this.initFacilityTable();
    this.queryEquipmentList();
    this.queryFacilityList();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.groupList = null;
    this.equipmentStatusRef = null;
    this.equipmentTypeRef = null;
    this.deviceStatusRef = null;
    this.deviceTypeTemp = null;
  }

  /**
   * 设备控制里面的按钮集合
   */
  public getOperation(): void {
    this.operationList = [
      {
        'name': this.languageTable.equipmentTable.switch,
        'getDataUrl': null,
        'submitUrl': null,
        'id': 'TURN_ON',
        'code': LightTableEnum.TURN_ON,
        'method': null,
        'type': 'button',
        'disable': false,
        'loading': false,
        'icon': 'fiLink-open',
        'max': null,
        'min': null,
        'unit': null,
        'value': null,
        'paramId': null
      },
      {
        'name': this.languageTable.equipmentTable.shut,
        'getDataUrl': null,
        'submitUrl': null,
        'id': 'TURN_OFF',
        'code': LightTableEnum.TURN_OFF,
        'method': null,
        'type': 'button',
        'disable': false,
        'loading': false,
        'icon': 'fiLink-shut-off',
        'max': null,
        'min': null,
        'unit': null,
        'value': null,
        'paramId': null
      },
      {
        'name': this.languageTable.frequentlyUsed.upElectric,
        'getDataUrl': null,
        'submitUrl': null,
        'id': 'POWER_ON',
        'code': LightTableEnum.POWER_ON,
        'method': null,
        'type': 'button',
        'disable': true,
        'loading': false,
        'icon': 'fiLink-up-electric',
        'max': null,
        'min': null,
        'unit': null,
        'value': null,
        'paramId': null
      },
      {
        'name': this.languageTable.frequentlyUsed.downElectric,
        'getDataUrl': null,
        'submitUrl': null,
        'id': 'POWER_OFF',
        'code': LightTableEnum.POWER_OFF,
        'method': null,
        'type': 'button',
        'disable': true,
        'loading': false,
        'icon': 'fiLink-down-electric',
        'max': null,
        'min': null,
        'unit': null,
        'value': null,
        'paramId': null
      },
      {
        'name': this.languageTable.frequentlyUsed.brightness,
        'getDataUrl': null,
        'submitUrl': null,
        'id': 'DIMMING',
        'code': LightTableEnum.DIMMING,
        'method': null,
        'type': 'slider',
        'disable': false,
        'loading': false,
        'icon': 'fiLink-light',
        'max': 100,
        'min': 0,
        'unit': null,
        'value': this.groupLight,
        'paramId': 'lightnessNum'
      }
    ];
  }

  /**
   * 分组操作
   * @ param data 参数
   */
  public handleEquipmentOperation(data): void {
    const d = JSON.parse(sessionStorage.getItem('radioData'));
    switch (data.type) {
      // 现场广播
      case ControlInstructEnum.broadcastOnline:
        // 如果缓存有  说明已有广播
        if (d) {
          this.$message.warning('已有广播正在广播中！');
          return;
        }
        this.queryCallEquipmentList();
        this.isOnline = true;
        this.onlineVolumeValue = 0;
        break;
      // 插播
      case ControlInstructEnum.broadcastPlay:
        if (d) {
          this.$message.warning('已有广播正在广播中！');
          return;
        }
        this.isInsert = true;
        this.insertVolumeValue = 0;
        break;
      // 保存音量
      case ControlInstructEnum.broadcastVolumeSave:
        this.isVolume = true;
        this.volumeValue = 0;
        break;
      default:
        if (d) {
          this.$message.warning('已有广播正在广播中！');
          return;
        }
        const params: DistributeModel = {
          commandId: data.type,
          groupIds: [this.groupId],
          param: {}
        };
        if (data.convenientVal >= 0) {
          params.param[data.paramId] = data.convenientVal;
        }
        const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
        instructConfig.groupControl(params);
    }
  }

  /**
   * 显示设施选择器
   */
  public onShowDeviceSelector(filterValue: FilterCondition): void {
    this.facilityShow = true;
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
  }

  /**
   * 改变滑块值
   * @ param event 滑块值
   */
  public handleSlider(event): void {
    this.lightNum = event;
  }

  /**
   * 亮度指令下发
   */
  public handleOk(): void {
    this.isBrightness = false;
    const params = {
      commandId: ControlInstructEnum.dimming,
      groupIds: [this.groupId],
      param: {
        lightnessNum: this.lightNum
      }
    };
    const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
    instructConfig.groupControl(params);
  }

  /**
   * 关闭亮度弹框
   */
  public handleCancel(): void {
    this.isBrightness = false;
    this.isVolume = false;
  }

  /**
   * 设备列表分页查询
   */
  public onEquipmentRefGroupPageChange(event: PageModel): void {
    this.queryEquipmentCondition.pageCondition.pageSize = event.pageSize;
    this.queryEquipmentCondition.pageCondition.pageNum = event.pageIndex;
    this.queryEquipmentList();
  }

  /**
   *  设施列表分页查询
   */
  public onFacilityRefGroupPageChange(event: PageModel): void {
    this.queryFacilityCondition.pageCondition.pageNum = event.pageIndex;
    this.queryFacilityCondition.pageCondition.pageSize = event.pageSize;
    this.queryFacilityList();
  }

  /**
   * 初始化设施列表
   */
  private initFacilityTable(): void {
    this.facilityRefGroupTableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noAutoHeight: true,
      notShowPrint: true,
      scroll: {x: '600px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber
        },
        { // 名称
          title: this.facilityLanguage.deviceName_a,
          key: 'deviceName',
          searchKey: 'deviceId',
          sortKey: 'deviceId',
          isShowSort: true,
          searchable: true,
          width: 200,
          searchConfig: {type: 'input'},
        },
        { // 类型
          title: this.facilityLanguage.deviceType_a,
          key: 'deviceType',
          width: 150,
          configurable: false,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 型号
          title: this.facilityLanguage.model,
          key: 'deviceModel',
          width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 设备数量
          title: this.assetLanguage.equipmentInfoNum,
          key: 'equipmentQuantity',
          isShowSort: true,
          width: 100,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 设施状态
          title: this.facilityLanguage.deviceStatus_a,
          key: 'deviceStatus',
          isShowSort: true,
          type: 'render',
          renderTemplate: this.deviceStatusRef,
          width: 150,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: getDeviceStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 详细地址
          title: this.facilityLanguage.address,
          key: 'address',
          isShowSort: true,
          width: 200,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      handleSearch: (event: FilterCondition[]) => {
        this.queryFacilityCondition.filterConditions = event;
        this.queryFacilityCondition.pageCondition.pageNum = 1;
        this.queryFacilityList();
      },
      sort: (event: SortCondition) => {
        this.queryFacilityCondition.sortCondition = event;
        this.queryFacilityList();
      },
    };
  }

  /**
   *  初始化设备列表
   */
  private initEquipmentTable(): void {
    this.equipmentRefGroupTableConfig = {
      primaryKey: '03-1',
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '600px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber,
        },
        { // 名称
          title: this.facilityLanguage.equipmentName,
          key: 'equipmentName',
          width: 200,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.facilityLanguage.equipmentType,
          key: 'equipmentTypeName',
          sortKey: 'equipmentType',
          searchKey: 'equipmentType',
          isShowSort: true,
          type: 'render',
          renderTemplate: this.equipmentTypeRef,
          width: 150,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.facilityLanguage.equipmentStatus,
          key: 'equipmentStatusName',
          sortKey: 'equipmentStatus',
          searchKey: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusRef,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 所属设施
          title: this.facilityLanguage.affiliatedDevice,
          key: 'deviceName',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 设施类型
          title: this.facilityLanguage.deviceType_a,
          key: 'deviceType',
          width: 150,
          type: 'render',
          renderTemplate: this.deviceTypeRefEquipTemp,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        {  // 详细地址
          title: this.facilityLanguage.address,
          key: 'address',
          width: 250,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 110,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      handleSearch: (event: FilterCondition[]) => {
        this.queryEquipmentCondition.filterConditions = event;
        this.queryEquipmentCondition.pageCondition.pageNum = 1;
        this.queryEquipmentList();
      },
      sort: (event: SortCondition) => {
        this.queryEquipmentCondition.sortCondition = event;
        this.queryEquipmentList();
      }
    };
  }

  /**
   * 查询分组设施详情列表
   */
  private queryFacilityList(): void {
    this.facilityRefGroupTableConfig.isLoading = true;
    this.queryFacilityCondition.bizCondition.groupId = this.groupId;
    this.$groupAipService.queryGroupDeviceInfoList(this.queryFacilityCondition).subscribe(
      (result: ResultModel<FacilityListModel[]>) => {
        this.facilityRefGroupTableConfig.isLoading = false;
        this.facilityRefGroupPageBean.Total = result.totalCount;
        this.facilityRefGroupPageBean.pageIndex = result.pageNum;
        this.facilityRefGroupPageBean.pageSize = result.size;
        if (result.code === ResultCodeEnum.success) {
          this.facilityRefGroupData = result.data;
          if (!_.isEmpty(this.facilityRefGroupData)) {
            this.facilityRefGroupData.forEach(row => {
              row.iconClass = CommonUtil.getFacilityIconClassName(row.deviceType);
              // 处理状态图标和国际化
              const statusStyle = CommonUtil.getDeviceStatusIconClass(row.deviceStatus);
              row.deviceStatusIconClass = statusStyle.iconClass;
              row.deviceStatusColorClass = statusStyle.colorClass;
            });
          }
        }
      }, () => {
        this.facilityRefGroupTableConfig.isLoading = false;
      });
  }

  /**
   * 查询设备的分组详情列表
   */
  private queryEquipmentList(): void {
    this.equipmentRefGroupTableConfig.isLoading = true;
    this.queryEquipmentCondition.bizCondition.groupId = this.groupId;
    this.$groupAipService.queryGroupEquipmentInfoList(this.queryEquipmentCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.equipmentRefGroupTableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.equipmentRefGroupPageBean.Total = result.totalCount;
          this.equipmentRefGroupPageBean.pageIndex = result.pageNum;
          this.equipmentRefGroupPageBean.pageSize = result.size;
          this.equipmentRefGroupData = result.data;
          if (!_.isEmpty(this.equipmentRefGroupData)) {
            this.equipmentRefGroupData.forEach(item => {
              // 设置设备类型的图标
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
              // 设施类型
              item.deviceIcon = CommonUtil.getFacilityIconClassName(item.deviceType);
              // 获取状态图标
              const statusStyle = CommonUtil.getDeviceStatusIconClass(item.deviceStatus);
              item.statusIconClass = statusStyle.iconClass;
              item.statusColorClass = statusStyle.colorClass;
            });
          }
        }
      }, () => {
        this.equipmentRefGroupTableConfig.isLoading = false;
      });
  }

  /**
   * 查询分组信息
   * 回显分组详情页亮度
   */
  private queryEquipmentInfo(): void {
    const queryBody = {
      groupIds: [this.groupId]
    };
    this.$applicationService.queryLightNumberByGroupId(queryBody)
      .subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // 获取亮度值
          this.groupLight = res.data[0].groupLight;
          // 回显亮度值
          if (this.category === this.languageTable.equipmentTable.call) {
            this.operationList = [
              {
                'name': '呼叫',
                'getDataUrl': null,
                'submitUrl': null,
                'id': 'CALL',
                // 'code': CallGroupTableEnum.primaryCallKey,
                'code': '000000',
                'method': null,
                'type': 'button',
                'disable': true,
                'loading': false,
                'icon': 'fiLink-filink-hujiao-icon',
                'max': null,
                'min': null,
                'unit': null,
                'value': null,
                'paramId': null
              },
              {
                'name': '监听',
                'getDataUrl': null,
                'submitUrl': null,
                'id': 'LISTEN',
                // 'code': CallGroupTableEnum.primaryListenKey,
                'code': '000000',
                'method': null,
                'type': 'button',
                'disable': true,
                'loading': false,
                'icon': 'fiLink-filink-jianting-icon',
                'max': null,
                'min': null,
                'unit': null,
                'value': null,
                'paramId': null
              },
            ];
          } else if (this.category === this.languageTable.policyControl.broadcast) {
            this.operationList = [
              {
                'name': '现场广播',
                'getDataUrl': null,
                'submitUrl': null,
                'id': ControlInstructEnum.broadcastOnline,
                'code': BroadcastGroupTableEnum.primaryOnline,
                'method': null,
                'type': 'button',
                'disable': false,
                'loading': false,
                'icon': 'fiLink-filink-xianchangguangbo-icon',
                'max': null,
                'min': null,
                'unit': null,
                'value': null,
                'paramId': null
              },
              {
                'name': '插播',
                'getDataUrl': null,
                'submitUrl': null,
                'id': ControlInstructEnum.broadcastPlay,
                'code': BroadcastGroupTableEnum.primaryInsertKey,
                'method': null,
                'type': 'button',
                'disable': false,
                'loading': false,
                'icon': 'fiLink-filink-chabo-icon',
                'max': null,
                'min': null,
                'unit': null,
                'value': null,
                'paramId': null
              },
              {
                'name': '停止插播',
                'getDataUrl': null,
                'submitUrl': null,
                'id': ControlInstructEnum.broadcastStop,
                'code': BroadcastGroupTableEnum.primaryShutKey,
                'method': null,
                'type': 'button',
                'disable': false,
                'loading': false,
                'icon': 'fiLink-suspend',
                'max': null,
                'min': null,
                'unit': null,
                'value': null,
                'paramId': null
              },
              {
                'name': '音量',
                'getDataUrl': null,
                'submitUrl': null,
                'id': ControlInstructEnum.broadcastVolumeSave,
                'code': BroadcastGroupTableEnum.primaryVolume,
                'method': null,
                'type': 'button',
                'disable': false,
                'loading': false,
                'icon': 'fiLink-filink-yinliang-icon1',
                'max': null,
                'min': null,
                'unit': null,
                'value': null,
                'paramId': null
              },
            ];
          } else {
            this.getOperation();
          }
        } else {
          this.$message.error(res.msg);
        }
      });
  }

  public queryCallEquipmentList() {
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

  /**
   * 指令接口
   * @ param params
   */
  public instructDistribute(params: DistributeModel, type?: string): void {
    this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
        this.isBrightness = false;
        this.isVolume = false;
        this.volumeValue = 0;
        this.savePlanThrottle = false;
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 现场广播 开始、停止
   */
  public switchOnlineOperate(type) {
    // 校验是否选择录音设备
    if (this.sourceId) {
      const params = {
        commandId: ControlInstructEnum.broadcastOnline,
        groupIds: [this.groupId],
        param: {
          sourceId: this.sourceId, // 录音设备真实id  sequenceId
          isStop: type, //  0 - 开始   1 - 停止.
        }
      };
      if (type === '1') {
        params.commandId = ControlInstructEnum.broadcastOnlineStop;
      }
      if (this.savePlanThrottle) {
        return;
      }
      // 开启节流阀防止重复提交
      this.savePlanThrottle = true;
      this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          const volumeParams = {
            commandId: ControlInstructEnum.broadcastVolume,
            groupIds: [this.groupId],
            param: {
              volume: this.onlineVolumeValue
            }
          };
          this.instructDistribute(volumeParams, type);
          // 存储广播状态
          this.radioStatus = type !== '1';
          this.isStop = type !== '1';
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

  public handleSource(event) {
    this.sourceId = event;
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

  public handleCloseOnline() {
    if (!this.sourceId) {
      this.isOnline = false;
    } else {
      this.isOnline = false;
      if (this.radioStatus) {
        this.$energyApiService.messageTopic.next({
          type: 2, // 广播类型  1：列表广播  2：分组广播
          radioId: this.sourceId,
          radioName: this.groupName,
        });
      }
    }
    this.sourceId = null;
  }

  /**
   * 音量调整
   */
  public confirmVolume(): void {
    const params: DistributeModel = {
      groupIds: [this.groupId],
      commandId: ControlInstructEnum.broadcastVolumeSave,
      param: {
        volume: this.volumeValue
      }
    };
    this.isVolume = false;
    this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        const volumeParams = {
          commandId: ControlInstructEnum.broadcastVolume,
          groupIds: [this.groupId],
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
}
