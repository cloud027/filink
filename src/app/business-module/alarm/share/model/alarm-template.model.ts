import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {EquipmentListModel} from '../../../../core-module/model/index/facility-list.modle';
import {FacilityDetailInfoModel} from '../../../../core-module/model/facility/facility-detail-info.model';

/**
 * 告警模板列表数据模型
 */
export class AlarmTemplateModel {
  /**
  * 创建时间
  */
  public createTime: number;
  /**
   * 创建用户
   */
  public createUser: string;
  /**
   * 责任id
   */
  public responsibleId: string;
  /**
   * 首次发生时间
   */
  public alarmBeginTime: Date[];
  /**
   * 首次发生时间-开始日期
   */
  public alarmBeginFrontTime: number;
  /**
   * 首次发生时间-结束日期
   */
  public alarmBeginQueenTime: number;
  /**
   * 确认时间
   */
  public alarmConfirmTime: Date[];
  /**
   * 最近发生时间
   */
  public alarmNearTime: Date[];
  /**
   * 清除时间
   */
  public alarmCleanTime: Date[];
  /**
   * 告警名称
   */
  public alarmNameList: AlarmListModel[];
  /**
   * 区域
   */
  public areaNameList: AreaModel[];
  /**
   * 告警对象
   */
  public alarmObjectList: EquipmentListModel[];
  /**
   * 责任单位
   */
  public departmentList: DepartmentListModel[];
  /**
   * 告警级别
   */
  public alarmFixedLevel: string | string[];
  /**
   * 设备类型
   */
  public alarmSourceTypeId: string | string[];
  /**
   * 模板名称
   */
  public templateName: string;
  /**
   * 频次
   */
  public alarmHappenCount: number;
  /**
   * 确认用户
   */
  public alarmConfirmPeopleNickname: string;
  /**
   * 清除用户
   */
  public alarmCleanPeopleNickname: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 详细地址
   */
  public address: string;
  /**
   * 告警附加信息
   */
  public extraMsg: string;
  /**
   * 告警处理建议
   */
  public alarmProcessing: string;
  /**
   * id
   */
  public id: string;
  /**
   * 是否勾选
   */
  public checked: boolean;
  /**
   * 设施类型
   */
  public alarmDeviceTypeId: string | string[];
  /**
   * 设施名称
   */
  public alarmDeviceNameList: FacilityDetailInfoModel[];
}

/**
 * 责任单位模型
 */
export class DepartmentListModel {
  /**
   * 责任单位名称
   */
  public departmentName: string;
  /**
   * 责任单位id
   */
  public departmentId: string;
}
