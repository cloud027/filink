import {IpEnum, StatusEnum} from '../enum/system-setting.enum';

export class RangeModel {
  /**
   * 主键ID
   */
  public rangeId: string;

  /**
   * IP类型
   */
  public ipType: IpEnum;

  /**
   * 起始IP
   */
  public startIp: string;

  /**
   * 终止IP
   */
  public endIp: string;

  /**
   * 掩码
   */
  public mask: string;

  /**
   * 启用状态,1是启用，0是禁用
   */
  public rangeStatus: StatusEnum;

  /**
   * 是否删除，0没有，1已删除
   */
  public isDeleted: string;

  /**
   * 创建人
   */
  public createUser: string;

  /**
   * 创建时间
   */
  public createTime: string;

  /**
   * 更新人
   */
  public updateUser: string;

  /**
   * 更新时间
   */
  public updateTime: string;
}
