import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {IndexApiService} from '../../service/index/index-api.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {EquipmentListModel, FacilityListModel} from '../../shared/model/facility-equipment-config.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition
} from '../../../../shared-module/model/query-condition.model';
import {ResultCodeEnum} from 'src/app/shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {PositionService} from '../../service/position.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {EquipmentListResultModel} from '../../shared/model/facilities-card.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {
  DeviceStatusEnum,
  DeviceTypeEnum,
  FacilityListTypeEnum
} from '../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {EquipmentStatusEnum, EquipmentEnumStatus, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {EquipmentModel} from '../../../../core-module/model/equipment/equipment.model';

/**
 * ??????????????????
 */
@Component({
  selector: 'app-facility-equipment-list',
  templateUrl: './facility-equipment-list.component.html',
  styleUrls: ['./facility-equipment-list.component.scss']
})
export class FacilityEquipmentListComponent implements OnInit, OnChanges {
  // ????????????
  @Input() polymerizationChange: string = '1';
  // ???????????????????????????
  @Input() facilityData: string[] = [];
  // ???????????????????????????
  @Input() equipmentData: string[] = [];
  // ???????????????????????????
  @Input() areaData: string[] = [];
  // ???????????????????????????
  @Input() projectData: string[] = [];
  // ???????????????????????????
  @Input() groupData: string[] = [];
  // ???????????????????????????
  @Output() FacilityEquipmentListEvent = new EventEmitter<any>();
  // ????????????
  @ViewChild('facilityListTable') facilityListTable: TableComponent;
  // ????????????
  @ViewChild('equipmentListTable') equipmentListTable: TableComponent;
  // ?????????
  public indexLanguage: IndexLanguageInterface;
  // ????????????????????????
  public facilityEquipmentList = FacilityListTypeEnum;
  // ???????????????table??????
  public defaultShowTable: boolean;
  // ?????????????????????
  public facilityListDataSet: FacilityListModel[] = [];
  // ????????????????????????
  public facilityListPageBean: PageModel = new PageModel(5, 1, 0);
  // ????????????????????????
  public facilityListTableConfig: TableConfigModel;
  // ?????????????????????
  public equipmentListDataSet: EquipmentListModel[] = [];
  // ??????????????????
  public equipmentListPageBean: PageModel = new PageModel(5, 1, 0);
  // ????????????????????????
  public equipmentListTableConfig: TableConfigModel;
  // ??????????????????????????????
  public buttonDisabled: boolean = true;
  // ??????????????????
  public roleDeviceOperating: boolean = false;
  // ?????????????????????????????????
  public deviceIsEquipmentTypes: string[];
  // ????????????????????????
  public equipmentTypes: string[];
  // ?????????????????????
  public facilityOrEquipment: string = FacilityListTypeEnum.facilitiesList;
  // ??????
  private more: string;
  // ??????????????????
  private facilityQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  private equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  private facilitySelectData: string[] = [];
  // ????????????????????????
  private equipmentSelectData: string[] = [];

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
    // ??????????????????table
    this.defaultShowTable = true;
    this.more = this.indexLanguage.more;
    // ????????????????????????
    this.initFacilityListTable();
    this.facilityListTableConfig.isLoading = false;
    // ????????????????????????
    this.initEquipmentListTable();
    this.equipmentListTableConfig.isLoading = false;
    // ?????????????????? ?????????????????????????????????????????????
    if (SessionUtil.checkHasRole('05-1') &&
      (SessionUtil.checkHasTenantRole('1-1-1-6') || SessionUtil.checkHasTenantRole('1-1-1-7'))) {
      this.roleDeviceOperating = true;
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.facilityData && changes.facilityData.currentValue.length > 0 && this.facilityListTableConfig || (changes.groupData && changes.groupData.currentValue)) {
      // ???????????????????????????????????????
      this.facilityQueryCondition = new QueryConditionModel();
      this.facilityQueryCondition.pageCondition.pageNum = 1;
      if (this.facilityListTableConfig) {
        this.getFacilityListTable();
      }
      this.initFacilityListTable();
    }
    if (changes.equipmentData && changes.equipmentData.currentValue && this.equipmentListTableConfig || (changes.groupData && changes.groupData.currentValue)) {
      // ???????????????????????????????????????
      this.equipmentQueryCondition = new QueryConditionModel();
      this.equipmentQueryCondition.pageCondition.pageNum = 1;
      if (this.equipmentListTableConfig) {
        this.getEquipmentListTable();

      }
      this.initEquipmentListTable();
    }
    // ????????????????????????
    if ((changes.areaData && !changes.areaData.firstChange) || (changes.projectData && !changes.projectData.firstChange)) {
      this.getFacilityListTable();
      this.getEquipmentListTable();
    }
  }

  /**
   * ??????tab???
   */
  public tabClick(tabNum: string): void {
    if (tabNum === FacilityListTypeEnum.facilitiesList) {
      if (this.facilitySelectData.length) {
        this.buttonDisabled = false;
      } else {
        this.buttonDisabled = true;
      }
      this.defaultShowTable = true;
      this.getFacilityListTable();
    }
    if (tabNum === FacilityListTypeEnum.equipmentList) {
      if (this.equipmentSelectData.length) {
        this.buttonDisabled = false;
      } else {
        this.buttonDisabled = true;
      }
      this.defaultShowTable = false;
      this.getEquipmentListTable();
    }
    this.facilityOrEquipment = tabNum;
  }

  /**
   * ??????????????????
   */
  public pageFacilityList(event: PageModel): void {
    this.facilityQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.facilityQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getFacilityListTable();
  }

  /**
   * ??????????????????
   */
  public pageEquipmentList(event: PageModel): void {
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getEquipmentListTable();
  }

  /**
   * ???????????????
   */
  public goToFacilityList(): void {
    if (this.defaultShowTable === true) {
      // ????????????
      this.$router.navigate([`/business/facility/facility-list`], {}).then();
    } else {
      // ????????????
      this.$router.navigate([`/business/facility/equipment-list`], {}).then();
    }
  }

  /**
   * ??????????????????
   */
  public handleBatchOperation(): void {
    if (this.defaultShowTable) {
      // ???????????????????????????????????????
      if (this.facilitySelectData.length) {
        // ?????????????????????ID
        this.queryEquipmentAllId().then((data: string[]) => {
          if (data.length > 0) {
            this.FacilityEquipmentListEvent.emit({visible: true, data: data, type: this.deviceIsEquipmentTypes});
          } else {
            this.$message.info(this.indexLanguage.noEquipmentUnderCurrentFacility);
          }
        });
      } else {
        this.$message.info(this.indexLanguage.pleaseSelectFacility);
      }
    } else {
      // ???????????????????????????????????????
      if (this.equipmentSelectData.length) {
        // ??????
        this.FacilityEquipmentListEvent.emit({visible: true, data: this.equipmentSelectData, type: this.equipmentTypes});
      } else {
        this.$message.info(this.indexLanguage.pleaseSelectEquipment);
      }
    }
  }

  /**
   * ??????????????????
   */
  public showSearch(): void {
    if (this.facilityOrEquipment === FacilityListTypeEnum.facilitiesList) {
      this.facilityListTableConfig.showSearch = !this.facilityListTableConfig.showSearch;
    } else {
      this.equipmentListTableConfig.showSearch = !this.equipmentListTableConfig.showSearch;
    }
  }

  /**
   * ??????????????????
   */
  private initFacilityListTable(): void {
    if (!_.isEmpty(this.facilitySelectData)) {
      this.facilityListTable.checkAll(false);
    }
    this.facilityListTableConfig = {
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
        {
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 50,
        },
        {// ????????????
          title: this.indexLanguage.deviceName, key: 'deviceName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.facilityTypeTitle, key: 'deviceType', width: 130,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceType',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label',
            value: 'code'
          },
        },
        {// ????????????
          title: this.indexLanguage.address, key: 'address', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.facilityStatusTitle, key: 'deviceStatus', width: 130,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceStatus',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, null),
            label: 'label', value: 'code'
          },
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
            let by: boolean = false;
            if (this.$mapStoreService.showFacilityTypeSelectedResults && this.$mapStoreService.showFacilityTypeSelectedResults.length) {
              this.$mapStoreService.showFacilityTypeSelectedResults.forEach(item => {
                if (item === currentIndex.cloneDeviceType) {
                  by = true;
                }
              });
              if (this.$mapCoverageService.showCoverage === 'facility') {
                if (by) {
                  this.$positionService.eventEmit.emit(currentIndex);
                } else {
                  this.$message.warning(this.indexLanguage.theCurrentFacilityTypeDoesNotExistInTheMapType);
                }
              } else {
                this.$message.warning(this.indexLanguage.theCurrentLayerIsAEquipmentLayer);
              }
            }
          }
        },
      ],
      sort: (event: SortCondition) => {
        // ??????
        this.facilityQueryCondition.sortCondition.sortField = event.sortField;
        this.facilityQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getFacilityListTable();
      },
      handleSearch: (event: FilterCondition) => {
        // ??????
        this.facilityQueryCondition.filterConditions = [];
        for (const item in event) {
          if (event[item]) {
            if (['deviceType', 'deviceStatus'].includes(item) && event[item].length > 0) {
              // ?????????????????????????????????in??????
              this.facilityQueryCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, event[item]));
            } else if (['deviceName', 'address'].includes(item)) {
              // ???????????????????????????like??????
              this.facilityQueryCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            }
          }
        }
        this.facilityQueryCondition.pageCondition.pageNum = 1;
        this.getFacilityListTable();
      },
      handleSelect: (event: FacilityListModel[]) => {
        const arr = [DeviceTypeEnum.opticalBox, DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet, DeviceTypeEnum.distributionFrame, DeviceTypeEnum.junctionBox];
        const newArr = [];
        event.forEach(item => {
          if (arr.indexOf(<DeviceTypeEnum>item.cloneDeviceType) === -1) {
            newArr.push(item.deviceId);
          }
        });
        this.facilitySelectData = newArr;
        // ??????????????????????????????0????????????????????????????????????
        if (newArr.length) {
          this.buttonDisabled = false;
        } else {
          this.buttonDisabled = true;
        }
      }
    };
  }

  /**
   * ????????????????????????
   */
  private getFacilityListTable(): void {
    if (this.areaData || this.projectData) {
      if (this.areaData[0] === 'noData' && this.polymerizationChange === '1') {
        this.facilityListDataSet = [];
        this.facilityListPageBean.Total = 0;
        return;
      }
      this.facilityQueryCondition.bizCondition = {
        projectId: this.projectData ? this.projectData : [],
        area: this.areaData,
        device: this.facilityData,
        group: this.$mapStoreService.logicGroupList ? this.$mapStoreService.logicGroupList : this.groupData
      };
      if (this.polymerizationChange === '2') {
        this.facilityQueryCondition.bizCondition.polymerizationType = '2';
      } else {
        this.facilityQueryCondition.bizCondition.polymerizationType = '1';
      }
      this.facilityQueryCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
      this.facilityListTableConfig.isLoading = true;
      this.$indexApiService.queryDeviceList(this.facilityQueryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.facilityListPageBean.Total = result.totalCount;
          this.facilityListPageBean.pageIndex = result.pageNum;
          this.facilityListPageBean.pageSize = result.size;
          // ???????????????????????????????????????
          result.data.forEach(item => {
            this.facilitySelectData.forEach(_item => {
              if (item.deviceId === _item) {
                item.checked = true;
              }
            });
            item.facilityType = 'device';
            item.show = true;
            // ?????????????????????????????????????????????????????????????????????????????????????????????????????????
            item.cloneDeviceType = item.deviceType;
            item.cloneDeviceStatus = item.deviceStatus;
            item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.deviceType, 'facility.config');
            item.deviceStatus = CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, item.deviceStatus, 'facility.config');
          });
          this.facilityListDataSet = result.data;
        } else {
          this.$message.error(result.msg);
        }
        this.facilityListTableConfig.isLoading = false;
      }, error => {
        this.facilityListTableConfig.isLoading = false;
      });
    }
  }

  /**
   * ??????????????????
   */
  private initEquipmentListTable(): void {
    if (!_.isEmpty(this.equipmentSelectData)) {
      this.equipmentListTable.checkAll(false);
    }
    this.equipmentListTableConfig = {
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
        {
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 50,
        },
        {// ????????????
          title: this.indexLanguage.equipmentName, key: 'equipmentName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.affiliatedFacilities, key: 'deviceName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.equipmentTypeTitle, key: 'equipmentType', width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
          },
        },
        {// ????????????
          title: this.indexLanguage.address, key: 'address', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.indexLanguage.equipmentStatus, key: 'equipmentStatus', width: 130,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentStatus',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(EquipmentEnumStatus, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label', value: 'code'
          },
        },
        {// ??????
          title: this.indexLanguage.operation, key: '', width: 80,
          configurable: false,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      operation: [{
        // ??????
        text: this.indexLanguage.location,
        className: 'fiLink-location',
        handle: (currentIndex: EquipmentListModel) => {
          let by: boolean = false;
          if (this.$mapStoreService.showEquipmentTypeSelectedResults && this.$mapStoreService.showEquipmentTypeSelectedResults.length) {
            this.$mapStoreService.showEquipmentTypeSelectedResults.forEach(item => {
              if (item === currentIndex.cloneEquipmentType) {
                by = true;
              }
            });
            if (this.$mapCoverageService.showCoverage === 'equipment') {
              if (by) {
                this.$positionService.eventEmit.emit(currentIndex);
              } else {
                this.$message.warning(this.indexLanguage.theCurrentDeviceTypeDoesNotExistInTheMapSegmentType);
              }
            } else {
              this.$message.warning(this.indexLanguage.theCurrentLayerIsAFacilityLayer);
            }
          }
        }
      }],
      sort: (event: SortCondition) => {
        // ??????
        this.equipmentQueryCondition.sortCondition.sortField = event.sortField;
        this.equipmentQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getEquipmentListTable();
      },
      handleSearch: (event) => {
        // ??????
        this.equipmentQueryCondition.filterConditions = [];
        for (const item in event) {
          if (event[item]) {
            if (['equipmentType', 'equipmentStatus'].includes(item) && event[item].length > 0) {
              // ?????????????????????????????????in??????
              this.equipmentQueryCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, event[item]));
            } else if (['equipmentName', 'deviceName', 'address'].includes(item)) {
              // ????????????????????????????????????????????????like??????
              this.equipmentQueryCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            }
          }
        }
        this.equipmentQueryCondition.pageCondition.pageNum = 1;
        this.getEquipmentListTable();
      },
      handleSelect: (event: EquipmentListModel[]) => {
        const arr = ['E012'];
        const newArr = [];
        event.forEach(item => {
          if (arr.indexOf(item.cloneEquipmentType) === -1) {
            newArr.push(item.equipmentId);
          }
        });
        this.equipmentSelectData = newArr;
        this.equipmentTypes = event.map(item => {
          return item.cloneEquipmentType;
        });
        // ??????????????????????????????0????????????????????????????????????
        this.buttonDisabled = !newArr.length;
      }
    };
  }

  /**
   * ????????????????????????
   */
  private getEquipmentListTable(): void {
    if (this.areaData) {
      this.equipmentQueryCondition.bizCondition = {
        'projrctId': this.projectData ? this.projectData : [],
        'area': this.areaData,
        'equipment': this.equipmentData,
        'group': this.$mapStoreService.logicGroupList ? this.$mapStoreService.logicGroupList : this.groupData
      };
      this.equipmentQueryCondition.pageCondition.pageSize = 5;
      this.equipmentListTableConfig.isLoading = true;
      this.$indexApiService.queryEquipmentList(this.equipmentQueryCondition).subscribe((result: ResultModel<EquipmentListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.equipmentListPageBean.Total = result.totalCount;
          this.equipmentListPageBean.pageIndex = result.pageNum;
          this.equipmentListPageBean.pageSize = result.size;
          // ???????????????????????????????????????
          result.data.forEach(item => {
            this.equipmentSelectData.forEach(_item => {
              if (item.equipmentId === _item) {
                item.checked = true;
              }
            });
            item.cloneEquipmentType = item.equipmentType;
            item.facilityType = 'equipment';
            item.show = true;
            item.cloneEquipmentStatus = item.equipmentStatus;
            item.equipmentType = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.equipmentType, LanguageEnum.facility);
            item.equipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, item.equipmentStatus, LanguageEnum.facility);
          });
          this.equipmentListDataSet = result.data;
        } else {
          this.$message.error(result.msg);
        }
        this.equipmentListTableConfig.isLoading = false;
      }, error => {
        this.equipmentListTableConfig.isLoading = false;
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
