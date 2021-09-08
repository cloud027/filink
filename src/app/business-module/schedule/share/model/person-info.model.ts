import {JobStatusEnum} from '../enum/job-status.enum';

/**
 * 人员信息数据模型
 */
export class PersonInfoModel {
  /**
   * 人主键
   */
  id: string;
  /**
   * 人员名称/姓名
   */
  personName: string;
  /**
   * 工号
   */
  jobNumber: string;
  /**
   * 单位id
   */
  deptId: string;
  /**
   * 单位
   */
  deptName: string;
  /**
   * 单位code
   */
  deptCode?: string;
  /**
   * 手机号
   */
  phoneNumber: string;
  /**
   * 关联用户id
   */
  associatedUser: string;
  /**
   * 关联的用户名称
   */
  userName?: string;
  /**
   * 岗位
   */
  workPosition: string;
  /**
   * 在职状态
   */
  onJobStatus: JobStatusEnum;
  /**
   * 在职状态是否点击
   */
  clicked: boolean;
  /**
   * 入职日期
   */
  entryTime: number | Date;
  /**
   * 离职日期
   */
  leaveTime: number | Date;
  /**
   * 备注
   */
  remark: string;
  /**
   * 是否选中
   */
  checked?: boolean;
  /**
   * 国际码
   */
  countryCode?: string;
}
