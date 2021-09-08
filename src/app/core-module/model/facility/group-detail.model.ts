import {GroupListModel} from '../group/group-list.model';
import {FacilityListModel} from './facility-list.model';
import {EquipmentListModel} from '../equipment/equipment-list.model';

export class GroupDetailModel extends GroupListModel {

  /**
   * 分组关联设施
   */
  public groupDeviceInfoDtoList: FacilityListModel[] = [];

  /**
   * 分组关联设备
   */
  public groupEquipmentDtoList: EquipmentListModel[] = [];

  /**
   * 设施Id
   */
  public groupDeviceInfoIdList: string[] = [];

  /**
   * 设备id
   */
  public groupEquipmentIdList: string[] = [];
}
