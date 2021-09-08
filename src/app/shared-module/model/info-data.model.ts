import {MarkerInfoDataModel} from './marker-info-data.model';

/**
 * 聚合点数据模型
 */
export class CollectionInfoDataModel {
  /**
   * 设施类型
   */
  deviceType: string;
  /**
   * 设施图标样式
   */
  className: string;
  /**
   * 设施类型名称
   */
  deviceTypeName: string;
  /**
   * 数量
   */
  count: string;
}

/**
 * 地图选择器弹框信息模型
 */
export class InfoDataModel {
  /**
   * 弹框类型 c 聚合点 m marker点
   */
  type: string;
  /**
   * marker点数据
   */
  markerInfoData?: MarkerInfoDataModel;
  /**
   * 聚合点数据
   */
  collectionInfoData?: CollectionInfoDataModel[];
}
