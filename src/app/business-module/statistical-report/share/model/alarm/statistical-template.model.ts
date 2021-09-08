import {TemplateConditionModel} from './template-condition.model';

export class StatisticalTemplateModel {
  /**
   * code
   */
  public code: number;
  /**
   * 查询条件
   */
  public condition: TemplateConditionModel;
  /**
   * 添加时间
   */
  public createTime: string;
  /**
   * 添加者
   */
  public createUser: string;
  /**
   * 结束日期
   */
  public endTime: number;
  /**
   * id
   */
  public id: string;
  /**
   * 是否删除
   */
  public isDeleted: string;
  /**
   * 页面类型
   */
  public pageType: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 开始日期
   */
  public startTime: number;
  /**
   * 模板名称
   */
  public templateName: string;
  /**
   * 区域名称
   */
  public areaNames: string;
  /**
   * 设施类型列表
   */
  public alarmForwardRuleDeviceTypeList;
  /**
   * 时间
   */
  public time;
  public alarmName: any;
}

