import {SelectModel} from '../../../../../shared-module/model/select.model';

/**
 * 巡检任务关联设施实体类
 */
export class InspectionFromDeviceInfoModel {
  /**
   * 设备名称
   */
  public name?: string;
  /**
   * 设施id
   */
  public deviceId?: string;
  /**
   * 设施类型
   */
  public type?: string;
  /**
   * 设施code
   */
  public code?: string;
  /**
   * 设施区域
   */
  public area?: string;
  /**
   * 设备/设施名称
   */
  public iconName?: string | SelectModel[];
  /**
   * 设备/设施class
   */
  public picture?: string;
  /**
   * 设施方位
   */
  public positionBase?: string;
  /**
   * 行状态
   */
  public rowActive?: boolean;
  /**
   * 图标是否选中
   */
  public checked?: boolean;
  /**
   * 经度
   */
  public lng?: number;
  /**
   * 纬度
   */
  public lat?: number;

  /**
   * 设施方位
   */
  public children?: InspectionFromDeviceInfoModel[];
  constructor() {
    this.children = [];
  }
}
