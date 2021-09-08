export class FilterCondition {
  filterValue: string[];
  filterField: string;
  operator: string = 'in';
}

/**
 * 区域点告警数据接口模型
 */
export class AlarmAreaModel {
  filterConditions: [FilterCondition];
  groupFilterFields: string[] = [
    'alarm_fixed_level',
    'area_code'
  ];
  areaCodes: string[];

  constructor() {
    this.filterConditions = [new FilterCondition()];
  }
}
