import {CameraTypeEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';

export class IndexUtil {
  /**
   * 摄像头球型枪型替换
   */
  public static getEquipmentTypeIcon(data): string {
    // 设置设备类型的图标
    let iconClass = '';
    if (data.equipmentType === EquipmentTypeEnum.camera && data.modelType === CameraTypeEnum.bCamera) {
      // 摄像头球型
      iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
    } else {
      iconClass = CommonUtil.getEquipmentIconClassName(data.equipmentType);
    }
    return iconClass;
  }


  /**
   * 常量转换对象
   *  object
   *  {Array<{value: string; label: string}>}
   */
  public constConvertObject(object) {
    const tempOption: Array<{ value: string, label: string }> = [];
    for (const item in object) {
      if (item) {
        tempOption.push({value: item, label: object[item]});
      }
    }
    return tempOption;
  }
}
