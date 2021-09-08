import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {LanguageEnum} from '../../../../enum/language.enum';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {DeviceStatusEnum, DeviceTypeEnum, FacilityListTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {EquipmentListModel, FacilityListModel} from '../../../../../business-module/index/shared/model/facility-equipment-config.model';
import {PageModel} from '../../../../model/page.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {QueryConditionModel} from '../../../../model/query-condition.model';
import {CommonUtil} from '../../../../util/common-util';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {MapStoreService} from '../../../../../core-module/store/map.store.service';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {PositionService} from '../../../../../business-module/application-system/share/service/position.service';
import {MyCollectionListComponent} from '../../../my-collection-list/my-collection-list.component';
import {MapCoverageService} from '../../../../service/index/map-coverage.service';
import {CollectionService} from '../../../../service/index/collection.service';
import {IndexFacilityService} from '../../../../../core-module/api-service/index/facility';
import {EquipmentStatusEnum} from '../../../../../core-module/enum/equipment/equipment.enum';

/**
 * 应用系统关注列表 设备/设施
 */
@Component({
  selector: 'my-attention',
  templateUrl: './my-attention.component.html',
  styleUrls: ['./my-attention.component.scss']
})
export class MyAttentionComponent extends MyCollectionListComponent implements OnInit, AfterViewInit {

  constructor(
    public $nzI18n: NzI18nService,
    public $indexFacilityService: IndexFacilityService,
    public $mapStoreService: MapStoreService,
    public $positionService: PositionService,
    public $message: FiLinkModalService,
    public $mapCoverageService: MapCoverageService,
    public $collectionService: CollectionService,
  ) {
    super($nzI18n, $indexFacilityService, $mapStoreService, $positionService,  $message, $mapCoverageService, $collectionService);
  }
  // 设备/设施
  @Input() facilityOrEquipment: string;
  // 我的关注列表设备类型
  @Input()equipmentTypeArr: string[];
  // 设施设备列表枚举
  public facilityListTypeEnum = FacilityListTypeEnum;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 设施列表数据集
  public facilityListDataSet: FacilityListModel[] = [];
  // 设施列表表格分页
  public facilityListPageBean: PageModel = new PageModel(5, 1, 0);
  // 设施列表表格配置
  public facilityListTableConfig: TableConfigModel;
  // 设施查询条件
  public facilityQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 设备列表数据集
  public equipmentListDataSet: EquipmentListModel[] = [];
  // 设备列表分页
  public equipmentListPageBean: PageModel = new PageModel(5, 1, 0);
  // 设备列表表格配置
  public equipmentListTableConfig: TableConfigModel;
  // 设备查询条件
  public equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  ngOnInit() {
    this.deviceStatusList = CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, null);
    // 过滤掉已拆除
    // this.deviceStatusList = this.deviceStatusList.filter(item => item.code !== DeviceStatusEnum.dismantled);
    this.equipmentStatusList = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, LanguageEnum.facility);
    // 过滤已拆除设备状态
    this.equipmentStatusList = this.equipmentStatusList.filter(item => item.code !== EquipmentStatusEnum.dismantled);
    // 初始化我的关注列表
    this.initTable();
  }

  ngAfterViewInit(): void {
   if (this.facilityOrEquipment === FacilityListTypeEnum.equipmentList) {
     // 刷新我的关注设备列表
     this.getEquipmentListTable();
   } else {
     // 刷新我的关注设施列表
     this.getFacilityListTable();
   }
  }
  /**
   * 初始化列表
   */
  public initTable(): void {
    if (this.facilityOrEquipment === FacilityListTypeEnum.equipmentList) {
      this.equipmentStoreData = this.equipmentTypeArr;
      // 设备类型过滤
      this.equipmentType = this.equipmentType.filter(item => this.equipmentTypeArr.includes(item.code));
      // 初始设备化表格配置
      this.initEquipmentListTable();
    } else {
      // 初始化设施表格配置
      this.initFacilityListTable();
      // 重写定位方法
      this.facilityListTableConfig.operation[0].handle = (currentIndex) => {
        this.$positionService.eventEmit.emit(currentIndex);
      };
    }
  }
  /**
   * 设施表格数据加载
   */
  public getFacilityListTable(): void {
    this.facilityQueryCondition.bizCondition = {
      'area': this.areaStoreData ? this.areaStoreData : [],
      'device': this.facilityStoreData ? this.facilityStoreData : []
      // 'group': this.groupStoreData ? this.groupStoreData : [],
    };
    this.facilityQueryCondition.pageCondition.pageSize = 5;
    this.$indexFacilityService.queryCollectingDeviceList(this.facilityQueryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.facilityListPageBean.Total = result.totalCount;
        this.facilityListPageBean.pageSize = result.size;
        this.facilityListPageBean.pageIndex = result.pageNum;
        this.facilityListDataSet = result.data;
        result.data.forEach(item => {
          item['facilityType'] = 'device';
          item['cloneDeviceStatus'] = item.deviceStatus;
          item['show'] = true;
          item['cloneDeviceType'] = item.deviceType;
          item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.deviceType, LanguageEnum.index);
          item.deviceStatus = CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, item.deviceStatus, LanguageEnum.facility);
        });
      }
    });
  }
  /**
   * 我的关注列表筛选开启/关闭
   */
  public showFilter() {
    if (this.facilityOrEquipment === FacilityListTypeEnum.facilitiesList) {
      // 设施列表表格筛选开启/关闭
      this.facilityListTableConfig.showSearch = !this.facilityListTableConfig.showSearch;
    } else {
      // 设备列表表格筛选开启/关闭
      this.equipmentListTableConfig.showSearch = !this.equipmentListTableConfig.showSearch;
    }
  }

}
