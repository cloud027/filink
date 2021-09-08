/**
 * 设施端口数据模型
 */
export class FacilityPortInfo {
  /**
   * 端口号
   */
  public portId: string;
  /**
   * 智能标签ID
   */
  public rfId: string;
  /**
   * 状态
   */
  public state: string;
  /**
   * 适配器类型
   */
  public adapterType: string;
  /**
   * 标签类型
   */
  public labelType: string;
  /**
   * 光缆段信息
   */
  public opticCableSectionName: string;
  /**
   * 纤芯信息
   */
  public cableCore: string;
  /**
   * 智能标签备注信息
   */
  public remark: string;

}
