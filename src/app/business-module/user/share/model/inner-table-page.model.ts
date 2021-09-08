export class InnerTablePageModel<T> {
  /**
   * 列表内容数据
   */
  data: T;
  /**
   * 当前页数
   */
  pageNum: number;
  /**
   * 当前数量
   */
  size: number;
  /**
   * 总数量
   */
  totalCount: number;
  /**
   * 总页数
   */
  totalPage: number;
}
