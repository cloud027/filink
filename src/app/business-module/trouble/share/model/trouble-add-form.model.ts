/**
 * 增加故障表格
 */

import {SelectDeviceModel} from '../../../../core-module/model/facility/select-device.model';
import {ToTroubleEquipment} from '../../../../core-module/model/trouble/alarm-to-trouble.model';

export class TroubleAddFormModel {
  /**
   * 设施数据
   */
  public troubleFacility: SelectDeviceModel;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 设施类型
   */
  public deviceType: string;
  /**
   * 区域名称
   */
  public area: string;
  /**
   * 区域id
   */
  public areaId: string;
  /**
   * 区域code
   */
  public areaCode: string;
  /**
   * 单位名称
   */
  public deptName: string;
  /**
   * 单位code
   */
  public deptCode: string;
  /**
   * 发生时间
   */
  public happenDate: string;
  /**
   * 故障id
   */
  public id: string;
  /**
   * 发生时间
   */
  public happenTime: string;
  /**
   * 处理状态
   */
  public handleStatus: string;
  /**
   * 故障等级
   */
  public troubleLevel: string;
  /**
   * 故障类型
   */
  public troubleType: string;
  /**
   * 故障来源
   */
  public troubleSource: string | { label: string; code: any }[];
  /**
   * 产品id
   */
  public productId?: string;
  public deviceProductId?: string;
  /**
   * 设施区域id
   */
  public deviceAreaId?: string;
  /**
   * 设施区域code
   */
  public deviceAreaCode?: string;
  /**
   *  项目id
   */
  public projectId?: string;
  /**
   * 设备
   */
  public equipment?: ToTroubleEquipment[];
}
