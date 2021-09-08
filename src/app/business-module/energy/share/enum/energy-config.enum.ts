export enum OperationButtonEnum {
  // 编辑
  edit = 'edit',
  // 删除
  delete = 'delete',
  // 启用
  enable = 'enable',
  // 禁用
  disable = 'disable',
  // 激活
  active = 'active',
  // 更新
  update = 'update',
}

/**
 * 判断是哪个页面调用 collection-tables 组件
 */
export enum switchPageEnum {
  /**
   * 能耗节点页面
   */
  energyNodes = '2',
  /**
   * 实时数据页面
   */
  timeData = '1',
}

// -------------------------------------能耗节点------------------------------------
/** 是否是 已有设施选择的数据 */
export enum EnergySelectedType {
  /** 是 */
  yes = 1,
  /** 否 */
  no = 0,
}
/** 能耗节点新增的时候 已有设备 和 通信设备 */
export enum EnergyOpearEquipmentTXEnum {
  /** 已有设备 */
  equipment = 1,
  /** 通信设备 */
  communication = 2,
}

/** 能耗节点新增的时候 采集设施 采集设备 采集回路 */
export enum EnergyInsertCollectionTypeEnum {
  /** 采集设施 */
  device = 1,
  /** 采集设备 */
  equipment = 2,
  /** 采集回路 */
  loop = 3,
}
// -------------------------------------能耗节点------------------------------------

// ------------------------------------- 数据采集任务-----------------------

/**
 * 数据采集任务的状态
 */
export enum dataCollectionTaskStatusEnum {
  /** 执行中 */
  inExecution = '1',
  /** 未开始 */
  notStarted = '2',
  /** 已完成 */
  completed = '3',
  /** 异常 */
  error = '4',
  /** 执行成功 */
  successExecution = '5',
}

/** 数据采集周期 */
export enum collectionTaskCycleEnum {
  /** 逐时 */
  hourly = '7',
  /** 逐天 */
  dayByDay = '8',
  /** 逐月 */
  monthByMonth = '9',
}

// 数据采集的策略状态 策略状态(0/1 (禁用/启用))
export enum collectionTaskOpenCloseEnum {
  // 开启
  Enable = '1',
  // 关闭
  Disable = '0',
}

/**
 * 新增数据采集任务的时候 应用范围用于区分的字段
 */
export enum InsertCollectionTaskRefType {
  areaRefType = '4',
  groupRefType = '2',
  equipmentRefType = '1',
}

/**
 * 应用范围的三个表格
 */
export enum ApplicationScopeTableEnum {
  area = 'area',
  group = 'group',
  equipment = 'equipment',
}

/**
 * 数据采集任务 判断是从哪个页面进入 应用范围的三个表格组件
 */
export enum SwitchPageToTableEnum {
  /** 新增页面 */
  insert = 'insert',
  /** 编辑页面 */
  edit = 'edit',
  /** 详情页面 */
  details = 'details',
}

// ------------------------------------- 数据采集任务-----------------------

// ------------------------------------------ 能耗统计------------------------------------------------------
/** 统计的时间范围枚举 */
export enum energyStatisticsTime {
  /** 日 */
  statisticsHour = 3,
  /** 月 */
  statisticsDay = 2,
  /** 年 */
  statisticsMonth = 1,
}
/** 统计的时间选择器的枚举 */
export enum timeSelectTypeEnum {
  time = 'time',
  day = 'day',
  month = 'month',
  year = 'year',
}
/** 统计范围选择器的枚举 */
export enum statictisRangeTypeEnum {
  /** 项目 */
  statisticsProject = 2,
  /** 区域 */
  statisticsRegion = 1,
}
/** 判断是 能耗统计 还是 排名统计 */
export enum StatisticORRankEnum {
  /** 能耗统计 */
  statistic = 'statistic',
  /** 排名统计 */
  rank = 'rank',
}
/** 统计排序 */
export enum StatisticRankTypeEnum {
  /** "asc" 正序排名   */
  asc = 'asc',
  /**  "desc" 反序排名 */
  desc = 'desc',
}
/** 设置 时间选择器的限制时间间隔 */
export enum DatePickerDisabledNumberEnum {
  /** 5天 */
  fifth = 5,
  /** 七天 */
  week = 7,
}
// ------------------------------------------ 能耗统计------------------------------------------------------

// --------------------------------电费策略---------------------------------
/** 新增电费策略第二步 添加策略类型 */
export enum StepSecondInsertStrategyTypeEnum {
  /** 添加策略 */
  insertStrategy = 1,
  /** 添加月策略 */
  insertMonthStrategy = 2,
  /** 添加小时策略 */
  insertHoursStrategy = 3,
}
/** 电量范围 月份范围 时间范围 的中英文字段*/
export enum StepSecondRangTypeEnum {
  /** 电量范围 */
  powerRange = 'powerRange',
  /** 月份范围 */
  monthRange = 'monthRange',
  /** 时间范围 */
  timeRange = 'timeRange',
}
// --------------------------------电费策略---------------------------------
