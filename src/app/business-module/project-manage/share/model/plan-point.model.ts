import {WisdomPointInfoModel} from '../../../../core-module/model/plan/wisdom-point-info.model';

export class PlanPointModel {
  /**
   * 规划点的中心点
   */
  point: PointPositionModel;

  /**
   * 规划点位集合
   */
  pointList?: WisdomPointInfoModel[];

  /**
   * 规划点位集合
   */
  pointInfoList?: WisdomPointInfoModel[];

  /**
   * 规划下点位是否全部被使用
   */
  allUsed?: boolean;
}

export class PointPositionModel {
  /**
   * 规划id
   */
  planId: string;

  /**
   * 坐标
   */
  xposition: string;
  yposition: string;
}
