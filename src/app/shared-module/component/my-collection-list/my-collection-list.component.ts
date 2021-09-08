import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {PageModel} from '../../model/page.model';
import {NzI18nService} from 'ng-zorro-antd';
import {EquipmentListModel, FacilityListModel} from '../../../business-module/index/shared/model/facility-equipment-config.model';
import {TableConfigModel} from '../../model/table-config.model';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {FilterCondition, QueryConditionModel} from '../../model/query-condition.model';
import {ResultModel} from '../../model/result.model';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {ResultCodeEnum} from '../../enum/result-code.enum';
import {PositionService} from '../../../business-module/index/service/position.service';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {MapCoverageService} from '../../service/index/map-coverage.service';
import {OperatorEnum} from '../../enum/operator.enum';
import {CollectionService} from '../../service/index/collection.service';
import {DeviceStatusEnum, DeviceTypeEnum, FacilityListTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../util/common-util';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../core-module/enum/equipment/equipment.enum';
import {LanguageEnum} from '../../enum/language.enum';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {IndexFacilityService} from '../../../core-module/api-service/index/facility';
import {indexCoverageType} from '../../../core-module/const/index/index.const';
import {SessionUtil} from '../../util/session-util';

@Component({
  selector: 'app-my-collection-list',
  templateUrl: './my-collection-list.component.html',
  styleUrls: ['./my-collection-list.component.scss']
})
export class MyCollectionListComponent implements OnInit, AfterViewInit {
  // 聚合类型
  @Input() polymerizationChange: string;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 设施设备列表枚举
  public facilityEquipmentList = FacilityListTypeEnum;
  // 是否展开
  public isExpandFacilityList: boolean;
  // 默认点击的tab页
  public defaultHandleTab: boolean;
  // 默认显示的table表格
  public defaultShowTable: boolean;
  // 设施列表数据集
  public facilityListDataSet: FacilityListModel[] = [];
  // 设施列表表格分页
  public facilityListPageBean: PageModel = new PageModel(5, 1, 0);
  // 设施列表表格配置
  public facilityListTableConfig: TableConfigModel;
  // 设备列表数据集
  public equipmentListDataSet: EquipmentListModel[] = [];
  // 设备列表分页
  public equipmentListPageBean: PageModel = new PageModel(5, 1, 0);
  // 设备列表表格配置
  public equipmentListTableConfig: TableConfigModel;
  // 区域缓存数据
  public areaStoreData;
  // 设施缓存数据
  public facilityStoreData;
  // 设备缓存数据
  public equipmentStoreData;
  // 分组缓存数据
  private groupStoreData;
  // 设施或设备
  public facilityOrEquipment: string = FacilityListTypeEnum.facilitiesList;
  // 设施查询条件
  public facilityQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 设备查询条件
  public equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  public equipmentType;
  // 我的关注权限
  public myCollectionOperating: boolean = false;
  // 设施状态
  public deviceStatusList;
  // 设备状态列表
  public equipmentStatusList;
  // 设施列表租户权限
  public deviceListTenantRole = SessionUtil.checkHasTenantRole('1-1-2-1');
  // 设备列表租户权限
  public equipmentListTenantRole = SessionUtil.checkHasTenantRole('1-1-2-2');

  constructor(public $nzI18n: NzI18nService,
              public $indexFacilityService: IndexFacilityService,
              public $mapStoreService: MapStoreService,
              public $positionService: PositionService,
              public $message: FiLinkModalService,
              public $mapCoverageService: MapCoverageService,
              public $collectionService: CollectionService) {
    this.indexLanguage = $nzI18n.getLocaleData(LanguageEnum.index);
    this.equipmentType = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
  }

  public ngOnInit(): void {
    this.isExpandFacilityList = true;
    this.defaultHandleTab = true;
    this.defaultShowTable = true;
    // 获取权限
    // 批量操作权限 （菜单操作权限和租户设置权限）
    if (this.deviceListTenantRole || this.equipmentListTenantRole) {
      this.myCollectionOperating = true;
    }
    if ((!this.deviceListTenantRole && this.equipmentListTenantRole) || this.polymerizationChange === '2') {
      this.defaultShowTable = false;
    }
    // 获取缓存筛选条件
    this.areaStoreData = this.$mapStoreService.areaSelectedResults || [];
    this.facilityStoreData = this.$mapStoreService.facilityTypeSelectedResults;
    this.equipmentStoreData = this.$mapStoreService.equipmentTypeSelectedResults;
    this.groupStoreData = this.$mapStoreService.logicGroupList;
    this.deviceStatusList = CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, null);
    this.equipmentStatusList = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, LanguageEnum.facility);
    this.equipmentStatusList = this.equipmentStatusList.filter(item => item.code !== EquipmentStatusEnum.dismantled);

    // 初始化设施表格配置
    this.initFacilityListTable();
    // 初始设备化表格配置
    this.initEquipmentListTable();
    // 详情卡点击关注或取消关注，我的关注列表刷新数据
    this.$collectionService.eventEmit.subscribe((value) => {
      if (value.type === indexCoverageType.facility) {
        this.getFacilityListTable();
      } else {
        this.getEquipmentListTable();
      }
    });
  }

  public ngAfterViewInit(): void {
    this.getFacilityListTable();
    this.getEquipmentListTable();
  }

  /**
   * 切换tab页
   */
  public tabClick(tabNum: string): void {
    if (tabNum === FacilityListTypeEnum.facilitiesList) {
      this.defaultShowTable = true;
      this.defaultHandleTab = true;
    }
    if (tabNum === FacilityListTypeEnum.equipmentList) {
      this.defaultShowTable = false;
      this.defaultHandleTab = false;
    }
    this.facilityOrEquipment = tabNum;
  }

  /**
   * 设施工单表格分页
   */
  public pageFacilityList(event: PageModel): void {
    this.facilityQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.facilityQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getFacilityListTable();
  }

  /**
   * 设备表格分页
   */
  public pageEquipmentList(event: PageModel) {
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getEquipmentListTable();
  }

  /**
   * 常量转换对象
   *  object
   *  {Array<{value: string; label: string}>}
   */
  public constConvertObject(object) {
    const tempOption: Array<{ value: string, label: string }> = [];
    for (const item in object) {
      if (item) {
        tempOption.push({value: item, label: object[item]});
      }
    }
    return tempOption;
  }

  /**
   * 字符串转换
   * param {string} str
   * returns {any}
   */
  public fontConvent(str: string) {
    const temp = str.split('clone')[1];
    return temp.substr(0, 1).toLowerCase() + temp.substr(1, temp.length);
  }

  public showSearch(): void {
    if (this.facilityOrEquipment === FacilityListTypeEnum.facilitiesList) {
      this.facilityListTableConfig.showSearch = !this.facilityListTableConfig.showSearch;
    } else {
      this.equipmentListTableConfig.showSearch = !this.equipmentListTableConfig.showSearch;
    }
  }

  /**
   * 设施表格配置
   */
  public initFacilityListTable(): void {
    this.facilityListTableConfig = {
      isDraggable: true,
      isLoading: false,
      notShowPrint: true,
      simplePageTotalShow: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '600px', y: '600px'},
      noIndex: true,
      showSearch: false,
      showPagination: true,
      simplePage: true,
      bordered: false,
      columnConfig: [
        {
          title: this.indexLanguage.deviceName, key: 'deviceName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
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
        {
          title: this.indexLanguage.address, key: 'address', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.facilityStatusTitle, key: 'deviceStatus', width: 130,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceStatus',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceStatusList,
            label: 'label', value: 'code'
          },
        },
        {// 操作
          title: this.indexLanguage.operation, key: '', width: 80,
          configurable: false,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      operation: [
        {
          // 定位
          text: this.indexLanguage.location,
          permissionCode: '',
          className: 'fiLink-location',
          handle: (currentIndex) => {
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
        {
          // 取消关注
          text: this.indexLanguage.unsubscribe,
          permissionCode: '',
          needConfirm: true,
          confirmContent: this.indexLanguage.areYouSureToUnFollow,
          className: 'fiLink-collected red-icon',
          handle: (currentIndex) => {
            const data = {
              deviceId: currentIndex.deviceId
            };
            this.$indexFacilityService.deviceDelCollectingById(data).subscribe((result: ResultModel<any>) => {
              if (result.code === ResultCodeEnum.success) {
                this.$message.success(this.indexLanguage.unfollowSuccessfully);
                // 发射事件，刷新详情卡关注
                this.$collectionService.eventEmit.emit({typeChange: true});
                this.getFacilityListTable();
              }
            });
          }
        },
      ],
      sort: (event) => {
        // 排序
        this.facilityQueryCondition.sortCondition.sortField = event.sortField;
        this.facilityQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getFacilityListTable();
      },
      handleSearch: (event) => {
        this.facilityQueryCondition.filterConditions = [];
        // 条件筛选
        for (const item in event) {
          if (event[item]) {
            // 设施类型、设施状态使用下拉查询
            if (['deviceType', 'deviceStatus'].includes(item) && event[item].length > 0) {
              this.facilityQueryCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, event[item]));
            } else if (['deviceName', 'address'].includes(item)) {
              // 设施名称、详细地址使用模糊查询
              this.facilityQueryCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            }
          }
        }
        this.facilityQueryCondition.pageCondition.pageNum = 1;
        this.getFacilityListTable();
      }
    };
  }


  /**
   * 设施表格数据加载
   */
  public getFacilityListTable(): void {
    this.facilityQueryCondition.bizCondition = {
      'area': this.areaStoreData ? this.areaStoreData : [],
      'device': this.facilityStoreData ? this.facilityStoreData : [],
      'group': this.groupStoreData ? this.groupStoreData : [],
    };
    this.facilityQueryCondition.pageCondition.pageSize = 5;
    this.$indexFacilityService.queryCollectingDeviceList(this.facilityQueryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.facilityListPageBean.Total = result.totalCount;
        this.facilityListPageBean.pageIndex = result.pageNum;
        this.facilityListPageBean.pageSize = result.size;
        this.facilityListDataSet = result.data;
        result.data.forEach(item => {
          item['facilityType'] = 'device';
          item['show'] = true;
          item['cloneDeviceType'] = item.deviceType;
          item['cloneDeviceStatus'] = item.deviceStatus;
          item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.deviceType, 'facility.config');
          item.deviceStatus = CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, item.deviceStatus, 'facility.config');
        });
      }
    });
  }

  /**
   * 设备表格配置
   */
  public initEquipmentListTable(): void {
    this.equipmentListTableConfig = {
      isDraggable: true,
      isLoading: false,
      notShowPrint: true,
      simplePageTotalShow: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '600px', y: '600px'},
      noIndex: true,
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      columnConfig: [
        {
          title: this.indexLanguage.equipmentName, key: 'equipmentName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.affiliatedFacilities, key: 'deviceName', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.indexLanguage.equipmentTypeTitle, key: 'equipmentType', width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.equipmentType,
            label: 'label',
            value: 'code'
          },
        },
        {
          title: this.indexLanguage.equipmentStatus, key: 'equipmentStatus', width: 130,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentStatus',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            // selectInfo: this.selectEquipmentStatusOption
            selectInfo: this.equipmentStatusList,
            label: 'label', value: 'code'
          },
        },
        {
          title: this.indexLanguage.address, key: 'address', width: 100,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: this.indexLanguage.operation, key: '', width: 80,
          configurable: false,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      operation: [
        {
          // 定位
          text: this.indexLanguage.location,
          permissionCode: '',
          className: 'fiLink-location',
          handle: (currentIndex) => {
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
        },
        {
          // 取消关注
          text: this.indexLanguage.unsubscribe,
          permissionCode: '',
          needConfirm: true,
          confirmContent: this.indexLanguage.areYouSureToUnFollow,
          className: 'fiLink-collected red-icon',
          handle: (currentIndex) => {
            const data = {
              equipmentId: currentIndex.equipmentId
            };
            this.$indexFacilityService.equipmentDelCollectingById(data).subscribe((result: ResultModel<any>) => {
              if (result.code === ResultCodeEnum.success) {
                this.$message.success(this.indexLanguage.unfollowSuccessfully);
                // 发射事件，刷新详情卡关注
                this.$collectionService.eventEmit.emit({typeChange: true});
                this.getEquipmentListTable();
              }
            });
          }
        },
      ],
      sort: (event) => {
        // 排序
        this.equipmentQueryCondition.sortCondition.sortField = event.sortField;
        this.equipmentQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getEquipmentListTable();
      },
      handleSearch: (event) => {
        this.equipmentQueryCondition.filterConditions = [];
        // 条件筛选
        for (const item in event) {
          if (event[item]) {
            // 设备类型使用下拉查询
            if (['equipmentType', 'equipmentStatus'].includes(item) && event[item].length > 0) {
              this.equipmentQueryCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, event[item]));
            } else if (['equipmentName', 'deviceName', 'address'].includes(item)) {
              // 设备名称、详细地址使用模糊查询
              this.equipmentQueryCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            }
          }
        }
        this.equipmentQueryCondition.pageCondition.pageNum = 1;
        this.getEquipmentListTable();
      }
    };

  }

  /**
   * 设备表格数据加载
   */
  public getEquipmentListTable(): void {
    this.equipmentQueryCondition.bizCondition = {
      'area': this.areaStoreData ? this.areaStoreData : [],
      'equipment': this.equipmentStoreData ? this.equipmentStoreData : [],
      'group': this.groupStoreData ? this.groupStoreData : [],
    };
    this.equipmentQueryCondition.pageCondition.pageSize = 5;
    this.$indexFacilityService.queryCollectingEquipmentList(this.equipmentQueryCondition).subscribe((result: ResultModel<EquipmentListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentListPageBean.Total = result.totalCount;
        this.equipmentListPageBean.pageIndex = result.pageNum;
        this.equipmentListPageBean.pageSize = result.size;
        this.equipmentListDataSet = result.data;
        result.data.forEach(item => {
          item['facilityType'] = 'equipment';
          item['show'] = true;
          item['cloneEquipmentType'] = item.equipmentType;
          item['cloneEquipmentStatus'] = item.equipmentStatus;
          item.equipmentType = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.equipmentType, LanguageEnum.facility);
          item.equipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, item.equipmentStatus, LanguageEnum.facility);
        });
      }
    });
  }
}
