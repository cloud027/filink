/**
 * Created by xiaoconghu on 2019/1/8.
 */
import {styleOptions} from './map.config';

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_RIGHT: any;
declare const BMAP_DRAWING_MARKER: any; // 画点
declare const BMAP_DRAWING_CIRCLE: any; // 画圆
declare const BMAP_DRAWING_POLYLINE: any; // 画线
declare const BMAP_DRAWING_POLYGON: any; // 画多边形
declare const BMAP_DRAWING_RECTANGLE: any; // 画矩形
/**
 * 百度绘制类
 */
export class MapDrawingService {
  // 绘制实例
  mapDrawingInstance;

  constructor(mapInstance) {
    this.mapDrawingInstance = new BMapLib.DrawingManager(mapInstance, {
      isOpen: false, // 是否开启绘制模式
      enableDrawingTool: false, // 是否显示工具栏
      drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
        offset: new BMap.Size(20, 20), // 偏离值
      },
      circleOptions: styleOptions, // 圆的样式
      polylineOptions: styleOptions, // 线的样式
      polygonOptions: styleOptions, // 多边形的样式
      rectangleOptions: styleOptions // 矩形的样式
    });
  }

  /**
   * 为绘制工具添加事件
   * param eventName
   * param eventFn
   */
  addEventListener(eventName, eventFn) {
    this.mapDrawingInstance.addEventListener(eventName, eventFn);
  }

  /**
   * 开启绘制
   */
  open() {
    this.mapDrawingInstance.open();

  }

  /**
   * 关闭绘制
   */
  close() {
    this.mapDrawingInstance.close();
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
    this.mapDrawingInstance.setDrawingMode(DrawingType);
  }
}
