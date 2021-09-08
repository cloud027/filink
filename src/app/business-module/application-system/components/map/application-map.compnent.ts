import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {Router} from '@angular/router';
import {FacilityService} from '../../../../core-module/api-service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {MapService} from '../../../../core-module/api-service';
import {SelectGroupService} from '../../../../shared-module/service/index/select-group.service';
import {AdjustCoordinatesService} from '../../../../shared-module/service/index/adjust-coordinates.service';
import {FacilityShowService} from '../../../../shared-module/service/index/facility-show.service';
import {OtherLocationService} from '../../../../shared-module/service/index/otherLocation.service';
import {CloseShowFacilityService} from '../../../../shared-module/service/index/close-show-facility.service';
import {MapLinePointUtil} from '../../../../shared-module/util/map-line-point-util';
import {MapGroupCommonComponent} from '../../../../shared-module/component/map/map-group-common.component';
import {SelectTableEquipmentChangeService} from '../../share/service/select-table-equipment-change.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {MapConfig as BMapConfig} from '../../../../shared-module/component/map/b-map.config';
import * as _ from 'lodash';
import {IndexApiService} from '../../../index/service/index/index-api.service';
import {SelectFacilityChangeService} from '../../share/service/select-facility-change.service';
import * as lodash from 'lodash';
import {ListTypeEnum} from '../../share/enum/list-type.enum';
import {takeUntil} from 'rxjs/operators';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

/**
 * 应用系统地图
 */
@Component({
  selector: 'app-application-map',
  templateUrl: '../../../../shared-module/component/map/map.component.html',
  styleUrls: ['../../../../shared-module/component/map/map.component.scss']
})
export class ApplicationMapComponent extends MapGroupCommonComponent implements OnInit {
  // 当前列表类型, 设备列表/分组列表
  @Input() listType: ListTypeEnum;
  // 缓存的地图勾选的设备列表中的设备数据或单独选中的设备，需要高亮展示的设备
  public equipmentSelected;
  // 设备类型
  public equipmentTypes: string[] = [];
  constructor(public $nzI18n: NzI18nService,
              public $mapStoreService: MapStoreService,
              public $router: Router,
              public $facilityService: FacilityService,
              public $modalService: FiLinkModalService,
              public $mapCoverageService: MapCoverageService,
              public $indexMapService: MapService,
              public $selectGroupService: SelectGroupService,
              public $adjustCoordinatesService: AdjustCoordinatesService,
              public $facilityShowService: FacilityShowService,
              public $message: FiLinkModalService,
              public $otherLocationService: OtherLocationService,
              public $closeShowFacilityService: CloseShowFacilityService,
              public $mapLinePointUtil: MapLinePointUtil,
              public $indexApiService: IndexApiService,
              private $selectTableEquipmentChangeService: SelectTableEquipmentChangeService,
              // 地图框选设施监听服务
              private $selectFacilityChangeService: SelectFacilityChangeService,
  ) {
    super($nzI18n, $mapStoreService, $router,
      $facilityService, $modalService, $mapCoverageService,
      $indexMapService, $selectGroupService, $adjustCoordinatesService, $facilityShowService, $message, $otherLocationService, $closeShowFacilityService, $mapLinePointUtil, $indexApiService);
  }

