export class Template {
  /**
   * 主键id
   */
  public id?: string;
  /**
   * 父id 最高默认 root
   */
  public parentId?: string;
  /**
   * 名称
   */
  public name?: string;
  /**
   * 行数
   */
  public row?: number;
  /**
   * 列数
   */
  public col?: number;
  /**
   * 编号
   */
  public num?: number;
  /**
   * TemplateTrendEnum
   * 走向(列优,行优)
   */
  public trend?: number;
  /**
   * 设施类型
   */
  public deviceType?: number;
  /**
   * 模板类型 TemplateTypeEnum
   */
  public templateType?: number;
  /**
   * 编号规则 Template
   * <p>
   * (0/1/2/3)
   * (左上/左下/右上/右下)
   */
  public codeRule?: number;
  /**
   * 编号坐标x
   */
  public xNo?: number;
  /**
   * 编号坐标y
   */
  public yNo?: number;
  /**
   * TemplateSideEnum
   * 朝向 (A/B/无)
   */
  public side?: number;
  /**
   * 单双面
   */
  public reversible?: number;

  /**
   * 子模板id 用, 分隔开
   */
  public childTemplateId?: string;
  /**
   * 子模板list
   */
  public childTemplateList?: Array<Template>;

  /**
   * 摆放状态
   */
  public putState?: number;
}

/**
 * 模板类型
 */
export enum TemplateType {
  BOX = 0,
  FRAME = 1,
  BOARD = 2,
}

/**
 * 模板数字颜色
 */
export enum TemplateColor {
  boxTemplate = 0,
  frameTemplate = 1,
  theTemplate = 2,
}

/**
 * 单双面
 */
export enum Reversible {
  SINGLE = 1,
  DOUBLE = 2,
}

export enum BoardPutState {
  /**
   * 竖放
   */
  STELLEN = 0,
  /**
   * 横放
   */
  LAY = 1
}

/**
 * 设施类型
 */
export enum DeviceTypeEnum {
  /**
   * 设施类型 箱
   */
  DEVICE_TYPE_BOX = 0,
  /**
   * 设施类型 框
   */
  DEVICE_TYPE_FRAME = 1,
  /**
   * 设施类型 盘
   */
  DEVICE_TYPE_DISC = 2,
  /**
   * 设施类型 端口
   */
  DEVICE_TYPE_PORT = 3,
  /**
   * A面 前端显示用
   */
  DEVICE_TYPE_BOX_A = 4,
  /**
   * B面 前端显示用
   */
  DEVICE_TYPE_BOX_B = 5
}

export enum BoardStateEnum {
  /**
   * 不在位
   */
  ABSENT = 0,
  /**
   * 在位
   */
  REIGN = 1

}

export enum PortStateEnum {
  /**
   * 预占用
   */
  PRE_OCCUPY = 0,
  /**
   * 占用
   */
  OCCUPY = 1,
  /**
   * 空闲
   */
  FREE = 2,
  /**
   * 异常
   */
  EXCEPTION = 3,
  /**
   * 虚占
   */
  VIRTUAL_OCCUPY = 4,
}
export const PortStateEnumString = {
  /**
   * 预占用
   */
  0: '预占用',
  /**
   * 占用
   */
  1: '占用',
  /**
   * 空闲
   */
  2: '空闲',
  /**
   * 异常
   */
  3: '异常',
  /**
   * 虚占
   */
  4: '虚占',
};
export enum MaxNum {

  /**
   * 最大纤芯数
   */
  Maximum = 3456
}

export enum LabelTypeEnum {

  /**
   * RFID
   */
  RFID = 0,

  /**
   * 二维码
   */
  QR_CODE = 1,

  /**
   * 无
   */
  NO_TYPE = 2,
}

export enum AdapterTypeEnum {
  /**
   * FC
   */
  FC = 0,
  /**
   * SC
   */
  SC = 1,
}

export enum RfidStatusEnum {
  /**
   * 正常
   */
  Normal = 0,
  /**
   * 异常
   */
  Abnormal = 1
}

export enum OppositePortStateEnum {
  /**
   * 预占用
   */
  PRE_OCCUPY = '0',
  /**
   * 占用
   */
  OCCUPY = '1',
  /**
   * 空闲
   */
  FREE = '2',
  /**
   * 异常
   */
  EXCEPTION = '3',
  /**
   * 虚占
   */
  VIRTUAL_OCCUPY = '4',
}

export enum OppositeLabelTypeEnum {

  /**
   * RFID
   */
  RFID = '0',

  /**
   * 二维码
   */
  QR_CODE = '1',

}

export enum OppositeRfidStatusEnum {
  /**
   * 正常
   */
  Normal = '0',
  /**
   * 异常
   */
  Abnormal = '1'
}
