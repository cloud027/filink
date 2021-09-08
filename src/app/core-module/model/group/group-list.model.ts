/**
 * 分组列表模型
 */
import {GroupTypeEnum} from '../../enum/group/group.enum';

export class GroupListModel {

  /**
   * 分组Id
   */
  public groupId: string;

  /**
   * 分组名称
   */
  public groupName: string;

  /**
   * 备注
   */
  public remark: string;
  /**
   * 分组类型
   */
  public groupType: GroupTypeEnum;
  /**
   * 设备分组按钮控制
   */
  public isNotEquipmentGroup: boolean;
  public checked?: boolean;
}
