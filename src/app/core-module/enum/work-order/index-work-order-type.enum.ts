/**
 * 工单类型
 */
export enum IndexWorkOrderTypeEnum {
  /**
   * 巡检
   */
  inspection = 'inspection',
  /**
   * 销障
   */
  clearFailure = 'clear_failure',
  /**
   * 告警确认
   */
  confirm = 'confirm',
  /**
   * 安装
   */
  install = 'install',
  /**
   * 拆除
   */
  removal = 'removal'
}
