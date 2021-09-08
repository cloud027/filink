/**
 * 控制指令枚举
 */
export enum ControlInstructEnum {
  /**
   * 开灯
   */
  turnOn = 'TURN_ON',
  /**
   * 上电
   */
  up = 'up',
  /**
   * 上电
   */
  down = 'down',
  /**
   * 关灯
   */
  turnOff = 'TURN_OFF',

  /**
   * 拉闸
   */
  closeBreak = 'CLOSE_BRAKE',
  /**
   * 合闸
   */
  openBreak = 'OPEN_BRAKE',
  /**
   * 调光
   */
  dimming = 'DIMMING',
  /**
   * 关灯策略下发
   */
  strategyDistributeTurnOff = 'STRATEGY_DISTRIBUTE_TURN_OFF',
  /**
   * 拉闸策略下发
   */
  strategyDistributeCloseBrake = 'STRATEGY_DISTRIBUTE_CLOSE_BRAKE',
  /**
   * 调光策略下发
   */
  strategyDistributeDimming = 'STRATEGY_DISTRIBUTE_DIMMING',
  /**
   * 配置下发(基本信息)
   */
  configurationDistributeBaseinfo = 'CONFIGURATION_DISTRIBUTE_BASEINFO',
  /**
   * 配置下发(阈值)
   */
  configurationDistributeThreshold = 'CONFIGURATION_DISTRIBUTE_THRESHOLD',
  /**
   * 信息屏开启
   */
  screenOpen = 'SCREEN_OPEN',
  /**
   * 信息屏关闭
   */
  screenClose = 'SCREEN_CLOSE',
  /**
   * 信息屏关闭策略下发
   */
  strategyDistributeScreenClose = 'STRATEGY_DISTRIBUTE_SCREEN_CLOSE',
  /**
   * 信息屏播放
   */
  screenPlay = 'SCREEN_PLAY_REAL_TIME',
  /**
   * 信息屏播放策略下发
   */
  strategyDistributeScreenPlay = 'STRATEGY_DISTRIBUTE_SCREEN_PLAY',
  /**
   * 设置亮度
   */
  setBrightness = 'DIMMING',
  /**
   * 设置音量
   */
  setVolume = 'SET_VOLUME',
  setBroadcastVolume = 'BROADCAST_VOLUME',
  /**
   * 摄像头登录
   */
  cameraOperaLogin = 'CAMERA_OPERA_LOGIN',
  /**
   * 获取摄像头视频流地址
   */
  getVideoStreamAddress = 'GET_VIDEO_STREAM_ADDRESS',
  /**
   * 自动发现
   */
  discovery = 'DISCOVERY',
  /**
   * 自动发现
   */
  getRtspUrl = 'GET_RTSP_URL',
  /**
   * 方向
   */
  adjustCameraDirection = 'ADJUST_CAMERA_DIRECTION',
  /**
   * 聚焦
   */
  zoom = 'ZOOM',
  /**
   * 调焦
   */
  focus = 'FOCUS',
  /**
   * 光圈调节
   */
  apertureAdjustment = 'APERTURE_ADJUSTMENT',
  /**
   * 设置预置位
   */
  setPresetPosition = 'SET_PRESET_POSITION',
  /**
   * 清除预置位
   */
  delPresetPosition = 'DEL_PRESET_POSITION',
  /**
   * 转到预置位
   */
  goPresetPosition = 'GO_PRESET_POSITION',
  /**
   * 注销
   */
  cancellation = 'CANCELLATION',
  /**
   * 关闭
   */
  stopRealPlay = 'STOP_REAL_PLAY',
  /**
   * 集中控制器和但等控制器绑定指令
   */
  docNum = 'CONFIGURATION_EQUIPMENT_DOC_NUM',
  /**
   * 分组编号指令
   */
  groupNum = 'CONFIGURATION_EQUIPMENT_GROUP_NUM',
  broadcastVolume = 'BROADCAST_VOLUME',
  broadcastVolumeSave = 'BROADCAST_VOLUME_SAVE',
  /**
   * 上电
   */
  powerOn = 'POWER_ON',
  /**
   * 下电
   */
  powerOff = 'POWER_OFF',
  /**
   * 开锁
   */
  unLock = 'UNLOCK',
  /**
   * 广播设备停止播放
   */
  broadcastStop = 'BROADCAST_PLAY_STOP',
    /**
     * 广播设备音量调整
     */
  broadcastOnline = 'BROADCAST_PLAY_REAL_TIME',
  broadcastOnlineStop = 'BROADCAST_PLAY_REAL_TIME_STOP',
  /**
   * 广播设备插播
   */
  broadcastPlay = 'BROADCAST_PLAY',
  /**
   * 呼叫
   */
  callStart = 'CALL',
  /**
   * 监听
   */
  callMonitor = 'LISTEN',
  callAccept = 'ACCEPT_CALL',
  callHangUp = 'LISTEN',
}
