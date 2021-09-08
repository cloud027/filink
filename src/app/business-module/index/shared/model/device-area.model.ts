export class FilterConditions {
  area: any[];
  device: any[];
}

/**
 * 设施图层区域点模型
 */
export class DeviceAreaModel {
  polymerizationType: string;
  filterConditions: any;

  constructor() {
    this.filterConditions = new FilterConditions();
  }
}
