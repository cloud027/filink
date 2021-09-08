import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexApiService} from '../../../business-module/index/service/index/index-api.service';
import {MapCoverageService} from '../../service/index/map-coverage.service';
import {OperationService} from '../../service/index/operation.service';
import {
  GetListDeviceTypeModel,
} from '../../../business-module/index/shared/model/map-bubble.model';
import {MapControl} from '../../../business-module/index/util/map-control';
import {ZoomSliderService} from '../../service/map-service/b-map/zoom-slider.service';
import {QueryConditionModel} from '../../model/query-condition.model';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../util/common-util';
import {FacilityShowService} from '../../service/index/facility-show.service';
import {PositionFacilityShowService} from '../../../business-module/index/service/position-facility-show.service';
import {BusinessFacilityService} from '../../service/business-facility/business-facility.service';
import {CloseShowFacilityService} from '../../service/index/close-show-facility.service';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {EquipmentTypeEnum} from '../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {LanguageEnum} from '../../enum/language.enum';
import {indexCoverageType} from '../../../core-module/const/index/index.const';
import {TroubleUtil} from '../../../core-module/business-util/trouble/trouble-util';
import {takeUntil} from 'rxjs/operators';
import {SelectPolymerizationService} from '../../service/index/selectPolymerizationService';
import {Subject} from 'rxjs';
import {ViewEnum} from '../../../core-module/enum/index/index.enum';
import {MapTypeEnum} from '../../enum/filinkMap.enum';

/**
 * 设施展示
 */
@Component({
  selector: 'app-facility-show',
  templateUrl: './facility-show.component.html',
  styleUrls: ['./facility-show.component.scss']
})
export class FacilityShowComponent extends MapControl implements OnInit, AfterViewInit {
  // 向父组件发射显示分层事件
  @Output() isShowCardEventEmitter = new EventEmitter<boolean>();
  // 地图标识
  @Input() otherMapFlag: boolean = false;
  // 是否是资产模块的分组管理（分组地图中设施/设备类型过滤电子锁）
  @Input() isGroupManage: boolean = false;
  // 视图类型
  @Input() viewIndex: string;
  // 设施/设备图层
  @Input() indexType: string;
  // 视图枚举
  public maintenanceView = ViewEnum;
  // 设施设备层枚举
  public mapTypeEnum = MapTypeEnum;

  // 设施设备卡是否显示
  public isShowFacilityEquipmentCard = false;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 显示设施选项
  public facilityRadioGroup: boolean = true;
  // 设备单选按钮值
  public equipmentRadioValue: string;
  // 设施类型出参数据模型
  // public deviceTypeList: MapDeviceTypeModel[] = [];
  public deviceTypeList = [];
  // 设备类型出参数据模型
  // public equipmentTypeList: MapEquipmentTypeModel[] = [];
  public equipmentTypeList = [];
  // 工具类
  public commonUtil = CommonUtil;
  // 设施类型枚举
  public indexFacilityTypeEnum = DeviceTypeEnum;
  // 设施类型枚举
  public indexEquipmentTypeEnum = EquipmentTypeEnum;
  // 其他页面跳转数据
  public equipmentLocationRadioValue;
  // 其他页面跳转传值
  public otherType;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 订阅流关闭
  private destroy$ = new Subject<void>();
  // 根据聚合方式控制设备图层显示
  public equipmentShow = true;
  public isEnglish: boolean = false;

