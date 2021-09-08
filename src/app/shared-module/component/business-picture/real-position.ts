export class RealPosition {
  /**
   * 主键id
   */
  public id?: string;
  /**
   * 父id
   */
  public parentId?: string;
  /**
   * 编号坐标x (用于后期微调处理)
   */
  public colNo?: number;
  /**
   * 编号坐标y
   */
  public rowNo?: number;
  /**
   * 横坐标x
   */
  public abscissa?: number;
  /**
   * 纵坐标Y
   */
  public ordinate?: number;
  /**
   * 顺序编号和业务编号差不多
   */
  public businessNum?: number;
  /**
   * 走向 不需要存走向
   * 走向和编号规则仅仅只是计算出业务编号而已
   */
  public trend?: number;
  /**
   * A/B面 templateSideEnum
   */
  public side?: number;
  /**
   * 列 计算坐标需要用到
   */
  public col?: number;
  /**
   * 行 计算坐标需要用到
   */
  public row?: number;
  /**
   * TemplateCodeRuleEnum
   * 编号规则
   */
  public codeRule?: number;
  /**
   * 状态 用于实景图中 每个设施的都不相同
   */
  public state?: number;
  /**
   * 设施id(唯一和设施绑定 )
   */
  public deviceId?: number;
  /**
   * 设施类型 DeviceTypeEnum
   */
  public deviceType?: number;
  /**
   * 适配器类型
   */
  public adapterType?: number;
  /**
   * 高度
   */
  public height?: number;
  /**
   * 宽度
   */
  public width?: number;
  /**
   * 标签id  App 端预留
   */
  public labelId?: number;
  /**
   * 标签状态  App 端预留
   */
  public labelState?: number;

  /**
   * 关系id 用于关联和模板的关系
   */
  public relationId?: string;
  /**
   * 子集 用逗号分隔开
   * 不需要这个
   */
  public childRealPositionId?: string;

  /**
   * 子节点列表
   */
  public childList?: Array<RealPosition>;

  /**
   * 端口所属盘号
   */
  public discNum?;
  /**
   * 端口状态
   */
  public portCableState?: number;

}
