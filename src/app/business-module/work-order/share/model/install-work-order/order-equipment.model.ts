/**
 * 安装工单中设备
 */
export class OrderEquipmentModel {
  equipmentName?: string;
  equipmentType?: string;
  sequenceId?: string;
  platformId?: string;
  equipmentModel?: string;
  supplier?: string;
  scrapTime?: string;
  deviceId?: string;
  mountPosition?: string;
  areaId?: string;
  gatewayId?: string;
  gatewayResolverType?: string;
  loopId?: string;
  company?: string;
  installationDate?: string;
  powerControlId?: string;
  otherSystemNumber?: string;
  equipmentCode?: string;
  remarks?: string;
  deviceInfo?: {
    areaInfo?: {accountabilityUnit?: []}
  };
  areaInfo?: {accountabilityUnit?: []};
  deviceName?: string;
  address?: string;
  positionBase?: string;
  deviceType?: string;
  areaName?: string;
  areaCode?: string;
  supplierId?: string;
  softwareVersion?: string;
  hardwareVersion?: string;
  equipmentModelType?: string;

  constructor() {
    this.equipmentName = '';
    this.equipmentType = '';
    this.sequenceId = null;
    this.platformId = null;
    this.equipmentModel = '';
    this.supplier = '';
    this.scrapTime = null;
    this.deviceId = '';
    this.mountPosition = '';
    this.areaId = '';
    this.gatewayId = null;
    this.gatewayResolverType = null;
    this.loopId = null;
    this.company = null;
    this.installationDate = null;
    this.powerControlId = null;
    this.otherSystemNumber = null;
    this.equipmentCode = '';
    this.remarks = null;
    this.deviceInfo = {
      areaInfo: {accountabilityUnit: []}
    };
    this.areaInfo = {accountabilityUnit: []};
    this.deviceName = '';
    this.address = '';
    this.positionBase = '';
    this.deviceType = '';
    this.areaName = '';
    this.areaCode = '';
    this.supplierId = '';
    this.softwareVersion = '';
    this.hardwareVersion = '';
    this.equipmentModelType = null;
  }
}
