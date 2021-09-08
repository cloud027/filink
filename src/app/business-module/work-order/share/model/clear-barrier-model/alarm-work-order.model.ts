/**
 * 销账工单详情-关联告警
 */
import {WorkOrderDeviceModel} from '../../../../../core-module/model/work-order/work-order-device.model';
import {SelectModel} from '../../../../../shared-module/model/select.model';

export class AlarmWorkOrderModel {
  /**
   * 告警id
   */
  public id: string;
  /**
   * Trap oid
   */
  public trapOid: string;
  /**
   * 告警名称
   */
  public alarmName: string;
  /**
   * 告警名称id
   */
  public alarmNameId: string;
  /**
   * 是否存在关联工单
   */
  public isOrder: boolean;
  /**
   * 告警编码
   */
  public alarmCode: string;
  /**
   * 告警内容
   */
  public alarmContent: string;
  /**
   * 告警类型 工单或者设备
   */
  public alarmType: number;
  /**
   * 告警源(设施id)  二期已经将字字段用作设备Id
   */
  public alarmSource: string;
  /**
   * 告警源类型 二期已经将字字段用作设备类型
   */
  public alarmSourceType: string;
  /**
   * 告警源类型id  二期已经将字字段用作设备类型id
   */
  public alarmSourceTypeId: string;
  /**
   * 区域id
   */
  public areaId: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 工单ID
   */
  public orderId: string;
  /**
   * 地址
   */
  public address: string;
  /**
   * 告警级别
   */
  public alarmFixedLevel: string;
  /**
   * 告警对象   设备名称
   */
  public alarmObject: string;
  /**
   * 单位id，多个单位ID用逗号隔开
   */
  public responsibleDepartmentId: string;
  /**
   * 负责单位名称，多个单位名称用逗号隔开,跟单位ID 按顺序一一对应
   */
  public responsibleDepartment: string;
  /**
   * 提示音 0是否 1是有
   */
  public prompt: string;
  /**
   * 告警发生时间
   */
  public alarmBeginTime: number;
  /**
   * 最近发生时间
   */
  public alarmNearTime: number;
  /**
   * 网管接收时间
   */
  public alarmSystemTime: number;
  /**
   * 网管最近接收时间
   */
  public alarmSystemNearTime: number;
  /**
   * 告警持续时间
   */
  public alarmContinousTime: number;
  /**
   * 告警持续时间
   */
  public alarmContinousTimeString?: string;
  /**
   * 告警发生次数
   */
  public alarmHappenCount: number;
  /**
   * 告警清除状态，2是设备清除，1是已清除，3是未清除
   */
  public alarmCleanStatus: number;
  /**
   * 告警清除时间
   */
  public alarmCleanTime: number;
  /**
   * 告警清除类型 手动或者自动
   */
  public alarmCleanType: number;
  /**
   * 告警清除责任人id
   */
  public alarmCleanPeopleId: string;
  /**
   * 告警清除责任人
   */
  public alarmCleanPeopleNickname: string;
  /**
   * 告警确认状态,1是已确认，2是未确认
   */
  public alarmConfirmStatus: number;
  /**
   * 告警确认时间
   */
  public alarmConfirmTime: string;
  /**
   * 告警确认人id
   */
  public alarmConfirmPeopleId: string;
  /**
   * 告警确认人
   */
  public alarmConfirmPeopleNickname: string;
  /**
   * 附加消息
   */
  public extraMsg: string;
  /**
   * 处理信息
   */
  public alarmProcessing: string;
  /**
   * 告警备注
   */
  public remark: string;
  /**
   * 门编号
   */
  public doorNumber: string;
  /**
   * 门名称
   */
  public doorName: string;
  /**
   * 是否存在关联的告警图片
   */
  public isPicture: boolean;
  /**
   * 设施id
   */
  public alarmDeviceId: string;
  /**
   * 设施名称
   */
  public alarmDeviceName: string;
  /**
   * 设施类型
   */
  public alarmDeviceType: string;
  /**
   * 设施类型Id
   */
  public alarmDeviceTypeId: string;
  /**
   * 告警类别
   */
  public alarmClassification: string;
  /**
   * 告警类别
   */
  public alarmClassificationName: string;
  /**
   * 设施对象
   */
  public deviceObject: WorkOrderDeviceModel;
  /**
   * 频次字体大小
   */
  public fontSize: number;
  /**
   * 设备容器
   */
  public equipmentList: WorkOrderDeviceModel[];

  /**
   * 设施名称
   */
  public deviceTypeName: string | SelectModel[];

  /**
   *设施class
   */
  public deviceClass: string;

  /**
   * 告警等级
   */
  public levelName: string;

  /***
   * 告警等级class
   */
  public levelStyle: string;

  /**
   * 设备名称
   */
  public equipmentTypeName: string | SelectModel[];

  /**
   * 设备class
   */
  public equipClass: string;

  /**
   * 确认状态
   */
  public alarmConfirmStatusName: string;

  /**
   * 清除状态
   */
  public alarmCleanStatusName: string;

  constructor() {
    this.deviceObject = new WorkOrderDeviceModel();
  }
}
