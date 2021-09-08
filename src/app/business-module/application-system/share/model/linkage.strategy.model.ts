/**
 * 联动策略
 */

export class LinkageStrategyModel {
  /**
   * 设备id
   */
  public equipmentId?: string;
  /**
   * 设备名称
   */
  public equipmentName?: string;
  /**
   * 事件id
   */
  public conditionId: string;
  /**
   * 事件名称
   */
  public conditionName?: string;
  /**
   * 事件类型
   */
  public conditionType: string;
  /**
   * 信息类型
   */
  public targetType: string;
  /**
   * 信息屏
   */
  public instructInfoBase?: InstructInfoBaseModel;
  /**
   * 照明信息
   */
  public instructLightBase?: InstructLightBaseModel;

  constructor(params?) {
    this.equipmentId = params.equipmentId || '';
    this.equipmentName = params.equipmentName || '';
    this.conditionId = params.conditionId || '1';
    this.conditionType = params.conditionType || '1';
    this.targetType = '';
    this.instructInfoBase = new InstructInfoBaseModel(params.instructInfoBase = {});
    this.instructLightBase = new InstructLightBaseModel(params.instructLightBase = {});
  }
}

/**
 * 信息屏
 */
export class InstructInfoBaseModel {
  /**
   * 信息屏id
   */
  public instructId?: string;
  /**
   * 亮度
   */
  public light: string;
  /**
   * 音量
   */
  public volume: string;
  /**
   * 节目id
   */
  public programId: string;
  /**
   * 节目名称
   */
  public programName: string;

  constructor(params: any = {}) {
    this.instructId = params.instructId || '';
    this.light = params.light || '0';
    this.volume = params.volume || '0';
    this.programId = params.programId || '';
  }
}

/**
 * 照明信息
 */
export class InstructLightBaseModel {
  /**
   * 开关信息
   */
  public switchLight: any;
  /**
   * 亮度
   */
  public light: string;

  constructor(params: any = {}) {
    this.switchLight = params.switchLight || '0';
    this.light = params.light || '0';
  }
}
