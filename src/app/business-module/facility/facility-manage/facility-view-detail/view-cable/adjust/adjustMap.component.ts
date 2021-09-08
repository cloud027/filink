import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityService} from '../../../../../../core-module/api-service/facility/facility-manage';
import {MapService} from '../../../../../../core-module/api-service/index/map';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {InspectionLanguageInterface} from '../../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {MapSelectorService} from '../../../../../../shared-module/component/map-selector/map-selector.service';
import {GMapSelectorService} from '../../../../../../shared-module/component/map-selector/g-map-selector.service';
import {Result} from '../../../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {iconSize} from '../../../../../../shared-module/component/map-selector/map.config';

declare const MAP_TYPE;
declare const BMap: any;
declare let google: any;

/**
 * 调整光缆段坐标组件
 */
@Component({
  selector: 'app-adjust-map',
  templateUrl: './adjust-map.component.html',
  styleUrls: ['./adjust-map.component.scss']
})
export class AdjustMapComponent implements OnInit, AfterViewInit {
  public mapInstance; // 实例化地图
  public polyline; // 连线实例化
  public modelWith = 1000; // 弹框宽度
  public language: FacilityLanguageInterface; // 国际化
  public InspectionLanguage: InspectionLanguageInterface; // 国际化
  public mapService: MapSelectorService | GMapSelectorService; // 地图服务
  public mapType: string = 'baidu'; // 判断地图类型
  @Input() public isVisible = false; // 模态框 关闭
  @Input() public mapData = []; // 模态框传入数据
  @Input() public id = ''; // 传入ID获取详情
  @Output() public close = new EventEmitter(); // 关闭事件
  public markMap = new Map(); // 百度地图数据
  public gMarkMap = new Map(); // 谷歌地图数据
  public marker; // 谷歌地图坐标点
  public gFun = []; // 坐标点存入数组
  public deviceMapData = []; // 存入设施点
  public dataId = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $facilityService: FacilityService,
    private $modalService: FiLinkModalService,
    public $mapService: MapService,
  ) {
  }

  public ngOnInit(): void {
    this.mapType = MAP_TYPE;
    this.InspectionLanguage = this.$nzI18n.getLocaleData('inspection');
    this.language = this.$nzI18n.getLocaleData('facility');
  }

  public ngAfterViewInit(): void {
    this.initMap();
    this.mapData = [];
    // 获取gis点
    this.$facilityService.findFindCable(this.id).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length > 0) {
          if (this.mapType === 'baidu') {
            // this.getGmap(result.data);
            this.getBMap(result.data);
          } else {
            this.getGmap(result.data);
          }
        } else {
          this.$modalService.warning(this.language.noDataAvailableForTheTimeBeing);
        }
      } else {
        this.$modalService.error(result.msg);
      }
    });

  }

  /**
   * 初始化地图
   */
  public initMap(): void  {
    // 实例化地图服务类
    if (this.mapType === 'baidu') {
      this.mapService = new MapSelectorService('map');
      this.mapService.setCenterPoint();
      this.mapInstance = this.mapService.mapInstance;
    } else {
      this.mapService = new GMapSelectorService('map', true);
      this.mapService.setCenterPoint();
      this.mapInstance = this.mapService.mapInstance;
      this.mapInstance.zoomControl = true;
      this.mapInstance.draggable = true;
      this.mapInstance.scrollwheel = true;
      this.mapInstance.scaleControl = true;
    }
  }

  /**
   *关闭模态框
   */
  public handleCancel(): void  {
    this.close.emit();
    if (this.mapType !== 'baidu') {
      if (this.polyline) {
        this.polyline.setMap(null);
      }
    }
  }

  /**
   *点击提交
   */
  public handleOk(): void  {
    const arr = [];
    if (this.mapType === 'baidu') {
      this.markMap.forEach((item, key) => {
        const obj = {opticStatusId: key, position: ''};
        obj.position = `${item.point.lng},${item.point.lat}`;
        arr.push(obj);
      });
    } else {
      this.gMarkMap.forEach((item, key) => {
        const obj = {opticStatusId: key, position: ''};
        obj.position = `${item.getPosition().lng()},${item.getPosition().lat()}`;
        arr.push(obj);
      });
    }
    this.$facilityService.updateCableQueryById(arr).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$modalService.success(result.msg);
        this.mapData = [];
        this.marker = null;
        this.markMap = new Map();
        this.gMarkMap = new Map();
        this.close.emit();
      } else {
        this.$modalService.error(result.msg);
      }
    });

  }

  /**
   * 百度地图连线方法
   */
  public addLine(): void  {
    if (this.polyline) {
      this.mapInstance.removeOverlay(this.polyline);
    }
    const arr = [];
    for (const [item] of this.markMap) {
      arr.push(item.point);
    }
    this.polyline = new BMap.Polyline(arr, {strokeColor: '#178aec', strokeWeight: 2, strokeOpacity: 1});   // 创建折线
    this.mapInstance.addOverlay(this.polyline);   // 增加折线
  }

  /**
   * 百度地图绘制
   */
  public getBMap(data): void  {
    data.map(item => {
      // 创建map设施点
      if (item.deviceId !== null) {
        const deviceObj = {lng: null, lat: null, id: '', type: ''};
        deviceObj.type = item.deviceType;
        deviceObj.lng = item.position.split(',')[0] * 1;
        deviceObj.id = item.deviceId;
        deviceObj.lat = item.position.split(',')[1] * 1;
        this.mapData.push(deviceObj);
        this.deviceMapData.push(deviceObj);
      }
      // 创建gis点连线
      if (item.opticStatusId !== null) {
        this.dataId.push(item.opticStatusId);
        const obj = {lng: null, lat: null, id: ''};
        obj.lat = item.position.split(',')[1] * 1;
        obj.lng = item.position.split(',')[0] * 1;
        obj.id = item.opticStatusId;
        this.mapData.push(obj);
      }
    });
    // 创建设施点
    this.deviceMapData.forEach(item => {
      const url = CommonUtil.getFacilityIconUrl(iconSize, item.type, '0');
      const icon = new BMap.Icon(url, new BMap.Size(20, 20));
      const point = new BMap.Point(item.lng * 1, item.lat * 1, item.id);
      this.marker = new BMap.Marker(point, {
        icon: icon
      }); // 创建标注
      this.mapInstance.addOverlay(this.marker);
      this.marker.setZIndex(888);
    });


    // 切换icon
    const myIcon = new BMap.Icon('../../../../../assets/img/facility/mapGis.jpg', new BMap.Size(10, 10));
    if (this.dataId.length > 0) {
      this.mapService.setCenterPoint(this.mapData[0].lat, this.mapData[0].lng, 13);
    } else {
      this.mapService.setCenterPoint(this.deviceMapData[0].lat, this.deviceMapData[0].lng, 13);
    }
    // mapData最后一个gis点
    const lastMapData = this.mapData.length - 1;
    for (let i = 0; i < this.mapData.length; i++) {
      const point = new BMap.Point(this.mapData[i].lng * 1, this.mapData[i].lat * 1, this.mapData[i].id);
      this.marker = new BMap.Marker(point, {
        icon: myIcon
      }); // 创建标注
      this.mapInstance.addOverlay(this.marker); // 将标注添加到地图中
      // 第一个gis点和最后一个gis点不可拖动
      if (i === 0 || i === lastMapData) {
        this.marker.disableDragging();
        this.marker.setZIndex(100);
      } else {
        this.marker.enableDragging();
        this.marker.setZIndex(999);
      }
      this.marker.addEventListener('dragstart', event => {
      });
      this.marker.addEventListener('dragging', event => {
        this.addLine();
      });
      this.marker.addEventListener('dragend', event => {
        this.addLine();
      });
      this.markMap.set(this.mapData[i].id, this.marker);
      this.addLine();
    }
  }

  /**
   * 谷歌地图绘制
   */
  public getGmap(data): void  {
    data.map(item => {
      // 创建map设施点
      if (item.deviceId !== null) {
        const deviceObj = {lng: null, lat: null, id: '', type: ''};
        deviceObj.lng = item.position.split(',')[0] * 1;
        deviceObj.lat = item.position.split(',')[1] * 1;
        deviceObj.id = item.deviceId;
        deviceObj.type = item.deviceType;
        this.mapData.push(deviceObj);
        this.deviceMapData.push(deviceObj);
      }
      this.dataId.push(item.opticStatusId);
      if (item.opticStatusId !== null) {
        const obj = {lng: null, lat: null, id: ''};
        obj.lng = item.position.split(',')[0] * 1;
        obj.lat = item.position.split(',')[1] * 1;
        obj.id = item.opticStatusId;
        this.mapData.push(obj);
      }
    });
    // 创建设施点
    this.deviceMapData.forEach(item => {
      if (this.dataId.length > 0) {
        this.mapService.setCenterPoint(this.mapData[0].lat, this.mapData[0].lng, 13);
      } else {
        this.mapService.setCenterPoint(this.deviceMapData[0].lat, this.deviceMapData[0].lng, 13);
      }
      const url = CommonUtil.getFacilityIconUrl(iconSize, item.type, '0');
      const icon = new google.maps.MarkerImage(url, new google.maps.Size(20, 20));
      this.marker = new google.maps.Marker({
        map: this.mapInstance,
        draggable: false,
        position: item,
        icon: icon
      });
      this.marker.setZIndex(888);
    });
    this.mapService.setCenterPoint(this.mapData[0].lat, this.mapData[0].lng, 12);
    const gmapIcon = new google.maps.MarkerImage('../../../../../assets/img/facility/mapGis.jpg', new google.maps.Size(10, 10));
    const lastMapData = this.mapData.length - 1;
    for (let i = 0; i < this.mapData.length; i++) {
      if (i === 0 || i === lastMapData) {
        this.marker = new google.maps.Marker({
          map: this.mapInstance,
          draggable: false,
          position: this.mapData[i],
          icon: gmapIcon
        });
      } else {
        this.marker = new google.maps.Marker({
          map: this.mapInstance,
          draggable: true,
          position: this.mapData[i],
          icon: gmapIcon
        });
      }
      this.marker.setZIndex(999);
      this.marker.addListener('dragstart', () => {
        // this.updateGmap();
      });
      this.marker.addListener('drag', () => {
        this.updateGmap();
      });
      this.marker.addListener('dragend', () => {
        this.updateGmap();
      });
      this.gFun.push(this.marker.getPosition());
      this.gMarkMap.set(this.mapData[i].id, this.marker);
    }
    this.updateGmap();
  }

  /**
   * 谷歌地图连线方法
   */
  public updateGmap(): void {
    if (this.polyline) {
      this.polyline.setMap(null);
    }
    const arr = [];
    this.gMarkMap.forEach((item, key) => {
      arr.push(item.getPosition());
    });
    this.polyline = new google.maps.Polyline({
      strokeColor: '#178aec',
      strokeWeight: 2,
      strokeOpacity: 1,
      geodesic: true,
      map: this.mapInstance,
    });

    this.polyline.setPath(arr);
  }
}
