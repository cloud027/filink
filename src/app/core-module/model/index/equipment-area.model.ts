export class FilterConditions {
  area: any[];
  equipment: any[];
}

/**
 * 设备图层区域点接口模型
 */
export class EquipmentAreaModel {
  polymerizationType: string;
  filterConditions: any;

  constructor() {
    this.filterConditions = new FilterConditions();
  }
}
