import {PicResourceEnum} from '../../../../core-module/enum/picture/pic-resource.enum';

/**
 * 监控信息入参模型
 */
export class FilterConditionsModel {
  area: string[];
  group: string[];
}


/**
 * 监控信息入参模型
 */
export class EquipmentListResultModel {
  /**
   * 设施id
   */
  deviceIdList: string[];
  filterConditions: FilterConditionsModel = new FilterConditionsModel();

  constructor(deviceIdList?: string[], filterConditions?: FilterConditionsModel) {
    this.deviceIdList = deviceIdList;
    this.filterConditions = filterConditions;
  }
}

/**
 * 设备信息空闲数量入参模型
 */
export class EquipmentListFreeNumResultModel {
  deviceId: string;
  businessStatus: string;
}

/**
 * 监控信息入参模型
 */
export class PicResultModel {
  objectId: string;
  objectType: string;
  resource: PicResourceEnum;

  constructor(objectId?: string, resource?: PicResourceEnum) {
    this.objectId = objectId;
    this.resource = resource || PicResourceEnum.realPic;
  }
}
