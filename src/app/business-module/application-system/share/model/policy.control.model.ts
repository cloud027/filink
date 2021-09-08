import {ExecStatusEnum, StrategyStatusEnum} from '../enum/policy.enum';
import {EquipmentListModel, GroupListModel} from './equipment.model';
import {LoopModel} from './loop.model';
import {LightIntensityModel} from './light.intensity.model';
import {ContentListModel} from './content.list.model';
import {ExecTypeEnum} from '../../../../core-module/enum/equipment/policy.enum';
import {InstructInfoBaseModel, InstructLightBaseModel} from './linkage.strategy.model';

/**
 * 策略控制列表
 */
export class PolicyControlModel {
  /**
   * 策略id
   */
  public strategyId?: string;
  /**
   * 策略名称
   */
  public strategyName: string;
  /**
   * 策略状态
   */
  public strategyStatus: string | boolean;
  /**
   * 控制类型
   */
  public controlType?: { label: string; code: any }[] | string;
  public controlTypeCode?: { label: string; code: any }[] | string;
  /**
   * 策略类型
   */
  public strategyType: string | Array<object>;
  /**
   * 备份策略类型
   */
  public _strategyType: string | Array<object>;
  /**
   * 开始时间
   */
  public effectivePeriodStart: number | string;
  /**
   * 结束时间
   */
  public effectivePeriodEnd: number | string;
  /**
   * 日期
   */
  public effectivePeriodTime?: string;
  /**
   * 有效期
   */
  public startEndTime?: string;
  /**
   * 执行状态
   */
  public execStatus: string | Array<object>;
  /**
   * 执行周期
   */
  public execCron: string;
  /**
   * 创建时间
   */
  public createTime: string;
  /**
   * 申请人
   */
  public applyUser: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 状态
   */
  public state?: boolean;
  /**
   * 策略节目列表
   */
  public strategyProgRelationList?: ContentListModel[];
  /**
   * 策略说明信息
   */
  public instructInfo?: InstructInfoModel;
  public instructBroadcast?: InstructBroadcastModel;
  /**
   * 禁用和启用的loading
   */
  public switchLoading?: boolean;
  /**
   * 执行类型
   */
  public execType?: ExecTypeEnum | string;

  constructor(params?) {
    this.strategyName = params.strategyName || '';
    this.strategyId = params.strategyId || '';
    this.strategyStatus = params.strategyStatus || '1';
    this.state = params.state || false;
    this.strategyProgRelationList = params.strategyProgRelationList || [];
    this.instructInfo = params.instructInfo || {};
  }
}

/**
 * 策略禁用/启用
 */
export class EnableOrDisableModel {
  /**
   * 策略状态
   */
  public strategyType: StrategyStatusEnum | string;
  /**
   * 操作类型
   */
  public operation: ExecStatusEnum | string;
  /**
   * 策略id集合
   */
  public strategyId: string;
}

/**
 * 策略控制
 */
export class StrategyListModel {
  /**
   * 申请人
   */
  public applyUser: string;
  /**
   * 控制类型
   */
  public controlType: string;
  /**
   * 创建时间
   */
  public createTime: number;
  /**
   * 创建人
   */
  public createUser: string;
  /**
   * 结束时间
   */
  public effectivePeriodEnd: number;
  /**
   * 开始时间
   */
  public effectivePeriodStart: number;
  /**
   * 执行周期
   */
  public execCron: string;
  /**
   * 执行状态
   */
  public execStatus: string;
  /**
   * 类型
   */
  public execType: ExecTypeEnum;
  /**
   * 间隔天数
   */
  public intervalTime?: any;
  /**
   * 执行日期
   */
  public execTime?: any;

  /**
   * 设备列表
   */
  public equipment?: EquipmentListModel[];
  /**
   * 分组列表
   */
  public group?: GroupListModel[];
  /**
   * 回路列表
   */
  public loop?: LoopModel[];
  /**
   * 备注
   */
  public remark: string;
  /**
   * 策略id
   */
  public strategyId: string;
  /**
   * 策略名称
   */
  public strategyName: string;
  /**
   * 应用范围 属于公共 在联动策略的时候在第二步选择
   */
  public strategyRefList?: StrategyRefListModel[];
  /**
   * 策略状态
   */
  public strategyStatus: string | boolean;
  public _strategyStatus?: any;
  /**
   * 策略类型
   */
  public strategyType: string;
  /**
   * 策略类型备份
   */
  public _strategyType: string;

  // ------------------
  /**
   * 动作 信息发布策略实体第二步多余信息
   */
  public instructInfo?: InstructInfoModel;
  public instructBroadcast?: InstructBroadcastModel;
  /**
   * 播放时段
   */
  public strategyPlayPeriodRefList?: StrategyPlayPeriodRefListModel[];
  /**
   * 节目列表
   */
  public strategyProgRelationList?: SelectedProgramModel[];

