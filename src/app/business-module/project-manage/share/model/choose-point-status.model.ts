/**
 * 勾选的项目智慧杆点位状态模型
 */
import {PointStatusEnum} from '../../../../core-module/enum/plan/point-status.enum';

export class ChoosePointStatusModel {
  /**
   * 地图上是否显示
   */
  checked: boolean;
  /**
   * 建设状态
   */
  code: PointStatusEnum;
  /**
   * 建设状态
   */
  label: string;
  value: PointStatusEnum;
}
