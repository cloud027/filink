/**
 * 区域下的设备类型接口查询模型
 */
export class AlarmEquipmentTypeModel{
  /**
   * 区域code
   */
  public areaCodes: string[];
  /**
   * 设施类型值
   */
  public deviceTypes: string[];

  constructor(code = [], type = []) {
    this.areaCodes = code;
    this.deviceTypes = type;
  }
}
