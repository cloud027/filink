/**
 * 树节点模型
 */
export class TreeNodeModel {
  /**
   * 是否选中
   */
  checked: boolean;
  /**
   * 父节点
   */
  father: TreeNodeModel;
  /**
   * 子节点
   */
  children: TreeNodeModel[];
}
