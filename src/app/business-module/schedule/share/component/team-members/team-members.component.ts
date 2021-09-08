import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ScheduleLanguageInterface} from '../../../../../../assets/i18n/schedule/schedule.language.interface';
import {PersonInfoModel} from '../../model/person-info.model';
import {JobStatusEnum} from '../../enum/job-status.enum';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ScheduleApiService} from '../../service/schedule-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {PersonInfoConfig} from '../../config/person-info-config';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 * 班组成员选择器
 */
@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit, OnDestroy {
  // 是否展示班组成员弹框
  @Input() isVisible: boolean = false;
  // 选中的单位，根据单位查询该单位下的人员
  @Input() deptCode: string;
  // 班组id集合，根据班组id查询
  @Input() teamIdList: string[] = [];
  // 选中的班组成员信息
  @Input() selectMemberList: PersonInfoModel[] = [];
  // 选中的班组成员确定事件
  @Output() handleOkEvent: EventEmitter<PersonInfoModel[]> = new EventEmitter<PersonInfoModel[]>();
  // 弹框显示隐藏事件
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter();
  // 表格组件
  @ViewChild('tableTpl') private tableTpl: TableComponent;
  // 班组成员列表中在职状态模板
  @ViewChild('jobStatusTemp') jobStatusTemp;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 排班管理国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 列表数据
  public personDataSet: PersonInfoModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel(5, 1, 0);
  // 班组成员列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 在职状态枚举
  public jobStatusEnum = JobStatusEnum;

  constructor(private $nzI18n: NzI18nService,
              private $scheduleService: ScheduleApiService,
              public $message: FiLinkModalService) { }

  /**
   * 初始化
    */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.queryCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.initPersonInfoTable();
    this.queryPersonList();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.tableTpl = null;
  }

  /**
   * 点击确定按钮事件
   */
  public handleOk(): void {
    this.handleOkEvent.emit(this.tableTpl.getDataChecked());
  }

  /**
   * 点击清空按钮事件
   */
  public cleanUpPerson(): void {
    this.selectMemberList = [];
    this.tableTpl.keepSelectedData.clear();
    this.tableTpl.updateSelectedData();
    this.tableTpl.checkStatus();
  }

  /**
   * 班组成员列表选择器分页
   * param event PageModel
   */
  public personPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryPersonList();
  }

  /**
   * 初始化班组成员列表信息
   */
  private initPersonInfoTable(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      noAutoHeight: true,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      keepSelected: true,
      selectedIdKey: 'id',
      pageSizeOptions: [PageSizeEnum.sizeFive, PageSizeEnum.sizeTen, PageSizeEnum.sizeTwenty, PageSizeEnum.sizeThirty, PageSizeEnum.sizeForty],
      columnConfig: PersonInfoConfig.personColumnConfig(this.commonLanguage, this.scheduleLanguage, this.jobStatusTemp),
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryPersonList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.queryPersonList();
      },
    };
  }

  /**
   * 查询人员信息列表数据
   */
  private queryPersonList(): void {
    this.tableConfig.isLoading = true;
    let request;
    if (this.deptCode) {
      // 根据单位id查询可选择的班组成员 人员列表
      if (!this.queryCondition.filterConditions.some(item => item.filterField === 'deptCode')) {
        this.queryCondition.filterConditions.push(new FilterCondition('deptCode', OperatorEnum.eq, this.deptCode));
      }
      // 编辑班组管理时，需要将班组id传入，查出已选择的班组成员；新增班组管理时，已选择的班组成员不会被查出
      if (this.teamIdList && this.teamIdList.length && this.teamIdList[0]
      && !this.queryCondition.filterConditions.some(item => item.filterField === 'teamId')) {
        this.queryCondition.filterConditions.push(new FilterCondition('teamId', OperatorEnum.eq, this.teamIdList[0]));
      }
      request = this.$scheduleService.queryFreeTeamMembers(this.queryCondition);
    } else {
      if (this.teamIdList && this.teamIdList.length && !this.queryCondition.filterConditions.some(item => item.filterField === 'teamIdList')) {
        this.queryCondition.filterConditions.push(new FilterCondition('teamIdList', OperatorEnum.in, this.teamIdList));
      }
      request = this.$scheduleService.queryPersonInformation(this.queryCondition);
    }
    request.subscribe((res: ResultModel<PersonInfoModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.personDataSet = res.data || [];
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
}
