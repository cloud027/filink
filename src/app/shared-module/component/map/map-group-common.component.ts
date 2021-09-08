import {MapComponent} from './map.component';
import {NzI18nService} from 'ng-zorro-antd';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {Router} from '@angular/router';
import {FacilityService} from '../../../core-module/api-service/facility/facility-manage';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {MapCoverageService} from '../../service/index/map-coverage.service';
import {MapService} from '../../../core-module/api-service/index/map';
import {SelectGroupService} from '../../service/index/select-group.service';
import {AdjustCoordinatesService} from '../../service/index/adjust-coordinates.service';
import {FacilityShowService} from '../../service/index/facility-show.service';
import {OtherLocationService} from '../../service/index/otherLocation.service';
import {CloseShowFacilityService} from '../../service/index/close-show-facility.service';
import {MapLinePointUtil} from '../../util/map-line-point-util';
import {CommonUtil} from '../../util/common-util';
import {bigIconSize} from '../../service/map-service/map.config';
import {MapConfig as BMapConfig} from './b-map.config';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import * as lodash from 'lodash';
import {Component, Input} from '@angular/core';
import {IndexApiService} from '../../../business-module/index/service/index/index-api.service';

/**
 * 应用系统和资产地图公用
 */
@Component({
  selector: 'app-map-group-common',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapGroupCommonComponent extends MapComponent {
  @Input() facilityInGroup;
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
              public $indexApiService: IndexApiService) {
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
      this.getWindowAreaDatalist().then( (resolve) => {
        this.selectedFacility(this.facilityInGroup);
      });
      this.hideProgressBar.emit();
      this.locationId = null;
    }
  }, 100, {leading: false, trailing: true});
  /** 我的
   * 设施选中
   */
  public selectMarkerId(id?: string): void {
    // 重置之前的样式
    if (!id) {
      this.resetAllTargetMarker();
    }
    // 拿到标记点
    const marker = this.mapService.getMarkerById(id);
    let imgUrl;
    // 地图缓存的数据
    const data = this.mapService.getMarkerDataById(id);
    if (!data) {
      return;
    }
    if (data.facilityType === this.mapTypeEnum.device) {
      // 获取设施图标
      imgUrl = CommonUtil.getFacilityIconUrl(bigIconSize, data.deviceType);
    } else if (data.facilityType === this.mapTypeEnum.equipment) {
      // 获取设备图标
      // 如果为设备传送设备型号
      imgUrl = CommonUtil.getEquipmentTypeIconUrl(bigIconSize, data.equipmentType, '0', data.equipmentList);
    }
    // 切换大图标
    const _icon = this.mapService.toggleBigIcon(imgUrl);
    marker.setIcon(_icon);
    // 选中图标置顶
    marker.setTop(true);
    // 为图标样式重置保存上一次数据
    // this.targetMarker = marker;
    this.targetMarkerArr.push(marker);
  }
  /**   我的
   * 定位通过ids
   * @param data 需要高亮的点
   * @param facilityListInWindow 当前窗口设备设施数据
   * */
  public locationByIds(data, facilityListInWindow?): void {
    // 清除地图数据
    if (this.mapService.mapInstance) {
      this.mapService.mapInstance.clearOverlays();
    }
    if (this.mapService.markerClusterer) {
      this.mapService.markerClusterer.clearMarkers();
    }
    const position = data.positionCenter.split(',');
    const positionItem = {lng: parseFloat(position[0]), lat: parseFloat(position[1])};
    this.mapService.setCenterAndZoom(positionItem['lng'], positionItem['lat'], BMapConfig.maxZoom);
    this.locationType = true;
    this.mapService.clearMarkerMap();
    if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
      this.deviceDataList = data || [];
      this.deviceDataList.deviceData = this.deviceDataList.polymerizationData;
      // 分割坐标点字符串
      this.deviceDataList.deviceData.forEach(item => {
        const devicePoint = item.positionBase.split(',');
        item['facilityId'] = item.deviceId;
        item['lng'] = +devicePoint[0];
        item['lat'] = +devicePoint[1];
        item['cloneCode'] = item.code;
        item['code'] = null;
        item['equipmentList'] = [];
        item['facilityType'] = 'device';
        item['show'] = true;
        setTimeout(() => {
          this.selectMarkerId(item.deviceId);
        }, 0);
      });
      // 创建点
      this.addMarkers(this.deviceDataList.deviceData);
    } else {
      this.equipmentDataList = data || [];
      this.equipmentDataList.equipmentData.forEach((item, index) => {
        if (item.length > 1) {
          this.equipmentDataList.equipmentData[index] = FacilityForCommonUtil.equipmentStatusSort(item);
        }
      });
      this.equipmentDataList.equipmentData.forEach(item => {
        item.forEach((_item, index) => {
          const equipmentPoint = _item.positionBase.split(',');
          _item['facilityId'] = _item.equipmentId;
          _item['lng'] = +equipmentPoint[0];
          _item['lat'] = +equipmentPoint[1];
          _item['cloneCode'] = item.areaCode;
          _item['code'] = null;
          _item['equipmentList'] = item;
          _item['facilityType'] = 'equipment';
          if (index === 0) {
            _item['show'] = true;
          } else {
            _item['show'] = false;
          }
          facilityListInWindow.forEach(windowItem => {
            let equipmentId;
            windowItem.equipmentList.forEach(_windowItem => {
              if (_windowItem.equipmentId === _item.equipmentId) {
               equipmentId = windowItem.equipmentId;
              }
            });
            if (equipmentId) {
              setTimeout(() => {
                this.selectMarkerId(equipmentId);
              }, 0);
            }
          });
        });

      });
      // 把二维数组转化为一维数组
      lodash.flattenDeep(this.equipmentDataList.equipmentData).forEach(item => {
        this.$mapStoreService.mapEquipmentList.push(item);
      });
      let equipmentData = this.$mapStoreService.mapEquipmentList;
      equipmentData = lodash.uniqBy(equipmentData, 'equipmentId');
      // 创建点
      this.addMarkers(equipmentData);
    }
  }

  /**
   * 高亮地图设备设施
   * @param data 设备设施数据
   */
  public selectedFacility(data): void {
    // 控制放大地图重置地图上的设施或设备的样式
    if (!data) {
      this.getWindowAreaDatalist().then((resolve: any[]) => {});
      this.resetAllTargetMarker();
      return;
    }
    // 清除地图数据
    if (this.mapService.mapInstance) {
      this.mapService.mapInstance.clearOverlays();
    }
    if (this.mapService.markerClusterer) {
      this.mapService.markerClusterer.clearMarkers();
    }
    if (data.positionCenter) {
      const position = data.positionCenter.split(',');
      const item = {lng: parseFloat(position[0]), lat: parseFloat(position[1])};
      this.mapService.setCenterAndZoom(item['lng'], item['lat'], BMapConfig.maxZoom);
    }
    this.locationType = true;
    this.getWindowAreaDatalist().then((resolve: any[]) => {
      data.polymerizationData.forEach(dataItem => {
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
        } else {
          // 选中高亮
          this.selectMarkerId(dataItem.deviceId);
        }
      });
    });
  }
}
