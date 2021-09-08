/**
 *  地图回路画线返回模型
 */
import {FacilityListModel} from './facility-list.model';

export class LoopDrawDeviceModel {
  /**
   * 回路管理设施数据
   */
  public loopDeviceMap: FacilityListModel[];
  /**
   * 中心点
   */
  public positionCenter: string;
  /**
   * 回路名称
   */
  public loopName: string;
}
