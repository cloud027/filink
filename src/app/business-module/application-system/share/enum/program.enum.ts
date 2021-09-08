/**
 * 节目启用禁用
 */
export enum ProgramEnum {
  // 启用
  enable = '0',
  // 禁用
  disabled = '3'
}

/**
 * 节目状态
 */
export enum ProgramStatusEnum {
  // 待审核
  toBeReviewed = '0',
  // 已审核
  reviewed = '1',
  // 审核未通过
  auditFailed = '2',
  // 已禁用
  disabled = '3',
  // 审核中
  underReviewed = '4',
  // 已启用
  enabled = '5'
}
/**
 * 节目状态
 */
export enum ProgramTypeEnum {
  // 信息发布
  info = '0',
  // 广播发布
  broadcast = '1',
}
/**
 * 节目状态
 */
export enum WorkOrderTypeEnum {
  // 信息发布
  info = '0',
  // 广播发布
  broadcast = '1',
}


/**
 * 播放类型
 */
export enum PlayEnum {
  // Video
  video = 'Video',
  // Flash
  flash = 'Flash',
  // Image
  image = 'Image',
  // Gif
  gif = 'Gif'
}

/**
 * 文件类型
 */
export enum FileTypeEnum {
  video = 'Video',
  image = 'Gif-Image',
  // image = 'Image',
  text = 'Text',
  audio = 'Audio',
}

/**
 * 文件名字类型
 */
export enum FileNameTypeEnum {
  video = 'Video',
  audio = 'Audio',
  picture = 'Picture',
  image = 'Image',
  gif = 'Gif',
  swf = 'Flash'
}


/**
 * 图片类型
 */
export enum ImageEnum {
  picture = 'picture'
}

/**
 * 开始结束类型
 */
export enum TimeTypeEnum {
  start = 'start',
  end = 'end',
}




