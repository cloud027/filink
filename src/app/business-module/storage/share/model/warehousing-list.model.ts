import {WarehousingStatusEnum} from '../enum/material-status.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {MaterialTypeEnum} from '../enum/material-type.enum';

export class WarehousingListModel {
  /**
   * 入库编号
   */
  warehousingId: string;
  /**
   * 入库编码
   */
  warehousingCode: string;
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
   * 入库状态
   */
  materialStatus: WarehousingStatusEnum;
  /**
   * 入库状态名称
   */
  materialStatusName?: string | SelectModel[];
  /**
   * 入库状态图标
   */
  statusClass?: string;
  /**
   * 物料类型
   */
  materialType: MaterialTypeEnum | string;
  /**
   * 规格型号id
   */
  materialModel: string;
  /**
   * 规格型号名称
   */
  materialModelName?: string;
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
   * 入库人员
   */
  warehousingUserName: string;
  /**
   * 入库单位
   */
  warehousingDept: string;
  /**
   * 入库事由
   */
  warehousingReason: string;
  /**
   * 入库时间
   */
  warehousingDate: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 设施/设备图标
   */
  iconClass: string;
  /**
   * 是否可已操作
   */
  canOperate?: string;
  /**
   * 是否被选择
   */
  checked?: boolean;
  /**
   * 出库数量
   */
  deliveryNum?: string | number;
  /**
   * 设备类型
   */
  equipmentType?: string;
  /**
   * 设备摄像头类型
   */
  equipmentModelType?: string;
  /**
   * 剩余物料数量
   */
  remainingNum: string;
}
