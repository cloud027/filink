import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {ScheduleLanguageInterface} from '../../../../../assets/i18n/schedule/schedule.language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {Router} from '@angular/router';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {WorkShiftDataModel} from '../../share/model/work-shift-data.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ScheduleApiService} from '../../share/service/schedule-api.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TableLanguageInterface} from '../../../../../assets/i18n/table/table.language.interface';
import {DateFormatStringEnum} from '../../../../shared-module/enum/date-format-string.enum';

/**
 * 班次管理
 */
@Component({
  selector: 'app-work-shift',
  templateUrl: './work-shift.component.html',
  styleUrls: ['./work-shift.component.scss']
})
export class WorkShiftComponent implements OnInit {
  // 开始时间、结束时间查询模板
  @ViewChild('startTimeSearchTemp') public startTimeSearchTemp: TemplateRef<HTMLDocument>;
  @ViewChild('endTimeSearchTemp') public endTimeSearchTemp: TemplateRef<HTMLDocument>;
  // 国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 表格国际化
  public tableLanguage: TableLanguageInterface;
  // 列表数据
  public dataSet: WorkShiftDataModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 时间选择框格式
  public format: string = DateFormatStringEnum.timeFormat;
  // 时间选择框默认打开的选择
  public defaultOpenValue: Date = new Date(0, 0, 0, 0, 0, 0);
  // 时间搜索操作符
  public timeOperator: OperatorEnum = OperatorEnum.eq;
  public endTimeOperator: OperatorEnum = OperatorEnum.eq;
  // 时间过滤数据
  public timeFilterValue: FilterCondition = new FilterCondition();
  public endTimeFilterValue: FilterCondition = new FilterCondition();

  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              private $modalService: NzModalService,
              private $router: Router,
              private $scheduleService: ScheduleApiService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.tableLanguage = this.$nzI18n.getLocaleData(LanguageEnum.table);
    // 初始化表格
    this.initTableConfig();
    // 获取列表数据
    this.queryShiftList();
  }

  /**
   * 分页
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryShiftList();
  }

  /**
   * 时间选择器变化事件
   */
  public timeSelectChange(event: Date, filterValue: FilterCondition, isStartTime: boolean): void {
    if (event) {
      if (isStartTime) {
        // 获取开始时间筛选条件
        this.timeFilterValue = filterValue;
        this.timeFilterValue.filterValue = event;
      } else {
        // 获取结束时间筛选条件
        this.endTimeFilterValue = filterValue;
        this.endTimeFilterValue.filterName = event;
      }
    } else {
      if (isStartTime) {
        this.timeOperator = OperatorEnum.eq;
      } else {
        this.endTimeOperator = OperatorEnum.eq;
      }
    }
  }

  /**
   * 获取班次列表数据
   */
  private queryShiftList(): void {
    this.tableConfig.isLoading = true;
    this.$scheduleService.queryListShiftByPage(this.queryCondition).subscribe((res: ResultModel<WorkShiftDataModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      notShowPrint: false,
      primaryKey: '18-2-2',
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        // 选择
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
        // 序号
        {
          type: 'serial-number', width: 60, title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        // 班次名称
        {
          title: this.scheduleLanguage.workShiftName, key: 'shiftName', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 班次类型
        {
          title: this.scheduleLanguage.workShiftType, key: 'shiftType', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 开始时间
        {
          title: this.scheduleLanguage.startTime, key: 'startTime', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.startTimeSearchTemp}
        },
        // 结束时间
        {
          title: this.scheduleLanguage.endTime, key: 'endTime', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.endTimeSearchTemp}
        },
        // 备注
        {
          title: this.scheduleLanguage.remark, key: 'remark', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 操作列
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 新增
          text: this.scheduleLanguage.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '17-2-2-2',
          handle: () => {
            this.$router.navigate(['/business/schedule/work-shift/add']).then();
          }
        },
        {
          // 批量删除
          text: this.commonLanguage.deleteBtn,
          permissionCode: '17-2-2-4',
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data: WorkShiftDataModel[]) => {
            this.$message.confirm(this.scheduleLanguage.deleteConfirmTitle1, () => {
              this.deleteWorkShift(data);
            });
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '17-2-2-3',
          handle: (data: WorkShiftDataModel) => {
            this.$router.navigate(['/business/schedule/work-shift/update'], {queryParams: {id: data.id}}).then();
          },
        },
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          permissionCode: '17-2-2-4',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          handle: (data: WorkShiftDataModel) => {
            // 单个或批量删除 删除需要做二次确认
            // 排班中的班次不允许删除
            this.$message.confirm(this.scheduleLanguage.deleteConfirmTitle2, () => {
              this.deleteWorkShift([data]);
            });
          }
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryShiftList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        // 对开始时间、结束时间的操作、筛选值做处理
        event.forEach(item => {
          if (item.filterField === 'startTime') {
            item.operator = this.timeOperator;
            item.filterValue = new Date(
              `1970-01-01 ${CommonUtil.dateFmt(this.format.toLowerCase(), this.timeFilterValue.filterValue)}`
            ).getTime() + 28800000 + '';
          }
          if (item.filterField === 'endTime') {
            item.operator = this.endTimeOperator;
            item.filterValue = new Date(
              `1970-01-01 ${CommonUtil.dateFmt(this.format.toLowerCase(), this.endTimeFilterValue.filterValue)}`
            ).getTime() + 28800000 + '';
          }
        });
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 重置时，清空时间的筛选条件，并把操作符置为等于
        if (!event.length) {
          this.timeFilterValue = new FilterCondition();
          this.endTimeFilterValue = new FilterCondition();
          this.timeOperator = OperatorEnum.eq;
          this.endTimeOperator = OperatorEnum.eq;
          console.log(this.timeFilterValue);
        }
        this.queryShiftList();
      },
      // 导出
      handleExport: (event: ListExportModel<WorkShiftDataModel[]>) => {
        // 处理参数
        const exportParams = new ExportRequestModel(event.columnInfoList, event.excelType, this.queryCondition);
        // 处理选择的数据
        if (event && !_.isEmpty(event.selectItem)) {
          const ids = event.selectItem.map(item => item.id);
          const filter = new FilterCondition('shiftIdList', OperatorEnum.in, ids);
          exportParams.queryCondition.filterConditions.push(filter);
        } else {
          // 处理查询条件
          exportParams.queryCondition.filterConditions = event.queryTerm;
        }
        this.$scheduleService.exportShiftData(exportParams).subscribe((res: ResultModel<WorkShiftDataModel[]>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.scheduleLanguage.exportShiftSuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      },
    };
  }

  /**
   * 删除班次
   */
  private deleteWorkShift(data: WorkShiftDataModel[]): void {
    const shiftIds = data.map(item => item.id);
    this.$scheduleService.deleteShiftBatch(shiftIds).subscribe((res: ResultModel<string>) => {
      // 判断是否是正在排班的班次 是 给出提示
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.scheduleLanguage.deleteShiftSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryShiftList();
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
