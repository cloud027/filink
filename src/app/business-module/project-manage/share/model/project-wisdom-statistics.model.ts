import {PointStatusEnum} from '../../../../core-module/enum/plan/point-status.enum';

/**
 * 项目智慧杆统计模型
 */
export class ProjectWisdomStatisticsModel {
  /**
   * 点位数量
   */
  public pointCount: number;
  /**
   * 点位状态 待建/在建/已建
   */
  public  pointStatus: PointStatusEnum;
}
