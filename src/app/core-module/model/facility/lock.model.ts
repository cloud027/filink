export class LockModel {
  /**
   * 电子锁id  主键
   */
  public lockId: string;
  /**
   * 主控id
   */
  public controlId: string;
  /**
   * 电子锁名称
   */
  public lockName: string;
  /**
   * 锁具地址/锁编号
   */
  public lockNum: string;
  /**
   * 电子锁状态 1-开 2-关
   */
  public lockStatus: string;
  /**
   * 门名称
   */
  public doorName: string;
  /**
   * 门状态 1-开 2-关
   */
  public doorStatus: string;
  /**
   * 门编号
   */
  public doorNum: string;
  /**
   * 二维码
   */
  public qrCode: string;

  /**
   * 行程开关地址
   */
  public switchNo: string;
  /**
   * 锁密钥（预留）
   */
  public lockKey: string;

  /**
   * 锁唯一ID
   */
  public lockCode: string;

  /**
   * 更新时间
   */
  public updateTime: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 排序字段
   */
  public rank: string;
  /**
   * 摄像头
   */
  public camera: string;

  /**
   * 检查设施id和门编号
   */
  public void: string;

  /**
   * 是否选择
   */
  public checked: boolean;

  /**
   * 电子锁状态类名
   */
  public lockStatusClassName: string;

  /**
   * 门状态状态类名
   */
  public doorStatusClassName: string;
  /**
   * 电子锁外盖状态 1-开 2-关
   */
  public outCoverStatus: string;
  /**
   * 电子锁内盖状态 1-开 2-关
   */
  public innerCoverStatus: string;
}
