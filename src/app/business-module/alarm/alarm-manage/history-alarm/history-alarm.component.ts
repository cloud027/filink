import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {AlarmService} from '../../share/service/alarm.service';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {AlarmLevelEnum} from '../../../../core-module/enum/alarm/alarm-level.enum';
import {PicResourceEnum} from '../../../../core-module/enum/picture/pic-resource.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {SelectDeviceModel} from '../../../../core-module/model/facility/select-device.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AlarmCleanStatusEnum} from '../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmConfirmStatusEnum} from '../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {QueryRecentlyPicModel} from '../../../../core-module/model/picture/query-recently-pic.model';
import {AlarmFiltrationModel} from '../../share/model/alarm-filtration.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {AlarmTemplateDataModel} from '../../share/model/alarm-template-data.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';


/**
 * ??????????????????
 */
@Component({
  selector: 'app-history-alarm',
  templateUrl: './history-alarm.component.html',
  styleUrls: ['./history-alarm.component.scss']
})
export class HistoryAlarmComponent implements OnInit {
  // ??????????????????????????????
  @ViewChild('alarmFixedLevelTemp') alarmFixedLevelTemp: TemplateRef<any>;
  // ??????
  @ViewChild('frequencyTemp') frequencyTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('alarmCleanStatusTemp') alarmCleanStatusTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('alarmConfirmStatusTemp') alarmConfirmStatusTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('alarmSourceTypeTemp') alarmSourceTypeTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('alarmName') alarmName: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('areaSelector') areaSelectorTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('departmentTemp') departmentTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('alarmContinueTimeTemp') alarmContinueTimeTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceNameTemp') deviceNameTemp: TemplateRef<any>;
  // ???????????????
  public dataSet: AlarmListModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ???????????????
  public tableConfig: TableConfigModel;
  // ????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ???????????????
  public language: AlarmLanguageInterface;
  // ??????????????????
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // ????????????
  public checkAlarmObject: SelectDeviceModel = new SelectDeviceModel();
  // ??????????????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ????????????????????????????????????
  public historyAlarmTemplateTable: boolean = false;
  // ??????????????????
  public alarmNameConfig: AlarmSelectorConfigModel;
  // ????????????
  public areaConfig: AlarmSelectorConfigModel;
  // ????????????(????????????)
  public checkAlarmEquipment: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ??????????????????
  public alarmTypeList: SelectModel[] = [];
  // ?????????????????????
  public equipmentVisible: boolean = false;
  // ?????????????????????
  public equipmentFilterValue: FilterCondition;
  // ???????????????
  public checkEquipmentObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ??????????????????
  public selectEquipments: EquipmentListModel[] = [];
  // ?????????
  public treeNodes: NzTreeNode[] = [];
  // ????????????
  public isVisible: boolean = false;
  // ??????id
  public equipmentId: string;
  // ??????????????????
  public selectUnitName: string;
  // ????????????
  public deviceTitle: string;
  // ????????????
  public equipmentType: string;
  // ??????????????????
  public alarmLevelEnum = AlarmLevelEnum;
  // ??????????????????
  public alarmCleanStatusEnum = AlarmCleanStatusEnum;
  // ??????????????????
  public alarmConfirmStatusEnum = AlarmConfirmStatusEnum;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ???????????????
  public languageEnum = LanguageEnum;
  // ??????
  public exportParams: ExportRequestModel = new ExportRequestModel();
  // ??????????????????
  private viewLoading: boolean = false;
  // ??????id
  private alarmId: string = null;
  // ??????id
  private deviceId: string = null;
  // ??????ID
  private templateId: string;
  // ???????????????????????????
  private deviceRoleTypes: SelectModel[];
  // ??????
  private areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ?????????????????????
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ??????????????????
  private alarmEquipmentConfig: AlarmSelectorConfigModel;
  constructor(private $router: Router,
              private $nzI18n: NzI18nService,
              private $alarmForCommonService: AlarmForCommonService,
              private $alarmService: AlarmService,
              private $message: FiLinkModalService,
              private $active: ActivatedRoute,
              private $alarmStoreService: AlarmStoreService,
              private $imageViewService: ImageViewService) {
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    // ???????????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // ????????????
    this.deviceTitle = this.language.deviceName;
    // ????????????
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // ?????????????????????
    this.initTableConfig();
    // ????????????????????????????????????
    this.queryFromPage();
    // ??????????????????
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
    });
    this.queryCondition.pageCondition = new PageCondition(this.pageBean.pageIndex, this.pageBean.pageSize);
    // ????????????
    this.refreshData();
    // ??????
    this.initAreaConfig();
    // ????????????
    this.initAlarmName();
    // ????????????
    this.initAlarmEquipmentConfig();
    // ????????????
    this.initAlarmObjectConfig();
    //  ??????????????????
    this.$active.queryParams.subscribe(param => {
      if (param.id) {
        const filterArr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === 'id';
        });
        if (!filterArr) {
          this.queryCondition.filterConditions.push({
            filterField: 'id',
            filterValue: param.id,
            operator: OperatorEnum.eq
          });
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      }
    });
  }

  /**
   * ????????????????????????????????????
   */
  public queryFromPage(): void {
    // ????????????id
    if (this.$active.snapshot.queryParams.id) {
      this.alarmId = this.$active.snapshot.queryParams.id;
      const filter = new FilterCondition('id', OperatorEnum.eq, this.alarmId);
      this.queryCondition.filterConditions = [filter];
    }
    // ????????????deviceId
    if (this.$active.snapshot.queryParams.deviceId) {
      this.deviceId = this.$active.snapshot.queryParams.deviceId;
      const filter = new FilterCondition('alarmDeviceId', OperatorEnum.eq, this.deviceId);
      this.queryCondition.filterConditions = [filter];
    }
    // ????????????equipmentId
    if (this.$active.snapshot.queryParams.equipmentId) {
      this.equipmentId = this.$active.snapshot.queryParams.equipmentId;
      const filter = new FilterCondition('alarmSource', OperatorEnum.eq, this.equipmentId);
      this.queryCondition.filterConditions = [filter];
    }
    // ??????????????????
    if (this.$active.snapshot.queryParams.alarmSourceTypeId) {
      this.equipmentType = this.$active.snapshot.queryParams.alarmSourceTypeId;
      const filter = new FilterCondition('alarmSourceTypeId', OperatorEnum.eq, this.equipmentType);
      this.queryCondition.filterConditions = [filter];
    }
  }
  /**
   * ???????????????????????????????????????
   */
  public initAlarmEquipmentConfig(): void {
    this.alarmEquipmentConfig = {
      clear: !this.checkAlarmEquipment.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmEquipment = event;
      }
    };
  }

  /**
   * ???????????????????????????
   */
  public initAlarmObjectConfig(): void {
    this.alarmObjectConfig = {
      clear: !this.checkAlarmObject.deviceId.length,
      handledCheckedFun: (event: SelectDeviceModel) => {
        this.checkAlarmObject = event;
      }
    };
  }
  /**
   * ????????????????????????
   */
  public pageChange(event: PageModel): void {
    if (!this.templateId) {
      this.queryCondition.pageCondition.pageNum = event.pageIndex;
      this.queryCondition.pageCondition.pageSize = event.pageSize;
      this.refreshData();
    } else {
      const data = new AlarmTemplateDataModel(new PageCondition(event.pageIndex, this.pageBean.pageSize));
      this.templateList(data);
    }
  }

  /**
   * ??????????????????
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkEquipmentObject = new AlarmSelectorInitialValueModel(
      event.map(v => v.equipmentName).join(',') || '', event.map(v => v.equipmentId) || []
    );
    this.equipmentFilterValue.filterValue = this.checkEquipmentObject.ids;
    this.equipmentFilterValue.filterName = this.checkEquipmentObject.name;
  }

  /**
   * ??????????????????
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * ????????????
   * param data
   */
  public examinePicture(data: AlarmListModel): void {
    // ?????????????????????
    if (this.viewLoading) {
      return;
    }
    this.viewLoading = true;
    // ??????id??????????????????id ???????????????1????????? 2????????? 3????????????  ???????????????1????????? 2?????????
    const body: QueryRecentlyPicModel[] = [
      new QueryRecentlyPicModel(data.alarmDeviceId, null, PicResourceEnum.alarm, data.id, ObjectTypeEnum.facility)
    ];
    this.$alarmService.examinePicture(body).subscribe((res) => {
      this.viewLoading = false;
      if (res.code === ResultCodeEnum.success) {
        if (res.data.length === 0) {
          this.$message.warning(this.language.noPicturesYet);
        } else {
          this.$imageViewService.showPictureView(res.data);
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.viewLoading = false;
    });
  }


  /**
   * ????????????
   */
  public templateTable(event: AlarmFiltrationModel): void {
    this.historyAlarmTemplateTable = false;
    if (!event) {
      return;
    }
    const data = new AlarmTemplateDataModel(new PageCondition(1, this.pageBean.pageSize));
    if (event) {
      this.tableConfig.isLoading = true;
      this.templateId = event.id;
      this.templateList(data);
    }
  }

  /**
   * ???????????? ??????
   */
  public templateList(data: AlarmTemplateDataModel): void {
    // ??????????????????
    this.tableConfig.isLoading = true;
    this.$alarmService.alarmHistoryQueryTemplateById(this.templateId, data).subscribe((res) => {
      if (res.code === 0) {
        this.giveList(res);
      } else if (res.code === ResultCodeEnum.noSuchData) {
        this.dataSet = [];
        this.tableConfig.isLoading = false;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ?????????????????????
   */
  private initAreaConfig(): void {
    this.areaConfig = {
      clear: !this.areaList.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.areaList = event;
      }
    };
  }

  /**
   * ???????????????????????????
   */
  private initAlarmName(): void {
    this.alarmNameConfig = {
      clear: !this.checkAlarmName.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
      }
    };
  }
  /**
   * ??????????????????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.forEach(item => {
      if (item.filterField === 'alarmName') {
        item.filterValue = this.checkAlarmName.alarmNames;
        item.operator = OperatorEnum.in;
      }
    });
    this.$alarmService.queryAlarmHistoryList(this.queryCondition).subscribe((res) => {
      if (res.code === 0) {
        this.giveList(res);
      } else {
        this.$message.error(res.msg);
      }
    }, (err) => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ????????????????????? ???????????????
   */
  private giveList(res: ResultModel<AlarmListModel[]>): void {
    // ??????????????????????????????
    this.tableConfig.isLoading = false;
    // ???????????????
    this.pageBean.Total = res.totalCount;
    // ?????????
    this.pageBean.Total = res.totalPage * res.size;
    this.pageBean.pageIndex = res.pageNum;
    // ??????????????????
    this.pageBean.pageSize = res.size;
    this.dataSet = res.data || [];
    this.dataSet = res.data.map(item => {
      this.translateType(item);
      // ???????????????
      if (item.alarmCorrelationList && item.alarmCorrelationList.length > 0) {
        item.alarmCorrelationList = item.alarmCorrelationList.map(el => {
          this.translateType(el);
          return el;
        });
      }
      return item;
    });
    this.tableConfig.showEsPagination = this.dataSet.length > 0;
  }

  /**
   * ?????????????????????
   */
  private translateType(item: AlarmListModel): void {
    item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
    const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.alarmCode);
    if (name) {
      item.alarmName = name;
    }
    // ????????????
    if (item.alarmSourceTypeId) {
      item.alarmSourceType = FacilityForCommonUtil.translateEquipmentType(this.$nzI18n, item.alarmSourceTypeId) as string;
      item.equipmentIcon = CommonUtil.getEquipmentIconClassName(item.alarmSourceTypeId);
    } else {
      item.alarmSourceType = item.alarmSourceType ? item.alarmSourceType : '??? ???';
    }
    // ????????????????????????
    if (item.alarmDeviceTypeId) {
      item.deviceTypeIcon = CommonUtil.getFacilityIconClassName(item.alarmDeviceTypeId);
    }
    item.alarmDeviceName = item.alarmDeviceName ? item.alarmDeviceName : '??? ???';
    if (item.alarmCode === 'orderOutOfTime' && item.extraMsg) {
      item.alarmObject = `${item.alarmObject}${item.extraMsg.slice(4)}`;
    }
    // ????????????
    item.alarmClassification = AlarmForCommonUtil.showAlarmTypeInfo(this.alarmTypeList, item.alarmClassification);
    // ??????????????????
    item.alarmContinousTime = CommonUtil.setAlarmContinousTime(item.alarmBeginTime, item.alarmCleanTime,
      {year: this.language.year, month: this.language.month, day: this.language.day, hour: this.language.hour});
    // ??????????????????????????????
    item.isShowBuildOrder = item.alarmCode === 'orderOutOfTime' ? 'disabled' : 'enable';
  }

  /**
   * ????????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-2',
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      showSearchExport: true,
      searchTemplate: false,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {
          type: 'expend', width: 30, expendDataKey: 'alarmCorrelationList',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '30px'}}, width: 60},
        {
          key: 'serialNumber', width: 62, title: this.language.serialNumber, fixedStyle: {fixedLeft: true, style: {left: '90px'}}
        },
        { // ????????????
          title: this.language.alarmName, key: 'alarmName', width: 180, isShowSort: true,
          searchable: true, searchKey: 'alarmName',
          searchConfig: {
            type: 'render',
            renderTemplate: this.alarmName
          },
          fixedStyle: {fixedLeft: true, style: {left: '152px'}}
        },
        { // ????????????
          title: this.language.alarmFixedLevel, key: 'alarmFixedLevel', width: 120, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null), label: 'label', value: 'code'
          },
          renderTemplate: this.alarmFixedLevelTemp
        },
        { // ????????????
          title: this.language.alarmobject, key: 'alarmObject', width: 180, isShowSort: true,
          searchKey: 'alarmSource',
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.departmentTemp
          },
        },
        {
          // ????????????
          title: this.language.equipmentType, key: 'alarmSourceTypeId', width: 150, isShowSort: true,
          type: 'render',
          configurable: true,
          searchKey: 'alarm_source_type_id',
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        {
          // ????????????
          title: this.language.deviceName, key: 'alarmDeviceName', width: 150, isShowSort: true,
          searchKey: 'alarmDeviceId',
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceNameTemp
          },
        },
        {
          // ????????????
          title: this.language.alarmSourceType, key: 'alarmDeviceTypeId', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'alarm_device_type_id',
          type: 'render',
          renderTemplate: this.alarmSourceTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.deviceRoleTypes, label: 'label', value: 'code'
          }
        },
        {
          // ??????
          title: this.language.area, key: 'areaName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'area_id',
          searchConfig: {
            type: 'render',
            renderTemplate: this.areaSelectorTemp
          },
        },
        {
          // ????????????
          title: this.language.AlarmType, key: 'alarmClassification', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'alarmClassification',
          searchConfig: {
            type: 'select', selectType: 'multiple',
          },
        },
        {
          // ????????????
          title: this.language.responsibleDepartment, key: 'responsibleDepartment', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ??????
          title: this.language.alarmHappenCount, key: 'alarmHappenCount', width: 80, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.frequencyTemp
          }
        },
        {
          // ????????????
          title: this.language.alarmCleanStatus, key: 'alarmCleanStatus', width: 125, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.isClean, value: AlarmCleanStatusEnum.isClean},
              {label: this.language.deviceClean, value: AlarmCleanStatusEnum.deviceClean}
            ]
          },
          renderTemplate: this.alarmCleanStatusTemp
        },
        {
          // ????????????
          title: this.language.alarmConfirmStatus, key: 'alarmConfirmStatus', width: 120, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.isConfirm, value: AlarmConfirmStatusEnum.isConfirm},
              {label: this.language.noConfirm, value: AlarmConfirmStatusEnum.noConfirm}
            ]
          },
          renderTemplate: this.alarmConfirmStatusTemp
        },
        {
          // ??????????????????
          title: this.language.alarmBeginTime, key: 'alarmBeginTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // ??????
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // ??????
          title: this.language.operate, searchable: true,
          searchConfig: {
            type: 'operate',
            /********???????????????**********/
            // customSearchHandle: () => {
            //   this.display.historyAlarmTemplateTable = true;
            // }
          },
          key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      // ??????????????????
      showPagination: false,
      // ????????????es????????????
      showEsPagination: false,
      // ???????????????
      bordered: false,
      // ?????????????????????
      showSearch: false,
      // ?????????????????????
      searchReturnType: 'Array',
      // ????????????
      topButtons: [
        {
          // ??????????????????
          text: this.language.historyAlarmSet,
          permissionCode: '02-2-5',
          iconClassName: 'fiLink-setup',
          handle: () => {
            // ???????????????????????????
            const flag = SessionUtil.checkHasRole('02-3-2');
            if (!flag) {
              this.$message.error(this.language.noPageRole);
              return;
            }
            this.$router.navigate(['business/alarm/history-alarm-set']).then();
          }
        }
      ],
      operation: [
        {
          // ??????
          text: this.language.location,
          key: 'isShowBuildOrder',
          className: 'fiLink-location',
          permissionCode: '02-2-2',
          disabledClassName: 'fiLink-location alarm-disabled-icon',
          handle: (e: AlarmListModel) => {
            this.navigateToDetail('business/index', {queryParams: {equipmentId: e.alarmSource}});
          }
        },
        {
          // ????????????
          text: this.language.viewPicture,
          className: 'fiLink-view-photo',
          permissionCode: '02-2-3',
          handle: (e: AlarmListModel) => {
            // ????????????
            this.examinePicture(e);
          }
        }, {
          // ????????????
          text: this.language.alarmDiagnose,
          key: 'isShowBuildOrder',
          permissionCode: '02-2-4',
          className: 'fiLink-diagnose-details',
          disabledClassName: 'fiLink-diagnose-details alarm-disabled-icon',
          handle: (e: AlarmListModel) => {
            this.$router.navigate(['business/alarm/history-diagnose-details'],
              {
                queryParams: {
                  id: e.alarmSource,
                  areaId: e.areaId,
                  alarmId: e.id,
                  alarmCode: e.alarmCode,
                  type: 'history'
                }
              }).then();
          }
        }
      ],
      leftBottomButtons: [
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'alarmContinousTime') {
          // ???????????????????????????????????? ?????????????????? alarmContinousTime ????????????
          this.queryCondition.sortCondition.sortField = 'alarmContinousTime';
        } else {
          this.queryCondition.sortCondition.sortField = event.sortField;
        }
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        // ???????????????????????????????????????????????????deviceId???alarmId?????????
        this.queryCondition.filterConditions = [];
        if (!event.length) {
          //  ???????????? ??????  ???????????? ??????
          this.areaList = new AlarmSelectorInitialValueModel();
          this.checkAlarmName = new AlarmSelectorInitialValueModel();
          this.checkEquipmentObject = new AlarmSelectorInitialValueModel();
          // ??????????????????
          this.selectUnitName = '';
          this.checkAlarmEquipment = new AlarmSelectorInitialValueModel();
          this.checkAlarmObject = new SelectDeviceModel();
          FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, []);
          // ??????
          this.initAreaConfig();
          // ????????????
          this.initAlarmName();
          this.selectEquipments = [];
          // ????????????
          this.initAlarmEquipmentConfig();
          // ????????????
          this.initAlarmObjectConfig();
          this.queryCondition.pageCondition = new PageCondition(1, this.pageBean.pageSize);
          this.refreshData();
        } else {
          event.forEach(item => {
            const filterFieldArr = ['alarmNameId', 'alarmSource', 'alarmDeviceId', 'area_id'];
            if (filterFieldArr.includes(item.filterField)) {
              item.operator = OperatorEnum.in;
            }
            // ??????
            if (item.filterField === 'alarmHappenCount') {
              item.operator =  OperatorEnum.lte;
              item.filterValue = Number(item.filterValue) ? Number(item.filterValue) : 0;
            }
            // ????????????
            if (item.filterField === 'responsibleDepartment') {
              item.operator =  OperatorEnum.like;
            }
          });
          this.pageBean = new PageModel(this.queryCondition.pageCondition.pageSize);
          this.queryCondition.pageCondition = new PageCondition(this.pageBean.pageIndex, this.pageBean.pageSize);
          this.queryCondition.filterConditions = event;
          this.refreshData();
        }
      },
      // ??????
      handleExport: (event: ListExportModel<AlarmListModel[]>) => {
        // ????????????
        this.exportParams = new ExportRequestModel(event.columnInfoList, event.excelType, this.queryCondition);
        const propertyName = ['alarmFixedLevel', 'alarmSourceTypeId', 'alarmCleanStatus',
          'alarmBeginTime', 'alarmNearTime', 'alarmConfirmTime', 'alarmCleanTime',
          'alarmContinousTime', 'alarmClassification', 'alarmDeviceTypeId', 'alarmConfirmStatus'];
        this.exportParams.columnInfoList.forEach(item => {
          if (propertyName.indexOf(item.propertyName) !== -1) {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        // ?????????????????????
        if (event.selectItem.length > 0) {
          event.queryTerm['alarmIds'] = event.selectItem.map(item => item.id);
          this.exportParams.queryCondition.filterConditions.push(
            new FilterCondition('id', OperatorEnum.in, event.queryTerm['alarmIds'])
          );
        }
        this.$alarmService.exportHistoryAlarmList(this.exportParams).subscribe((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      // ????????????????????????
      openTableSearch: () => {
        this.tableConfig.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item.searchConfig.selectInfo = this.alarmTypeList;
          }
        });
      },
    };
  }

  /**
   * ????????????
   * param url
   * param {{}} extras
   */
  private navigateToDetail(url: string, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

}
