/**
 * onvif状态枚举
 */
export enum EnableOnvifStatusEnum {
  // 是
  yes = '1',
  // 否
  no = '0',
}

export enum OtherSettingsEnum {
  // 开启音频
  openVolume = '1',
  // 关闭音频
  closeVolume = '0',
}

/**
 * 业务状态
 */
export enum BusinessStatusEnum {
  //  释放
  release = '1',
  // 锁定
  lockEquipment = '2'
}

/**
 * 摄像机接入类型
 */
export enum CameraAccessTypeEnum {
  // rtsp类型
  rtsp = 'RTSP',
  // onvif类型
  onvif = 'ONVIF'
}

