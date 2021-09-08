/**
 * 网关信息端口拓扑保存参数模型
 */
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

export class GatewayDataRequestModel {

  /**
   * 设备id
   */
  equipmentId: string;
  /**
   * 设备类型
   */
  equipmentType: EquipmentTypeEnum;

  /**
   * 设备型号
   */
  equipmentModel: string;
  /**
   * 网关id
   */
  gatewayId: string;
  /**
   * 端口序号
   */
  portNo: string;

  /**
   * 网关名称
   */
  gatewayName: string;

  /**
   * 设备位置
   */
  equipmentPosition: string;

  /**
   * 端口位置
   */
  portPosition: string;
  /**
   * 连线名称
   */
  lineName: string;
  /**
   * 节点名称
   */
  nodeName: string;

  constructor(equipmentId?, equipmentType?, equipmentModel?, gatewayId?, portNo?, gatewayName?,
              equipmentPosition?, portPosition?, lineName?, nodeName?) {
    this.equipmentId = equipmentId;
    this.equipmentType = equipmentType;
    this.equipmentModel = equipmentModel;
    this.gatewayId = gatewayId;
    this.portNo = portNo;
    this.gatewayName = gatewayName;
    this.equipmentPosition = equipmentPosition;
    this.portPosition = portPosition || '';
    this.lineName = lineName || '';
    this.nodeName = nodeName || '';
  }
}
