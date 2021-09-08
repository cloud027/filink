/**
 * core-end
 * 纤芯成端配置文件
 */

/**
 * 光缆段
 */
export enum cableSegmentType {
  // 光缆段的框
  cableSegmentBox = 'cableSegmentBox',
  // 光缆头
  StartOpticalCable = 'StartOpticalCable',
  // 光缆尾
  endOpticalCable = 'endOpticalCable'
}

/**
 * 框
 */
export enum typeOfBoxTrayPort {
  // 端口
  port = 'port',
  // 盘
  portTray = 'portTray',
  // 框
  portBox = 'portBox'
}

/**
 * 模式
 */
export enum selectionMode {
  // 点选模式
  arrow = 'arrow',
  // 框选模式
  rectangle = 'rectangle',
}

/**
 * 数字类型
 * 用于纤芯成端绘图坐标与Number类型判断
 */
export const numberType = {
  zero: 0,
  ZeroFive: 0.5,
  one: 1,
  two: 2,
  three: 3,
  Fives: 5,
  Seven: 7,
  ten: 10,
  fourteen: 14,
  eighteen: 18,
  forty: 40,
  fortyThree: 43,
  oneHundred: 100,
  twoHundredAndFive: 250,
  threeHundredFour: 340,
  fourHundred: 400,
  fourHundredAndFive: 450,
  fiveHundred: 500
};

/**
 * 颜色类型
 */
export const colorType = {
  coreIsNotConnected: '#FFFFF8',
  otherTheCoreIsConnected: '#E0CF16',
  theCoreIsConnected: '#E04F77',
  frameBorder: '#1D4876',
  gray: '#555',
  blue: '#2898E0'
};


/**
 * 绘制熔纤box数字参数
 */
export const cableBox = {
  /**
   * 本端box X坐标
   */
  localX: 600,
  /**
   * 对端box X坐标
   */
  peerX: 1200,
  /**
   * 本对端box y坐标
   */
  Y: -400,
  /**
   * 本对端box长度
   */
  W: 250,
  /**
   * 本对端box宽度参数
   */
  H: 9.5,
  Hc: 400,
  /**
   * box字体大小
   */
  fontSize: 18
};

/**
 * 绘制熔纤本端光缆段相关参数
 */
export const localCable = {
  /**
   * 起始端 X坐标
   */
  startX: 540,
  /**
   * 起始端Name
   */
  startN: '1-1',
  /**
   * 尾端 X坐标
   */
  endX: 650,
  /**
   * y坐标参数
   */
  Y: 40,
  Yc: 360,
  /**
   * 长度
   */
  W: 100,
  /**
   * 高度
   */
  H: 7,
  /**
   * 显示优先级
   */
  zIndex: 3,
  /**
   * 纤芯号起始
   */
  num: 1
};

/**
 * 绘制熔纤对端光缆段相关参数
 */
export const peerCable = {
  /**
   * 起始端 X坐标
   */
  startX: 1140,
  /**
   * 起始端Name
   */
  startN: '1-1',
  /**
   * 尾端 X坐标
   */
  endX: 1250,
  /**
   * y坐标参数
   */
  Y: 40,
  Yc: 360,
  /**
   * 长度
   */
  W: 100,
  /**
   * 高度
   */
  H: 7,
  /**
   * 显示优先级
   */
  zIndex: 3,
  /**
   * 纤芯号起始
   */
  num: 1
};


/**
 * 纤芯熔接颜色枚举
 */

export const coreFusionColor = {
  /**
   * 设施内本对端纤芯互连
   */
  coreUsedIn: '#E04F77',
  /**
   * 纤芯未占用初始色
   */
  initCore: '#FFF',
  /**
   * 纤芯占用状态
   */
  coreUsed: '#E0CF16',
  /**
   * 光缆段边框颜色
   */
  label: '#1D4876',
  /**
   * box框背景色
   */
  boxBackground: '#ebebeb',
  /**
   * 光缆段名称字段颜色 连线颜色
   */
  cableFont: '#2eaae6',
};
