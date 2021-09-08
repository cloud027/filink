import {LockModel} from './lock.model';
import {HostTypeEnum} from '../../enum/facility/Intelligent-lock/host-type.enum';
import {SourceTypeEnum} from '../../enum/facility/Intelligent-lock/source-type.enum';
import {SolarCellEnum} from '../../enum/facility/Intelligent-lock/solar-cell.enum';
import {DeployStatusEnum, DeviceStatusEnum} from '../../enum/facility/facility.enum';
/**
 * 电子锁主控信息
 */
export class ControlModel {
  /**
   * 电子锁id  主键
   */
  public lockId: string;
  /**
   * 主控id
   */
  public controlId: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 关联区域id
   */
  public areaId: string;
  /**
   *  区域code
   */
  public areaCode: string;
  /**
   * 设备id
   */
  public equipmentId: string;
  /**
   * 主控id(设备串号)
   */
  public sequenceId: string;
  /**
   * 主控名称(设备名字)
   */
  public equipmentName: string;
  /**
   * 设备资产编码
   */
  public equipmentCode: string;

  /**
   * 主控类型(智能门禁锁)
   */
  public equipmentType: string;
  /**
   * 设备型号
   */
  public equipmentModel: string;

  /**
   * 供应商
   */
  public supplier: string;

  /**
   * 报废年限
   */
  public scrapTime: string;
  /**
   * 主控类型(有源锁，无源锁)
   */
  public equipmentModelType: HostTypeEnum;
  /**
   * IP
   */
  public ip: string;
  /**
   * 端口
   */
  public port: string;

  /**
   * 蓝牙mac地址
   */
  public macAddr: string;

  /**
   * 供电方式  适配器”0”，可充电电池”1”，不可充电电池”2”
   */
  public sourceType: SourceTypeEnum;

  /**
   * 太阳能 已安装“0”，”未安装”1”，”不支持”2”
   */
  public solarCell: SolarCellEnum;

  /**
   *  产品id
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
   * 软件版本
   */
  public softwareVersion: string;

  /**
   *  硬件版本
   */
  public hardwareVersion: string;
  /**
   *  门数量
   */
  public doors: string;

  /**
   * 配置策略值
   */
  public configValue: any;

  /**
   *  实际传感值
   */
  public actualValue: string;
  /**
   * 同步状态 1:未同步 2:同步
   */
  public syncStatus: string;
  /**
   * 更新时间
   */
  public updateTime: string;

  /**
   * 门锁映射关系
   */
  public lockList: Array<LockModel>;

  /**
   * 设施状态
   */
  public deviceStatus: DeviceStatusEnum;

  /**
   * 部署状态
   */
  public deployStatus: DeployStatusEnum;

  /**
   *  激活状态
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
   *  sim套餐类型
   */
  public simPackage: string;
  /**
   *  iccid
   */
  public iccid: string;

  /**
   *  用户id(feign)
   */
  public userId: string;
  /**
   * userName(feign)
   */
  public userName: string;

  /**
   * 用户token(feign)
   */
  public userToken: string;

  /**
   *   租户
   */
  public tenantId: string;
}
