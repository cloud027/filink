/**
 * 告警列表实体
 */
import {IsRootAlarmEnum} from '../../enum/alarm/is-root-alarm.enum';
import {SelectModel} from '../../../shared-module/model/select.model';


export class AlarmListModel {
  /**
   * 主键id
   */
  public id: string;

  /**
   * 告警名称
   */
  public alarmName: string;

  /**
   * 告警名称id
   */
  public alarmNameId: string;

  /**
   * 告警编码
   */
  public alarmCode: string;

  /**
   * 告警类型
   */
  public alarmType: number;

  /**
   * 告警源(设备id)
   */
  public alarmSource: string;

  /**
   * 告警源类型
   */
  public alarmSourceType: string;

  /**
   * 告警源类型id
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

  /*
  * 工单ID
  * */
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
   * 告警对象
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
   * 告警持续时间
   */
  public alarmContinousTime: number | string;

  /**
   * 告警发生次数
   */
  public alarmHappenCount;

  /**
   * 告警清除状态，2是设备清除，1是已清除，3是未清除
   */
  public alarmCleanStatus: number | string;

  /**
   * 告警清除时间
   */
  public alarmCleanTime: number;

  /**
   * 告警清除类型
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
  public alarmConfirmTime: number;

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
   * 备注
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
   * 主控id
   */
  public  controlId: string;


  /**
   * 设备id
   */
  public  alarmEquipmentId: string;

  /**
   * 设备名称
   */
  public alarmEquipmentName: string;
  /**
   * 扩展字段--告警级别名称
   */
  public alarmLevelName: string;
  /**
   * 扩展字段--样式
   */
  public style: string;
  /**
   * 扩展字段--告警清除状态名称
   */
  public alarmCleanStatusName: string | { label: string; code: any }[];
  /**
   * 设施id
   */
  public alarmDeviceId: string;
  /**
   * 设施类型id
   */
  public alarmDeviceTypeId: string;
  /**
   * 进程状态
   */
  public alarmProcesseStatus: string | { label: string; code: any }[];
  /**
   * 告警等级
   */
  public alarmLeaveName: string | { label: string; code: any }[];
  /**
   * 告警等级样式
   */
  public alarmLeaveClass: string;
  /**
   * 清除状态样式
   */
  public alarmCleanStatusClass: string;
  /**
   * 确认状态
   */
  public alarmConfirmStatusName: string;
  /**
   * 确认状态样式
   */
  public alarmConfirmStatusClass: string;
  /**
   * 设施类型名称
   */
  public deviceTypeName: string | SelectModel[];
  /**
   * 设施类型图标
   */
  public deviceTypeIcon: string;
  /**
   * 设备名称
   */
  public equipmentName: string | { label: string; code: any }[];
  /**
   * 设备图标
   */
  public equipmentIcon: string;
  /**
   * 频次字体大小
   */
  public fontSize: number;
  /**
   * 告警设施名称
   */
  public alarmDeviceName: string;
  /**
   * 区域code
   */
  public areaCode: string;
  /**
   * 告警持续时间
   */
  public alarmContinuedTimeString: string;
  /**
   * 告警关联类别
   */
  public alarmClassificationName?: string;
  /**
   * 判断诊断、定位禁启用
   */
  public isShowBuildOrder: boolean | string;
  /**
   * 告警类别
   */
  public alarmClassification: string;
  /**
   * 判断查看图片禁启用
   */
  public isShowViewIcon: boolean | string;
  /**
   * 相关性告警
   */
  public alarmCorrelationList: AlarmListModel[];
  /**
   * 修改备注是否显示
   */
  public isShowRemark: boolean;
  /**
   * 是否根告警
   */
  public isRootAlarm: IsRootAlarmEnum;
  /**
   * 是否勾选
   */
  public checked?: boolean;
  /**
   * 是否显示单选框或者复选框
   */
  public isRadio?: boolean;
  /**
   * 子集中的父级
   */
  public father?: AlarmListModel[];
}
