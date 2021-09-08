import {DeliveryStatusEnum} from '../enum/material-status.enum';
import {MaterialTypeEnum} from '../enum/material-type.enum';

export class DeliveryListModel {
  /**
   * 出库id/出库编号
   */
  deliveryId: string;
  /**
   * 物料名称
   */
  materialName: string;
  /**
   * 物料编号
   */
  materialNumber: string;
  /**
   * 物料Code
   */
  materialCode: string;
  /**
   * 出库状态
   */
  materialStatus: DeliveryStatusEnum;
  /**
   * 出库状态图标
   */
  statusClass?: string;
  /**
   * 物料类型
   */
  materialType: MaterialTypeEnum;
  /**
   * 规格型号
   */
  materialModel: string;
  /**
   * 规格型号名称
   */
  materialModelName: string;
  /**
   * 软件版本号
   */
  softwareVersion: string;
  /**
   * 硬件版本号
   */
  hardwareVersion: string;
  /**
   * 物料数量
   */
  materialNum: string;
  /**
   * 物料单价
   */
  materialUnitPrice: string;
  /**
   * 供应商id
   */
  supplierId: string;
  /**
   * 供应商
   */
  supplierName: string;
  /**
   * 出库数量
   */
  deliveryNum: string | number;
  /**
   * 物料剩余数量
   */
  remainingNum: string;
  /**
   * 领用人员
   */
  collectUser: string;
  /**
   * 领用单位
   */
  collectDept: string;
  /**
   * 出库事由
   */
  deliveryReason: string;
  /**
   * 出库时间
   */
  deliveryTime: string;
  /**
   * 出库人员
   */
  deliveryUser: string;
  /**
   * 是否可操作
   */
  canOperate?: string;
  /**
   * 设施设备图标
   */
  iconClass?: string;
  /**
   * 设备类型
   */
  equipmentType?: string;
}
