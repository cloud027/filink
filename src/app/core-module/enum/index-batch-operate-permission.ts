/**
 * 摄像头
 */
export enum IndexCameraOperatePermission {
  /**
   * 开权限
   */
  TURN_ON = '05-2-1-6',
  /**
   * 关权限
   */
  TURN_OFF =  '05-2-1-7',
  /**
   * 上电
   */
  POWER_ON =  '05-2-1-8',
  /**
   * 下电
   */
  POWER_OFF =  '05-2-1-9',
  /**
   * 播放/停止
   */
  play =  '05-2-1-1',
  /**
   * 云台控制
   */
  panTiltControl =  '05-2-1-2',
  /**
   * 转到预置位
   */
  goToPresetPosition =  '05-2-1-3',
  /**
   * 预置位保存
   */
  save =  '05-2-1-4',
  /**
   * 预置位删除
   */
  delete =  '05-2-1-5',
}
/**
 * 信息屏
 */
 export enum IndexInformationScreenOperatePermission {
   /**
    * 开权限
    */
   TURN_ON = '09-2-2-1-1',
   /**
    * 关权限
    */
   TURN_OFF =  '09-2-2-1-2',
   /**
    * 上电
    */
   POWER_ON =  '09-2-2-1-3',
   /**
    * 下电
    */
   POWER_OFF =  '09-2-2-1-4',
   /**
    * 亮度
    */
   DIMMING = '09-2-2-1-5',
   /**
    * 音量
    */
   SET_VOLUME = '09-2-2-1-8',
   /**
    * 节目下发
    */
   // programDistribution = '05-2-2-1'
 }
/**
 * 照明
 */
export enum IndexIlluminationOperatePermission {
  /**
   * 开权限
   */
  TURN_ON = '09-1-2-1-1',
  /**
   * 关权限
   */
  TURN_OFF =  '09-1-2-1-2',
  /**
   * 上电
   */
  POWER_ON =  '09-1-2-1-3',
  /**
   * 下电
   */
  POWER_OFF =  '09-1-2-1-4',
  /**
   * 亮度
   */
  DIMMING = '09-1-2-1-5',
}
/**
 * 广播
 */
export  enum IndexBroadcastOperatePermission {
  BROADCAST_PLAY = '09-6-3-0-1',
  BROADCAST_PLAY_REAL_TIME = '09-6-3-0-2',
  BROADCAST_VOLUME_SAVE = '09-6-3-0-3',
  BROADCAST_PLAY_STOP = '09-6-3-0-4',
}
export  enum IndexCallOperatePermission {

}
