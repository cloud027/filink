/**
 * 回路和线缆的绑定关系模型
 */
export class LoopCableInfoModel {
  /**
   * 回路id
   */
  public loopId: string;
  /**
   * 回路编号
   */
  public cableNum: any;
  /**
   * 回路是否删除
   */
  public isDeleted: string;
  /**
   * 回路创建时间
   */
  public createTime: string;
  /**
   * 回路更新时间
   */
  public updateTime: string;
  /**
   * 回路更新者
   */
  public updateUser: string;
  /**
   * 回路创建者
   */
  public createUser: string;
  /**
   * 回路对应的pid
   */
  public pid: string;
  /**
   * A相熔断丝
   */
  public aphaseStatus: string;
  /**
   * B相熔断丝
   */
  public cphaseStatus: string;
  /**
   * C相熔断丝
   */
  public bphaseStatus: string;
}
