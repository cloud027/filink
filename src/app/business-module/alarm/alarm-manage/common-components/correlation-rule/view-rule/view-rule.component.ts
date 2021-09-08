import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../../../shared-module/model/query-condition.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {AlarmService} from '../../../../share/service/alarm.service';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {RuleConditionModel} from '../../../../share/model/rule-condition.model';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {TableComponent} from '../../../../../../shared-module/component/table/table.component';
/**
 * 查看规则条件
 */
@Component({
  selector: 'app-view-rule',
  templateUrl: './view-rule.component.html',
})
export class ViewRuleComponent implements OnInit {
  // 弹窗是否展示
  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }
  get xcVisible() {
    return this._xcVisible;
  }
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 规则id
  @Input() public ruleId: string;
  // 控制弹窗展示回调
  @Output() close = new EventEmitter();
  // 规则条件
  @ViewChild('viewRuleTable') viewRuleTable: TableComponent;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 表格数据源
  public dataSet: RuleConditionModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 最终展示的分页数据
  public resultTableData: RuleConditionModel[] = [];
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 控制是否展示
  private _xcVisible: boolean;
  constructor(
    public $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $message: FiLinkModalService,
  ) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 关闭弹窗
   */
  public setHandleCancel(): void {
    this.resultTableData = [];
    this.pageBean = new PageModel();
    this.tableConfig.showSearch = false;
    this.viewRuleTable.handleRest();
    this.xcVisible = false;
  }
  /**
   * 表格翻页查询
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum =  event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshTableData();
  }
  /**
   * 请求列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    // 获取列表所有数据
    this.$alarmService.queryStaticRuleCondition(this.ruleId).subscribe((res: ResultModel<RuleConditionModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data;
        // 组装列表
        this.refreshTableData();
      } else {
        // 请求错误
        this.$message.error(res.msg);
        this.tableConfig.isLoading = false;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 处理表格数据
   */
  public refreshTableData(): void {
    const pageIndex = this.queryCondition.pageCondition.pageNum;
    const pageSize = this.queryCondition.pageCondition.pageSize;
    let data = AlarmUtil.ruleCondition(this.dataSet, this.language, this.$nzI18n);
    // 含有条件筛选
    if (this.queryCondition.filterConditions && this.queryCondition.filterConditions.length > 0) {
      data = data.filter(item => {
        if (item.ruleCondition.includes(this.queryCondition.filterConditions[0].filterValue)) {
          return item;
        }
      });
    }
    // 含有排序条件
    if (this.queryCondition.sortCondition.sortRule) {
      const isSort = this.queryCondition.sortCondition.sortRule === 'asc';
      data = data.sort(function( itemStart: RuleConditionModel, itemEnd: RuleConditionModel) {
        if (isSort) {
          return Number(itemStart.operator) - Number(itemEnd.operator);
        } else {
          return Number(itemEnd.operator) - Number(itemStart.operator);
        }
      });
    }
    this.pageBean.Total = data.length;
    this.pageBean.pageIndex = pageIndex;
    this.pageBean.pageSize = pageSize;
    // 组装列表数据
    this.resultTableData = data.slice(((pageIndex - 1) * pageSize), ((pageIndex - 1) * pageSize ) + pageSize);
    this.tableConfig.isLoading = false;
  }
  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-1',
      showSearchSwitch: true,
      notShowPrint: true,
      showSizeChanger: true,
      scroll: {x: '1000px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {
          // 规则条件
          title: this.language.ruleCondition, key: 'ruleCondition',
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
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
      topButtons: [],
      operation: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        if (!event.length) {
          this.queryCondition.filterConditions = event;
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          this.pageBean = new PageModel(this.queryCondition.pageCondition.pageSize);
          this.queryCondition.filterConditions = event;
          this.queryCondition.pageCondition = new PageCondition(this.pageBean.pageIndex, this.pageBean.pageSize);
          this.refreshTableData();
        }
      }
    };
  }
}
