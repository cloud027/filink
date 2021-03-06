import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import * as lodash from 'lodash';
import {IndexApiService} from '../../service/index/index-api.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {EquipmentListModel, FacilityListModel} from '../../shared/model/facility-equipment-config.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultCodeEnum} from 'src/app/shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {PositionService} from '../../service/position.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {EquipmentListResultModel} from '../../shared/model/facilities-card.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {FacilityListTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {EquipmentModel} from '../../../../core-module/model/equipment/equipment.model';
import {PointStatusEnum} from '../../../../core-module/enum/plan/point-status.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';


@Component({
  selector: 'app-planning-liat-left-card',
  templateUrl: './planning-liat-left-card.component.html',
  styleUrls: ['./planning-liat-left-card.component.scss']
})
export class PlanningLiatLeftCardComponent implements OnInit, OnChanges {
  // ????????????
  @Input() viewIndex: string;
  // ???????????????????????????
  @Input() facilityData: string[] = [];
  // ???????????????????????????
  @Input() equipmentData: string[] = [];
  // ???????????????????????????
  @Input() areaData: string[] = [];
  // ???????????????????????????
  @Input() planningData: string[] = [];
  // ????????????????????????????????????
  @Input() smartPoleModelData: string[] = [];
  // ?????????????????????????????????
  @Input() constructionStatusData: string[] = [];
  // ???????????????????????????
  @Input() groupData: string[] = [];
  // ????????????????????????????????????
  @Input() isShowPlanningOrProject: boolean;
  // ???????????????????????????
  @Output() FacilityEquipmentListEvent = new EventEmitter<any>();
  // ????????????
  @ViewChild('facilityListTable') facilityListTable: TableComponent;
  // ????????????
  @ViewChild('equipmentListTable') equipmentListTable: TableComponent;
  // ???????????????
  @ViewChild('pointStatusTemp') pointStatusTemp: TemplateRef<HTMLDocument>;
  // ?????????
  public indexLanguage: IndexLanguageInterface;
  // ????????????????????????
  public facilityEquipmentList = FacilityListTypeEnum;
  // ?????????????????????
  public planningListDataSet: FacilityListModel[] = [];
  // ????????????????????????
  public planningListPageBean: PageModel = new PageModel(5, 1, 0);
  // ????????????????????????
  public planningListTableConfig: TableConfigModel;
  // ?????????????????????
  public projectListDataSet: EquipmentListModel[] = [];
  // ??????????????????
  public projectListPageBean: PageModel = new PageModel(5, 1, 0);
  // ????????????????????????
  public projectListTableConfig: TableConfigModel;
  // ??????????????????????????????
  public buttonDisabled: boolean = true;
  // ??????????????????
  public roleDeviceOperating: boolean = false;
  // ?????????????????????????????????
  public deviceIsEquipmentTypes: string[];
  // ????????????????????????
  public equipmentTypes: string[];
  // ??????
  private more: string;
  // ??????????????????
  private planningQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  private projectQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  private facilitySelectData: string[] = [];
  // ????????????????????????
  private equipmentSelectData: string[] = [];
  public statusObj = {};
  // ????????????
  public pointStatusEnum = PointStatusEnum;
  // ????????????????????????
  public planningQueryData = [];
  // ????????????????????????
  public projectQueryData = [];
  /**
   * ??????????????????
   */
  queryProjectList = lodash.debounce((value) => {
    this.getProjectListTable();
  }, 200, {leading: false, trailing: true});

  /**
   * ??????????????????
   */
  queryPlanningList = lodash.debounce((value) => {
    this.getPlanningListTable();
  }, 200, {leading: false, trailing: true});

  constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $indexApiService: IndexApiService,
    private $positionService: PositionService,
    private $message: FiLinkModalService,
    private $mapCoverageService: MapCoverageService,
    private $mapStoreService: MapStoreService) {
    this.indexLanguage = $nzI18n.getLocaleData(LanguageEnum.index);
  }

  public ngOnInit(): void {
    this.more = this.indexLanguage.more;
    // ????????????????????????
    this.initPlanningListTable();
    this.planningListTableConfig.isLoading = false;
    // ????????????????????????
    this.initProjectListTable();
    this.projectListTableConfig.isLoading = false;
    // ?????????????????? ?????????????????????????????????????????????
    if (SessionUtil.checkHasRole('05-1') &&
      (SessionUtil.checkHasTenantRole('1-1-6') || SessionUtil.checkHasTenantRole('1-1-7'))) {
      this.roleDeviceOperating = true;
    }
    this.statusObj = {
      running: this.indexLanguage.underConstruction,
      end: this.indexLanguage.hasBeenBuilt,
      runnable: this.indexLanguage.toBeBuilt,
    };
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // ????????????????????????
    this.planningQueryData = [
      {
        filterField: 'planId',
        operator: 'in',
        filterValue: this.planningData
      },
      {
        filterField: 'pointModel',
        operator: 'in',
        filterValue: this.smartPoleModelData
      },
      {
        filterField: 'pointStatus',
        operator: 'in',
        filterValue: this.constructionStatusData
      },
    ];
    // ????????????????????????
    this.projectQueryData = [
      {
        filterField: 'projectId',
        operator: 'in',
        filterValue: this.planningData
      },
      {
        filterField: 'pointModel',
        operator: 'in',
        filterValue: this.smartPoleModelData[0] ? this.smartPoleModelData[0] : []
      },
      {
        filterField: 'supplierId',
        operator: 'in',
        filterValue: this.smartPoleModelData[1] ? this.smartPoleModelData[1] : []
      },
      {
        filterField: 'pointStatus',
        operator: 'in',
        filterValue: this.constructionStatusData
      },
    ];
    if (this.viewIndex === 'planView') {
      this.initPlanningListTable();
      // ???????????????????????????????????????
      this.planningQueryCondition = new QueryConditionModel();
      this.planningQueryCondition.pageCondition.pageNum = 1;
      if (this.planningListTableConfig) {
        if (this.planningData) {
          this.planningQueryCondition.filterConditions = this.planningQueryData;
          this.queryPlanningList();
        }
      }
    }
    if (this.viewIndex === 'projectView') {
      this.initProjectListTable();
      // ???????????????????????????????????????
      this.projectQueryCondition = new QueryConditionModel();
      this.projectQueryCondition.pageCondition.pageNum = 1;
      if (this.projectListTableConfig) {
        if (this.areaData) {
          this.projectQueryCondition.filterConditions = this.projectQueryData;
          this.projectQueryCondition.bizCondition = {
            modelSupplier : this.$mapStoreService.projectModelData ? this.$mapStoreService.projectModelData : []
          };
          this.queryProjectList();
        }
      }
    }
    if (changes.planningData && !changes.planningData.firstChange) {
      if (this.viewIndex === 'planView') {
        if (this.planningData) {
          this.planningQueryCondition.filterConditions = this.planningQueryData;
          this.queryPlanningList();
        }
      } else {
        if (this.areaData) {
          this.projectQueryCondition.filterConditions = this.projectQueryData;
          this.projectQueryCondition.bizCondition = {
            modelSupplier : this.$mapStoreService.projectModelData ? this.$mapStoreService.projectModelData : []
          };
          this.queryProjectList();
        }
      }
    }
  }

  /**
   * ??????????????????
   */
  public pagePlanningList(event: PageModel): void {
    this.planningQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.planningQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getPlanningListTable();
  }

  /**
   * ??????????????????
   */
  public pageProjectList(event: PageModel): void {
    this.projectQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.projectQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getProjectListTable();
  }

  /**
   * ???????????????
   */
  public goToFacilityList(): void {
    if (this.isShowPlanningOrProject === true) {
      // ????????????
      this.$router.navigate([`/business/plan-project/plan-wisdom-list`], {}).then();
    } else {
      // ????????????
      this.$router.navigate([`/business/project-manage/project-wisdom-list`], {}).then();
    }
  }

  /**
   * ??????????????????
   */
  public showSearch(): void {
    if (this.viewIndex === 'planView') {
      this.planningListTableConfig.showSearch = !this.planningListTableConfig.showSearch;
    } else {
      this.projectListTableConfig.showSearch = !this.projectListTableConfig.showSearch;
    }
  }

  /**
   * ??????????????????
   */
  private initPlanningListTable(): void {
    if (!_.isEmpty(this.facilitySelectData)) {
      this.facilityListTable.checkAll(false);
    }
    this.planningListTableConfig = {
      isDraggable: true,
      isLoading: true,
      simplePageTotalShow: true,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      keepSelected: true,
      selectedIdKey: 'deviceId',
      searchReturnType: 'object',
      scroll: {x: '600px', y: '600px'},
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      noIndex: true,
      columnConfig: [
        // {
        //   type: 'select',
        //   fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        //   width: 50,
        // },
        {// ????????????
          title: this.indexLanguage.name, key: 'pointName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ???????????????
          title: this.indexLanguage.smartPoleModel, key: 'pointModel', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.viewPlan, key: 'planName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.constructionStatus, key: 'pointStatus', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(PointStatusEnum, this.$nzI18n, null, LanguageEnum.planProject) as SelectModel[],
            label: 'label',
            value: 'code'
          }
        },
        {// ??????
          title: this.indexLanguage.operation, key: '', width: 80,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      operation: [
        {
          // ??????
          text: this.indexLanguage.location,
          className: 'fiLink-location',
          handle: (currentIndex: FacilityListModel) => {
            this.$positionService.eventEmit.emit(currentIndex);
          }
        },
      ],
      sort: (event: SortCondition) => {
        // ??????
        this.planningQueryCondition.sortCondition.sortField = event.sortField;
        this.planningQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getPlanningListTable();
      },
      handleSearch: (event) => {
        const filterConditions = CommonUtil.deepClone(this.planningQueryData);
        for (const item in event) {
          if (event[item]) {
            if (['pointName', 'pointModel', 'planName'].includes(item)) {
              // ????????????????????????????????????????????????like??????
              filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            } else {
              let found = false;
              for (let i = 0; i < event.pointStatus.length; i++) {
                if (this.constructionStatusData.indexOf(event.pointStatus[i]) > -1) {
                  found = true;
                  break;
                }
              }
              if ((found || this.constructionStatusData === []) && this.constructionStatusData !== ['noData']) {
                filterConditions.forEach(_item => {
                  if (_item.filterField === 'pointStatus') {
                    _item.filterValue = event.pointStatus;
                  }
                });
              }
            }
          }
        }
        this.planningQueryCondition.filterConditions = filterConditions;
        this.planningQueryCondition.pageCondition.pageNum = 1;
        this.getPlanningListTable();
      },
      handleSelect: (event: FacilityListModel[]) => {
      }
    };
  }

  /**
   * ????????????????????????
   */
  private getPlanningListTable(): void {
    if (this.planningData) {
      this.planningQueryCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
      this.planningListTableConfig.isLoading = true;
      this.$indexApiService.getPlanPoleList(this.planningQueryCondition).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.planningListPageBean.Total = result.data.totalCount;
          this.planningListPageBean.pageIndex = result.data.pageNum;
          this.planningListPageBean.pageSize = result.data.size;
          result.data.data = result.data.data || [];
          result.data.data.forEach(item => {
            item.pointStatus = this.statusObj[item.pointStatus];
          });
          this.planningListDataSet = result.data.data;
        } else {
          this.$message.error(result.msg);
        }
        this.planningListTableConfig.isLoading = false;
      }, error => {
        this.planningListTableConfig.isLoading = false;
      });
    }
  }

  /**
   * ??????????????????
   */
  private initProjectListTable(): void {
    if (!_.isEmpty(this.equipmentSelectData)) {
      this.equipmentListTable.checkAll(false);
    }
    this.projectListTableConfig = {
      isDraggable: true,
      isLoading: false,
      simplePageTotalShow: true,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      searchReturnType: 'object',
      scroll: {x: '600px', y: '600px'},
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      noIndex: true,
      columnConfig: [
        // {
        //   type: 'select',
        //   fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        //   width: 50,
        // },
        {// ????????????
          title: this.indexLanguage.pointName, key: 'pointName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ???????????????
          title: this.indexLanguage.smartPoleModel, key: 'pointModel', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.viewProject, key: 'projectName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.constructionStatus, key: 'pointStatus', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(PointStatusEnum, this.$nzI18n, null, LanguageEnum.planProject) as SelectModel[],
            label: 'label',
            value: 'code'
          }
        },
        {// ??????
          title: this.indexLanguage.operation, key: '', width: 80,
          configurable: false,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      operation: [
        {
          // ??????
          text: this.indexLanguage.location,
          className: 'fiLink-location',
          handle: (currentIndex: FacilityListModel) => {
            this.$positionService.eventEmit.emit(currentIndex);
          }
        },
      ],
      sort: (event: SortCondition) => {
        // ??????
        this.projectQueryCondition.sortCondition.sortField = event.sortField;
        this.projectQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getProjectListTable();
      },
      handleSearch: (event) => {
        const filterConditions = CommonUtil.deepClone(this.projectQueryData);
        for (const item in event) {
          if (event[item]) {
            if (['pointName', 'pointModel', 'projectName'].includes(item)) {
              // ????????????????????????????????????????????????like??????
              filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            } else {
              let found = false;
              for (let i = 0; i < event.pointStatus.length; i++) {
                if (this.constructionStatusData.indexOf(event.pointStatus[i]) > -1) {
                  found = true;
                  break;
                }
              }
              if ((found || this.constructionStatusData === []) && this.constructionStatusData !== ['noData']) {
                filterConditions.forEach(_item => {
                  if (_item.filterField === 'pointStatus') {
                    _item.filterValue = event.pointStatus;
                  }
                });
              }
            }
          }
        }
        this.projectQueryCondition.filterConditions = filterConditions;
        this.projectQueryCondition.pageCondition.pageNum = 1;
        this.getProjectListTable();
      },
      handleSelect: (event: EquipmentListModel[]) => {
      }
    };
  }

  /**
   * ????????????????????????
   */
  private getProjectListTable(): void {
    if (this.smartPoleModelData && this.smartPoleModelData[0] === 'noData') {
      this.projectListDataSet = [];
      this.projectListPageBean.Total = 0;
      return;
    }
    if (!Array.isArray(this.smartPoleModelData[0])) {
      this.projectListDataSet = [];
      this.projectListPageBean.Total = 0;
      return;
    }
    if (this.areaData) {
      this.projectQueryCondition.pageCondition.pageSize = 5;
      this.projectListTableConfig.isLoading = true;
      this.$indexApiService.getProjectPoleList(this.projectQueryCondition).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.projectListPageBean.Total = result.data.totalCount;
          this.projectListPageBean.pageIndex = result.data.pageNum;
          this.projectListPageBean.pageSize = result.data.size;
          result.data.data = result.data.data || [];
          result.data.data.forEach(item => {
            item.pointStatus = this.statusObj[item.pointStatus];
          });
          this.projectListDataSet = result.data.data;
        } else {
          this.$message.error(result.msg);
        }
        this.projectListTableConfig.isLoading = false;
      }, error => {
        this.projectListTableConfig.isLoading = false;
      });
    }
  }

  /**
   * ????????????id??????????????????Id
   */
  private queryEquipmentAllId(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const body = new EquipmentListResultModel(this.facilitySelectData);
      this.$indexApiService.queryEquipmentListByDeviceId(body).subscribe((result: ResultModel<EquipmentModel[]>) => {
        const list = result.data.map(item => {
          return item.equipmentId;
        });
        this.deviceIsEquipmentTypes = result.data.map(item => {
          return item.equipmentType;
        });
        resolve(list);
      });
    });
  }
}
