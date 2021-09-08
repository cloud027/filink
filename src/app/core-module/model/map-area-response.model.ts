import {LoopMapDeviceDataModel} from '../../business-module/facility/share/model/loop-map-device-data.model';

/**
 * 地图区域点返回数据模型
 */
export class MapAreaResponseModel {
  /**
   * 区域设施设备数量数据
   */
  polymerizationData: LoopMapDeviceDataModel[];
  /**
   * 区域中心点
   */
  positionCenter: string;
}
