/**
 * 应用系统里面的路由配置
 */
export const RouterJumpConst = {
  lightingPolicyControl: 'business/application/lighting/policy-control',
  lightingPolicyControlAdd: 'business/application/lighting/policy-control/add',
  lightingPolicyControlEdit: 'business/application/lighting/policy-control/update',
  equipmentDetails: '/business/application/lighting/equipment-list/policy-details',
  securityDetails: '/business/application/security/equipment-list/policy-details',
  groupDetails: '/business/application/lighting/equipment-list/group-policy-details',
  releaseDetails: '/business/application/release/equipment-list/policy-details',
  releaseGroupDetails: '/business/application/release/equipment-list/group-policy-details',
  loopDetails: '/business/application/lighting/equipment-list/loop-policy-details',
  lightingWorkbench: 'business/application/lighting/workbench',
  releaseWorkbench: 'business/application/release/workbench',
  strategy: '/business/application/strategy/list',
  strategyAdd: '/business/application/strategy/add',
  strategyEdit: '/business/application/strategy/update',
  strategyDetails: '/business/application/strategy/policy-details',
  releasePolicyControl: 'business/application/release/policy-control',
  releaseWorkbenchAdd: 'business/application/release/policy-control/add',
  releaseWorkbenchEdit: 'business/application/release/policy-control/update',
  releaseWorkbenchDetails: 'business/application/release/policy-details',
  securityWorkbench: 'business/application/security/workbench',
  securityPolicyControl: 'business/application/security/policy-control',
  securityPolicyControlAdd: 'business/application/security/policy-control/add',
  securityPolicyControlDetails: 'business/application/security/policy-details',
  securityPolicyControlEdit: 'business/application/security/policy-control/update',
  lightingDetails: 'business/application/lighting/policy-details',
  callWorkbench: 'business/application/call/workbench',
  callDetails: '/business/application/call/equipment-list/policy-details',
  callGroupDetails: '/business/application/call/equipment-list/call-group-details',
  fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  broadcastWorkbench: 'business/application/broadcast/workbench',
  broadcastDetails: '/business/application//broadcast/equipment-list/policy-details',
  broadcastGroupDetails: '/business/application/broadcast/equipment-list/group-policy-details',
  broadcastPolicyControl: 'business/application/broadcast/policy-control',
  broadcastWorkbenchAdd: 'business/application/broadcast/policy-control/add',
  broadcastWorkbenchDetails: 'business/application/broadcast/policy-details',
  broadcastWorkbenchEdit: 'business/application/broadcast/policy-control/update',
};



/**
 * 步骤条切换样式
 */
export const ClassStatusConst = {
  stepsFinish: 'finish',
  stepsActive: 'active',
  detailsActive: 'details-active'
};

/**
 * 区分三个平台的常量
 */
export const ApplicationFinalConst = {
  lighting: 'lighting',
  release: 'release',
  security: 'security',
  strategy: 'strategy',
  broadcast: 'broadcast',
  /** 环境监测 */
  monitor: 'monitor',
  call: 'call',
  dateType: 'yyyy-MM-dd hh:mm:ss',
  dateTypeDay: 'yyyy-MM-dd'
};

/**
 * 策略列表
 */
export const StrategyListConst = {
  lighting: '1',
  centralizedControl: '2',
  information: '3',
  broadcast: '4',
  linkage: '5'
};

export const ExecStatusConst = {
  free: '0',
  implement: '1'
};
/**
 * 控制类型
 */
export const ControlTypeConst = {
  platform: '1',
  equipment: '2'
};
/**
 * 策略状态
 */
export const StrategyStatusConst = {
  open: '1',
  close: '0'
};
/**
 * 设备状态统计
 */
export const EquipmentStatusConst = {
  // 未配置
  unSet: '1',
  // 正常在线
  online: '2',
  // 告警
  alarm: '3',
  // 故障
  break: '4',
  // 下线
  offline: '5',
  // 失联
  outOfContact: '6',
  // 已拆除
  dismantled: '7'
};
/**
 * 设备状态统计
 */
export const alarmLevelStatusConst = {
  // 通信告警
  signal: 'alarmType1',
  // 通信告警
  businessQuality: 'alarmType2',
  // 环境告警
  environmentalScience: 'alarmType3',
  // 电力告警
  power: 'alarmType4',
  // 安全告警
  security: 'alarmType5',
  // 设备告警
  equipment: 'alarmType6',
};

/**
 * 开启/关闭
 */
export const SwitchActionConst = {
  open: 'open',
  close: 'close',
  light: 'light'
};

/**
 * 上电/下电
 */
export const ElectricConst = {
  up: 'up',
  down: 'down'
};

/**
 * 告警分类数量统计
 */
export const AlarmLevelStatisticsConst =  {
  // 紧急
  urgent : 'alarmLevel1',
  // 主要
  main : 'alarmLevel2',
  // 次要
  secondary : 'alarmLevel3',
  // 提示
  tips :  'alarmLevel4',
};

/**
 * 步骤条数据集合
 */
export const SET_DATA = [
  {
    number: 1,
    activeClass: ' active',
    title: '基本信息'
  },
  {
    number: 2,
    activeClass: '',
    title: '策略详情'
  },
  {
    number: 3,
    activeClass: '',
    title: '完成'
  }
];









