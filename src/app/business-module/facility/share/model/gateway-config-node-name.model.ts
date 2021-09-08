/**
 * 网关配置编辑节点名称请求模型
 */
export class GatewayConfigNodeNameModel {
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
   * 节点名称
   */
  nodeName: string;

  constructor(gatewayId, portNo, equipmentId, nodeName) {
    this.gatewayId = gatewayId;
    this.portNo = portNo;
    this.equipmentId = equipmentId;
    this.nodeName = nodeName;
  }
}
