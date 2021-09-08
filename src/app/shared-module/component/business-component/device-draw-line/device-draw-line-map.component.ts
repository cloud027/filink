import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {BMapPlusService} from '../../../service/map-service/b-map/b-map-plus.service';
import {BMapDrawingService} from '../../../service/map-service/b-map/b-map-drawing.service';
import {FilinkMapEnum} from '../../../enum/filinkMap.enum';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {GMapPlusService} from '../../../service/map-service/g-map/g-map-plus.service';
import {LoopLineModel} from '../../../../core-module/model/loop/LoopLine.model';
import {LanguageEnum} from '../../../enum/language.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

// 一定要声明BMap，要不然报错找不到BMap
declare let BMap: any;
declare let BMapLib: any;

@Component({
  selector: 'app-device-draw-map',
  templateUrl: './device-draw-line-map.component.html',
  styleUrls: ['./device-draw-line-map.component.scss']
})
export class DeviceDrawLineMapComponent implements OnInit, AfterViewInit {
  // 设施数据入参
  @Input() public devices: FacilityListModel[] = [];
  // 关联的线路
  @Input() public associatedLine: [];
  // 地图类型
  @Input() public mapType: FilinkMapEnum = FilinkMapEnum.baiDu;
  // 显示隐藏变化
  @Output() completeDraw = new EventEmitter<any>();
  // 地图实例
  public mapService: BMapPlusService | GMapPlusService;
  // 地图绘画工具
  public mapDrawUtil: any;
  // 设施点的时间
  public deviceEventFn: any;
  // 需要画线的数据
  public drawDeviceData: LoopLineModel[] = [];
  //  地图画线事件
  public lineEvent: any;
  // 展示删除按钮
  public showDelete: boolean = false;
  // 横向位置（删除按钮）
  public infoX: string = '0';
  // 偏移上距离（删除按钮）
  public infoY: string = '0';
  // 横向位置(具体信息)
  public infoTitleX: string = '0';
  // 偏移上距离（具体信息）
  public infoTitleY: string = '0';
  // 点击的当前折线
  public currentLine: any;
  // 记录点击的设施
  public clickDeviceData: LoopLineModel = new LoopLineModel();
  // 显示设施信息浮窗
  public showDeviceInfo: boolean = false;
  // 当前设施
  public currentDevice: FacilityListModel;
  // 国际化
  public language: CommonLanguageInterface;

  constructor(
    private $nzI18n: NzI18nService,
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化设施点的事件
    this.initDeviceEvent();
    // 初始化画线事件
    this.addListenerEventForLine();
  }

  /**
   * 试图渲染之后函数
   */
  public ngAfterViewInit(): void {
    // 初始化百度地图
    if (this.mapType === FilinkMapEnum.baiDu) {
      this.initBMap();
    }
    if (!_.isEmpty(this.associatedLine)) {
      this.drawDeviceData = this.associatedLine;
      this.redrawAlignment();
      this.computingEvents();
    }
  }

  public initBMap(): void {
    try {
      if (!BMap || !BMapLib) {
        // 百度地图资源未加载
        return;
      }
      this.mapService = new BMapPlusService();
      // 创建地图容器
      this.mapService.createPlusMap('mapContainer');
      this.mapService.addEventListenerToMap();
      // 添加地图相关事件
      this.addMapListenerEvent();
      /* this.mapService.mapInstance.setMapStyleV2({
         styleId: '44dc7b975692cc3a4c9d3e7330dd21cf'
       });*/
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
      // 在地图上面添加设施点
      this.devices.forEach(v => v['show'] = true);
      this.creatMarkers(this.devices);
      if (!_.isEmpty(this.devices)) {
        // 定位到中心点
        this.mapService.setCenterPoint(18);
      } else {
        // 默认定位到当前的地市
        this.mapService.locateToUserCity();
      }
    } catch (e) {
    }
  }

  /**
   * 创建设施点
   */
  public creatMarkers(data: FacilityListModel[]): void {
    // 先请除所有的marker
    this.mapService.markersMap.clear();
    // 创建设施点
    const arr = [];
    data.forEach(item => {
      if (item['show'] === true) {
        const point = item.positionBase.split(',');
        if (!_.isEmpty(point)) {
          item['lng'] = +point[0];
          item['lat'] = +point[1];
          const marker = this.mapService.createMarker(item, this.deviceEventFn, '18-24');
          marker['data'] = item;
          arr.push(marker);
        }
      }
    });
    this.mapService.addMarkerClusterer(arr);
  }

  /**
   *  初始化设施点的事件
   */
  public initDeviceEvent(): void {
    this.deviceEventFn = [
      { // 点击设施
        eventName: 'click',
        eventHandler: (event) => {
          this.handelClickDevice(event);
        }
      },
      { // 鼠标移入设施
        eventName: 'onmouseover',
        eventHandler: (event) => {
          // 显示设施信息浮窗
          this.openDeviceInfo(event);
        }
      },
      {// 鼠标移出设施
        eventName: 'onmouseout',
        eventHandler: () => {
          this.showDeviceInfo = false;
        }
      }
    ];
  }

  /**
   * 鼠标悬停设施事件
   */
  public openDeviceInfo(event): void {
    this.currentDevice = event.currentTarget.data;
    this.getLocation(event.point.lng, event.point.lat);
  }

  /**
   * 计算提示框的位置
   */
  public getLocation(lng: string, lat: string): void {
    const pixel = this.mapService.pointToOverlayPixel(lng, lat);
    const currentOffset = this.mapService.getOffset();
    const topPos = currentOffset.offsetY + pixel.y + 40;
    this.infoTitleX = currentOffset.offsetX + pixel.x + 20 + 'px';
    this.infoTitleY = topPos + 'px';
    this.showDeviceInfo = true;
  }

