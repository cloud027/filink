/**
 * 网关配置端口信息
 */
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

export class GatewayPortInfoModel {
  /**
   * 占用端口连接设备型号
   */
  actualEquipmentModel: string;
  /**
   * 占用端口连接设备类型
   */
  actualEquipmentType: EquipmentTypeEnum;
  /**
   *  设备id
   */
  equipmentId: string;
  /**
   * 设备型号
   */
  equipmentModel: string;
  /**
   * 设备位置
   */
  equipmentPosition: string;
  /**
   * 设备类型
   */
  equipmentType: string;
  /**
   * 端口类型
   */
  equipmentTypeList: EquipmentTypeEnum[];
  /**
   * 网关id
   */
  gatewayId: string;
  /**
   * 网关端口信息id
   */
  gatewayInfoId: string;
  /**
   * 网关型号
   */
  gatewayModel: string;
  /**
   * 连接标识id
   */
  gatewayPortId: string;
  /**
   * 连线名称
   */
  lineName: string;
  /**
   * 节点名称
   */
  nodeName: string;
  /**
   * 端口名称
   */
  portName: string;
  /**
   * 端口序号
   */
  portNo: string;
  /**
   * 端口位置
   */
  portPosition: string;
  /**
   * 端口类型
   */
  portType: string;
  /**
   * 端口状态
   */
  status: boolean;
  /**
   * 节点图片
   */
  image: string;
}
