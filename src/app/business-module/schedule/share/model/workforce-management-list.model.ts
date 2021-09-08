import { TeamManageListModel } from './team-manage-list.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';

/**
 * 排班管理列表模型
 */
export class WorkforceManagementListModel {
  /**
   * 排班id
   */
  id: string;
  /**
   * 开始日期
   */
  startDate: number | Date;
  /**
   * 结束日期
   */
  endDate: number | Date;
  /**
   * 班组名称集合
   */
  teamNames: string;
  /**
   * 班组信息集合
   */
  teamVOList?: TeamManageListModel[];
  /**
   * 班次名称
   */
  shiftName: string;
  /**
   * 班次id
   */
  shiftId?: string;
  /**
   * 区域名称集合
   */
  areaNames: string;
  /**
   * 区域信息集合
   */
  areaVOList?: AreaModel[];
  /**
   * 备注
   */
  remark: string;
  /**
   * 是否选中
   */
  checked?: boolean;
}
