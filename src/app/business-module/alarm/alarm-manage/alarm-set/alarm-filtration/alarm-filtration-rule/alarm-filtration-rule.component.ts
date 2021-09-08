import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { PageModel } from '../../../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../../../shared-module/model/table-config.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NzI18nService } from 'ng-zorro-antd';
import { AlarmService } from '../../../../share/service/alarm.service';
import { AlarmLanguageInterface } from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {
  FilterCondition, QueryConditionModel, SortCondition,
} from '../../../../../../shared-module/model/query-condition.model';
import { FiLinkModalService } from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import { AlarmStoreService } from '../../../../../../core-module/store/alarm.store.service';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {AlarmFiltrationModel} from '../../../../share/model/alarm-filtration.model';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {AlarmEnableStatusEnum, AlarmInventoryEnum} from '../../../../share/enum/alarm.enum';
import {OperatorEnum} from '../../../../../../shared-module/enum/operator.enum';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';

/**
 * 告警 复制规则
 */
@Component({
  selector: 'app-alarm-filtration-rule',
  templateUrl: './alarm-filtration-rule.component.html',
  styleUrls: ['./alarm-filtration-rule.component.scss']
})
export class AlarmFiltrationRuleComponent implements OnInit {
  @Output()
  resultAndClose = new EventEmitter<AlarmFiltrationModel>();
  // 表格启用禁用模板
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  // 表格是否去库存模板
  @ViewChild('isNoStorageTemp') isNoStorageTemp: TemplateRef<any>;
  // 表格过滤条件模板
  @ViewChild('filtrationConditionTemp') filtrationConditionTemp: TemplateRef<any>;
  // 列表 单选框模板
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 表格告警名称过滤模板
  @ViewChild('alarmName') private alarmName;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 表格数据源
  public dataSet: AlarmFiltrationModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 过滤条件
  public filterEvent: AlarmFiltrationModel;
  // 弹窗控制
  public rule: boolean = true;
  // 复制已选择告警
  public selectedAlarm: AlarmFiltrationModel = new AlarmFiltrationModel();
  // 选择告警id
  public selectedAlarmId: string;
  // 是否禁启用
  public isStatus = AlarmEnableStatusEnum;
  // 是否库存
  public isInventory = AlarmInventoryEnum;
  // 勾选的告警名称
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 告警名称配置
  private alarmNameConfig: AlarmSelectorConfigModel;

  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $alarmService: AlarmService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $alarmStoreService: AlarmStoreService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  public ngOnInit(): void {
    // 初始化表格配置
    this.initTableConfig();
    // 查询表格数据
    this.refreshData();
    // 告警名称配置初始化
    this.initAlarmName();
  }
  /**
   * 点击关闭 或者 取消
   */
  public closeTable(): void {
    this.rule = false;
    this.resultAndClose.emit();
  }
  /**
   * 确认
   */
  public okText(): void {
    this.resultAndClose.emit(this.selectedAlarm);
  }
  /**
   * 选择告警
   * param event
   * param data
   */
  public selectedAlarmChange(data: AlarmFiltrationModel): void {
    this.selectedAlarm = data;
  }

  /**
   * 告警名称
   */
  public initAlarmName(): void {
    this.alarmNameConfig = {
      clear: !this.checkAlarmName.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
      }
    };
  }
  /**
   * 表格翻页查询
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: { x: '1200px', y: '600px' },
      columnConfig: [
        {
          title: '',
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } }
        },
        {
          title: this.language.name, key: 'ruleName',
          width: 150,
          searchable: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
        },
        {
          // 过滤条件
          title: this.language.filterConditions,
          key: 'alarmName',
          width: 200,
          searchable: true,
          type: 'render',
          searchConfig: {
            type: 'render',
            selectInfo: this.checkAlarmName.alarmNames,
            renderTemplate: this.alarmName
          },
          renderTemplate: this.filtrationConditionTemp,
        },
        {
          title: this.language.opertionUser, key: 'operationUser', width: 120, isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' }
        },
        {
          title: this.language.openStatus, key: 'status', width: 120, isShowSort: true,
          searchKey: 'statusArray',
          searchable: true,
          type: 'render',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              { label: this.language.disable, value: AlarmEnableStatusEnum.disable },
              { label: this.language.enable, value: AlarmEnableStatusEnum.enable }
            ]
          },
        },
        {
          title: this.language.createTime, key: 'createTime',
          width: 180, isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: { type: 'dateRang' }
        },
        {
          // 是否库存
          title: this.language.isNoStored, key: 'storeDatabase', width: 110, isShowSort: true,
          searchKey: 'storedArray',
          searchable: true,
          type: 'render',
          renderTemplate: this.isNoStorageTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              { label: this.language.yes, value: AlarmInventoryEnum.yes },
              { label: this.language.no, value: AlarmInventoryEnum.no }
            ]
          },
        },
        {
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' }
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: { type: 'operate' }, key: '',
          width: 120, fixedStyle: { fixedRight: true, style: { right: '0px' } }
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [],
      topButtons: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        if (!event.length) {
          // 清除告警名称和区域
          this.checkAlarmName = new AlarmSelectorInitialValueModel();
          this.initAlarmName();
          this.refreshData();
        } else {
          const filterEvent: AlarmFiltrationModel = new AlarmFiltrationModel();
          event.forEach((item, index) => {
            filterEvent[item.filterField] = item.filterValue;
            if (item.filterField === 'createTime') {
              //  创建时间
              event.forEach(itemTime => {
                if (itemTime.operator === OperatorEnum.gte) {
                  filterEvent.createTime = itemTime.filterValue;
                }
                if (itemTime.operator === OperatorEnum.lte) {
                  filterEvent.createTimeEnd = itemTime.filterValue;
                }
              });
            }
            if (this.checkAlarmName && this.checkAlarmName.ids && this.checkAlarmName.ids.length) {
              // 告警名称
              // filterEvent.alarmFilterRuleNameList = this.checkAlarmName.ids;
            }
            if (this.checkAlarmName && this.checkAlarmName.alarmNames && this.checkAlarmName.alarmNames.length) {
              // 告警名称
              filterEvent.alarmFilterRuleNames = this.checkAlarmName.alarmNames;
            }
          });
          this.filterEvent = filterEvent;
          this.refreshData(filterEvent);
        }
      }
    };
  }

  /**
   * 获取告警过滤列表信息
   */
  private refreshData(filterEvent?: AlarmFiltrationModel) {
    this.tableConfig.isLoading = true;
    const data = filterEvent ? { 'bizCondition': filterEvent } : { 'bizCondition': {} };
    this.queryCondition.bizCondition = { ...data.bizCondition,
      'sortProperties': this.queryCondition.sortCondition.sortField,
      'sort': this.queryCondition.sortCondition.sortRule };
    this.$alarmService.queryAlarmFiltration(this.queryCondition).subscribe((res: ResultModel<AlarmFiltrationModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.dataSet = res.data.map( item => {
          item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
          // 过滤条件
          if (item.alarmFilterRuleNames && item.alarmFilterRuleNames.length) {
            item.alarmName = item.alarmFilterRuleNames.join();
          }
          return item;
        });
      } else {
        // 请求错误
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
}
