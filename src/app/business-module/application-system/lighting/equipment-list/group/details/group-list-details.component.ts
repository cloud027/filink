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
 * ????????????-??????????????????
 */
@Component({
  selector: 'app-group-list-details',
  templateUrl: './group-list-details.component.html',
  styleUrls: ['./group-list-details.component.scss']
})
export class GroupListDetailsComponent implements OnInit, OnDestroy {
  // ????????????????????????????????????
  @ViewChild('deviceTypeRefEquipTemp') deviceTypeRefEquipTemp: TemplateRef<HTMLDocument>;
  // ?????????????????????
  @ViewChild('deviceSelectorTemplate') deviceSelectorTemplate: TemplateRef<HTMLDocument>;
  // ?????????????????????????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // ????????????????????????????????????????????????
  @Input() public category: string = '';
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ???????????????????????????
  public heightStyle = {height: '100%'};
  public operationList = [];
  public sourceDataList = {
    strategyType: '',
    strategyRefList: []
  };
  // ????????????
  public deviceStatusCodeEnum = DeviceStatusEnum;
  // ?????????????????????
  public filterDeviceNameStr: string;
  // ???????????????????????????
  public facilityRefGroupTableConfig: TableConfigModel;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ?????????????????????
  public equipmentRefGroupTableConfig: TableConfigModel;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ????????????????????????
  public equipmentRefGroupPageBean: PageModel = new PageModel();
  // ?????????????????????
  public facilityRefGroupPageBean: PageModel = new PageModel();
  // ?????????????????????
  public equipmentRefGroupData: EquipmentListModel[] = [];
  // ???????????????
  public facilityRefGroupData: FacilityListModel[] = [];
  // ???????????????
  public facilityLanguage: FacilityLanguageInterface;
  // ??????id
  public groupId: string = '';
  // ????????????
  public groupName: string = '';
  // ??????
  public remark: string = '';
  // ??????????????????
  public isBrightness: boolean = false;
  // ????????????
  public filterValue: FilterCondition;
  // ???????????????
  public language: OnlineLanguageInterface;
  // ???????????????????????????
  public facilityShow: boolean = false;
  //  ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ???????????????
  public assetLanguage: AssetManagementLanguageInterface;
  // ????????????
  @ViewChild('groupList') private groupList;
  // ????????????
  @ViewChild('equipmentStatusRef') private equipmentStatusRef: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentTypeRef') private equipmentTypeRef: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('deviceStatusRef') private deviceStatusRef: TemplateRef<HTMLDocument>;
  // ?????????
  private lightNum: number = 0;
  // ???????????????
  private groupLight: number;
  // ???????????????????????????
  private queryEquipmentCondition: QueryConditionModel = new QueryConditionModel();
  // ???????????????????????????
  private queryFacilityCondition: QueryConditionModel = new QueryConditionModel();
  // ???????????????????????????
  public volumeList: GroupListModel[] = [];
  public selectedEquipmentData: GroupListModel[] = [];
  public equipmentList = [];
  // ??????????????????
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
  // ????????????
  public radioStatus: boolean = false;
  public isStop: boolean = false;
  private savePlanThrottle: boolean = false;
  private insertVolumeValue: number;

  constructor(
    // ????????????
    private $activatedRoute: ActivatedRoute,
    private $energyApiService: EnergyApiService,
    private $groupAipService: FacilityForCommonService,
    // ??????
    private $message: FiLinkModalService,
    // ???????????????
    private $nzI18n: NzI18nService,
    // ????????????
    private $applicationService: ApplicationService,
  ) {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
  }

