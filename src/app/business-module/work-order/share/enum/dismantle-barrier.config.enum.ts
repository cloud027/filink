/** 拆除工单的 枚举 */

/** 新增编辑时 选择的 拆除设施/设备 */
export enum DismantleTypeEnum {
  /** 设施 */
  device = '0',
  /** 设备 */
  equipment = '1',
}

/** 关联告警 关联故障 的类型 */
export enum DismantleWarnTroubleEnum {
  /** 关联告警 */
  warn = '1',
  /** 关联故障 */
  trouble = '2',
}

/** 新增删除的时候后台需要的判断字段 */
export enum InsertOrDeleteEnum {
  /** 新增 */
  add = 'add',
  /** 删除 */
  delete = 'delete',
}

/**
 * 图片来源
 */
export enum QueryImgResource {
  /**
   * 告警
   */
  alarm = '1',
  /**
   *工单
   */
  order = '2',
  /**
   * 实景图
   */
  realImage = '3',
}

/**
 * 图片设施或者设备
 */
export enum QueryImgType {
  /**
   * 设施图片
   */
  device = '1',
  /**
   * 设备图片
   */
  equipment = '2',
}
