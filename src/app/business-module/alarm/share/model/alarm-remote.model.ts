import {AlarmRemoteLevelModel} from './alarm-remote-level.model';
import {AlarmRemoteDeviceModel} from './alarm-remote-device.model';
import {AlarmRemoteEquipmentModel} from './alarm-remote-equipment.model';
import {AlarmEnableStatusEnum} from '../enum/alarm.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {AlarmRemoteAreaModel} from './alarm-remote-area.model';
import {EquipmentDeviceTypeModel} from '../../../../core-module/model/equipment-device-type.model';
/**
 * 告警远程通知
 */

export class AlarmRemoteModel {
  /**
   * 区域信息
   */
  public alarmForwardRuleAreaList: AlarmRemoteAreaModel[];
  /**
   * 区域名称
   */
  public alarmForwardRuleAreaName: string[];
  /**
   * 设施信息
   */
  public alarmForwardRuleDeviceList: AlarmRemoteDeviceModel[];
  /**
   * 设施类型
   */
  public alarmForwardRuleDeviceTypeList: AlarmRemoteDeviceModel[];
  /**
   * 设备信息
   */
  public alarmForwardRuleEquipmentList: AlarmRemoteEquipmentModel[];
  /**
   * 设备类型
   */
  public alarmForwardRuleEquipmentTypeList: AlarmRemoteEquipmentModel[];
  /**
   * 等级
   */
  public alarmForwardRuleLevels: AlarmRemoteLevelModel[];
  /**
   * 用户id
   */
  public alarmForwardRuleUserList: string[];
  /**
   * 用户名称
   */
  public alarmForwardRuleUserName: string[];
  /**
   * 禁启用状态
   */
  public status: AlarmEnableStatusEnum;
  /**
   * 告警远程通知id
   */
  public id: string;
  /**
   * 通知人名字转化
   */
  public user: string;
  /**
   * 区域名字转化
   */
  public areaName: string;
  /**
   * 设备名字转化
   */
  public equipmentNames: string;
  /**
   * 设备类型名字转化
   */
  public equipmentTypeNames: string;
  /**
   * 设施名称转化
   */
  public deviceNames: string;
  /**
   * 设施类型名称转化
   */
  public deviceTypeNames: string;
  /**
   * 禁用名称
   */
  public statusName: string | SelectModel[];
  /**
   * 远程通知名称
   */
  public ruleName: string;
  /**
   * 远程通知备注
   */
  public remark: string;
  /**
   * 多个设施回显
   */
  public deviceTypeArr: EquipmentDeviceTypeModel[];
  /**
   * 多个设备回显
   */
  public equipmentTypeArr: EquipmentDeviceTypeModel[];
  /**
   * 创建起始时间
   */
  public createTime: string;
  /**
   * 创建结束时间
   */
  public createTimeEnd: string;
  /**
   * 区域id
   */
  public areaId: string[];
  /**
   * 禁启用权限
   */
  public appAccessPermission: string;
}
