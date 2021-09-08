import {AreaModel} from '../../../../../core-module/model/facility/area.model';

export class TopDeviceModel {
  status: any;
  address: string;
  accountabilityUnitName: string;
  areaInfo: AreaModel = new AreaModel();
  areaName: string;
  cityName: string;
  createTime: string;
  createUser: string;
  ctime: number;
  deployStatus: string;
  deviceCode: string;
  deviceId: string;
  deviceName: string;
  deviceStatus: string;
  deviceType: string;
  districtName: string;
  isCollecting: string;
  isDeleted: string;
  lockList: any;
  positionBase: string;
  positionGps: string;
  provinceName: string;
  remarks: any;
  serialNum: any;
  specificFieldId: any;
  updateTime: string;
  updateUser: string;
  utime: number;
}
