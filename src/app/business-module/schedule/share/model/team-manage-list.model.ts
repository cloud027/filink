/**
 * 班组管理列表模型
 */
import {PersonInfoModel} from './person-info.model';

export class TeamManageListModel {
  /**
   * 主键id
   */
  id: string;
  /**
   * 单位名称
   */
  deptName: string;
  /**
   * 单位code
   */
  deptCode?: string;
  /**
   * 单位id
   */
  deptId?: string;
  /**
   * 班组名称
   */
  teamName: string;
  /**
   * 班组成员名称
   */
  personInformationNames: string;
  /**
   * 选择的班组成员id集合
   */
  personIdList?: string[];
  /**
   * 班组成员信息
   */
  personInformationVOList?: PersonInfoModel[];
  /**
   * 备注
   */
  remark: string;
  /**
   * 是否选中
   */
  checked?: boolean;
}
