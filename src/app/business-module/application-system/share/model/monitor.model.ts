import { ExecTypeEnum } from '../../../../core-module/enum/equipment/policy.enum';
import { EquipmentTypeEnum } from '../../../../core-module/enum/equipment/equipment.enum';
/**
 * 策略控制列表
 */
export class PolicyControlModel {
  /**
   * 策略id
   */
  public equipmentId?: string;
  /**
   * 策略名称
   */
  public equipmentName: string;
  /**
   * 策略状态
   */
  public equipmentStatus: string | boolean;
  /**
   * 控制类型
   */
  public controlType?: { label: string; code: any }[];
  /**
   * 策略类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 备份策略类型
   */
  public _strategyType: string | Array<object>;
  /**
   * 执行状态
   */
  public execStatus: string | Array<object>;
  /**
   * 所属区域
   */
  public areaName: string;
  /** 区域信息 */
  public areaInfo: any;
  // 所属设施
  deviceName: string;
  /** 所属设施类型 */
  deviceType: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 状态
   */
  public state?: boolean;
  /**
   * 禁用和启用的loading
   */
  public switchLoading?: boolean;
  /**
   * 执行类型
   */
  public execType?: ExecTypeEnum | string;

  constructor(params?) {
    this.equipmentName = params.equipmentName || '';
    this.equipmentId = params.equipmentId || '';
    this.equipmentStatus = params.equipmentStatus || '1';
    this.state = params.state || false;
  }
}
// 设备统计数量
export class EquipmentCountListModel {
  /**
   * 环境监测仪数量
   */
  public numberMonitors: number;
  /**
   * 智慧杆数量
   */
  public wisdomPoles: number;

  constructor(params?) {
    this.numberMonitors = params.numberMonitors || 0;
    this.wisdomPoles = params.wisdomPoles || 0;
  }
}

/** 便捷入口 */
export class MonitorConvenientEntranceModel {
  /** 温度 */
  temperature: number;
  /** 雨量 */
  yuliang: number;
  /** 风向 */
  winddirection: number;
  /** 风向文字说明 */
  winddirectionText: string;
  /** 风速 */
  windspeed: number;

  /** 湿度 */
  humidity: number;

  /** 气压 */
  pressure: number;
  /** 辐射 */
  radiation: number;
  /** 紫外线 */
  UVIndex: number;
  /** PM25 */
  PM25: number;

  /** PM10 */
  PM10: number;

  /** 噪声 */
  noise: number;

  constructor(params?) {
    this.temperature = params.temperature || 0;
    this.yuliang = params.yuliang || 0;
    this.winddirection = params.winddirection || 0;
    this.windspeed = params.windspeed || 0;
    this.humidity = params.humidity || 0;
    this.pressure = params.pressure || 0;
    this.radiation = params.radiation || 0;
    this.UVIndex = params.UVIndex || 0;
    this.PM25 = params['PM2.5'] || 0;
    this.PM10 = params.PM10 || 0;
    this.noise = params.noise || 0;

    this.winddirectionText = this.setWinddirection(this.winddirection, this.windspeed);
  }

  /** 重置数据 */
  public initData(params?) {
    this.temperature = (params && params.temperature) || 0;
    this.yuliang = (params && params.yuliang) || 0;
    this.winddirection = (params && params.winddirection) || 0;
    this.windspeed = (params && params.windspeed) || 0;
    this.humidity = (params && params.humidity) || 0;
    this.pressure = (params && params.pressure) || 0;
    this.radiation = (params && params.radiation) || 0;
    this.UVIndex = (params && params.UVIndex) || 0;
    this.PM25 = (params && params['PM2.5']) || 0;
    this.PM10 = (params && params.PM10) || 0;
    this.noise = (params && params.noise) || 0;
    this.winddirectionText = this.setWinddirection(this.winddirection, this.windspeed);
  }

  /** 设置风向文字 */
  setWinddirection(winddirection: number, windspeed: number) {
    let winddirectionString: string;
    // if (windspeed < 0.2) return (winddirectionString = "静风")
    // @ts-ignore
    if (0 <= winddirection <= 22.5) { return (winddirectionString = '北风'); }
    if (22.5 < winddirection && winddirection <= 67.5) { return (winddirectionString = '东北风'); }
    if (67.5 < winddirection && winddirection <= 112.5) { return (winddirectionString = '东风'); }
    if (112.5 < winddirection && winddirection <= 157.5) { return (winddirectionString = '东南风'); }
    if (157.5 < winddirection && winddirection <= 202.5) { return (winddirectionString = '南风'); }
    if (202.5 < winddirection && winddirection <= 247.5) { return (winddirectionString = '西南风'); }
    if (247.5 < winddirection && winddirection <= 295.5) { return (winddirectionString = '西风'); }
    if (295.5 < winddirection && winddirection <= 337.5) { return (winddirectionString = '西北风'); }
    if (337.5 < winddirection && winddirection <= 360) { return (winddirectionString = '北风'); }
  }
}

/** 337.5-22.5为北风，22.5-67.5为 东北风，67.5-112.5位东风，112.5-157.5位东南风，157.5-202.5位南风，202.5-247.5位西南风，247.5-295.5位西风，295.5-337.5为西北风，风速小于等于0.2m/s为静风
 * 8个风向，每个45度。
 */
class WindDirection {}
