import {LoopPullCloseDetailModel} from './loop-pull-close-detail.model';

/**
 * 回路拉合闸参数模型
 */
export class LoopPullCloseBreakModel {
  /**
   * 回路参数集合
   */
  loopList: LoopPullCloseDetailModel[];

  constructor(loopList) {
    this.loopList = loopList;
  }
}

