import {BMapPlusService} from '../../service/map-service/b-map/b-map-plus.service';
import {GMapPlusService} from '../../service/map-service/g-map/g-map-plus.service';
import {GMapDrawingService} from '../../service/map-service/g-map/g-map-drawing.service';
import {ResultCodeEnum} from '../../enum/result-code.enum';
import {MapConfig as BMapConfig} from '../map/b-map.config';
import * as lodash from 'lodash';
import {CommonUtil} from '../../util/common-util';
import {FilterCondition, QueryConditionModel} from '../../model/query-condition.model';
import {ResultModel} from '../../model/result.model';
import {OperatorEnum} from '../../enum/operator.enum';
import {MapServiceUtil} from '../../service/map-service/map-service.util';
import {MarkerInfoDataModel} from '../../model/marker-info-data.model';
import {ViewEnum} from '../../../core-module/enum/index/index.enum';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {PointStatusEnum} from '../../../core-module/enum/plan/point-status.enum';
import {PlanProjectForCommonService} from '../../../core-module/api-service/plan-project/plan-project-for-common.service';

export class PlanPointRender {
  // 地图服务类
  public mapService: BMapPlusService | GMapPlusService;
  // 地图绘制类
  public mapDrawUtil: GMapDrawingService;
  // 规划数据备份
  public planCloneData: any [];
  // 是否正处于创建中
  public isCreating: boolean = false;

  // 是否显示信息面板展示
  public isShowInfoWindow: boolean = false;
  // 信息面板left
  public infoWindowLeft;
  // 信息面板top
  public infoWindowTop;
  // 信息面板数据
  public infoData: any = {type: '', markerInfoData: new MarkerInfoDataModel(), collectionInfoData: []};
  // 规划查询条件
  public planQueryCondition = new QueryConditionModel();

  // 规划点位查询条件
  public planPointQueryCondition = new QueryConditionModel();
  // 高亮智慧杆点id
  public highlightedPointId: string = '';

  // 搜索后的选项
  public searchOptions: any[] = [];