  constructor(public $nzI18n: NzI18nService,
              private el: ElementRef,
              private $zoomSliderService: ZoomSliderService,
              private $mapCoverageService: MapCoverageService,
              private $indexApiService: IndexApiService,
              private $mapStoreService: MapStoreService,
              private $message: FiLinkModalService,
              private $OperationService: OperationService,
              private $facilityShowService: FacilityShowService,
              private $businessFacilityService: BusinessFacilityService,
              private $positionFacilityShowService: PositionFacilityShowService,
              private $closeShowFacilityService: CloseShowFacilityService,
              private $selectPolymerizationService: SelectPolymerizationService, ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    // 获取设施类型数据
    this.getDeviceDataList();
    // 获取设备类型数据
    this.getEquipmentDataList();
    this.$OperationService.eventEmit.subscribe((value) => {
      if (value.facility === false) {
        this.isShowFacilityEquipmentCard = value.facility;
      }
    });
    this.$businessFacilityService.eventEmit.subscribe(value => {
      if (value && value.type && value.type === 'facility') {
        if (value.data && value.data.length) {
          this.deviceTypeList = [];
          value.data.forEach(item => {
            item.isModel = item.checked || false;
            this.deviceTypeList.push({isModel: item.isModel, code: item.deviceType});
          });
        }
      } else {
        if (value && value.data && value.data.length) {
          if (value.data.some(item => item.checked)) {
            this.equipmentRadioValue = value.data
              .filter(item => item.checked)[0]
              .equipmentType;
            this.$mapStoreService.showEquipmentTypeSelectedResults = [this.equipmentRadioValue];
          }
        }
      }
    });
    this.$selectPolymerizationService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && value.polymerizationValue === 'project') {
        this.equipmentShow = false;
      } else {
        this.equipmentShow = true;
      }
    });
    if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
      // 如果是英文环境
      this.isEnglish = true;
    }
  }

  public ngAfterViewInit(): void {
    this.$positionFacilityShowService.eventEmit.subscribe((value) => {
      if (value.type === 'facility') {
        this.showFacilityCard(true, true);
      } else {
        this.showFacilityCard(false, true);
        this.equipmentLocationRadioValue = value.equipmentType;
        this.equipmentCheckChange(value.equipmentType);
        this.equipmentRadioValue = value.equipmentType;
        this.otherType = value.equipmentType;
      }
    });
    this.$closeShowFacilityService.eventEmit.subscribe((value) => {
      this.isShowFacilityEquipmentCard = false;
    });
  }

  /**
   * 获取设施类型数据
   */
  private getDeviceDataList(): void {
    const body = new GetListDeviceTypeModel();
    body.areaCodeList = [];
    const deviceData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 设施类型排序重组
    this.deviceTypeList = FacilityForCommonUtil.deviceSort(deviceData);
    // 所有电子锁相关的设施类型
    const filterDeviceType = TroubleUtil.filterDeviceType();
    // 设施权限过滤电子锁的相关类型
    if (this.isGroupManage) {
      this.deviceTypeList = this.deviceTypeList.filter(item => {
        return filterDeviceType.includes(item.code as string);
      });
    }
    // 初始化祥地图发射设施类型数据
    this.$mapStoreService.showFacilityTypeSelectedResults = this.deviceTypeList.map(item => {
      return item.code;
    });
    this.$facilityShowService.subject.next({
      deviceType: this.deviceTypeList.map(item => {
        return item.code;
      })
    });
  }

  /**
   * 获取设备类型数据
   */
  private getEquipmentDataList(): void {
    const body = new GetListDeviceTypeModel();
    body.areaCodeList = [];
    if (this.equipmentLocationRadioValue) {
      return;
    }
    let equipmentData = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    // 资产模块过滤电子锁设备
    if (this.isGroupManage) {
      equipmentData = equipmentData.filter(item => item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    }
    // 设备类型排序重组
    this.equipmentTypeList = FacilityForCommonUtil.equipmentSort(equipmentData);
    // 设备默认勾选第一个
    if (this.otherType) {
      this.equipmentRadioValue = this.otherType;
    } else {
      this.equipmentRadioValue = this.equipmentTypeList.length ? this.equipmentTypeList[0].code : [];
    }
    this.$mapStoreService.showEquipmentTypeSelectedResults = [this.equipmentRadioValue];
    this.$facilityShowService.subject.next({equipmentType: this.equipmentRadioValue});
  }

  /**
   * 展示设施设备选择卡
   */
  public showFacilityAndEquipmentCard(): void {
    // 读取缓存
    const storeDeviceType = this.$mapStoreService.showFacilityTypeSelectedResults;
    const storeEquipmentType = this.$mapStoreService.showEquipmentTypeSelectedResults;
    if (storeEquipmentType && storeEquipmentType[0] !== indexCoverageType.noData) {
      this.equipmentRadioValue = storeEquipmentType[0];
    }
    // 缓存数据不为空，勾选相应设施
    if (storeDeviceType && storeDeviceType.length && storeDeviceType[0] !== indexCoverageType.noData) {
      this.deviceTypeList.forEach(item => {
        item.isModel = false;
        storeDeviceType.forEach(_item => {
          if (item.code === _item) {
            item.isModel = true;
          }
        });
      });
      // 设施全部去选
    } else if (storeDeviceType && storeDeviceType[0] === indexCoverageType.noData) {
      this.deviceTypeList.forEach(item => {
        item.isModel = false;
      });
      // 没有缓存，全部勾选
    } else {
      this.deviceTypeList.forEach(item => {
        item.isModel = true;
      });
    }
    this.isShowFacilityEquipmentCard = !this.isShowFacilityEquipmentCard;
    this.isShowCardEventEmitter.emit(this.isShowFacilityEquipmentCard);
  }

  /**
   * 显示设施部分
   */
  public showFacilityCard(type: boolean, other: boolean): void {
    if (!other) {
      window.location.hash = 'business/index';
    }
    this.$mapCoverageService.showCoverage = type ? indexCoverageType.facility : indexCoverageType.equipment;
    // 向地图发射当前图层并刷新地图
    const mapType = type ? {mapShowType: indexCoverageType.facility} : {mapShowType: indexCoverageType.equipment};
    this.$facilityShowService.subject.next(mapType);
    this.facilityRadioGroup = type;
  }

  /**
   * 选中设备变化时的回调
   */
  public equipmentCheckChange(value: string) {
    // 向地图发射当前设备类型
    this.$mapStoreService.showEquipmentTypeSelectedResults = [value];
    this.$facilityShowService.subject.next({equipmentType: value});
  }

  /**
   * 选中设施变化时的回调
   */
  public facilityCheckChange(facilityList: string[]) {
    // 如果没有选中的设施类型，向地图组件传noData标识
    if (facilityList && !facilityList.length) {
      facilityList.push('noData');
    }
    // 向地图发射当前设施类型
    this.$mapStoreService.showFacilityTypeSelectedResults = facilityList;
    this.$facilityShowService.subject.next({deviceType: facilityList});
  }

  /**
   * 获取设施Icon样式
   */
  public getFacilityIconStyle(type: string) {
    return CommonUtil.getFacilityIConClass(type);
  }

  /**
   * 获取设备Icon样式
   */
  public getEquipmentIconStyle(type?: string) {
    if (type === 'E005') {
      return 'iconfont facility-icon fiLink-camera-statistics all-facility-color';
    } else {
      return CommonUtil.getEquipmentIconClassName(type);
    }
  }
}
