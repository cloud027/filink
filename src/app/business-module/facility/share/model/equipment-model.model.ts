import {CameraTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';

/**
 * 设备型号数据模型
 */
export class EquipmentModelModel {
  /**
   * 型号
   */
  public model: string;
  /**
   * 型号id
   */
  public modelInfoId: string;
  /**
   * 报废时间
   */
  public scrapTime: number;
  /**
   * 供应商id
   */
  public supplierId: string;
  /**
   * 供应商名称
   */
  public supplierName: string;

  /**
   * 型号类型
   */
  public type?: DeviceTypeEnum;
  /**
   * 型号类别
   */
  public modelType: CameraTypeEnum;
}
