import {MapEquipmentDataByAreaModel} from '../../../../core-module/model/map-equipmentData-by-area.model';
import {AREA_POINT_CONST} from '../../../../core-module/const/index/map.const';

/**
 * 回路地图区域设施数据模型
 */
export class LoopMapDeviceDataModel {
  /**
   * 区域id
   */
  areaId: string;
  /**
   * 区域code
   */
  code: string;
  /**
   * 数量
   */
  count: number;
  /**
   * 设备数据
   */
  equipmentData: MapEquipmentDataByAreaModel[];
  /**
   * 所属区域
   */
  parentId: string;
  /**
   * 区域预留字段,区分区域点
   */
  polymerization: string = AREA_POINT_CONST;
  /**
   * 经纬度
   */
  positionCenter: string;
  /**
   * 经度
   */
  lat?: string;
  /**
   * 维度
   */
  lng?: string;
}
