import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ScheduleApiService} from '../../../share/service/schedule-api.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ScheduleLanguageInterface} from 'src/assets/i18n/schedule/schedule.language.interface';
import {CommonLanguageInterface} from 'src/assets/i18n/common/common.language.interface';
import {PageModel} from 'src/app/shared-module/model/page.model';
import {TableConfigModel} from 'src/app/shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from 'src/app/shared-module/model/query-condition.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {WorkforceManagementListModel} from '../../../share/model/workforce-management-list.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {TeamManageListModel} from '../../../share/model/team-manage-list.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';

/**
 * 查看排班页面
 */
@Component({
  selector: 'app-view-scheduling',
  templateUrl: './view-scheduling.component.html',
  styleUrls: ['./view-scheduling.component.scss']
})
export class ViewSchedulingComponent implements OnInit {
  // 班组名称选择器过滤模板
  @ViewChild('teamSelectorTpl') teamSelectorTpl;
  // 国家化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 列表数据
  public dataSet = [];
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
  // 班组名称选择器选择的数据，用于回显
  public selectTeamNameList: TeamManageListModel[] = [];
  // 是否展示日历
  public isShowCalendar: boolean = false;
  // 页面操作类型枚举
  public operateTypeEnum = OperateTypeEnum;
  // 查看排班日历的开始日期
  public startDate: string;
  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              private $router: Router,
              private $active: ActivatedRoute,
              private $scheduleService: ScheduleApiService) { }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.startDate = CommonUtil.dateFmt('yyyy-MM-dd', new Date(Number(this.$active.snapshot.queryParams.startDate)));
    this.initTableConfig();
    this.queryViewScheduleList();
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
    this.queryViewScheduleList();
  }

  /**
   * 获取查看排班列表数据
   */
  private queryViewScheduleList(): void {
    this.tableConfig.isLoading = true;
    // 获取查看排班的id集合
    let viewScheduleIds = this.$active.snapshot.queryParams.id;
    viewScheduleIds = viewScheduleIds instanceof Array ? viewScheduleIds : [viewScheduleIds];
    if (!this.queryCondition.filterConditions.some(item => item.filterField === 'schedulingIdList')) {
      this.queryCondition.filterConditions.push(new FilterCondition('schedulingIdList', OperatorEnum.in, viewScheduleIds));
    }
    this.$scheduleService.schedulingPersonPageList(this.queryCondition).subscribe((res: ResultModel<WorkforceManagementListModel[]>) => {
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
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        // 序号
        {
          type: 'serial-number', width: 60, title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        // 姓名
        {
          title: this.scheduleLanguage.userName, key: 'personName', width: 150, isShowSort: true,
          searchable: true, configurable: false,
          searchConfig: {type: 'input'}
        },
        // 排班日期
        {
          title: this.scheduleLanguage.date, key: 'startDate', width: 180, isShowSort: true,
          searchable: true,
          configurable: false,
          // pipe: 'date',
          // pipeParam: 'yyyy-MM-dd',
          searchConfig: {type: 'dateRang'}
        },
        // 班次名称
        {
          title: this.scheduleLanguage.workShiftName, key: 'shiftName', width: 150, isShowSort: true,
          searchable: true, configurable: false,
          searchConfig: {type: 'input'}
        },
        // 班组名称
        {
          title: this.scheduleLanguage.teamName, key: 'teamName', width: 150, isShowSort: true,
          searchable: true, configurable: false,
          searchKey: 'teamIdList',
          searchConfig: {type: 'render', renderTemplate: this.teamSelectorTpl}
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
      rightTopButtons: [
        {
          // 排班日历
          text: this.scheduleLanguage.viewSchedulingCalendar,
          iconClassName: 'fiLink-flink_rili-icon',
          handle: () => {
            this.isShowCalendar = true;
          },
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryViewScheduleList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        if (event && event.length) {
          event.forEach(item => {
            if (item.filterField === 'startDate') {
              item.filterValue = CommonUtil.dateFmt('yyyy-MM-dd', new Date(item.filterValue));
            }
          });
        } else {
          this.selectTeamNameList = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.queryViewScheduleList();
      }
    };
  }
}
