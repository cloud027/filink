/**
 * 设备列表数据模型
 */
import {CameraTypeEnum, EquipmentStatusEnum, EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';
import {AreaModel} from '../facility/area.model';
import {PointModel} from '../point.model';
import {DeviceStatusEnum} from '../../enum/facility/facility.enum';
import {FacilityListModel} from '../facility/facility-list.model';

export class EquipmentListModel {
  /**
   * 设备Id
   */
  public equipmentId: string;
  /**
   * 资产编码
   */
  public equipmentCode: string;
  /**
   * 设备真实id
   */
  public sequenceId: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 设备类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 设备状态
   */
  public equipmentStatus: EquipmentStatusEnum;
  /**
   * 设备型号
   */
  public equipmentModel: string;
  /**
   * 型号类型
   */
  public equipmentModelType: CameraTypeEnum;
  public modelType: string;
  /**
   * 供应商名称
   */
  public supplier: string;
  /**
   * 报废年限
   */
  public scrapTime: string;
  /**
   * 所属设施
   */
  public deviceId: string;
  /**
   * 所属设施名称
   */
  public deviceName: string;
  /**
   * 设施类型
   */
  public deviceType: string;
  /**
   * 挂在位置
   */
  public mountPosition: string;
  /**
   * 安装日期
   */
  public installationDate: string;
  /**
   * 权属公司
   */
  public company: string;
  /**
   * 业务状态
   */
  public businessStatus: string;

  /**
   * 基础位置
   */
  public positionBase: string;

  /**
   * 业务状态名称
   */
  public businessStatusName: string;
  /**
   * 所属区域
   */
  public areaName: string;
  /**
   * 所属网管
   */
  public gatewayName: string;
  /**
   * 备注
   */
  public remarks: string;
  /**
   * 区域code
   */
  public areaCode: string;
  /**
   * 网关id
   */
  public gatewayId: string;
  /**
   * 区域信息
   */
  public areaInfo: AreaModel;

  /**
   *  网关端口
   */
  public portNo: string;

  /**
   * 设备状态名称
   */
  public equipmentStatusName: string | { label: string; code: string }[];

  /**
   * 状态名称
   */
  public equipmentTypeName: string | { label: string; code: string }[];
  /**
   *  设施信息
   */
  public deviceInfo: FacilityListModel;
  /**
   * 安装日期
   */
  public instDate: number;
  /**
   * 地址
   */
  public address: string;
  /**
   * 扩展状态图标
   */
  public statusIconClass: string;
  /**
   * 扩展状态颜色
   */
  public statusColorClass: string;
  /**
   * 类型图标
   */
  public iconClass: string;

  /**
   * 选中状态
   */
  public checked: boolean;

  /**
   * 表格行样式
   */
  public rowStyle: {};

  /**
   * 删除按钮是否显示
   */
  public deleteButtonShow: boolean;
  /**
   * 设施类型图标样式
   */
  public deviceIcon?: string;
  /**
   * 设备状态
   */
  public deviceStatus?: DeviceStatusEnum;
  /**
   * 线缆编号
   */
  public cableNum: string;
  /**
   * 档案编号
   */
  public equipmentDocNum: string;

  /**
   * 分组编号
   */
  public equipmentGroupNum: string;

  /**
   * 经纬度信息
   */
  public point?: PointModel;
  /**
   * 设施迁移
   */
  public facilityRelocation;

  /**
   * 设备配置按钮 无缘锁时不显示
   */
  public deviceConfiguration;
  /**
   * 线缆编号下拉框数据
   */
  public equipmentCableOption: string[];
  /**
   * 供应商ID
   */
  public supplierId?: string;
  /**
   * 软件版本
   */
  public softwareVersion?: string;
  /**
   * 硬件版本
   */
  public hardwareVersion?: string;
  /**
   * 产品类型字段
   */
  typeCode: string;
  /**
   * 产品摄像头类型
   */
  pattern: string;
}

