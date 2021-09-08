import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {AlarmSelectorConfigTypeEnum} from '../../../../enum/alarm-selector-config-type.enum';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {TableComponent} from '../../../table/table.component';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {PageModel} from '../../../../model/page.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {FilterCondition, QueryConditionModel} from '../../../../model/query-condition.model';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../util/common-util';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {SelectModel} from '../../../../model/select.model';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {RelevancyAlarmTable} from './relevancy-alarm-table';
import {AlarmLevelEnum} from '../../../../../core-module/enum/alarm/alarm-level.enum';
import {AlarmCleanStatusEnum} from '../../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmConfirmStatusEnum} from '../../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../model/alarm-selector-config.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';

@Component({
  selector: 'app-relevancy-alarm',
  templateUrl: './relevancy-alarm.component.html',
  styleUrls: ['./relevancy-alarm.component.scss']
})
export class RelevancyAlarmComponent implements OnInit {
  // 弹框显示状态
  @Input()
  set relevancyAlarmVisible(params) {
    this._relevancyAlarmVisible = params;
    this.relevancyAlarmVisibleChange.emit(this._relevancyAlarmVisible);
  }
  // 是否显示选择的条数
  @Input() public showSelectedCount: boolean = false;
  // 是否多选
  @Input() public multiple: boolean = false;
  // 告警过滤条件
  @Input() public filterConditions: FilterCondition[] = [];
  // 弹窗表格标题
  @Input() public tableTitle: string;
  // 告警id
  @Input()
  public selectAlarmId: string = '';
  @Input() public selectAlarmIds: string[] = [];
  // 多选数据时的回显key数组
  @Input() public selectAlarms: AlarmListModel[] = [];
  // 显示隐藏变化
  @Output() public relevancyAlarmVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<AlarmListModel[]>();
  // 表格实例
  @ViewChild('tableComponent') private tableComponent: TableComponent;
  // 告警名称
  @ViewChild('alarmName') alarmName: TemplateRef<HTMLDocument>;
  // 告警级别过滤模板
  @ViewChild('alarmFixedLevelTemp') alarmFixedLevelTemp: TemplateRef<HTMLDocument>;
  // 清除状态过滤模板
  @ViewChild('isCleanTemp') isCleanTemp: TemplateRef<HTMLDocument>;
  // 频次
  @ViewChild('frequencyTemp') frequencyTemp: TemplateRef<HTMLDocument>;
  // 设施类型过滤模板
  @ViewChild('alarmSourceTypeTemp') alarmSourceTypeTemp: TemplateRef<HTMLDocument>;
  // 确认状态过滤模板
  @ViewChild('isConfirmTemp') isConfirmTemp: TemplateRef<HTMLDocument>;
  // 区域选择
  @ViewChild('areaSelector') areaSelectorTemp: TemplateRef<HTMLDocument>;
  // 设备名称(告警对象)
  @ViewChild('alarmEquipmentTemp') alarmEquipmentTemp: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  // 设施名称
  @ViewChild('deviceNameTemp') deviceNameTemp: TemplateRef<HTMLDocument>;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // 获取modal框显示状态
  get relevancyAlarmVisible() {
    return this._relevancyAlarmVisible;
  }
  /** 该组件被使用的类型 表单/表格*/
  public useType: AlarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum.table;
  /** 被使用的类型枚举*/
  public alarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum;
  /** 告警国际化*/
  public language: AlarmLanguageInterface;
  // 显示隐藏
  public _relevancyAlarmVisible: boolean = false;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 已选数据
  public selectedData = [];
  // 表格翻页对象
  public pageBean: PageModel = new PageModel();
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 表格数据
  public dataSet: AlarmListModel[] = [];
  // 告警类别数组
  public alarmTypeList: SelectModel[] = [];
  // 告警级别枚举
  public alarmLevelEnum = AlarmLevelEnum;
  // 清除状态枚举
  public alarmCleanStatusEnum = AlarmCleanStatusEnum;
  // 确认状态枚举
  public alarmConfirmStatusEnum = AlarmConfirmStatusEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 勾选的告警名称
  public checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 区域
  public areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 区域配置
  public areaConfig: AlarmSelectorConfigModel = new AlarmSelectorConfigModel();
  // 设施名称
  public checkAlarmObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设施名称配置
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 设备选择器显示
  public equipmentFilterValue: FilterCondition;
  // 勾选的设备
  public checkEquipmentObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 设备名称(告警对象)
  public checkAlarmEquipment: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设施名称title
  public deviceTitle: string;
  // 树节点
  public treeNodes: NzTreeNode[] = [];
  // 点击按钮是否可以点击
  private handleOkDisabled: boolean = true;
  constructor(
    private $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $alarmStoreService: AlarmStoreService,
    public $alarmForCommonService: AlarmForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(this.languageEnum.common);
  }