  public ngOnInit(): void {
    // ??????/?????????/?????????????????????
    if (this.category) {
      this.sourceDataList.strategyType = this.category;
    } else {
      this.sourceDataList.strategyType = this.languageTable.policyControl.lighting;
    }
    // ??????????????????
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
   * ??????
   */
  public ngOnDestroy(): void {
    this.groupList = null;
    this.equipmentStatusRef = null;
    this.equipmentTypeRef = null;
    this.deviceStatusRef = null;
    this.deviceTypeTemp = null;
  }

  /**
   * ?????????????????????????????????
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
   * ????????????
   * @ param data ??????
   */
  public handleEquipmentOperation(data): void {
    const d = JSON.parse(sessionStorage.getItem('radioData'));
    switch (data.type) {
      // ????????????
      case ControlInstructEnum.broadcastOnline:
        // ???????????????  ??????????????????
        if (d) {
          this.$message.warning('??????????????????????????????');
          return;
        }
        this.queryCallEquipmentList();
        this.isOnline = true;
        this.onlineVolumeValue = 0;
        break;
      // ??????
      case ControlInstructEnum.broadcastPlay:
        if (d) {
          this.$message.warning('??????????????????????????????');
          return;
        }
        this.isInsert = true;
        this.insertVolumeValue = 0;
        break;
      // ????????????
      case ControlInstructEnum.broadcastVolumeSave:
        this.isVolume = true;
        this.volumeValue = 0;
        break;
      default:
        if (d) {
          this.$message.warning('??????????????????????????????');
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
   * ?????????????????????
   */
  public onShowDeviceSelector(filterValue: FilterCondition): void {
    this.facilityShow = true;
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
  }

  /**
   * ???????????????
   * @ param event ?????????
   */
  public handleSlider(event): void {
    this.lightNum = event;
  }

  /**
   * ??????????????????
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
   * ??????????????????
   */
  public handleCancel(): void {
    this.isBrightness = false;
    this.isVolume = false;
  }

  /**
   * ????????????????????????
   */
  public onEquipmentRefGroupPageChange(event: PageModel): void {
    this.queryEquipmentCondition.pageCondition.pageSize = event.pageSize;
    this.queryEquipmentCondition.pageCondition.pageNum = event.pageIndex;
    this.queryEquipmentList();
  }

  /**
   *  ????????????????????????
   */
  public onFacilityRefGroupPageChange(event: PageModel): void {
    this.queryFacilityCondition.pageCondition.pageNum = event.pageIndex;
    this.queryFacilityCondition.pageCondition.pageSize = event.pageSize;
    this.queryFacilityList();
  }

  /**
   * ?????????????????????
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
        { // ??????
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber
        },
        { // ??????
          title: this.facilityLanguage.deviceName_a,
          key: 'deviceName',
          searchKey: 'deviceId',
          sortKey: 'deviceId',
          isShowSort: true,
          searchable: true,
          width: 200,
          searchConfig: {type: 'input'},
        },
        { // ??????
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
        { // ??????
          title: this.facilityLanguage.model,
          key: 'deviceModel',
          width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // ????????????
          title: this.assetLanguage.equipmentInfoNum,
          key: 'equipmentQuantity',
          isShowSort: true,
          width: 100,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // ????????????
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
        { // ????????????
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
   *  ?????????????????????
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
        { // ??????
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber,
        },
        { // ??????
          title: this.facilityLanguage.equipmentName,
          key: 'equipmentName',
          width: 200,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
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
        { // ??????
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
        { // ????????????
          title: this.facilityLanguage.affiliatedDevice,
          key: 'deviceName',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
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
        {  // ????????????
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
   * ??????????????????????????????
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
              // ??????????????????????????????
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
   * ?????????????????????????????????
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
              // ???????????????????????????
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
              // ????????????
              item.deviceIcon = CommonUtil.getFacilityIconClassName(item.deviceType);
              // ??????????????????
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
   * ??????????????????
   * ???????????????????????????
   */
  private queryEquipmentInfo(): void {
    const queryBody = {
      groupIds: [this.groupId]
    };
    this.$applicationService.queryLightNumberByGroupId(queryBody)
      .subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // ???????????????
          this.groupLight = res.data[0].groupLight;
          // ???????????????
          if (this.category === this.languageTable.equipmentTable.call) {
            this.operationList = [
              {
                'name': '??????',
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
                'name': '??????',
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
                'name': '????????????',
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
                'name': '??????',
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
                'name': '????????????',
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
                'name': '??????',
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
   * ????????????
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
   * ???????????? ???????????????
   */
  public switchOnlineOperate(type) {
    // ??????????????????????????????
    if (this.sourceId) {
      const params = {
        commandId: ControlInstructEnum.broadcastOnline,
        groupIds: [this.groupId],
        param: {
          sourceId: this.sourceId, // ??????????????????id  sequenceId
          isStop: type, //  0 - ??????   1 - ??????.
        }
      };
      if (type === '1') {
        params.commandId = ControlInstructEnum.broadcastOnlineStop;
      }
      if (this.savePlanThrottle) {
        return;
      }
      // ?????????????????????????????????
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
          // ??????????????????
          this.radioStatus = type !== '1';
          this.isStop = type !== '1';
          // ??????????????????
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
   * ??????????????????????????????
   * @ param event
   */
  public handleVolumeSlider(event, type) {
    if (type === 0) {
      // ????????????
      this.volumeValue = event;
    } else {
      // ??????
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
          type: 2, // ????????????  1???????????????  2???????????????
          radioId: this.sourceId,
          radioName: this.groupName,
        });
      }
    }
    this.sourceId = null;
  }

  /**
   * ????????????
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
