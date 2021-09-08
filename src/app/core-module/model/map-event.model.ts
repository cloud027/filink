import {MapEventTypeEnum} from '../../shared-module/enum/filinkMap.enum';

/**
 * 地图回传事件模型
 */
export class MapEventModel {
  /**
   * 地图表层点击类型
   */
  type: MapEventTypeEnum;
  /**
   *  设施id
   */
  id?: string;
  /**
   * 数据 可能是区域点数据 设施数据  设备数据  地图数据
   */
  data?: any;
}
