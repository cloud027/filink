/**
 * 库存管理中各总数的数据模型
 */
export class StorageTotalNumModel {
  /**
   * 物料总数
   */
  materialTotal: number;
  /**
   * 设施总数
   */
  deviceTotal: number;
  /**
   * 设备总数
   */
  equipmentTotal: number;
  /**
   * 其他总数
   */
  otherTotal: number;

  constructor() {
    this.materialTotal = 0;
    this.deviceTotal = 0;
    this.equipmentTotal = 0;
    this.otherTotal = 0;
  }
}
