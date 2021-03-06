import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';

import {PageModel} from '../../../../../../../shared-module/model/page.model';
import {
  FilterCondition,
  QueryConditionModel,
} from '../../../../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../../../../shared-module/model/table-config.model';

import {
  initAlarmTableConfig,
  initUnitTreeConfig,
  initUnitTreeSelectConfig,
} from './detail-ref-alarm-table-util';
import {AlarmForCommonUtil} from '../../../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {Result} from '../../../../../../../shared-module/entity/result';
import {SelectModel} from '../../../../../../../shared-module/model/select.model';
import {CommonUtil} from '../../../../../../../shared-module/util/common-util';
import {DismantleBarrierWorkOrderService} from '../../../../../share/service/dismantle-barrier';
import {WorkOrderBusinessCommonUtil} from '../../../../../share/util/work-order-business-common.util';
import {ClearBarrierWorkOrderModel} from '../../../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {InspectionLanguageInterface} from '../../../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {AlarmLanguageInterface} from '../../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {WorkOrderAlarmLevelColor} from '../../../../../../../core-module/enum/trouble/trouble-common.enum';
import {AlarmStoreService} from '../../../../../../../core-module/store/alarm.store.service';
import {LanguageEnum} from '../../../../../../../shared-module/enum/language.enum';
import {DeviceTypeModel} from '../../../../../share/model/device-type.model';
import {SelectAlarmModel} from '../../../../../share/model/select-alarm.model';
import {ClearWorkOrderEquipmentModel} from '../../../../../share/model/clear-barrier-model/clear-work-order-equipment.model';
import {EquipmentListModel} from '../../../../../../../core-module/model/equipment/equipment-list.model';

import {DismantleWarnTroubleEnum} from '../../../../../share/enum/dismantle-barrier.config.enum';
import {AlarmForCommonService} from '../../../../../../../core-module/api-service/alarm';
import {AlarmSelectorConfigModel} from '../../../../../../../shared-module/model/alarm-selector-config.model';
import {SelectEquipmentModel} from '../../../../../../../core-module/model/equipment/select-equipment.model';
import {ClearBarrierWorkOrderService} from '../../../../../share/service/clear-barrier';
import {WorkOrderLanguageInterface} from '../../../../../../../../assets/i18n/work-order/work-order.language.interface';
import {OperatorEnum} from '../../../../../../../shared-module/enum/operator.enum';
import {TableComponent} from '../../../../../../../shared-module/component/table/table.component';

@Component({
  selector: 'app-warn-tab',
  templateUrl: './warn-tab.component.html',
  styleUrls: ['./warn-tab.component.scss'],
})
export class WarnTabComponent implements OnInit {
  // ??????
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // ????????????(????????????)
  @ViewChild('alarmEquipmentTemp') alarmEquipmentTemp: TemplateRef<any>;
  @ViewChild('tableTemp') tableTemp: TableComponent;

  /** ?????????????????????????????? */
  @Output() radioClickChange = new EventEmitter<any>();
  /** ????????????id */
  @Input() selectedAlarmId: string;
  /** ????????????name */
  @Input() selectDataName: string;
  @Input() selectDataType: string;
  /** ????????????????????? */
  @Input() filterData;
  // ????????????
  public queryfilterData: any[] = [];
  // ??????????????????????????????
  pageLoad: boolean = false;
  // ????????????
  public _dataSet: ClearBarrierWorkOrderModel[] = [];
  // ??????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public alarmTypeList: SelectModel[] = [];
  /** ?????????????????? */
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // ??????
  private alarmLevelList: DeviceTypeModel[] = [];
  /** ???????????? */
  public checkAlarmObject: SelectEquipmentModel = new SelectEquipmentModel();

  // ???????????????
  public selectedAlarm: SelectAlarmModel;
  // ?????????????????????
  public _selectedAlarm: SelectAlarmModel;
  // ???????????????
  public checkEquipmentObject: ClearWorkOrderEquipmentModel = new ClearWorkOrderEquipmentModel();
  // ?????????????????????
  public equipmentVisible: boolean = false;
  // ?????????????????????
  public equipmentFilterValue: FilterCondition;
  // ??????????????????
  public selectEquipments: EquipmentListModel[] = [];

  // ????????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ?????????????????????
  public language: AlarmLanguageInterface;
  // ????????????
  public alarmLanguage: AlarmLanguageInterface;
  workOrderLanguage: WorkOrderLanguageInterface;

  constructor(
    public $nzI18n: NzI18nService,
    public $alarmUtil: AlarmForCommonUtil,
    public $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
    private $alarmService: AlarmForCommonService,
    public $alarmStoreService: AlarmStoreService,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  ngOnInit() {
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    // ??????????????????
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmService).then(
      (data: SelectModel[]) => {
        this.pageLoad = true;
        this.alarmTypeList = data;
        initAlarmTableConfig(this);
        // ????????????
        this.initAlarmObjectConfig();
        initUnitTreeConfig(this);
        initUnitTreeSelectConfig(this);
        this.refreshData();
        for (const k in WorkOrderAlarmLevelColor) {
          if (WorkOrderAlarmLevelColor[k]) {
            this.alarmLevelList.push({
              label: this.alarmLanguage[k],
              code: WorkOrderAlarmLevelColor[k],
            });
          }
        }
      },
      (error) => {
        initAlarmTableConfig(this);
      },
    );
  }
  ngOnDestroy(){
    this.tableTemp.tableQueryTermStoreService.clearQueryTerm();
  }

  /**
   * ??????????????????
   */
  public initAlarmObjectConfig(): void {
    this.alarmObjectConfig = {
      clear: !this.checkAlarmObject.ids.length,
      handledCheckedFun: (event) => {
        this.checkAlarmObject = event;
      },
    };
  }

