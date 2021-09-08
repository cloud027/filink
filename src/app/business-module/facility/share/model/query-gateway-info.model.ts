/**
 * 网关拓扑信息查询模型
 */
export class QueryGatewayInfoModel {
  /**
   * 网关id
   */
  gatewayId: string;
  /**
   * 网关型号
   */
  gatewayModel: string;

  constructor(gatewayId, gatewayModel) {
    this.gatewayId = gatewayId;
    this.gatewayModel = gatewayModel;
  }
}
