import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {AlarmNameListModel} from '../../../../../core-module/model/alarm/alarm-name-list.model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition
} from '../../../../../shared-module/model/query-condition.model';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmIsConfirmEnum} from '../../../../alarm/share/enum/alarm.enum';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {AlarmLevelEnum} from '../../../../../core-module/enum/alarm/alarm-level.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 告警代码选择器
 */
@Component({
  selector: 'app-alarm-name-select',
  templateUrl: './alarm-name-select.component.html',
  styleUrls: ['./alarm-name-select.component.scss']
})
export class AlarmNameSelectComponent implements OnInit {
  // 弹框显示状态
  @Input()
  set alarmNameSelectVisible(params) {
    this.alarmNameSelectIsVisible = params;
    this.alarmNameSelectVisibleChange.emit(this.alarmNameSelectIsVisible);
  }

  @Input() alarmCheckList = [];
  // 是否显示选择的条数
  @Input() public showSelectedCount: boolean = true;
  // 多选数据时的回显key数组
  @Input() public selectAlarms: any[] = [];
  // 是否显示清空按钮
  @Input() public showCleanBtn: boolean = true;
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<any>();
  // 显示隐藏变化
  @Output() public alarmNameSelectVisibleChange = new EventEmitter<any>();
  // 表格实例
  @ViewChild('tableComponent') private tableComponent: TableComponent;
  // 表格告警级别过滤模板
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  // 表格定制级别过滤模板
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // 表格确认状态过滤模板
  @ViewChild('alarmConfirmTemp') alarmConfirmTemp: TemplateRef<any>;

  // 是否显示最大选择条数
  @Input() public showSelectedMaxCount: boolean = true;

  // 告警名称选择弹窗是否显示
  public alarmNameSelectIsVisible: boolean = false;
  // 弹窗表格标题
  public tableTitle: string;
  // 告警列表结果集
  public dataSet: AlarmNameListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 已选数据
  public selectedAlarmData: AlarmNameListModel[] = [];
  // 表格配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 告警等级枚举
  public alarmLevelEnum = AlarmLevelEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 是否自动确认枚举
  public alarmIsConfirmEnum = AlarmIsConfirmEnum;
  // 告警类别
  public alarmTypeList: SelectModel[] = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $alarmForCommonService: AlarmForCommonService,
    private $alarmStoreService: AlarmStoreService,
    private $message: FiLinkModalService,
  ) {
  }

  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(this.languageEnum.common);
    this.tableTitle = this.tableTitle || this.language.alarmList;
    this.selectedAlarmData = this.selectAlarms || [];
    // 告警类别
    this.getAlarmType();
    // 初始化表格
    this.initTableConfig();
    // 刷新列表数据
    this.refreshData();
  }

  /**
   * 切换分页触发事件
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 刷新告警列表
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$alarmForCommonService.queryAlarmCurrentSetList(this.queryCondition).subscribe((res: ResultModel<AlarmNameListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === 0) {
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.tableConfig.isLoading = false;
        const ids = this.selectAlarms ? this.selectAlarms.map(v => v.id) : [];
        // const selectAlarms = []
        this.dataSet = res.data.map(item => {
          item.defaultStyle = this.$alarmStoreService.getAlarmColorByLevel(item.alarmDefaultLevel);
          item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmLevel);
          item.alarmClassification = AlarmForCommonUtil.showAlarmTypeInfo(this.alarmTypeList, item.alarmClassification);
          item.checked = ids.includes(item.id);
          return item;
        });
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 告警类别
   */
  public getAlarmType(): void {
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
    });
  }

  // 获取modal框显示状态
  get alarmNameSelectVisible(): boolean {
    return this.alarmNameSelectIsVisible;
  }

  /**
   * 清空操作
   */
  public onClickCleanUp(): void {
    this.tableComponent.keepSelectedData.clear();
    this.tableComponent.checkStatus();
    this.selectAlarms = [];
    this.selectedAlarmData = [];
    this.refreshData();
  }

  /**
   * 确定选择告警
   */
  public handleOk(): void {
    const data = this.selectedAlarmData;
    this.selectDataChange.emit(data);
    this.alarmNameSelectVisible = false;
  }

  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      keepSelected: true,
      selectedIdKey: 'id',
      // primaryKey: '02-3-1',
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      scroll: {x: '1400px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        {
          // 告警名称
          title: this.language.alarmName, key: 'alarmName', width: 140,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '122px'}}
        },
        {
          // 告警代码
          title: this.language.AlarmCode, key: 'alarmCode', width: 140,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 告警级别
          title: this.language.alarmDefaultLevel, key: 'alarmDefaultLevel', width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null), label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
        },
        {
          // 告警定制级别
          title: this.language.alarmLevel, key: 'alarmLevel', width: 100,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmLevelTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null), label: 'label', value: 'code'
          },
        },
        {
          // 告警类别
          title: this.language.AlarmType, key: 'alarmClassification', width: 120, isShowSort: true,
          searchable: true,
          searchKey: 'alarmClassification',
          searchConfig: {
            type: 'select', selectType: 'multiple',
          },
        },
        {
          // 自动确认
          title: this.language.alarmAutomaticConfirmation, key: 'alarmAutomaticConfirmation', width: 100,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmConfirmTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.yes, value: AlarmIsConfirmEnum.yes},
              {label: this.language.no, value: AlarmIsConfirmEnum.no},
            ]
          }
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 72, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'array',
      // 勾选事件
      handleSelect: (event: AlarmNameListModel[]) => {
        this.selectedAlarmData = event;
        this.selectAlarms = event;
      },
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      openTableSearch: () => {
        this.tableConfig.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item['searchConfig']['selectInfo'] = this.alarmTypeList;
          }
        });
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.filterConditions = [];
        if (!event.length) {
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          this.pageBean = new PageModel(this.queryCondition.pageCondition.pageSize, 1, 1);
          this.queryCondition.filterConditions = event;
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: this.pageBean.pageIndex};
          this.refreshData();
        }
      }
    };
  }
}
