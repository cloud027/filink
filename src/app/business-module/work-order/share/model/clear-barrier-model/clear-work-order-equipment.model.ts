/**
 * 选择设备名称
 */
export class ClearWorkOrderEquipmentModel {
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
  public type: string;
  constructor() {
    this.ids = [];
    this.name = '';
    this.type = '';
  }
}
