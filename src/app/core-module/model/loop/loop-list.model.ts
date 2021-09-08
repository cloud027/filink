/**
 * 回路列表模型
 */
import {LoopStatusEnum, LoopTypeEnum} from '../../enum/loop/loop.enum';

export class LoopListModel {
  /**
   * 回路id
   */
  public loopId: string;
  /**
   * 回路名称
   */
  public loopName: string;
  /**
   * 回路编号
   */
  public loopCode: string;
  /**
   * 回路状态
   */
  public loopStatus: any;
  /**
   * 回路类型 回路列表自定义时字符串
   */
  public loopType: any;
  /**
   * 回路类型自定义内容
   */
  public customizeLoopType: string;
  /**
   * 所属配电箱id
   */
  public distributionBoxId: string;
  /**
   * 所属配电箱名称
   */
  public distributionBoxName: string;

  /**
   * 控制对象id
   */
  public centralizedControlId: string;
  /**
   * 控制对象
   */
  public centralizedControlName: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 拉闸合闸按钮是否显示
   */
  public isShowOperateIcon: boolean;

}
