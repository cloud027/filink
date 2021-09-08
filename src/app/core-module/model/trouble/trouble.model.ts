import {EquipmentDeviceTypeModel} from '../equipment-device-type.model';
import {WorkOrderDeviceModel} from '../work-order/work-order-device.model';
import {PersonModel} from '../../../business-module/trouble/share/model/person.model';
import {CarModel} from '../../../business-module/trouble/share/model/car.model';
import {MaterielModel} from '../../../business-module/trouble/share/model/materiel.model';
import {SelectModel} from '../../../shared-module/model/select.model';
import {EquipmentFormModel} from '../work-order/equipment-form.model';
import {DeviceTypeEnum} from '../../enum/facility/facility.enum';

/**
 * Created by wh1910108 on 2019/6/15.
 */
export class TroubleModel {
  /**
   * 故障编号
   */
  public troubleCode: string;
  /**
   * 处理状态
   */
  public handleStatus: any;
  /**
   * 故障级别
   */
  public troubleLevel: string;
  /**
   * 单位code
   */
  public deptCode: string;
  /**
   * 故障类型
   */
  public troubleType: string;
  /**
   * 故障来源
   */
  public troubleSource: string | SelectModel[];
  /**
   * 故障设施名称
   */
  public deviceName: string;
  /**
   * 故障设施ID
   */
  public deviceId: string;
  /**
   * 故障设备名称
   */
  public alarmSourceName: string;
  /**
   * 故障设备ID
   */
  public alarmSourceTypeId: string;
  /**
   * 故障描述
   */
  public troubleDescribe: string;
  /**
   * 填报人
   */
  public reportUserName: string;
  /**
   * 发生时间
   */
  public happenTime: string;
  /**
   * 责任单位名称
   */
  public deptName: string;
  /**
   * 备注
   */
  public troubleRemark: string;
  /**
   * 故障总数
   */
  public troubleTotal: string;
  /**
   * 单位id
   */
  public deptId: string;
  /**
   * 设备类型
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 区域名称
   */
  public area: string;
  /**
   * 区域id
   */
  public areaId: string;
  /**
   * 设备
   */
  public equipment:EquipmentFormModel[];
  /**
   * 删除按钮是否展示
   */
  public isDelete: boolean;
  /**
   * 故障列表操作按钮禁用
   */
  public isShowBuildOrder: string | boolean;
  /**
   * 告警码
   */
  public alarmCode: string;
  /**
   * 故障列表流程按钮展示
   */
  public isShowFlow: string | boolean;
  /**
   * 故障列表操作按钮禁用
   */
  public isShowEdit: string | boolean;
  /**
   * 状态名称
   */
  public handleStatusName: string | SelectModel[];
  /**
   * 等级样式
   */
  public style: string;
  /**
   * 等级名称
   */
  public troubleLevelName: string | SelectModel[];
  /**
   * 故障来源
   */
  public troubleSourceTypeName: string | SelectModel[];
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 处理状态样式
   */
  public handleStatusClass: string;
  /**
   * 多个设备名称
   */
  public equipmentTypeArr: EquipmentDeviceTypeModel[];
  /**
   * 设施图片
   */
  public deviceTypeIcon: string;
  /**
   * 设施类型样式
   */
  public deviceTypeClass: string;
  /**
   * 设施名称
   */
  public deviceTypeName: string;
  /**
   * 设施名称
   */
  public handleTime: string | number;
  /**
   * 处理责任人
   */
  public assignUserName: string;

  /**
   * 故障id
   */
  public id: string;
  /**
   * 复选框
   */
  public checked: boolean;
  /**
   * 流程实例id
   */
  public instanceId: string;
  /**
   * 流程节点
   */
  public progessNodeId: string;
  /**
   * 流程节点名称
   */
  public currentHandleProgress: string;
  /**
   * 当前节点
   */
  public currentNode?: string;
  /**
   * 区域code
   */
  public areaCode: string;
  /**
   * 故障来源
   */
  public troubleSourceCode: string | SelectModel[];
  /**
   * 区域code
   */
  public alarmId: string;
  /**
   * 名称
   */
  public nodeName: string;
  /**
   * 设备类型
   */
  public equipmentList: WorkOrderDeviceModel[];

  /**
   * 设施类型
   */
  public deviceObject: WorkOrderDeviceModel;

  /**
   * 状态图标
   */
  public handleStatusIcon: string;
  /**
   * 等级样式
   */
  public troubleLevelClass: string;
  /**
   * 所有设备名称
   */
  public equipmentTypeNames: string;
  /**
   * 故障来源名称
   */
  public troubleSourceName: string | SelectModel[];
  /**
   * 故障类型
   */
  public troubleTypeName: string;
  /**
   * 责任单位名称
   */
  public assignDeptName: string;
  /**
   * 人员信息
   */
  public staff: PersonModel[];
  /**
   * 车辆信息
   */
  public car: CarModel[];
  /**
   * 申请设备
   */
  public materiel: MaterielModel[];
  constructor() {
    this.deviceObject = new WorkOrderDeviceModel();
  }
}
