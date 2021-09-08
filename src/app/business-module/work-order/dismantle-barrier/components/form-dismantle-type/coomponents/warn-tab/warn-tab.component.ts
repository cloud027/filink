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
  // 单选
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 告警级别
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // 设施图标
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // 设备名称(告警对象)
  @ViewChild('alarmEquipmentTemp') alarmEquipmentTemp: TemplateRef<any>;
  @ViewChild('tableTemp') tableTemp: TableComponent;

  /** 表格单选框的点击事件 */
  @Output() radioClickChange = new EventEmitter<any>();
  /** 选择告警id */
  @Input() selectedAlarmId: string;
  /** 选择告警name */
  @Input() selectDataName: string;
  @Input() selectDataType: string;
  /** 数据过滤的条件 */
  @Input() filterData;
  // 筛选数据
  public queryfilterData: any[] = [];
  // 告警类别数据获取之后
  pageLoad: boolean = false;
  // 列表数据
  public _dataSet: ClearBarrierWorkOrderModel[] = [];
  // 分页
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 告警类型数组
  public alarmTypeList: SelectModel[] = [];
  /** 设施名称配置 */
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // 告警
  private alarmLevelList: DeviceTypeModel[] = [];
  /** 设施名称 */
  public checkAlarmObject: SelectEquipmentModel = new SelectEquipmentModel();

  // 已选择告警
  public selectedAlarm: SelectAlarmModel;
  // 复制已选择告警
  public _selectedAlarm: SelectAlarmModel;
  // 勾选的设备
  public checkEquipmentObject: ClearWorkOrderEquipmentModel = new ClearWorkOrderEquipmentModel();
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 设备选择器显示
  public equipmentFilterValue: FilterCondition;
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];

  // 工单语言
  public InspectionLanguage: InspectionLanguageInterface;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 告警语言
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
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmService).then(
      (data: SelectModel[]) => {
        this.pageLoad = true;
        this.alarmTypeList = data;
        initAlarmTableConfig(this);
        // 设施名称
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
   * 设施名称配置
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
   * 获取当前告警
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

  /** 清空已经选中的数据 */
  clearSelectedData() {
    this.selectedAlarmId = null;
    this._selectedAlarm = null;
  }

  /**
   * 选择告警
   * param event
   * param data
   */
  public selectedAlarmChange(data): void {
    this._selectedAlarm = data;
    this.radioClickChange.emit(DismantleWarnTroubleEnum.warn);
  }

  /**
   * 告警对象弹框
   */
  public openEquipmentSelector(filterValue): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * 设备名称
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

  /** 传递给父组件当前选中的数据 */
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
   * 过滤条件处理
   */
  public handleFilter(filters: FilterCondition[]): FilterCondition[] {
    const filterEvent = [];
    filters.forEach((item) => {
      switch (item.filterField) {
        case 'alarmHappenCount':
          // 频次
          filterEvent.push({
            filterField: 'alarmHappenCount',
            filterValue: Number(item.filterValue) ? Number(item.filterValue) : 0,
            operator: 'lte',
          });
          break;
        case 'alarmSource':
          // 告警对象
          if (this.checkEquipmentObject.name) {
            filterEvent.push({
              filterField: 'alarmSource',
              filterValue: this.checkEquipmentObject.ids,
              operator: OperatorEnum.in,
            });
          }
          break;
        case 'alarmDeviceName':
          // 设施名称
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