  ngOnInit() {
    this.tableTitle = this.tableTitle || this.language.relevancyAlarm;
    this.deviceTitle = this.language.deviceName;
    this.selectedData = this.selectAlarms || [];
    if (this.multiple) {
      if (this.selectAlarms && this.selectAlarms.length > 0) {
        this.handleOkDisabled = false;
      }
    } else {
      this.handleOkDisabled = !this.selectAlarmIds.length;
    }
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
    });
    // 表格配置初始化
    RelevancyAlarmTable.initRelevancyAlarmTableConfig(this);
    // 区域
    this.initAreaConfig();
    // 告警名称
    this.initAlarmName();
    // 设施名称
    this.initAlarmObjectConfig();
    this.refreshData();
    // 已选告警id
    if (this.selectAlarmIds && this.selectAlarmIds.length) {
      this.selectAlarmId = this.selectAlarmIds[0];
      this.handleOkDisabled = false;
    }
  }
  /**
   * 表格翻页
   */
  public pageChange(event: PageModel): void {
      this.queryCondition.pageCondition.pageNum = event.pageIndex;
      this.queryCondition.pageCondition.pageSize = event.pageSize;
      this.refreshData();
  }
  /**
   * 获取当前告警列表信息
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    const ids = this.selectAlarms.map(v => v.id);
    this.$alarmForCommonService.queryCurrentAlarmList(this.queryCondition).subscribe((res) => {
      this.tableConfig.isLoading = false;
      if (res.code === 0) {
        this.pageBean.Total = res.totalPage * res.size;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.dataSet = res.data || [];
        this.tableConfig.showEsPagination = this.dataSet.length > 0;
        this.dataSet = res.data.map(item => {
          item.isRadio = true;
          // 通过首次发生时间计算出告警持续时间
          item.alarmContinousTime = CommonUtil.setAlarmContinousTime(item.alarmBeginTime, item.alarmCleanTime,
            {year: this.language.year, month: this.language.month, day: this.language.day, hour: this.language.hour});
          this.translateField(item);
          if (item.alarmCorrelationList && item.alarmCorrelationList.length) {
            item.alarmCorrelationList.forEach(v => {
              v.isRadio = false;
              this.translateField(v);
            });
          }
          item.checked = ids.includes(item.id);
          return item;
        });
      } else {
        this.$message.error(res.msg);
      }
    }, (err) => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 列表翻译
   */
  public translateField(item: AlarmListModel): void {
    item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
    // 设备类型
    if (item.alarmSourceTypeId) {
      item.alarmSourceType = FacilityForCommonUtil.translateEquipmentType(this.$nzI18n, item.alarmSourceTypeId) as string;
      // 获取设备类型图标样式
      item.equipmentIcon = CommonUtil.getEquipmentIconClassName(item.alarmSourceTypeId);
    } else {
      item.alarmSourceType = item.alarmSourceType ? item.alarmSourceType : '— —';
    }
    const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.alarmCode);
    if (name) {
      item.alarmName = name;
    }
    // 设施名称
    item.alarmDeviceName = item.alarmDeviceName ? item.alarmDeviceName : '— —';
    // 设施图标样式
    item.deviceTypeIcon = CommonUtil.getFacilityIconClassName(item.alarmDeviceTypeId);
    // 告警类别
    item.alarmClassificationName = AlarmForCommonUtil.showAlarmTypeInfo(this.alarmTypeList, item.alarmClassification);
    if (item.alarmCode === 'orderOutOfTime' && item.extraMsg) {
      item.alarmObject = `${item.alarmObject}${item.extraMsg.slice(4)}`;
    }
  }
  /**
   * 告警对象弹框
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }
  /**
   * 告警对象过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkAlarmEquipment = new AlarmSelectorInitialValueModel(
      event.map(v => v.equipmentName).join(',') || '', event.map(v => v.equipmentId) || []
    );
    this.equipmentFilterValue.filterValue = this.checkAlarmEquipment.ids;
    this.equipmentFilterValue.filterName = this.checkAlarmEquipment.name;
  }
  /**
   * 确定选择设备
   */
  public handleOk(): void {
    const data = this.selectedData;
    this.selectDataChange.emit(data);
    this.relevancyAlarmVisible = false;
  }

  /**
   * 单选设备
   */
  public onAlarmChange(event: string, data: EquipmentListModel): void {
    this.selectAlarmId = event;
    this.selectedData = [data];
    this.handleOkDisabled = !this.selectedData.length;
  }
  /**
   *  告警名称配置初始化
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
   * 区域配置初始化
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
   * 设施名称配置初始化
   */
  private initAlarmObjectConfig(): void {
    this.alarmObjectConfig = {
      clear: !this.checkAlarmObject.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmObject = event;
      }
    };
  }
}
