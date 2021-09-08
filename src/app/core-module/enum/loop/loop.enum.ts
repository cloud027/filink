/**
 * 回路类型
 */
export enum LoopTypeEnum {
  // 照明回路
  illumination = '1',
  // 通信回路
  communication = '2',
  // 自定义
  customize = '0'
}
/**
 * 回路状态
 */
export enum LoopStatusEnum {
  // 未知
  unKnown= '3',
  // 拉闸
  brake = '1',
  // 合闸
  closing = '2'
}
