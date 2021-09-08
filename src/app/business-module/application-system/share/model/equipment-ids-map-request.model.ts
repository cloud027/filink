/**
 * 根据设备id 分组id 回路id 设备类型获取设备点在地图上的位置信息的请求参数模型
 */
export class EquipmentIdsMapRequestModel {
  /**
   * 设备id
   */
  equipmentIdList: string[];
  /**
   * 分组id
   */
  groupIds: string[];
  /**
   * 回路id
   */
  loopIds: string[];
  /**
   * 设备类型
   */
  equipmentTypes: string[];
}
