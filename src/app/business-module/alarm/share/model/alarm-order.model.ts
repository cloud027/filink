/**
 * 告警转工单
 */
import {AlarmRemoteDeviceModel} from './alarm-remote-device.model';
import {AlarmEnableStatusEnum, AlarmTriggerTypeEnum, AlarmWorkOrderTypeEnum} from '../enum/alarm.enum';
import {AlarmRemoteEquipmentModel} from './alarm-remote-equipment.model';
import {EquipmentDeviceTypeModel} from '../../../../core-module/model/equipment-device-type.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';

export class AlarmOrderModel {
  /**
   * 区域id
   */
  public alarmOrderRuleArea: string[];
  /**
   * 区域名称
   */
  public alarmOrderRuleAreaName: string[];
  /**
   * 设施信息
   */
  public alarmOrderRuleDeviceTypeList: AlarmRemoteDeviceModel[];
  /**
   * 设备信息
   */
  public alarmOrderRuleEquipmentTypeList: AlarmRemoteEquipmentModel[];
  /**
   * 转工单名称id
   */
  public alarmOrderRuleNameList: string[];
  /**
   * 转工单名称
   */
  public alarmOrderRuleNames: string[];
  /**
   * 工单类型
   */
  public orderType: AlarmWorkOrderTypeEnum;
  /**
   * 工单类型名称
   */
  public orderTypeName: string;
  /**
   * 触发类型
   */
  public triggerType: AlarmTriggerTypeEnum;
  /**
   * 触发类型名称
   */
  public triggerTypeName: string;
  /**
   * 告警名称
   */
  public alarmName: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 告警id
   */
  public id: string;
  /**
   * 禁启用状态
   */
  public status: AlarmEnableStatusEnum;
  /**
   * 工单名称
   */
  public orderName: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 单位code
   */
  public departmentCode: string;
  /**
   * 单位名称
   */
  public departmentName: string;
  /**
   * 设备类型名称组装
   */
  public equipmentTypeNames: string;
  /**
   * 设施类型名称组装
   */
  public deviceTypeNames: string;
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
   * 期待完工时长
   */
  public completionTime: number;
  /**
   * 期待完工时长查询范围
   */
  public completionTimeOperate: OperatorEnum;
  /**
   * 设施id
   */
  public deviceTypeId: string[];
  /**
   * 禁启用权限
   */
  public appAccessPermission: string;
  /**
   * 是否自动派单
   */
  public autoDispatch?: string;
}
