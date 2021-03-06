import {Component, OnInit, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {ProjectInfoModel} from '../share/model/project-info.model';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {PlanProjectApiService} from '../share/service/plan-project.service';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {PlanProjectLanguageInterface} from '../../../../assets/i18n/plan-project/plan-project.language.interface';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {ProjectStatusEnum} from '../../../core-module/enum/plan-project/project-status.enum';
import {SliderCommon} from '../../../core-module/model/slider-common';
import {ProjectStatusIconEnum} from '../../../core-module/enum/plan-project/project-status-icon.enum';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {TableComponent} from '../../../shared-module/component/table/table.component';
import {ListExportModel} from '../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';
import * as _ from 'lodash';
import {ResultModel} from '../../../shared-module/model/result.model';
import {HIDDEN_SLIDER_HIGH_CONST, SHOW_SLIDER_HIGH_CONST} from '../../facility/share/const/facility-common.const';
import {PointStatusEnum} from '../../../core-module/enum/plan/point-status.enum';
import {DateFormatStringEnum} from '../../../shared-module/enum/date-format-string.enum';
import {ViewEnum} from '../../../core-module/enum/index/index.enum';
import {IS_TRANSLATION_CONST} from '../../../core-module/const/common.const';
import {NativeWebsocketImplService} from '../../../core-module/websocket/native-websocket-impl.service';
import {PlanProjectResultService} from '../../../core-module/mission/plan-project-result.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {WisdomPointInfoModel} from '../../../core-module/model/plan/wisdom-point-info.model';
import {SliderPanelModel} from '../../../shared-module/model/slider-panel.model';
import {SliderConfigModel} from '../../../core-module/model/facility/slider-config.model';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {ScheduleForCommonUtil} from '../../../core-module/business-util/schedule/schedule-for-common.util';

/**
 * ???????????? ??????????????????
 */
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  // ??????????????????
  @ViewChild('projectStatusTemp') projectStatusTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // ???????????????????????????
  @ViewChild('wisdomListTable') wisdomListTable: TableComponent;
  // ????????????
  public sliderConfig: Array<SliderCommon> = [];
  // ?????????????????????
  public dataSet: ProjectInfoModel[] = [];
  // ????????????????????????
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  public tableConfig: TableConfigModel;
  // ????????????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public language: PlanProjectLanguageInterface;
  // ?????????????????????id??????
  public selectProjectIds: string[] = [];

  // ??????????????????
  public projectStatusEnum = ProjectStatusEnum;
  // ???????????????
  public languageEnum = LanguageEnum;

  // ??????????????????????????????????????????????????????????????????
  public isShowPointStatusWindow: boolean = false;
  public wisdomListDataSet: WisdomPointInfoModel[] = [];
  // ?????????????????????
  public wisdomListPageBean: PageModel = new PageModel(10, 1);
  // ???????????????????????????
  public tableWisdomListConfig: TableConfigModel;
  // ???????????????
  private destroy$ = new Subject<void>();

  constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $modalService: NzModalService,
    private $wsService: NativeWebsocketImplService,
    // ????????????
    private $planProjectApiService: PlanProjectApiService,
    private $planProjectResultService: PlanProjectResultService
  ) {
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // ??????????????????
    this.initTableConfig();
    this.refreshData();
    // ?????????????????? ????????????
    this.sliderConfig = [
      {
        // ????????????
        label: this.language.projectSum,
        iconClass: 'fiLink-work-order-all wisdom-sum',
        textClass: 'wisdom-sum',
        code: null, sum: 0
      },
      {
        // ?????????
        label: this.language.notStarted,
        iconClass: ProjectStatusIconEnum.notStarted,
        textClass: 'no-start',
        code: ProjectStatusEnum.notStarted, sum: 0
      },
      {
        // ?????????
        label: this.language.working,
        iconClass: ProjectStatusIconEnum.working,
        textClass: 'project-working',
        code: ProjectStatusEnum.working, sum: 0
      },
      {
        // ??????
        label: this.language.delayed,
        iconClass: ProjectStatusIconEnum.delayed,
        textClass: 'project-delayed',
        code: ProjectStatusEnum.delayed, sum: 0
      },
      {
        // ?????????
        label: this.language.finished,
        iconClass: ProjectStatusIconEnum.finished,
        textClass: 'project-finished',
        code: ProjectStatusEnum.finished, sum: 0
      }
    ];
    // ????????????????????????
    this.queryProjectInfoStatistics();
    // websocket??????????????????
    this.wsMsgAccept();
  }

  /**
   * ??????
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * ????????????
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * websocket??????????????????????????????
   */
  public wsMsgAccept(): void {
    this.$planProjectResultService.refreshChangeHook.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      // ?????????????????????????????????
      if (value) {
        this.refreshData();
      }
    });
  }
  /**
   * ??????????????????
   */
  public sliderChange(event: SliderPanelModel): void {
    if (event.code) {
      // ????????????????????????????????????
      this.tableComponent.searchDate = {};
      this.tableComponent.rangDateValue = {};
      this.tableComponent.tableService.resetFilterConditions(this.tableComponent.queryTerm);
      this.tableComponent.handleSetControlData('status', [event.code]);
      this.tableComponent.handleSearch();
    } else {
      this.tableComponent.handleRest();
    }
  }

  /**
   * ????????????
   * param event
   */
  public slideShowChange(event: SliderConfigModel): void {
    if (event) {
      this.tableConfig.outHeight = SHOW_SLIDER_HIGH_CONST;
    } else {
      this.tableConfig.outHeight = HIDDEN_SLIDER_HIGH_CONST;
    }
    this.tableComponent.calcTableHeight();
  }

  /**
   * ?????????????????????
   * @param event ????????????
   */
  public wisdomListPageChange(event: PageModel): void {
    this.wisdomListPageBean.pageIndex = event.pageIndex;
    this.wisdomListPageBean.pageSize = event.pageSize;
    this.wisdomListPageBean.Total = event.Total;
    this.queryBuildingPointByPage(this.selectProjectIds);
  }

  /**
   * ???????????????????????????
   */
  public handleOk(): void {
    this.finishProject();
  }

  /**
   * ??????
   */
  public handleCancel(): void {
    this.isShowPointStatusWindow = false;
  }

  /**
   * ????????????????????????
   */
  private queryProjectInfoStatistics(): void {
    // ?????????????????????????????????
    this.$planProjectApiService.queryProjectInfoStatistics().subscribe((result) => {
      if (result.code === ResultCodeEnum.success) {
        this.sliderConfig.forEach(item => {
          // ????????? ??????????????????????????????????????????
          item.sum = 0;
          const temp = result.data.find(_item => _item.status === item.code);
          if (temp) {
            item.sum = temp.number;
          }
        });
        this.sliderConfig[0].sum = _.sumBy(result.data, 'number') || 0;
      }
    });
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      primaryKey: '25-1-1',
      keepSelected: true,
      selectedIdKey: 'projectId',
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        { // ??????
          title: this.commonLanguage.select,
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        { // ??????
          type: 'serial-number',
          width: 62,
          title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ????????????
          title: this.language.projectName,
          key: 'projectName',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.projectCode,
          key: 'projectCode',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.projectScale,
          key: 'projectScale',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.builtCount,
          key: 'builtCount',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.buildingCount,
          key: 'buildingCount',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.projectStatus,
          key: 'status',
          type: 'render',
          renderTemplate: this.projectStatusTemp,
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(ProjectStatusEnum, this.$nzI18n, null, LanguageEnum.planProject),
            label: 'label',
            value: 'code'
          }
        },
        { // ????????????
          title: this.language.builtDept,
          key: 'builtDept',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.manager,
          key: 'manager',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.designUnit,
          key: 'designUnit',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.buildUnit,
          key: 'buildUnit',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.supervisionUnit,
          key: 'supervisionUnit',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.projectAreaName,
          key: 'areaName',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ??????????????????
          title: this.language.planStart, key: 'planStart', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'dateRang', notShowTime: true},
          pipe: 'date',
          pipeParam: DateFormatStringEnum.date
        },
        { // ??????????????????
          title: this.language.planStop, key: 'planStop', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'dateRang', notShowTime: true},
          pipe: 'date',
          pipeParam: DateFormatStringEnum.date
        },
        { // ??????????????????
          title: this.language.actualStart, key: 'actualStart', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'dateRang', notShowTime: true},
          pipe: 'date',
          pipeParam: DateFormatStringEnum.date
        },
        { // ??????????????????
          title: this.language.actualStop, key: 'actualStop', width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'dateRang', notShowTime: true},
          pipe: 'date',
          pipeParam: DateFormatStringEnum.date
        },
        { // ??????
          title: this.language.remark,
          key: 'remark',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ?????????
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        { // ??????
          text: this.commonLanguage.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '25-1-2',
          handle: () => {
            this.$router.navigate(['business/project-manage/project-detail/add']).then();
          },
          disabled: !SessionUtil.checkHasDeviceType('D002'),
          canDisabled: !SessionUtil.checkHasDeviceType('D002')
        },
        { // ??????
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '25-1-6',
          needConfirm: true,
          canDisabled: true,
          handle: () => {
            this.deleteProjectInfo(this.selectProjectIds);
          }
        },
      ],
      moreButtons: [
        { // ????????????
          text: this.language.startProject,
          iconClassName: 'fiLink-flink_qidong-icon',
          canDisabled: true,
          needConfirm: false,
          permissionCode: '25-1-8',
          handle: (event) => {
            // ??????????????????????????????
            let canOperate = true;
            event.forEach(item => {
              if (item.status !== ProjectStatusEnum.notStarted) {
                canOperate = false;
                return;
              }
            });
            if (canOperate) {
              this.startProject(this.selectProjectIds);
            } else {
              this.$message.info(this.language.onlyStartNoStartSProject);
            }

          }
        },
        { // ????????????
          text: this.language.endProject,
          iconClassName: 'fiLink-flink_jiesu-icon',
          canDisabled: true,
          permissionCode: '25-1-9',
          handle: (event) => {
            // ??????????????????
            let canOperate = true;
            // ??????????????????????????? ??????????????????????????????????????????
            event.forEach(item => {
                if (item.status === ProjectStatusEnum.notStarted || item.status === ProjectStatusEnum.finished) {
                  canOperate = false;
                  return;
                }
              }
            );
            if (canOperate) {
              this.showWisdomList(this.selectProjectIds);
            } else {
              this.$message.info(this.language.onlyEndWorkingProject);
            }
          }
        }
      ],
      operation: [
        { // ??????
          text: this.language.location,
          className: 'fiLink-location',
          permissionCode: '25-1-7',
          handle: (e: ProjectInfoModel) => {
            if (!e.positionCenterLongitude) {
              this.$message.error(this.language.planNoPoint);
              return;
            }
            // ?????????????????????????????????????????????
            this.$router.navigate(['business/index'],
              {
                queryParams: {
                  id: e.projectId,
                  xPosition: e.positionCenterLongitude,
                  yPosition: e.positionCenterLatitude,
                  type: ViewEnum.projectView,
                }
              }).then();
          }
        },
        { // ????????????
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '25-1-3',
          handle: (event: ProjectInfoModel) => {
            if (event.status === ProjectStatusEnum.finished) {
              this.$message.info(this.language.cannotModify);
              return;
            }
            this.$router.navigate(['business/project-manage/project-detail/update'],
              {queryParams: {id: event.projectId}}).then();
          }
        },
        { // ??????????????????
          text: this.language.editProjectPoint,
          className: 'fiLink-coordinate-edit-icon',
          permissionCode: '25-1-5',
          handle: (event: ProjectInfoModel) => {
            if (event.status === ProjectStatusEnum.finished) {
              this.$message.info(this.language.cannotModify);
              return;
            }
            this.$router.navigate(['business/project-manage/point-detail/update'],
              {
                queryParams: {
                  id: event.projectId
                }
              }).then();
          }
        },
        { // ????????????
          text: this.language.startProject,
          className: 'fiLink-flink_qidong-icon',
          needConfirm: false,
          permissionCode: '25-1-8',
          handle: (event: ProjectInfoModel) => {
            if (event.status !== ProjectStatusEnum.notStarted) {
              this.$message.info(this.language.onlyStartNoStartSProject);
              return;
            }
            this.startProject([event.projectId]);
          }
        },
        { // ????????????
          text: this.language.endProject,
          className: 'fiLink-flink_jiesu-icon',
          iconClassName: 'fiLink-flink_jiesu-icon',
          permissionCode: '25-1-9',
          handle: (event: ProjectInfoModel) => {
            if (event.status === ProjectStatusEnum.notStarted || event.status === ProjectStatusEnum.finished) {
              this.$message.info(this.language.onlyEndWorkingProject);
              return;
            }
            this.showWisdomList([event.projectId]);
            this.selectProjectIds = [event.projectId];
          }
        },
        { // ??????
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          iconClassName: 'fiLink-delete',
          permissionCode: '25-1-6',
          needConfirm: true,
          btnType: 'danger',
          handle: (event: ProjectInfoModel) => {
            this.deleteProjectInfo([event.projectId]);
          }
        }
      ],
      // ??????
      handleSelect: (event: ProjectInfoModel[]) => {
        if (!event.length) {
          this.selectProjectIds = [];
          return;
        }
        this.selectProjectIds = event.map(item => item.projectId);
      },
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      // ????????????
      handleSearch: (e: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = e;
        // ?????????????????????????????????
        ScheduleForCommonUtil.handleRangeTimeFormat(e, ['planStart', 'planStop', 'actualStart', 'actualStop']);
        this.refreshData();
      },
      // ??????
      handleExport: (event: ListExportModel<ProjectInfoModel[]>) => {
        // ????????????????????????????????????
        const exportData = new ExportRequestModel(event.columnInfoList, event.excelType);
        const translationField = ['planStart', 'planStop', 'actualStart', 'actualStop'];
        // ???????????????????????????????????????????????????
        exportData.columnInfoList.forEach(item => {
          if (translationField.includes(item.propertyName)) {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        //  ?????????????????????
        if (event && !_.isEmpty(event.selectItem)) {
          const projectIds = event.selectItem.map(item => item.projectId);
          exportData.queryCondition.filterConditions = exportData.queryCondition.filterConditions.concat([new FilterCondition('projectId', OperatorEnum.in, projectIds)]);
        } else {
          exportData.queryCondition.filterConditions = event.queryTerm;
        }
        // ????????????
        this.$planProjectApiService.exportProjectList(exportData).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.exportProjectSuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * ??????????????????????????????
   */
  private initWisdomTable(): void {
    this.tableWisdomListConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      notShowPrint: true,
      showSizeChanger: true,
      showSearchSwitch: false,
      keepSelected: true,
      showPagination: true,
      scroll: {x: '1804px', y: '340px'},
      selectedIdKey: 'pointId',
      noIndex: true,
      showSearch: false,
      columnConfig: [
        { // ??????
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        { // ??????
          type: 'serial-number',
          width: 62,
          title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ???????????????
          title: this.language.wisdomName, key: 'pointName', width: 150,
        },
        { // ????????????
          title: this.language.belongProject, key: 'projectName', width: 150,
        },
        { // ????????????
          title: this.language.planId, key: 'planName', width: 150,
        },
      ],
    };
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    // ????????????
    this.$planProjectApiService.queryProjectInfoListByPage(this.queryCondition).subscribe((res: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.dataSet.forEach(item => {
          item.statusIconClass = ProjectStatusIconEnum[item.status];
        });
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ????????????
   * @param data ???????????????
   */
  private startProject(data: string[]): void {
    this.$modalService.confirm({
      nzTitle: this.language.confirmStartProject,
      nzOkType: 'danger',
      nzOkText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.$planProjectApiService.startProject(data).subscribe((result) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.language.startSuccess);
            this.refreshData();
            this.queryProjectInfoStatistics();
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }

  /**
   * ???????????????????????????????????????
   * @param data ????????????
   */
  private showWisdomList(data: string[]): void {
    this.isShowPointStatusWindow = true;
    this.initWisdomTable();
    this.queryBuildingPointByPage(data);
  }

  /**
   * ????????????
   */
  private finishProject(): void {
    // ????????????????????????
    const pointData = this.wisdomListTable.getDataChecked() || [];
    this.$planProjectApiService.finishProject(
      {
        projectIds: this.selectProjectIds,
        pointIds: pointData.map(v => v.pointId)
      }).subscribe((result) => {
      if (result.code === ResultCodeEnum.success) {
        // ??????????????????????????????
        this.isShowPointStatusWindow = false;
        this.$message.success(this.language.endSuccess);
        // ?????????????????????????????????
        this.refreshData();
        this.queryProjectInfoStatistics();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ??????????????????????????????????????????(???????????????)
   * @param data ??????????????????projectId??????
   */
  private queryBuildingPointByPage(data: string[]): void {
    this.tableWisdomListConfig.isLoading = true;
    const queryCondition: QueryConditionModel = new QueryConditionModel();
    queryCondition.filterConditions.push(new FilterCondition('projectId', OperatorEnum.in, data));
    queryCondition.filterConditions.push(new FilterCondition('pointStatus', OperatorEnum.eq, PointStatusEnum.underConstruction));
    queryCondition.pageCondition.pageSize = this.wisdomListPageBean.pageSize;
    queryCondition.pageCondition.pageNum = this.wisdomListPageBean.pageIndex;
    this.$planProjectApiService.queryBuildingPointByPage(queryCondition).subscribe((result: ResultModel<WisdomPointInfoModel[]>) => {
      this.tableWisdomListConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.wisdomListDataSet = result.data || [];
        this.wisdomListPageBean.pageIndex = result.pageNum;
        this.wisdomListPageBean.Total = result.totalCount;
        this.wisdomListPageBean.pageSize = result.size;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableWisdomListConfig.isLoading = false;
    });
  }

  /**
   * ????????????
   * @param data ???????????????projectId??????
   */
  private deleteProjectInfo(data: string[]): void {
    this.$planProjectApiService.deleteProjectInfo(data).subscribe((result) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.deleteSuccess);
        this.refreshData();
        this.queryProjectInfoStatistics();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
