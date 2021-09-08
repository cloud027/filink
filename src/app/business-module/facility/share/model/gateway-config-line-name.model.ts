/**
 * 网关配置编辑连线名称请求模型
 */
export class GatewayConfigLineNameModel {
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
   * 连线名称
   */
  lineName: string;

  constructor(gatewayId, portNo, equipmentId, lineName) {
    this.gatewayId = gatewayId;
    this.portNo = portNo;
    this.equipmentId = equipmentId;
    this.lineName = lineName;
  }
}
