/**
 * 新建分组入参模型
 */
export class AddGroupResultModel {
  /**
   * 组名
   */
  groupName: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 设施id
   */
  groupDeviceInfoIdList: string[];
  /**
   * 设备id
   */
  groupEquipmentIdList: string[];
}


/**
 * 已有分组入参模型
 */
export class AddToExistGroupModel {
  /**
   * 组名id
   */
  groupId: string;
  /**
   * 设施id
   */
  groupDeviceInfoIdList: string[];
  /**
   * 设备id
   */
  groupEquipmentIdList: string[];
}
