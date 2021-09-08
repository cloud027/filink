/**
 * 选择设施，设备模型
 */
export class SelectEquipmentModel {
  /**
   * 设备id
   */
  public ids: string[] = [];
  /**
   * 设备名称
   */
  public name: string;
  /**
   * 设备类型
   */
  public type?: string;
  constructor() {
    this.ids = [];
    this.name = '';
    this.type = '';
  }
}
