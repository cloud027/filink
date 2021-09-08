/**
 * 告警类型
 */
export enum AlarmTypeEnum {
  /**
   * 通信告警
   */
  commAlarm = '1',
  /**
   * 业务质量告警
   */
  businessAlarm = '2',
  /**
   * 环境告警
   */
  environmentAlarm = '3',
  /**
   * 电力告警
   */
  powerAlarm = '4',
  /**
   * 安全告警
   */
  safeAlarm = '5',
  /**
   * 设备告警
   */
  equipmentAlarm = '6'
}

export enum AlarmTypeRankEnum {
  /**
   * 通信告警
   */
  commAlarm = 'commAlarm',
  /**
   * 业务质量告警
   */
  businessAlarm = 'businessAlarm',
  /**
   * 环境告警
   */
  environmentAlarm = 'environmentAlarm',
  /**
   * 电力告警
   */
  powerAlarm = 'powerAlarm',
  /**
   * 安全告警
   */
  safeAlarm = 'safeAlarm',
  /**
   * 设备告警
   */
  equipmentAlarm = 'equipmentAlarm'
}


/**
 * 告警类型
 */
export enum FacilityAlarmTypeEnum {
  /**
   * 当前告警
   */
  currentAlarm = 1,
  /**
   * 历史告警
   */
  historyAlarm = 2,
}

/**
 * 告警类型
 */
export enum AlarmTypeCodeEnum {
  // 通信告警
  commAlarm = '1',
  // 业务质量告警
  businessAlarm = '2',
  // 环境告警
  environmentAlarm = '3',
  // 电力告警
  powerAlarm = '4',
  // 安全告警
  safeAlarm = '5',
  // 设备告警
  equipmentAlarm = '6',
  // 告警预警
  alarmWarning = '7'
}
