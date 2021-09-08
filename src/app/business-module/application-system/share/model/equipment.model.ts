/**
 * 设备列表
 */
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';

export class EquipmentModel {
  /**
   * 设备id
   */
  public equipmentId: string;
  /**
   * 资产编号
   */
  public equipmentCode: string;
  /**
   * 名称
   */
  public equipmentName: string;
  /**
   * 话筒设备形态
   */
  public equipmentModelType: string;
  /**
   * 设备序列号
   */
  public sequenceId: string;
  /**
   * 类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 状态
   */
  public equipmentStatus: EquipmentStatusEnum;
  /**
   * 型号
   */
  public equipmentModel: string;
  /**
   * 供应商
   */
  public supplier: string;
  /**
   * 报废年限
   */
  public scrapTime: number;
  /**
   * 状态
   */
  public state: boolean;
  /**
   * 网关设备id
   */
  public gatewayId: string;
}

/**
 * 亮度调整
 */
export class DimmingLightModel {
  /**
   * 设备id
   */
  public equipmentId: string;
  /**
   * 设备名称
   */
  public equipmentName: string;

  constructor(equipmentId?, equipmentName?) {
    this.equipmentId = equipmentId || '';
    this.equipmentName = equipmentName || '';
  }
}

/**
 * 分组列表
 */
export class GroupListModel {
  /**
   * 分组id
   */
  public groupId: string;
  /**
   * 分组名称
   */
  public groupName: string;
  /**
   * 备注
   */
  public remark?: string;
  checked?: boolean;
}

/**
 * 设备列表
 */
export class EquipmentListModel {
  /**
   * 设备id
   */
  public equipmentId: string;
  /**
   * 资产编号
   */
  public equipmentCode: string;
  /**
   * 名称
   */
  public equipmentName: string;
  /**
   * 类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 状态
   */
  public equipmentStatus: EquipmentStatusEnum;
  /**
   * 型号
   */
  public equipmentModel: string;
  /**
   * 供应商
   */
  public supplier: string;
  /**
   * 报废年限
   */
  public scrapTime: number;
  /**
   * 状态
   */
  public state: boolean;
  /**
   * 状态
   */
  public path: string;

  constructor(equipmentId?, equipmentName?) {
    this.equipmentId = equipmentId || '';
    this.equipmentName = equipmentName || '';
  }
}

/**
 * 设备控制
 */
export class EquipmentControlModel {
  /**
   * 类型
   */
  public type: ControlInstructEnum;
  /**
   * 亮度数值
   */
  public convenientVal: number;
  public paramId: string;
}
