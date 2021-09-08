import {DeviceTypeEnum} from '../../enum/facility/facility.enum';

/**
 * 获取通知人用户信息的入参模型
 */
export class AlarmNotifierRequestModel {
  /**
   * 责任单位list
   */
  deptList: string[];
  /**
   * 设施类型list
   */
  deviceTypes: DeviceTypeEnum[];

  constructor(deptList = [], deviceTypes = []) {
    this.deptList = deptList;
    this.deviceTypes = deviceTypes;
  }

}
