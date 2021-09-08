/**
 * 节目信息数据模型
 */
export class ProgramListModel {

  /**
   * 节目id
   */
  public programId: string;

  /**
   * 节目名称
   */
  public programName: string;

  /**
   * //状态 (已审核/未审核/审核不通过/已禁用)
   */
  public programStatus: string;

  /**
   * 节目用途
   */
  programPurpose: string;

  /**
   * 节目时长
   */
  public duration: string;

  /**
   * 格式
   */
  public mode: string;

  /**
   * 分辨率
   */
  public resolution: string;

  /**
   *  大小
   */
  public programSize: string;

  /**
   * 申请人
   */
  public applyUser: string;

  /**
   * 添加人
   */
  public addUser: string;

  /**
   * 添加时间
   */
  public createTime: string;

  /**
   * 审核人
   */
  public reviewedUser: string;
  /**
   * 审核时间
   */
  public reviewedTime: string;
  /**
   * 文件存放 服务器地址
   */
  public fastdfsAddr: string;
  /**
   * 节目存放地址
   */
  public programPath: string;
  /**
   * 节目文件名
   */
  public programFileName: string;
  /**
   * 备注
   */
  public remark: string;
}
