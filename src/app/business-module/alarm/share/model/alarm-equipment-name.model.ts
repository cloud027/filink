/**
 * 设备id集合获取设备名字
 */
export class AlarmEquipmentNameModel {
  /**
   * 设备id集合
   */
  public equipmentIdList: string[];

  constructor(equipmentIdList) {
    this.equipmentIdList = equipmentIdList;
  }
}
