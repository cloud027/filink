/**
 * 控制模型
 */
import {LockModel} from '../../../../core-module/model/facility/lock.model';
import {HostTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/host-type.enum';
import {SimPackageTypeEnum} from '../../../../core-module/enum/facility/facility.enum';

export class ControlInfo {
  /**
   * 主键
   */
  public controlId: string;
  /**
   * 设备id
   */
  public equipmentId: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 主控id
   */
  public hostId: string;
  /**
   * 主控名称
   */
  public hostName: string;
  /**
   * 主控类型  0-无源锁 1-机械锁芯 2-电子锁芯
   */
  public hostType: HostTypeEnum;
  /**
   * IP
   */
  public hostIp: string;
  /**
   * 端口
   */
  public hostPort: string;
  /**
   * 蓝牙mac地址
   */
  public macAddr: string;
  /**
   * 供电方式  适配器”0”，可充电电池”1”，不可充电电池”2”
   */
  public sourceType: string;
  /**
   * 太阳能 已安装“0”，”未安装”1”，”不支持”2”
   */
  public solarCell: string;
  /**
   * 产品id
   */
  public productId: string;
  /**
   * 云平台id
   */
  public platformId: string;
  /**
   * 云平台类型
   */
  public cloudPlatform: string;
  /**
   * SIM卡类型
   */
  public simCardType: string;
  /**
   * IMEI号
   */
  public imei: string;
  /**
   * IMSI号
   */
  public imsi: string;
  /**
   * 软件版本
   */
  public softwareVersion: string;
  /**
   * 硬件版本
   */
  public hardwareVersion: string;
  /**
   * 门数量
   */
  public doors: string;

  /**
   * 配置策略值
   */
  public configValue: string;
  /**
   * 实际传感值
   */
  public actualValue: string;
  /**
   * 同步状态1:未同步 2:同步
   */
  public syncStatus: string;
  /**
   * 更新时间
   */
  public updateTime: number | Date;
  /**
   * 设施状态
   */
  public deviceStatus: string;
  /**
   * 部署状态
   */
  public deployStatus: string;
  /**
   * 激活状态
   */
  public activeStatus: string;
  /**
   * 版本更新时间
   */
  public versionUpdateTime: number | Date;
  /**
   * 创建时间
   */
  public currentTime: number | Date;
  /**
   * sim套餐类型
   */
  public simPackage: SimPackageTypeEnum | string;
  public simPackageOrigin: SimPackageTypeEnum | string;
  /**
   * iccid
   */
  public iccid: string;
  /**
   * 门锁映射关系
   */
  private lockList: Array<LockModel>;

}
