import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import { FiLinkModalService } from 'src/app/shared-module/service/filink-modal/filink-modal.service';
import { ScheduleApiService } from '../../share/service/schedule-api.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ScheduleLanguageInterface} from '../../../../../assets/i18n/schedule/schedule.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import { WorkforceManagementListModel } from '../../share/model/workforce-management-list.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {TeamManageListModel} from '../../share/model/team-manage-list.model';
import {ScheduleForCommonUtil} from '../../../../core-module/business-util/schedule/schedule-for-common.util';

/**
 * 排班管理
 */
@Component({
  selector: 'app-workforce-management',
  templateUrl: './workforce-management.component.html',
  styleUrls: ['./workforce-management.component.scss']
})

export class WorkforceManagementComponent implements OnInit {
  // 班组名称选择器过滤模板
  @ViewChild('teamSelectorTpl') teamSelectorTpl;
  // 国家化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 列表数据
  public dataSet: WorkforceManagementListModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 是否展示班组名称选择器
  public isShowTeamSelectorModal: boolean = false;
  // 班组名称的过滤字段
  public teamNameFilter: FilterCondition = new FilterCondition();
  // 选择的班组名称，用于回显
  public selectTeamNameList: TeamManageListModel[] = [];
  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              private $router: Router,
              private $scheduleService: ScheduleApiService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableConfig();
    this.queryScheduleList();
  }

  /**
   * 打开班组名称选择器弹框
   * param filterValue
   */
  public showTeamNameModal(filterValue: FilterCondition): void {
    this.teamNameFilter = filterValue;
    this.isShowTeamSelectorModal = true;
  }

  /**
   * 选择班组名称确定事件
   */
  public handleTeamNameOk(members: TeamManageListModel[]): void {
    this.teamNameFilter.filterValue = members.map(item => item.id);
    this.teamNameFilter.filterName = members.map(item => item.teamName).join(',');
    this.selectTeamNameList = members;
    this.isShowTeamSelectorModal = false;
  }

  /**
   * 分页
   * param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryScheduleList();
  }

  /**
   * 获取排班列表数据
   */
  private queryScheduleList(): void {
    this.tableConfig.isLoading = true;
    this.$scheduleService.queryListScheduleByPage(this.queryCondition).subscribe((res: ResultModel<WorkforceManagementListModel[]>) => {
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
   * 导出
   * param event
   */
  private handleExportSchedule(event: ListExportModel<WorkforceManagementListModel[]>): void {
    // 处理参数
    (event.columnInfoList || []).forEach(item => {
      if (['startDate', 'endDate'].includes(item.propertyName)) {
        item.propertyName = item.propertyName + 'Str';
      }
    });
    const exportParams = new ExportRequestModel(event.columnInfoList, event.excelType, this.queryCondition);
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.id);
      const filter = new FilterCondition('workScheduleIdList', OperatorEnum.in, ids);
      exportParams.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportParams.queryCondition.filterConditions = event.queryTerm;
    }
    this.$scheduleService.exportScheduleData(exportParams).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.commonLanguage.exportSuccess);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 删除排班
   */
  private deleteSchedule(data: WorkforceManagementListModel[]): void {
    // 排班中的班组不允许删除
    const teamIds = data.map(item => item.id);
    this.$scheduleService.deleteScheduleBatch(teamIds).subscribe((result: ResultModel<string>) => {
      // 判断是否是正在排班的班次 是 给出提示
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.scheduleLanguage.deleteScheduleSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryScheduleList();
      } else {
        this.$message.error(result.msg);
      }
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
      primaryKey: '18-2-3',
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
        // 开始日期
        {
          title: this.scheduleLanguage.startDate, key: 'startDate', width: 180, isShowSort: true,
          searchable: true,
          configurable: false,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: {type: 'dateRang', notShowTime: true}
        },
        // 结束日期
        {
          title: this.scheduleLanguage.endDate, key: 'endDate', width: 180, isShowSort: true,
          searchable: true,
          configurable: false,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: {type: 'dateRang', notShowTime: true}
        },
        // 班组名称
        {
          title: this.scheduleLanguage.teamName, key: 'teamNames', width: 150,
          searchable: true, configurable: true,
          searchKey: 'teamIdList',
          searchConfig: {type: 'render', renderTemplate: this.teamSelectorTpl}
        },
        // 班次名称
        {
          title: this.scheduleLanguage.workShiftName, key: 'shiftName', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 区域
        {
          title: this.scheduleLanguage.area, key: 'areaNames', width: 150,
          searchable: true, configurable: true,
          searchKey: 'areaName',
          searchConfig: {type: 'input'}
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
          key: '', width: 120,
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
          permissionCode: '17-2-3-2',
          handle: () => {
            this.$router.navigate(['/business/schedule/workforce-management/add']).then();
          }
        },
        {
          // 批量删除
          text: this.commonLanguage.deleteBtn,
          permissionCode: '17-2-3-4',
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data: WorkforceManagementListModel[]) => {
            // 仅支持删除不在执行中的排班
            this.deleteSchedule(data);
          }
        },
        {
          // 查看排班
          text: this.scheduleLanguage.viewScheduling,
          iconClassName: 'fiLink-flink_chakanpaiban-icon',
          className: 'select-status',
          btnType: 'default',
          permissionCode: '17-2-3-5',
          handle: () => {
            const selectData = this.dataSet.filter(item => item.checked).map(item => item.id);
            if (selectData.length) {
              const startDateList = this.dataSet.filter(item => item.checked).map(item => item.startDate).sort();
              this.$router.navigate(['/business/schedule/view-scheduling'], {queryParams: {id: selectData, startDate: startDateList[0]}}).then();
            } else {
              this.$message.info(this.scheduleLanguage.selectDataAtLeast);
            }
          }
        },
      ],
      operation: [
        {
          // 编辑
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '17-2-3-3',
          handle: (data: WorkforceManagementListModel) => {
            this.$router.navigate(['/business/schedule/workforce-management/update'], {queryParams: {id: data.id}}).then();
          },
        },
        {
          // 查看排班
          text: this.scheduleLanguage.viewScheduling,
          className: 'fiLink-flink_chakanpaiban-icon',
          permissionCode: '17-2-3-5',
          handle: (data: WorkforceManagementListModel) => {
            this.$router.navigate(['/business/schedule/view-scheduling'], {queryParams: {id: [data.id], startDate: data.startDate}}).then();
          },
        },
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          permissionCode: '17-2-3-4',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          handle: (data: WorkforceManagementListModel) => {
            // 仅支持删除不在执行中的排班
            this.deleteSchedule([data]);
          }
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryScheduleList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        if (event && !event.length) {
          this.selectTeamNameList = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 对选择的开始日期和结束日期数据做处理
        ScheduleForCommonUtil.handleRangeTimeFormat(event, ['startDate', 'endDate']);
        this.queryScheduleList();
      },
      // 导出
      handleExport: (event: ListExportModel<WorkforceManagementListModel[]>) => {
        this.handleExportSchedule(event);
      },
    };
  }
}