  /**
   * 点击设施点事件
   */
  public handelClickDevice(event): void {
    // 首先将点击的设施高亮处理
    const device = event.currentTarget.data;
    if (this.clickDeviceData.startNode) {
      this.clickDeviceData.endNode = device.deviceId;
    } else {
      this.clickDeviceData.startNode = device.deviceId;
    }
    if (this.clickDeviceData.startNode && this.clickDeviceData.endNode) {
      this.drawDeviceData.push(this.clickDeviceData);
      this.redrawAlignment();
      this.computingEvents();
    }
  }

  /**
   * 重新绘制线路
   */
  public redrawAlignment(): void {
    // 先清空线条然后重新循环绘制
    if (this.mapService) {
      this.mapService.mapInstance.removeOverlay();
    }
    // 调用画线的方法
    this.drawDeviceData.forEach(item => {
      this.drawLineByPoint(item.startNode, item.endNode);
    });
  }

  /**
   * 线路绘制完成 计算发送事件并是否可以点击保存
   */
  public computingEvents(): void {
    // 如果设施都有画线就抛出事件可以保存了
    const drawStartDeviceIds = this.drawDeviceData.map(item => item.startNode);
    const drawEndDeviceIds = this.drawDeviceData.map(item => item.endNode);
    // 将其实节点和结束节点的数据合并且去重
    const ids = _.uniq(_.union(drawStartDeviceIds, drawEndDeviceIds));
    const deviceIds = this.devices.map(item => item.deviceId);
    // 返回一个数组 起始点和结束点相同的去掉
    this.drawDeviceData = this.drawDeviceData.filter(item => item.startNode !== item.endNode);
    // 两个数组取交集，如果交集数据为空就抛出事件可以点击保存按钮
    if (_.isEmpty(_.pullAll(deviceIds, ids))) {
      // 抛出事件给用用组件的地方
      this.completeDraw.emit({saveBtn: true, lineData: this.drawDeviceData});
    } else {
      // 抛出事件给用用组件的地方
      this.completeDraw.emit({saveBtn: false, lineData: this.drawDeviceData});
    }
  }

  /**
   * 地图添加监听
   */
  public addMapListenerEvent(): void {
    this.mapService.mapEventHook().subscribe(data => {
      /**
      const type = data.type;
      // 标记点
      if (type === 'zoomend') {
      } else if (type === 'dragend') {
      } else if (type === 'click') {
      }
       */
    });
  }

  /**
   * 地图线条添加监听事件
   */
  public addListenerEventForLine(): void {
    this.lineEvent = [
      {
        eventName: 'click',
        eventHandler: (event) => {
          this.handelClickLine(event);
        }
      },
    ];
  }

  /**
   * 地图画线点击事件
   */
  public handelClickLine(event): void {
    this.showDelete = true;
    // 获取到点击坐标点
    const point = event.point;
    this.getDeleteBtnPosition(point.lng, point.lat);
    this.currentLine = event;
  }

  /**
   * 删除回路的线
   */
  public deleteLine(event): void {
    const allOverlay = this.mapService.mapInstance.getOverlays();
    const startPoint = event.currentTarget.startPoint;
    const endPoint = event.currentTarget.endPoint;
    // 过滤出要删除的折线
    const line = allOverlay.filter(item => item.startPoint && item.endPoint
      && startPoint.deviceId === item.startPoint.deviceId && endPoint.deviceId === item.endPoint.deviceId);
    if (!_.isEmpty(line)) {
      line.forEach(item => {
        item.remove();
      });
      this.showDelete = false;
      // 清除已经选择的设施点
      this.currentLine = null;
      this.clickDeviceData = new LoopLineModel();
      this.drawDeviceData = this.drawDeviceData.filter(item => `${item.startNode}${item.endNode}` !== `${startPoint.deviceId}${endPoint.deviceId}`);
      this.computingEvents();
    }
  }

  /**
   * 计算删除按钮的位置
   */
  public getDeleteBtnPosition(lng: string, lat: string): void {
    const pixel = this.mapService.pointToOverlayPixel(lng, lat);
    const currentOffset = this.mapService.getOffset();
    const topPos = currentOffset.offsetY + pixel.y + 110;
    this.infoX = currentOffset.offsetX + pixel.x + 40 + 'px';
    this.infoY = topPos + 'px';
    this.showDelete = true;
  }

  /**
   *  根据亮点的坐标进行画线处理
   */
  public drawLineByPoint(startNode: string, endNode: string): void {
    const startDevice = this.devices.find(item => item.deviceId === startNode);
    const endDevice = this.devices.find(item => item.deviceId === endNode);
    if (!startDevice || !endDevice) {
      return;
    }
    // 如果起点和终点有一个为空则无法画线
    const polyline = new BMap.Polyline([
      new BMap.Point(startDevice['lng'], startDevice['lat']),
      new BMap.Point(endDevice['lng'], endDevice['lat'])
    ], {strokeColor: 'red', strokeWeight: 3, strokeOpacity: 1});
    polyline['startPoint'] = startDevice;
    polyline['endPoint'] = endDevice;
    if (!_.isEmpty(this.lineEvent)) {
      this.lineEvent.forEach(item => {
        polyline.addEventListener(item.eventName, item.eventHandler, {passive: false, capture: true});
      });
    }
    this.mapService.mapInstance.addOverlay(polyline);
    // 清除所选设施
    this.clickDeviceData = new LoopLineModel();
  }
}
