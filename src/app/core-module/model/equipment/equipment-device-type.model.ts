/**
 * 设施/设备对象
 */
export class EquipmentDeviceTypeModel {
  /**
   * 设施/设备名称
   */
  public name: string | { label: string; code: any }[];
  /**
   * 设施/设备图片
   */
  public picture: string;
  /**
   * 类型名称
   */
  public typeName?: string;
  constructor() {
    this.name = '';
    this.picture = '';
  }
}
