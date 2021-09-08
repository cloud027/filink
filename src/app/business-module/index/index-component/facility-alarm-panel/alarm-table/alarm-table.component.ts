import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexTable} from '../../../util/index.table';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {IndexWorkOrderService} from '../../../../../core-module/api-service/index/index-work-order';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapCoverageService} from '../../../../../shared-module/service/index/map-coverage.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {AlarmCategoryEnum} from '../../../../../core-module/enum/alarm/alarm-category.enum';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';
import {DetailsCardAlarmModel} from '../../../shared/model/alarm.model';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {MapTypeEnum} from '../../../../../core-module/enum/index/index.enum';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';

/**
 * 告警组件
 */
@Component({
  selector: 'app-alarm-table',
  templateUrl: './alarm-table.component.html',
  styleUrls: ['./alarm-table.component.scss']
})
export class AlarmTableComponent extends IndexTable implements OnInit {
  // 设施id
  @Input() facilityId: string;
  // 告警类型 当前和历史
  @Input() facilityAlarmType: AlarmCategoryEnum;
  // 跳转更多
  @Output() alarmTypeEmit = new EventEmitter();
  // 当前告警模板
  @ViewChild('alarmNameTemp') alarmNameTemp: TemplateRef<HTMLDocument>;

  // 告警名称
  public alarmName: string;
  // 告警列表数据集
  public alarmDataSet: DetailsCardAlarmModel[] = [];
  // 告警表格配置
  public alarmTableConfig: TableConfigModel;
  // 设施告警查询条件
  public queryAlarmByFacilityCondition: QueryConditionModel = new QueryConditionModel();
  // 当前图层
  private indexType = this.$mapCoverageService.showCoverage;

  public constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $mapCoverageService: MapCoverageService,
    private $alarmStoreService: AlarmStoreService,
    private $indexWorkOlder: IndexWorkOrderService) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    // 初始化告警表格配置
    this.initAlarmTableConfig();
    // 获取告警数据
    this.getAlarmTableByFacilityData();
    // 告警表格名称
    this.alarmName = this.facilityAlarmType === AlarmCategoryEnum.currentAlarm ? this.indexLanguage.currentAlarm : this.indexLanguage.historyAlarm;
  }

  /**
   * 告警表格配置
   */
  private initAlarmTableConfig(): void {
    this.alarmTableConfig = {
      isDraggable: true,
      isLoading: false,
      noIndex: true,
      scroll: {x: '366px', y: '250px'},
      topButtons: [],
      columnConfig: [
        {
          // 告警名称
          title: this.indexLanguage.alarmTypeName, key: 'alarmName', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'},
          type: 'render',
          renderTemplate: this.alarmNameTemp,
        },
        {
          // 设备名称
          title: this.indexLanguage.equipmentName, key: 'equipmentName', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 设备类型
          title: this.indexLanguage.equipmentTypeTitle, key: 'equipmentType', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 设施名称
          title: this.indexLanguage.searchDeviceName, key: 'deviceName', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 告警类型
          title: this.indexLanguage.alarmType, key: 'alarmType', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        {
          // 责任单位
          title: this.indexLanguage.responsibleUnit, key: 'accountabilityUnit', width: 96,
          configurable: false,
          searchable: false,
          searchConfig: {type: 'input'}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
    };
  }

  /**
   * 获取告警数据
   */
  private getAlarmTableByFacilityData(): void {
    // 查询参数配置
    this.queryAlarmByFacilityCondition.filterConditions = [];
    this.queryAlarmByFacilityCondition.pageCondition.pageNum = 1;
    this.queryAlarmByFacilityCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    const paramTem = this.indexType === MapTypeEnum.facility ? 'alarm_device_id' : 'alarm_source';
    this.queryAlarmByFacilityCondition.filterConditions.push(
      new FilterCondition(paramTem, OperatorEnum.eq, this.facilityId));

    this.alarmTableConfig.isLoading = true;
    // 接口获取当前告警数据
    this.$indexWorkOlder.getAlarmInfoListById(this.facilityAlarmType, this.queryAlarmByFacilityCondition)
      .subscribe((result: ResultModel<DetailsCardAlarmModel[]>) => {
        // 一期接口返回值等于0 现应为ResultCodeEnum.success 待后台修改否则报错。
        if (result.code === 0) {
          this.alarmDataSet = result.data.map(item => {
            // 告警级别颜色转换
            if (this.facilityAlarmType === AlarmCategoryEnum.currentAlarm) {
              item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
            }
            item.alarmType = this.getStatusName(item.alarmType);
            item.equipmentType = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.equipmentType, LanguageEnum.facility);
            return item;
          });
        } else {
          this.$message.error(result.msg);
        }
        this.alarmTableConfig.isLoading = false;
      }, () => {
        this.alarmTableConfig.isLoading = false;
      });
  }

  /**
   * 告警类别
   */
  private getStatusName(type: string) {
    const alarmType = CommonUtil.getlarmType(type);
    return this.indexLanguage[alarmType] || '';
  }

  /**
   * 点击更多按钮
   */
  public handleMoreButton(): void {
    this.alarmTypeEmit.emit();
  }
}

