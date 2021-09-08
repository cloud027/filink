/**
 * 地图判断类型枚举
 */
export enum MapTypeEnum {
  /**
   * 设施分层
   */
  facility = 'facility',
  /**
   * 设备分层
   */
  equipment = 'equipment',
  /**
   * 设施分层
   */
  device = 'device'
}

/**
 * 地图点击事件回传类型枚举
 */

export enum MapEventTypeEnum {
  /**
   * 区域聚合点击事件
   */
  areaPoint = 'areaPoint',
  /**
   * 地图点击事件
   */
  mapClick = 'mapClick',
  /**
   * 点击聚合点
   */
  clickClusterer = 'clickClusterer',
  /**
   * 点击设施
   */
  selected = 'selected',
  /**
   * 点击地图空白
   */
  mapBlackClick = 'mapBlackClick',
  /**
   * 城市控件打开与关闭
   */
  cityListControlStatus = 'cityListControlStatus',
  /**
   * 城市切换
   */
  cityChange = 'cityChange',
  /**
   * 地图拖动
   */
  mapDrag = 'mapDrag',
  /**
   * 重置设施id
   */
  resetFacilityId = 'resetFacilityId',
  /**
   * 拓扑高亮
   */
  showLight = 'showLight'
}


/**
 * 区域等级
 */
export enum AreaRankEnum {
  /**
   * 一级区域
   */
  one = '1',
  /**
   * 二级区域
   */
  two = '2',
  /**
   * 三级区域
   */
  three = '3',
  /**
   * 四级区域
   */
  four = '4',
  /**
   * 五级区域
   */
  five = '5',
}

/**
 * 区域等级颜色
 */
export enum AreaColorEnum {
  /**
   * 一级区域颜色
   */
  one = '#72ddd9',
  /**
   * 二级区域颜色
   */
  two = '#78e3af',
  /**
   * 三级区域颜色
   */
  three = '#56c2ea',
  /**
   * 四级区域颜色
   */
  four = '#ffc878',
  /**
   * 五级区域颜色
   */
  five = '#ff8a73',
}

/**
 * 地图分层步骤条
 */
export enum StepIndexEnum {
  /**
   * 上一步
   */
  back = 0,
  /**
   * 设备分层
   */
  next = 1
}

/**
 * 视图类型
 */
export enum ViewEnum {
  /**
   * 规划视图
   */
  planView = 'planView',
  /**
   * 项目视图
   */
  projectView = 'projectView',
  /**
   * 运维视图
   */
  maintenanceView = 'maintenanceView',
  /**
   * 项目视图
   */
  projectViewList = 'projectViewList',
  /**
   * 运维视图
   */
  planViewList = 'planViewList',
}

/**
 * 智慧杆状态图标和颜色
 */
export enum PointProjectStatusEnum {
  // 待建
  runnable = '#cccccc',
  // 在建
  running = '#8ecaf7',
  // 已建
  end = '#91e15b'
}

/**
 * 智慧杆状态图标和颜色
 */
export enum PointOrProjectStatusEnum {
  // 待建
  runnable = 'runnable',
  // 在建
  running = 'running',
  // 已建
  end = 'end'
}


