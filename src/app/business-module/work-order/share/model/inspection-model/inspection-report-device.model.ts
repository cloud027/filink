/**
 * 巡检报告-设施
 */
import {InspectionReportEquipmentModel} from './inspection-report-equipment.model';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';

export class InspectionReportDeviceModel {
  /**
   * 设施id
   */
  public deviceId?: string;
  public key?: string;
  /**
   * 设施名称
   */
  public deviceName?: string;
  public title?: string;
  /**
   * 设施区域
   */
  public deviceAreaName?: string;
  /**
   * 区域id
   */
  public deviceAreaId?: string;
  /**
   * 设施类型
   */
  public deviceType?: DeviceTypeEnum;
  /**
   * 设备列表
   */
  public equipment?: InspectionReportEquipmentModel[];
  /**
   * 子集
   */
  public children?: InspectionReportEquipmentModel[];
}
