import {styleOptions} from './map.config';

/**
 * Created by wh1709040 on 2019/2/14.
 *  google地图绘制类
 */
declare let google: any;

export class GMapDrawingService {
  // 绘制实例
  mapDrawingInstance;

  constructor(mapInstance) {
    this.mapDrawingInstance = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
      },
      markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
      circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
      },
      polylineOptions: styleOptions, // 线的样式
      polygonOptions: styleOptions, // 多边形的样式
      rectangleOptions: styleOptions // 矩形的样式
    });
    this.mapDrawingInstance.setMap(mapInstance);
  }

  /**
   * 为绘制工具添加事件
   * param eventName
   * param eventFn
   */
  addEventListener(eventName, eventFn) {
    google.maps.event.addListener(this.mapDrawingInstance, eventName, eventFn);
  }

  /**
   * 开启绘制
   */
  open() {
    this.mapDrawingInstance.setOptions({drawingControl: false});
  }

  /**
   * 关闭绘制
   */
  close() {
    this.mapDrawingInstance.setOptions({drawingControl: false});

  }

  /**
   * 获取当前绘制模式
   */
  getDrawingMode() {
    return this.mapDrawingInstance.getDrawingMode();
  }

  /**
   * 设置当前的绘制模式
   * param DrawingType
   */
  setDrawingMode(DrawingType) {
    this.mapDrawingInstance.setDrawingMode(DrawingType || null);
  }
}
