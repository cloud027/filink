/**
 * 网关配置清除当前配置请求模型 保存设备节点坐标位置请求模型
 */
export class GatewayConfigClearModel {
  /**
   * 网关id
   */
  gatewayId: string;
  /**
   * 端口序号
   */
  portNo: string;
  /**
   * 设备id
   */
  equipmentId: string;

  /**
   * 设备节点位置 保存设备节点才需要传
   */
  equipmentPosition?: string;

  constructor(gatewayId, portNo, equipmentId, equipmentPosition?) {
    this.gatewayId = gatewayId;
    this.portNo = portNo;
    this.equipmentId = equipmentId;
    this.equipmentPosition = equipmentPosition;
  }
}
