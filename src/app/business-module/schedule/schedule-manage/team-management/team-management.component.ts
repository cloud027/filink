import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ScheduleLanguageInterface} from '../../../../../assets/i18n/schedule/schedule.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ScheduleApiService} from '../../share/service/schedule-api.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {TeamManageListModel} from '../../share/model/team-manage-list.model';
import {ResultModel} from 'src/app/shared-module/model/result.model';
import {ResultCodeEnum} from 'src/app/shared-module/enum/result-code.enum';
import {TeamManagementConfig} from '../../share/config/team-management-config';
import {ListUnitSelector} from '../../../../shared-module/component/business-component/list-unit-selector/list-unit-selector';
import {UserForCommonService} from '../../../../core-module/api-service';
import {PersonInfoModel} from '../../share/model/person-info.model';

/**
 * 班组管理
 */
@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent extends ListUnitSelector implements OnInit {
  // 班组成员搜索成员时的输入框模板
  @ViewChild('teamMemberTpl') teamMemberTpl: TemplateRef<any>;
  // 班组成员列表中搜索单位时的输入框模板
  @ViewChild('unitNameSearch') unitNameSearchTpl: TemplateRef<any>;
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
  // 是否展示班组选择器弹框
  public isShowPersonModal: boolean = false;
  // 班组成员的过滤字段
  public teamMemberFilter: FilterCondition = new FilterCondition();
  // 选择的班组信息集合
  public selectMemberList = [];
  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              private $router: Router,
              private $scheduleService: ScheduleApiService,
              private $userForCommonService: UserForCommonService) {
    super($userForCommonService, $nzI18n, $message);

  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableConfig();
    this.initTreeSelectorConfig();
    this.queryTeamList();
  }

  /**
   * 打开班组成员选择器弹框
   * param filterValue
   */
  public showTeamMemberModal(filterValue: FilterCondition): void {
    this.teamMemberFilter = filterValue;
    this.isShowPersonModal = true;
  }

  /**
   * 选择班组成员确定事件
   */
  public handlePersonOk(members: PersonInfoModel[]): void {
    this.selectMemberList = members;
    this.teamMemberFilter.filterValue = members.map(item => item.id);
    this.teamMemberFilter.filterName = members.map(item => item.personName).join(',');
    this.isShowPersonModal = false;
  }

  /**
   * 分页
   * param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryTeamList();
  }

  /**
   * 获取班组列表数据
   */
  private queryTeamList(): void {
    this.tableConfig.isLoading = true;
    this.$scheduleService.queryListTeamByPage(this.queryCondition).subscribe((res: ResultModel<TeamManageListModel[]>) => {
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
      primaryKey: '18-2-1',
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: TeamManagementConfig.initTeamManagementColumnConfig(this.commonLanguage, this.scheduleLanguage, true, this.teamMemberTpl, this.unitNameSearchTpl),
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 新增
          text: this.scheduleLanguage.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '17-2-1-2',
          handle: () => {
            this.$router.navigate(['/business/schedule/team-management/add']).then();
          }
        },
        {
          // 批量删除
          text: this.commonLanguage.deleteBtn,
          permissionCode: '17-2-1-4',
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data: TeamManageListModel[]) => {
            // 单个或批量删除 删除需要做二次确认
            this.$message.confirm(this.scheduleLanguage.confirmAgainDelTeam, () => {
              this.deleteTeam(data);
            });
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '17-2-1-3',
          handle: (data: TeamManageListModel) => {
            this.$router.navigate(['/business/schedule/team-management/update'], {queryParams: {id: data.id}}).then();
          },
        },
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          permissionCode: '17-2-1-4',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          handle: (data: TeamManageListModel) => {
            // 单个或批量删除 删除需要做二次确认
            this.$message.confirm(this.scheduleLanguage.confirmAgainDelTeam, () => {
              this.deleteTeam([data]);
            });
          }
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryTeamList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        if (event && event.length) {
          event.forEach(item => {
            if (item.filterField === 'personIdList') {
              item.operator = OperatorEnum.in;
            }
          });
        } else {
          this.selectMemberList = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.queryTeamList();
      },
      // 导出
      handleExport: (event: ListExportModel<TeamManageListModel[]>) => {
        this.handelExportTeam(event);
      },
    };
  }

  /**
   * 导出
   * param event
   */
  private handelExportTeam(event: ListExportModel<TeamManageListModel[]>): void {
    // 处理参数
    const exportParams = new ExportRequestModel(event.columnInfoList, event.excelType, this.queryCondition);
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.id);
      const filter = new FilterCondition('teamIdList', OperatorEnum.in, ids);
      exportParams.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportParams.queryCondition.filterConditions = event.queryTerm;
    }
    this.$scheduleService.exportTeamData(exportParams).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.commonLanguage.exportSuccess);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 删除班组
   */
  private deleteTeam(data: TeamManageListModel[]): void {
    // 排班中的班组不允许删除
    const teamIds = data.map(item => item.id);
    this.$scheduleService.deleteTeamBatch(teamIds).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.scheduleLanguage.deleteTeamSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
         this.queryTeamList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
