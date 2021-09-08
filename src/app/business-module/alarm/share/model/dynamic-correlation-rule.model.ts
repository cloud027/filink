/**
 * 动态相关性规则列表
 */
import {SelectModel} from '../../../../shared-module/model/select.model';

export class DynamicCorrelationRuleModel {
  /**
   *  任务id
   */
  public id?: string;
  /**
   * 任务名称
   */
  public taskName?: string;
  /**
   * 任务状态
   */
  public taskStatus?: string;
  public taskStatusName?: string | SelectModel[];
  public action?: string;
  /**
   * 任务类型
   * 已完成，未执行，执行中，异常
   */
  public taskType?: string;
  public taskTypeName?: string | SelectModel[];
  /**
   * 任务周期
   */
  public taskPeriod?: string;
  /**
   * 周期执行时间点
   */
  public periodExecutionTime?: any;
  public periodDate?: number | string;
  /**
   * 任务数据
   */
  public taskData?: string;
  /**
   * 文件名
   */
  public fileName?: string;
  /**
   * 文件全部路径
   */
  public fileFullPath?: string;
  /**
   * 文件路径
   */
  public filePath?: string;
  /**
   * 文件md5
   */
  fileMd5?: string;
  /**
   * 开始时间
   */
  public startTime?: string;
  /**
   * 完成进度
   */
  public completeProgress?: number;
  /**
   * 输出类型
   * 自动，手动
   */
  public outputType?: string;
  public outputTypeName?: string | SelectModel[];
  /**
   * 备注
   */
  public remark?: string;
  /**
   * 时间窗口
   */
  public timeWindow?: string;
  /**
   * 最小支持度
   */
  public minSup?: number;
  /**
   * 最小置信度
   */
  public minConf?: number;
  /**
   * 是否已保存
   */
  public isSave?: string;

  /**
   * 状态
   */
  public isDisabled?: boolean;
  /**
   * 是否可编辑
   */
  public isExecute?: boolean;
  /**
   * 部门code
   */
  public deptCode?: string;
}
