import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HIDDEN_SLIDER_HIGH_CONST, SHOW_SLIDER_HIGH_CONST} from '../../facility/share/const/facility-common.const';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {PlanProjectLanguageInterface} from '../../../../assets/i18n/plan-project/plan-project.language.interface';
import {TableComponent} from '../../../shared-module/component/table/table.component';
import {WisdomPointInfoModel} from '../../../core-module/model/plan/wisdom-point-info.model';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {PlanningListTableUtil} from '../../../core-module/business-util/project/planning-list-table.util';
import {PointStatusEnum} from '../../../core-module/enum/plan/point-status.enum';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {PlanProjectApiService} from '../share/service/plan-project.service';
import {PointStatusIconEnum} from '../../../core-module/enum/plan/point-status-icon.enum';
import {Router} from '@angular/router';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import * as _ from 'lodash';
import {SliderConfigModel} from '../../../core-module/model/facility/slider-config.model';
import {ListExportModel} from '../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';
import {ResultModel} from '../../../shared-module/model/result.model';
import {IS_TRANSLATION_CONST} from '../../../core-module/const/common.const';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {ViewEnum} from '../../../core-module/enum/index/index.enum';
import {SliderPanelModel} from '../../../shared-module/model/slider-panel.model';
import {ProjectWisdomStatisticsModel} from '../share/model/project-wisdom-statistics.model';
import {PlanProjectResultService} from '../../../core-module/mission/plan-project-result.service';

@Component({
  selector: 'app-project-wisdom-list',
  templateUrl: './project-wisdom-list.component.html',
  styleUrls: ['./project-wisdom-list.component.scss']
})
export class ProjectWisdomListComponent implements OnInit {

  // ????????????
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // ???????????????
  @ViewChild('pointStatusTemp') pointStatusTemp: TemplateRef<HTMLDocument>;
  // ????????????
  public sliderConfig: SliderPanelModel[] = [];
  // ??????????????????????????????
  public dataSet: WisdomPointInfoModel[] = [];
  // ?????????????????????????????????
  public pageBean: PageModel = new PageModel();
  // ???????????????????????????
  public tableConfig: TableConfigModel;
  // ?????????????????????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public language: PlanProjectLanguageInterface;
  // ?????????????????????
  public pointStatusEnum = PointStatusEnum;
  // ???????????????
  public languageEnum = LanguageEnum;
  // ????????????????????????
  public selectWisdomData: WisdomPointInfoModel[] = [];

  constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    // ????????????
    private $planProjectApiService: PlanProjectApiService,
    private $modalService: NzModalService,
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
    // ?????????????????????
    this.refreshData();
    // ????????????
    this.sliderConfig = [
      {
        // ???????????????
        label: this.language.wisdomSum,
        iconClass: 'fiLink-work-order-all wisdom-sum',
        textClass: 'wisdom-sum',
        code: null, sum: 0
      },
      // ??????
      {
        label: this.language.toBeBuilt,
        iconClass: PointStatusIconEnum.runnable,
        textClass: 'to-be-built',
        code: PointStatusEnum.toBeBuilt, sum: 0
      },
      // ??????
      {
        label: this.language.underConstruction,
        iconClass: PointStatusIconEnum.running,
        textClass: 'under-construction',
        code: PointStatusEnum.underConstruction, sum: 0
      },
      //   ??????
      {
        label: this.language.hasBeenBuilt,
        iconClass: PointStatusIconEnum.end,
        textClass: 'has-been-built',
        code: PointStatusEnum.hasBeenBuilt, sum: 0
      },
    ];
    // ?????????????????????????????????
    this.queryProjectPoleStatistics();
    this.$planProjectResultService.refreshChangeHook.subscribe((value) => {
      // ?????????????????????????????????
      if (value) {
        this.refreshData();
        this.queryProjectPoleStatistics();
      }
    });
  }

  /**
   * ?????????????????????????????????
   * param event
   */
  public sliderChange(event: SliderConfigModel): void {
    if (event.code) {
      // ????????????????????????????????????
      this.tableComponent.searchDate = {};
      this.tableComponent.rangDateValue = {};
      this.tableComponent.tableService.resetFilterConditions(this.tableComponent.queryTerm);
      this.tableComponent.handleSetControlData('pointStatus', [event.code]);
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
   * ????????????
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.refreshData();
  }

  /**
   * ??????????????????????????????
   */
  private initTableConfig(): void {
    const columnConfig = PlanningListTableUtil.getWisdomColumnConfig(this, this.$nzI18n);
    columnConfig.splice(-1, 0, {
      // ????????????
      title: this.language.belongProject, key: 'projectName', width: 150,
      isShowSort: true,
      searchable: true,
      configurable: true,
      searchConfig: {type: 'input'}
    });
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      primaryKey: '25-2-1',
      keepSelected: true,
      selectedIdKey: 'pointId',
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: columnConfig,
      topButtons: [
        { // ????????????
          text: this.language.updateStatus,
          iconClassName: 'fiLink-refresh-index',
          needConfirm: false,
          canDisabled: true,
          permissionCode: '25-2-3',
          handle: () => {
            this.updateProjectStatus(this.selectWisdomData.map(item => item.pointId));
          }
        },
      ],
      operation: [
        { // ??????
          text: this.language.location,
          className: 'fiLink-location',
          permissionCode: '25-2-4',
          handle: (e: WisdomPointInfoModel) => {
            this.$router.navigate(['business/index'],
              {
                queryParams: {
                  id: e.pointId,
                  xPosition: e.xposition,
                  yPosition: e.yposition,
                  type: ViewEnum.projectViewList,
                  deviceType: DeviceTypeEnum.wisdom,
                  pointStatus: e.pointStatus,
                }
              }).then();
          }
        },
        { // ???????????????
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '25-2-2',
          handle: (event: WisdomPointInfoModel) => {
            this.checkPointCanUpdate(event.pointId);
          }
        },
        { // ????????????
          text: this.language.updateStatus,
          className: 'fiLink-refresh-index',
          canDisabled: true,
          permissionCode: '25-2-3',
          needConfirm: false,
          handle: (event) => {
            this.updateProjectStatus([event.pointId]);
          }
        },
      ],
      // ??????
      handleSelect: (event: WisdomPointInfoModel[]) => {
        this.selectWisdomData = event;
      },
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      // ????????????
      handleSearch: (e: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = e;
        this.refreshData();
      },
      // ??????
      handleExport: (event: ListExportModel<any>) => {
        // ????????????????????????????????????
        const exportData = new ExportRequestModel(event.columnInfoList, event.excelType);
        const translationField = ['pointStatus'];
        // ???????????????????????????????????????????????????
        exportData.columnInfoList.forEach(item => {
          if (translationField.includes(item.propertyName)) {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        //  ?????????????????????
        if (event && !_.isEmpty(event.selectItem)) {
          const pointIds = event.selectItem.map(item => item.pointId);
          exportData.queryCondition.filterConditions = exportData.queryCondition.filterConditions.concat([new FilterCondition('pointId', OperatorEnum.in, pointIds)]);
        } else {
          exportData.queryCondition.filterConditions = event.queryTerm;
        }
        // ????????????
        this.$planProjectApiService.exportProjectPoleList(exportData).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(`${this.language.exportProjectWisdom}`);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * ??????????????????
   * @param data ????????????
   */
  private updateProjectStatus(data: string[]): void {
    if (_.isEmpty(data)) {
      return;
    }
    // ??????????????????????????????
    this.$modalService.confirm({
      nzTitle: this.language.ifUpdateStatus,
      nzContent: this.language.confirmPointStatusInfo,
      nzOkType: 'danger',
      nzOkText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.$planProjectApiService.updateProjectStatus(data).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.language. updateSuccess);
            this.refreshData();
            this.queryProjectPoleStatistics();
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }

  /**
   *  ???????????????????????????????????????
   * @param id ???????????????id
   */
  private checkPointCanUpdate(id: string): void {
    this.$planProjectApiService.checkPointCanUpdate([id]).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success && result.data) {
        this.$router.navigate(['business/project-manage/project-wisdom-detail/update'],
          {queryParams: {id: id}}).then();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ???????????????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$planProjectApiService.queryProjectPoleByPage(this.queryCondition).subscribe((res: ResultModel<WisdomPointInfoModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.dataSet.forEach(item => {
          // ???????????????????????????????????????
          item.statusIconClass = PointStatusIconEnum[item.pointStatus];
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
   * ?????????????????????
   */
  private queryProjectPoleStatistics(): void {
    this.$planProjectApiService.queryProjectPoleStatistics().subscribe((result: ResultModel<ProjectWisdomStatisticsModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.sliderConfig.forEach(item => {
          item.sum = 0;
          const temp = result.data.find(_item => _item.pointStatus === item.code);
          if (temp) {
            item.sum = temp.pointCount;
          }
        });
        // ?????????????????????
        this.sliderConfig[0].sum = _.sumBy(result.data, 'pointCount') || 0;
      }
    });
  }
}
