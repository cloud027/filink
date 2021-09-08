import {PlanInfoModel} from '../../../../core-module/model/plan/plan-info.model';

/**
 * 地图新增规划点位参数模型
 */
export class PointParamsModel {

  /**
   * 规划id
   */
  public planId: string;

  /**
   * 名称重复解决方案
   */
  public solution: string;

  /**
   * 名称起始编号
   */
  public startingNumber: string;

  /**
   * 规划点位信息
   */
  public pointInfoList: PlanInfoModel[];

  /**
   *  规划id集合
   */
  public pointNameList: string[];


}
