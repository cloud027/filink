import {FileTypeEnum, ProgramStatusEnum} from '../enum/program.enum';

/**
 * 节目列表模型
 */
export class ContentListModel {

  /**
   * 节目Id
   */
  public programId: string;

  /**
   * 节目名称
   */
  public programName: string;

  /**
   * 状态 (已审核/未审核/审核不通过/已禁用)
   */
  public programStatus: ProgramStatusEnum;

  /**
   * 节目用途
   */
  public programPurpose: string;

  /**
   * 时长
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
   * 大小
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
   * 部门ID
   */
  public deptId: string;
  /**
   * 部门code
   */
  public deptCode: string;
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

  /**
   * 文件类型 picture：图片 video：视频
   */
  public programFileType: FileTypeEnum;

  /**
   * fastdfsAddr  地址
   */
  public fastdfsAddr: string;

  /**
   * md5 加密
   */
  public md5: string;
  /**
   * 是否展示删除按钮
   */
  public isDelete?: boolean;
  /**
   * 是否展示审核按钮
   */
  public isAudit?: boolean;
  /**
   * 是否展示禁用按钮
   */
  public isDisabled?: boolean;
  /**
   * 是否展示启用按钮
   */
  public isEnable?: boolean;
  /**
   * 是否展示编辑按钮
   */
  public isUpdate?: boolean;
}

/**
 * 节目启用禁用参数模型
 */
export class ContentEnableModel {
  /**
   * 是否展示启用按钮
   */
  public programId?: string;
  /**
   * 是否展示编辑按钮
   */
  public programStatus?: string;
}
