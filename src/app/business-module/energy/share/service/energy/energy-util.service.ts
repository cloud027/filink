import { Injectable } from '@angular/core';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import {
  CameraTypeEnum,
  EquipmentTypeEnum,
} from '../../../../../core-module/enum/equipment/equipment.enum';

@Injectable()
export class EnergyUtilService {
  constructor() {}

  /**
   * 获取设备类型的图标样式
   */
  public getEquipmentTypeIcon(data: any): string {
    // 设置设备类型的图标
    let iconClass = '';
    if (
      data.equipmentType === EquipmentTypeEnum.camera &&
      data.equipmentModel === CameraTypeEnum.bCamera
    ) {
      // 摄像头球型
      iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
    } else {
      iconClass = CommonUtil.getEquipmentIconClassName(data.equipmentType);
    }
    return iconClass;
  }
}