  // ------------------
  /**
   * 光照强度 照明策略实体第二步多余信息
   */
  public instructLightList?: LightIntensityModel[];

  // ------------------
  /**
   * 联动策略第二步的策略详情信息
   */
  public linkageStrategyInfo?: LinkageStrategyInfoModel;
  multiEquipmentData?: any[] = [];

  public devicePoints?;

  constructor() {
    this.equipment = [];
    this.group = [];
    this.loop = [];
    this.linkageStrategyInfo = new LinkageStrategyInfoModel();
    this.strategyProgRelationList = [];
    this.strategyPlayPeriodRefList = [];
    this.instructInfo = new InstructInfoModel();
    this.instructBroadcast = new InstructBroadcastModel();
    this.strategyRefList = [];
    this.instructLightList = [];
    this.multiEquipmentData = [];
  }
}

/**
 * 循环模式
 */
export class InstructInfoModel {
  /**
   * 开关
   */
  public switches: string;
  /**
   * 循环类型
   */
  public playType: string;
  /**
   * 音量
   */
  public volume: string;
  /**
   * 亮度
   */
  public light: string;


  constructor(switches: string = '0', playType: string = '1', volume: string = '0', light: string = '0') {
    this.switches = switches;
    this.playType = playType;
    this.volume = volume;
    this.light = light;
  }
}
/**
 * 循环模式
 */
export class InstructBroadcastModel {
  /**
   * 开关
   */
  public switches: string;
  /**
   * 循环类型
   */
  public playType: string;
  /**
   * 音量
   */
  public volume: string;

  constructor(switches: string = '0', playType: string = '1', volume: string = '0') {
    this.switches = switches;
    this.playType = playType;
    this.volume = volume;
  }
}

/**
 * 联动策略
 */
export class LinkageStrategyInfoModel {
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
   * 事件类型
   */
  public conditionType: string;
  /**
   * 告警名称（事件名称）
   */
  public conditionName?: string;
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
  /**
   * 事件类型为触发器时的执行动作数据备份
   */
  public actionBackup?: any;
  public groupInstructs?: any;
  public groupEquipments?: any;
  public multipleConditions?: any;
  public triggerSelectedList?: any;
  public logic?: any;

  constructor() {
    this.conditionType = '1';
    this.instructInfoBase = new InstructInfoBaseModel();
    this.instructLightBase = new InstructLightBaseModel();
    this.equipmentName = '';
    this.targetType = '';
    this.conditionName = '';
  }
}

/**
 * 播放时段
 */
export class StrategyPlayPeriodRefListModel {
  /**
   * 开始时间
   */
  public playStartTime: number;
  /**
   * 结束时间
   */
  public playEndTime: number;
  /**
   * 是否展示时间选择框 当点击时间进行编辑时需展示时间选择框
   */
  public showTimePicker?: boolean;
}

/**
 * 选中的节目
 */
export class SelectedProgramModel {
  /**
   * 节目id
   */
  public programId: string;
  /**
   * 节目序号
   */
  public playSort?: number;
  /**
   * 节目时长
   */
  public duration?: string;
  /**
   * 播放时间
   */
  public playTime?: string | number;
  /**
   * 节目名称
   */
  public programName?: string;

  constructor(params?) {
    this.programId = params.programId || '';
    this.playSort = params.playSort || 1;
    this.duration = params.duration || '';
    this.programName = params.programName || '';
  }
}

/**
 * 应用范围
 */
export class StrategyRefListModel {
  /**
   * id
   */
  public refId: string;
  /**
   * 名称
   */
  public refName: string;
  /**
   * 设备状态
   */
  public refEquipmentType?: string;
  /**
   * 应用范围类型
   */
  public refType: string;
}

/**
 * 节目列表
 */
export class ProgramListModel {
  /**
   * 节目id
   */
  public programId: string;
  /**
   * 节目名称
   */
  public programName: string;
  /**
   * 节目用途
   */
  public programPurpose: string;
  /**
   * 时长
   */
  public duration: string;
  /**
   * 格式
   */
  public mode: string;
  /**
   * 分辨率
   */
  public resolution: string;
  /**
   * 文件名称
   */
  public programFileName: string;
  /**
   * 文件路径
   */
  public programPath: string;
  /**
   * 文件大小
   */
  public programSize?: string;
  /**
   * 节目md5值
   */
  public md5?: string;
  /**
   * 文件类型
   */
  public programFileType?: string;
  /**
   * 地址
   */
  public fastdfsAddr?: string;
}




