/**
 * filterValue模型
 */
export class FilterValueModel {
  /**
   * 区域id
   */
  areaId?: string;
  /**
   * 区域名称
   */
  areaName?: string;
  /**
   * 过滤条件
   */
  filterValue?: any;
  /**
   * 设施id
   */
  deviceId?: string[];
  deviceIds?: string[];
  /**
   * 设施名称
   */
  deviceName?: string;
  /**
   * 设施类型
   */
  deviceTypes?: string[];
  /**
   * 设施编码
   */
  deviceCode?: string;
  /**
   * 设备id
   */
  equipmentId?: string[];
  equipmentIds?: string[];
  /**
   * 设备名称
   */
  equipmentName?: string;
  /**
   * id
   */
  ids?: string[];
  /**
   * name
   */
  name?: string;
  /**
   * picName
   */
  picName?: string;
  /**
   * resource
   */
  resource?: string;
  /**
   * 过滤条件名称
   */
  filterName?: string;

  /**
   * 用户id
   */
  userIds?: string[];

  /**
   * 用户名
   */
  userName?: string;

  constructor() {
    this.ids = [];
    this.picName = '';
    this.deviceName = '';
    this.deviceCode = '';
    this.areaName = '';
    this.resource = null;
    this.areaId = '';
    this.deviceIds = [];
    this.deviceTypes = [];
    this.equipmentIds = [];
    this.equipmentName = '';
    this.filterValue = null;
    this.userIds = [];
    this.userName = '';
  }
}
