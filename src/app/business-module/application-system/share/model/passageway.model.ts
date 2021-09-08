import {OtherSettingsEnum} from '../enum/camera.enum';
import {SwitchStatus} from '../enum/policy.enum';

export class PassagewayModel {
  /**
   * 通道号Id
   */
  public channelId: string;

  /**
   * 主键ＩＤ
   */
  public id: string;

  /**
   * 通道名称
   */
  public channelName: string;

  /**
   * 是否启用状态 (1 启用 0 停用 默认启用1)
   */
  public status: SwitchStatus;

  /**
   * 摄像机id
   */
  public equipmentId: string;

  /**
   * 摄像机类型
   */
  public cameraType: string;

  /**
   * 是否启用ONVIF探测 (1 启用 0 停用 默认启用1)
   */
  public onvifStatus: SwitchStatus;

  /**
   * 探测ONVIF IP
   */
  public onvifIp: string;

  /**
   * 探测ONVIF port
   */
  public onvifPort: string;

  /**
   * 探测 ONVIF 用户名
   */
  public onvifAccount: string;

  /**
   * 探测ONVIF 密码
   */
  public onvifPassword: string;

  /**
   * 摄像机接入RTSP地址
   */
  public rtspAddr: string;

  /**
   * 摄像机接入ONVIF地址
   */
  public onvifAddr: string;

  /**
   * 摄像机用户名
   */
  public cameraAccount: string;

  /**
   * 摄像机密码
   */
  public cameraPassword: string;

  /**
   * 录像保留天数
   */
  public videoRetentionDays: number;

  /**
   * 按需直播 (1 启用 0 停用 默认启用1)
   */
  public liveSwitch: SwitchStatus;

  /**
   * 音频开关 (1 启用 0 停用 默认启用1)
   */
  public audioSwitch: OtherSettingsEnum;

  /**
   * 租户id
   */
  public tenantId: string;

  /**
   * 创建时间
   */
  public createTime: string;

  /**
   * 创建人
   */
  public createUser: string;

  /**
   * 更新时间
   */
  public updateTime: string;

  /**
   * 更新人
   */
  public updateUser: string;

  /**
   * 摄像头IP
   */
  public cameraIp: string;

  /**
   * 摄像头端口
   */
  public cameraPort: string;

  /**
   * 通道是否被选中状态
   */
  public state: boolean;
  /**
   * 通道直播流地址
   */
  public path: string;
  /**
   *
   */
  public lUserId: string;
  /**
   * 摄像头的播放句柄
   */
  public lRealHandle: number;
  /**
   * 设备名称
   */
  public equipmentName?: string;
}