  // 是否是搜索下拉框定位
  public searchLocation: boolean = false;
  /**
   * 缩放防抖
   */
  zoomEnd = lodash.debounce(() => {
    if (this.isCreating) {
      return;
    }
    if (!this.mapService) {
      return;
    }
    // 清除设施或设备以外所有的点
    if (this.mapService.markerClusterer) {
      if (this.mapService.mapInstance) {
        this.mapService.mapInstance.clearOverlays();
      }
      if (this.mapService.markerClusterer) {
        this.mapService.markerClusterer.clearMarkers();
      }
    }
    this.currentWindowPointData = [];
    this.hideWindow();
    // 缩放层级区级
    if (this.mapService.getZoom() <= BMapConfig.areaZoom) {
      if (this.planCloneData && this.planCloneData.length > 0) {
        this.renderPlan(this.planCloneData);
      }
    }
    // 缩放层级街道级别
    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      this.queryPlanPointData();
    }
  }, 100, {leading: false, trailing: true});
  // 当前窗口下的点
  public currentWindowPointData: any = [];
  dragEnd = lodash.debounce(() => {
  }, 100, {leading: false, trailing: true});

  constructor(public $planProjectForCommonService: PlanProjectForCommonService) {
  }

  /**
   * 地图搜索事件回调
   */
  public searchInputChange(value): void {
    // 调接口查询数据
    const queryCondition = new QueryConditionModel();
    queryCondition.filterConditions.push(new FilterCondition('pointName', OperatorEnum.like, value));
    this.$planProjectForCommonService.queryPoleByName(queryCondition).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.searchOptions = result.data || [];
      }
    });
  }

  /**
   * 地图搜索后选中智慧杆回调
   * param id
   */
  public searchSelectPoint(data): void {
    this.searchLocation = true;
    // @ts-ignore
    this.mapService.setCenterAndZoom(data['longitude'], data['latitude'], BMapConfig.deviceZoom);
    this.highlightedPointId = data.pointId;
    this.triggerZoomEnd(BMapConfig.deviceZoom);
  }

  /**
   * 查询规划数据
   */
  public queryPlanData(isNoRender: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$planProjectForCommonService.getPlanPolymerizationPoint(this.planQueryCondition).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.planCloneData = CommonUtil.deepClone(result.data.planData);
          if (!isNoRender) {
            if (this.mapService.getZoom() <= BMapConfig.areaZoom) {
              this.renderPlan(result.data.planData);
            }
          }
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  /**
   * 查询规划下点位数据
   */
  public queryPlanPointData(): Promise<any> {
    return new Promise((resolve, reject) => {
      const pointList = MapServiceUtil.getWindowIsArea(this.mapService.mapInstance);
      this.$planProjectForCommonService.getPlanNonPolymerizationPoint({
        queryCondition: this.planPointQueryCondition,
        pointList
      }).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success && result.data && result.data.planPoleData) {
          result.data.planPoleData.forEach(item => {
            item['facilityId'] = item.pointId;
            item['lng'] = item.longitude;
            item['lat'] = item.latitude;
            item['cloneCode'] = item.planId;
            item['code'] = null;
            item['show'] = true;
          });
          // 清除点
          if (this.mapService.mapInstance) {
            this.mapService.mapInstance.clearOverlays();
          }
          if (this.mapService.markerClusterer) {
            this.mapService.markerClusterer.clearMarkers();
          }
          this.renderPlanPoint(result.data.planPoleData);
          this.queryPlanData().then();
          resolve();
        } else {
          reject();
        }
      });

    });

  }

  /**
   * 渲染规划下的点
   */
  public renderPlanPoint(data): void {
    const arr = [];
    data.forEach(_item => {
      if (_item.show === true) {
        const marker = this.mapService.createMarker(_item, [{
          eventName: 'onmouseover',
          eventHandler: (event, m) => {
            const pointInfo = event.currentTarget.$detail;
            this.projectPlanDeviceWindow(pointInfo);
          }
        },
          {
            eventName: 'onmouseout',
            eventHandler: () => {
              this.hideWindow();
            }
          }], '24-32');
        if (this.highlightedPointId && _item.pointId === this.highlightedPointId) {
          const imgUrl = CommonUtil.getFacilityIconUrl('36-48', DeviceTypeEnum.wisdom);
          // @ts-ignore
          const icon = this.mapService.toggleIcon(imgUrl, '36-48');
          marker.setIcon(icon);
          this.highlightedPointId = null;
        }
        arr.push(marker);
      }
    });
    this.currentWindowPointData = arr;
    this.mapService.addMarkerClusterer(arr);
  }

  /**
   * 渲染规划点
   */
  public renderPlan(data): void {
    const arr = [];
    data.forEach(item => {
      item.lng = parseFloat(item.longitude);
      item.lat = parseFloat(item.latitude);
      // 过滤掉无坐标区域掉点
      if (item.lat && item.lng) {
        // @ts-ignore
        arr.push(this.mapService.createMarker(item, this.createEventFn(), '24-32', 'plan'));
      }
    });
    this.mapService.mapInstance.clearOverlays();
    this.mapService.addMarkerClusterer(arr);
  }

  /**
   * 添加地图事件
   */
  public addMapEvent(): void {
    const mapInstance = this.mapService.mapInstance;
    // 点击事件
    mapInstance.addEventListener('click', e => {
      const type = e.overlay ? e.overlay.toString() : '';
      if (type !== '[object Marker]') {
        console.log(type);
      }
    }, {passive: false, capture: true});
    mapInstance.addEventListener('zoomend', () => {
      this.zoomEnd();
    }, {passive: false, capture: true});
    mapInstance.addEventListener('dragend', () => {
      this.dragEnd();
    }, {passive: false, capture: true});
  }


  /**
   * 规划点事件回调
   */
  public createEventFn(): any[] {
    return [
      {
        eventName: 'onmouseover',
        eventHandler: (event, markers) => {
          const data = event.currentTarget.$detail;
          this.showInfoWindow('m', data.lng, data.lat);
          this.openWindow(ViewEnum.planView, event, null);
        }
      },
      {
        eventName: 'onmouseout',
        eventHandler: (event) => {
          this.hideWindow();
        }
      },
      {
        eventName: 'onclick',
        eventHandler: (event, markers) => {
          const planId = event.currentTarget.$detail.planId;
          const queryCondition = new QueryConditionModel();
          queryCondition.filterConditions = [new FilterCondition('planId', OperatorEnum.in, [planId])];
          this.$planProjectForCommonService.getPlanPolymerizationPointCenter(queryCondition).subscribe((result: ResultModel<any>) => {
            if (result.code === ResultCodeEnum.success && result.data) {
              // @ts-ignore
              this.mapService.setCenterAndZoom(parseFloat(result.data.longitude), parseFloat(result.data.latitude), BMapConfig.deviceZoom);
            }
          }, () => {
            // this.$message.warning(this.indexLanguage.networkTips);
          });
        }
      }
    ];
  }

  /**
   * 模拟title提示框  规划点/项目点
   * param e
   */
  public openWindow(type, e, m): void {
    const id = e.target.customData.code;
    const info = this.mapService.getMarkerDataById(id);
    const poleModelList = [];
    Object.getOwnPropertyNames(info.poleModelMap).forEach(function (key) {
      const obj = {
        model: key,
        modelCount: info.poleModelMap[key]
      };
      poleModelList.push(obj);
    });

    let name = '';
    if (type === ViewEnum.planView) {
      name = info.planName;
    }
    if (type === ViewEnum.projectView) {
      name = info.projectName;
    }
    this.infoData = {
      type: 'a',
      data: {
        name: name,
        count: info.count,
        poleModelMap: poleModelList,
        poleStatusMap: info.poleStatusMap
      }
    };
    this.showInfoWindow('a', info.lng, info.lat);
  }

  /**
   * 项目/规划设施点浮窗
   */
  public projectPlanDeviceWindow(info): void {
    // const name = info.planName ? info.planName : info.projectName;
    const name = info.planName;
    this.infoData = {
      type: 'p',
      data: {
        pointName: info.pointName,
        deviceStatusName: info.pointStatus,
        pointStatusColor: info.pointStatus === PointStatusEnum.toBeBuilt ? '#cccccc' : info.pointStatus === PointStatusEnum.underConstruction ? '#8ecaf7' : '#90e15b',
        pointStatus: info.pointStatus,
        pointModel: info.pointModel,
        projectPlanName: name,
        projectName: info.projectName,
        supplierName: info.supplierName,
      }
    };
    this.showInfoWindow('m', info.lng, info.lat);
  }

  /**
   * 控制层级触发缩放
   */
  public triggerZoomEnd(zoom = BMapConfig.defaultZoom) {
    if (this.mapService.getZoom() === zoom) {
      // 为了触发一次缩放事件，由于缩放事件有防抖处理，可以重复设置
      this.mapService.setZoom(zoom - 1);
      this.mapService.setZoom(zoom);
    } else {
      this.mapService.setZoom(zoom);
    }
  }

  /**
   * 隐藏弹框
   */
  public hideWindow() {
    this.isShowInfoWindow = false;
  }

  /**
   * 鼠标移入显示信息
   * param info   设施点信息
   * param type   类型  c：聚合点 m：marker点
   */
  private showInfoWindow(type, lng, lat) {
    const pixel = this.mapService.pointToOverlayPixel(lng, lat);
    const offset = this.mapService.getOffset();
    let _top = offset.offsetY + pixel.y;
    if (type === 'm') {
      const iconHeight = parseInt('10', 10);
      _top = _top - iconHeight + 16;
    }
    // 10 为左边padding
    this.infoWindowLeft = offset.offsetX + 10 + pixel.x + 'px';
    this.infoWindowTop = _top + 'px';
    this.isShowInfoWindow = true;
  }
}


