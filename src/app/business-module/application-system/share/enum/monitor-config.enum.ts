/** 工作台 还是 详情页面 */
export enum WorkOrDetailEnum {
  /** 工作台 */
  workPage = 'workPage',
  /** 详情页面 */
  detailPage = 'detailPage',
}
// -------------------------------------------监测点数据----------------------------
/** 监测点数据的 每个tab字段 */
export enum MonitorPointTabKeyEnum {
  /** 温度 */
  temperature = 'temperature',
  temperatureCompany = '℃',
  /** 湿度 */
  humidity = 'humidity',
  humidityCompany = '%',
  /** 气压 */
  pressure = 'pressure',
  pressureCompany = 'hPa',
  /** 风向 */
  winddirection = 'winddirection',
  winddirectionCompany = '',
  /** 风速 */
  windspeed = 'windspeed',
  windspeedCompany = 'm/s',
  /** 雨量 */
  rainfall = 'rainfall',
  rainfallCompany = 'mm',
  /** 辐射 */
  radiation = 'radiation',
  radiationCompany = 'w/m³',
  /** 紫外线 */
  UVIndex = 'UVIndex',
  UVIndexCompany = 'UVI',
  /** PM25 */
  PM25 = 'PM2_5',
  PM25Company = 'ug/m³',
  /** PM10 */
  PM10 = 'PM10',
  PM10Company = 'ug/m³',
  /** 噪声 */
  noise = 'noise',
  noiseCompany = 'dB(A)',
}
// -------------------------------------------监测点数据----------------------------

// ------------------------------------------ 地图 --------------------------------
/** 设施设备列表 */
export enum FacilityListTypeEnum {
  /** 设施列表 */
  facilitiesList = '1',
  /** 设备列表 */
  equipmentList = '2',
}
/** 添加关注 分组变更 */
export enum ChooseTypeEnum {
  /** 添加关注 */
  collect = 'collect',
  /** 分组变更 */
  groupChange = 'groupChange',
}
/** 分组变更 类型 */
export enum GroupTypeEnum {
  //  移入其他分组
  moveInOtherGroup = 1,
  //  移出当前分组
  moveOutCurrentGroup = 2,
  //  移入新分组
  moveInNewGroup = 3,
}
/** 查询分组信息列表的类型 */
export enum QueryGroupTypeEnum {
  // 设施
  device = 'device',
  // 设备
  equipment = 'equipment',
}
/** 分组变更 操作步骤模型 */
export class GroupStepModel {
  /**
   * 步骤数字
   */
  public stepNumber: number;
  /**
   * 样式
   */
  activeClass: string;
  /**
   * 标题
   */
  title: string;
}
// ------------------------------------------ 地图 --------------------------------
