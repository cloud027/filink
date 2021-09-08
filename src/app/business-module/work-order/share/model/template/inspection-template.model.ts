/**
 * 巡检模板模型
 */
import {InspectionItemForm} from './inspection-item-form.model';

export class InspectionTemplateModel {
  /**
   * 巡检模板id
   */
  public templateId: string;
  /**
   * 巡检模板名称
   */
  public templateName: string;
  /**
   *  巡检项总数
   */
  public inspectionItemSize: number;
  /**
   * 责任人姓名
   */
  public createUserName: string;
  /**
   * 责任人id
   */
  public createUser: string;
  /**
   * 创建时间
   */
  public createTime: string;
  /**
   * 巡检项列表
   */
  public inspectionTemplateItemList: InspectionItemForm[];
  public inspectionItemList: InspectionItemForm[];
  /**
   * 备注
   */
  public remark: string;
  /**
   * 巡检项id
   */
  public templateItemId: string;
  /**
   * 巡检项名称
   */
  public templateItemName: string;
  /**
   * 排序
   */
  public sort: number;
  /**
   * 状态
   */
  public status: string;
  /**
   * 状态名称
   */
  public statusName: string;
  /**
   * 状态class
   */
  public statusClass: string;
  /***
   * 是否可用
   */
  public isShowTurnBackConfirmIcon: boolean;
}
