/**
 * 传感值数据模型
 */
import {PerformanceModel} from './performance.model';

export class PerformDataModel {
  /**
   * 设备类型
   */
 public equipmentType: string;
  /**
   * 设备id
   */
  public equipmentId: string;

  /**
   * 传感值字段数组
   */
  public performanceList: PerformanceModel[] = [];
}