  /**
   * ??????????????????
   */
  public refreshData(): void {
    // this.queryCondition.filterConditions = [
    //   {
    //     filterField: 'alarmDeviceId',
    //     filterValue: [this.filterData],
    //     operator: OperatorEnum.in,
    //   },
    // ];
    this.queryCondition.filterConditions = [
      {
        filterField: 'alarmDeviceId',
        filterValue: [this.filterData],
        operator: OperatorEnum.in,
      },
    ];
    if (this.queryfilterData && this.queryfilterData.length > 0) {
      this.queryfilterData.forEach(i => {
        this.queryCondition.filterConditions.push(i)
      })
    }
    this.tableConfig.isLoading = true;
    this.$clearBarrierWorkOrderService.getRefAlarmInfo(this.queryCondition).subscribe(
      (res: Result) => {
        this._dataSet = [];
        if (res.data && res.data.length > 0) {
          // this.pageBean.Total = res.totalCount * res.size;
          this.pageBean.Total = res.totalCount
          this.pageBean.pageIndex = res.pageNum;
          this.pageBean.pageSize = res.size;
          res.data.forEach((item) => {
            item.alarmClassificationName = AlarmForCommonUtil.showAlarmTypeInfo(
              this.alarmTypeList,
              item.alarmClassification,
            );
            if (item.alarmDeviceTypeId) {
              item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(
                this.$nzI18n,
                item.alarmDeviceTypeId,
              );
              if (item.deviceTypeName) {
                item.deviceClass = CommonUtil.getFacilityIconClassName(item.alarmDeviceTypeId);
              }
            }
            if (item.alarmFixedLevel) {
              item.levelName = this.turnAlarmLevel(item.alarmFixedLevel);
              item.levelStyle = this.$alarmStoreService.getAlarmColorByLevel(
                item.alarmFixedLevel,
              ).backgroundColor;
            }
            if (item.alarmSourceTypeId) {
              item.equipmentTypeName = WorkOrderBusinessCommonUtil.equipTypeNames(
                this.$nzI18n,
                item.alarmSourceTypeId,
              );
              if (item.equipmentTypeName) {
                item.equipClass = CommonUtil.getEquipmentIconClassName(item.alarmSourceTypeId);
              }
            }
            if (item.alarmConfirmStatus && item.alarmConfirmStatus === 1) {
              item.alarmConfirmStatusName = this.language.isConfirm;
            } else if (item.alarmConfirmStatus && item.alarmConfirmStatus === 2) {
              item.alarmConfirmStatusName = this.language.noConfirm;
            }
            if (item.alarmCleanStatus) {
              switch (item.alarmCleanStatus) {
                case 1:
                  item.alarmCleanStatusName = this.language.isClean;
                  break;
                case 2:
                  item.alarmCleanStatusName = this.language.deviceClean;
                  break;
                case 3:
                  item.alarmCleanStatusName = this.language.noClean;
                  break;
                default:
                  item.alarmCleanStatusName = '';
                  break;
              }
            }
            // if (item.id === this.selectedAlarmId) {
            //   this._selectedAlarm.push(item)
            // }
          });
          this._dataSet = res.data;
        }
        this.tableConfig.isLoading = false;
      }, error => {
        this.tableConfig.isLoading = false;
      })
  }

  private turnAlarmLevel(code: string): string {
    let name = '';
    for (const k in WorkOrderAlarmLevelColor) {
      if (WorkOrderAlarmLevelColor[k] === code) {
        name = this.alarmLanguage[k];
        break;
      }
    }
    return name;
  }

  public pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /** ??????????????????????????? */
  clearSelectedData() {
    this.selectedAlarmId = null;
    this._selectedAlarm = null;
  }

  /**
   * ????????????
   * param event
   * param data
   */
  public selectedAlarmChange(data): void {
    this._selectedAlarm = data;
    this.radioClickChange.emit(DismantleWarnTroubleEnum.warn);
  }

  /**
   * ??????????????????
   */
  public openEquipmentSelector(filterValue): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * ????????????
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkEquipmentObject = {
      ids: event.map((v) => v.equipmentId) || [],
      name: event.map((v) => v.equipmentName).join(',') || '',
      type: '',
    };
    this.equipmentFilterValue.filterValue = this.checkEquipmentObject.ids;
  }

  /** ??????????????????????????????????????? */
  tranSelectedData() {
    // return this._selectedAlarm;
    if (this._selectedAlarm) {
      return this._selectedAlarm;
    } else {
      return {
        id: this.selectedAlarmId,
        alarmName: this.selectDataName
      }
    }
  }

  /**
   * ??????????????????
   */
  public handleFilter(filters: FilterCondition[]): FilterCondition[] {
    const filterEvent = [];
    filters.forEach((item) => {
      switch (item.filterField) {
        case 'alarmHappenCount':
          // ??????
          filterEvent.push({
            filterField: 'alarmHappenCount',
            filterValue: Number(item.filterValue) ? Number(item.filterValue) : 0,
            operator: 'lte',
          });
          break;
        case 'alarmSource':
          // ????????????
          if (this.checkEquipmentObject.name) {
            filterEvent.push({
              filterField: 'alarmSource',
              filterValue: this.checkEquipmentObject.ids,
              operator: OperatorEnum.in,
            });
          }
          break;
        case 'alarmDeviceName':
          // ????????????
          if (this.checkAlarmObject.name) {
            filterEvent.push({
              filterField: 'alarmDeviceId',
              filterValue: this.checkAlarmObject.ids,
              operator: OperatorEnum.in,
            });
          }
          break;
        default:
          filterEvent.push(item);
      }
    });
    return filterEvent;
  }
}
