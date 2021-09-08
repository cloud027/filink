/**
 * 地图枚举
 */
export enum FilinkMapEnum {
  baiDu = 'baidu',
  google = 'google'
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


// 地图图标样式
export enum MapIconSizeEnum {
  // 默认设施图标大小
  defaultIconSize = '18-24'
}

// 地图判断类型枚举
export enum MapTypeEnum {
  facility = 'facility',
  equipment = 'equipment',
  device = 'device'
}

// 浮窗类型
export enum TipWindowType {
  /**
   * 单个设施设备点
   */
  m = 'm',
  /**
   * 重合设备点
   */
  e = 'e',
  /**
   * 聚合点
   */
  c = 'c',
  /**
   * 区域点
   */
  a = 'a',
  /**
   * 线条
   */
  l = 'l',
  /**
   * 项目/规划下设施点
   */
  p = 'p'

}