  /**
   * 平移防抖
   */
  dragEnd = lodash.debounce(() => {
    this.locationType = false;
    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      // 获取窗口内的区域下设施设备点数据
      this.showProgressBar.emit();
      this.getWindowAreaDatalist().then( (resolve: any[]) => {
        if (this.facilityInGroup && this.listType === ListTypeEnum.groupList) {
          // 重新渲染勾选分组中的设备
          this.selectedFacility(this.facilityInGroup);
        }
        if (this.equipmentSelected && this.listType === ListTypeEnum.equipmentList) {
          // 重新渲染勾选设备
          this.highLightEquipments(this.equipmentSelected, resolve);
        }
      });
      this.hideProgressBar.emit();
      this.locationId = null;
    }
  }, 100, {leading: false, trailing: true});
  public ngOnInit(): void {
    // 初始化国际化
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 语言类型
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    // 告警权限查询
    this.roleAlarm = SessionUtil.checkHasRole('02');
    this.searchTypeName = this.indexLanguage.equipmentName;
    this.mapTypeId = 'roadmap';
    this.title = this.indexLanguage.chooseFibre;
    this.indexType = this.$mapCoverageService.showCoverage;
    // 创建设施点事件
    this.initFn();
    // 创建区域点事件
    this.initAreaPoint();
    // 创建绘画工具类
    this.changChooseUtil();
    // 创建坐标调整绘画工具类
    this.adjustCoordinatesUtil();
    // 监听地图下列表勾选数据变化
    this.$selectTableEquipmentChangeService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.type === 'equipment') {
        // 重置选中状态
        if (_.isEmpty(value.equipmentData)) {
          if (value.isFromTable === false) {
            return;
          }
          //  无选中数据清除地图上的点
          this.resetAllTargetMarker();
          //  无选中数据
          return;
        }
        this.targetMarkerArr = [];
        // 勾选设备列表联动地图
        this.locationByIdFromTable(value.equipmentData);
        this.equipmentSelected = _.cloneDeep(value.equipmentData);
      }
    });
    // 判断设备类型
    if (this.$router.url.indexOf('lighting') > -1) {
      this.equipmentTypes = [EquipmentTypeEnum.singleLightController, EquipmentTypeEnum.centralController];
    } else if (this.$router.url.indexOf('release') > -1) {
      this.equipmentTypes = [EquipmentTypeEnum.informationScreen];
    } else if (this.$router.url.indexOf('security') > -1) {
      this.equipmentTypes = [EquipmentTypeEnum.camera];
    }
  }

  /**
   * 从列表勾选数据定位设备
   */
  public locationByIdFromTable(data) {
    // 多个设备勾选以第一个设备所在位置为定位中心
    const locationTarget = data[0];
    // 存储当前定位中心设施/设备ID
    this.locationId = locationTarget.equipmentId;
    // 当前为定位缩放
    this.locationType = true;
    // 清除地图数据
    if (this.mapService.mapInstance) {
      this.mapService.mapInstance.clearOverlays();
    }
    if (this.mapService.markerClusterer) {
      this.mapService.markerClusterer.clearMarkers();
    }
    const position = locationTarget.positionBase.split(',');
    const item = {lng: parseFloat(position[0]), lat: parseFloat(position[1])};
    if (this.mapService.mapInstance) {
      this.mapService.setCenterAndZoom(item['lng'], item['lat'], BMapConfig.maxZoom);
    }

    this.getWindowAreaDatalist().then((resolve: any[]) => {
      this.highLightEquipments(data, resolve);
    });
  }

  /**
   * 高亮地图上设备
   * @param data 高亮设备数据
   * @param resolve 当前视图下地图所有设备数据
   */
  public highLightEquipments (data, resolve: any[]) {
    data.forEach(dataItem => {
      if (resolve.length) {
        let equipmentId;
        resolve.forEach(resItem => {
          resItem.equipmentList.forEach(_item => {
            if (_item.equipmentId === dataItem.equipmentId) {
              equipmentId = resItem.equipmentList[0].equipmentId;
            }
          });
        });
        // 多重设备选中高亮
        if (equipmentId) {
          this.selectMarkerId(equipmentId);
        }
      }
    });
  }
  /**
   * 重写选中2个以上的设备
   * param id
   * param data
   */
  multipleClick(id, data) {
    if (data.facilityType === this.mapTypeEnum.equipment && data.equipmentList.length > 1) {
      if (data.equipmentList && data.equipmentList.length > 0) {
        this.$selectFacilityChangeService.eventEmit.emit({equipmentIds: data.equipmentList.map(item => item.equipmentId)});
      }
      this.equipmentTableWindow(id, data);
    }
  }
  public queryDeviceByName(value): void {
    if (!value || value === '') {
      return;
    }
    const body = {
      filterConditions: [
        {
          filterField: 'equipmentName',
          operator: 'like',
          filterValue: value
        },
        {
          filterField: 'equipmentType',
          operator: 'in',
          filterValue: this.equipmentTypeArr
        }
      ]
    };
    this.$indexMapService.queryEquipmentByName(body).subscribe((result: ResultModel<any>) => {
      result.data.forEach(item => {
        const devicePoint = item.positionBase.split(',');
        item['facilityName'] = item.equipmentName;
        item['facilityId'] = item.equipmentId;
        item['facilityType'] = 'equipment';
        item['lng'] = +devicePoint[0];
        item['lat'] = +devicePoint[1];
        item['equipmentList'] = [];
        item['type'] = 'device';
        item['code'] = null;
        item['show'] = true;
      });
      this.options = result.data;
    });
  }
}
