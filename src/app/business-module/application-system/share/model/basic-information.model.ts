import {StrategyRefListModel} from "./policy.control.model";

/**
 * 基础信息模型
 */
export class BasicInformationModel {
  /**
   * 回路
   */
  public loop: StrategyRefListModel[];
  /**
   * 设备
   */
  public equipment: StrategyRefListModel [];
  /**
   * 分组
   */
  public group: StrategyRefListModel[];
}
