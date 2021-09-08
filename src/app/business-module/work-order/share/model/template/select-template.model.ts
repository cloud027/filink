/**
 * 选择巡检模板
 */
import {InspectionItemForm} from './inspection-item-form.model';

export class SelectTemplateModel {
  /**
   * 巡检模板id
   */
  public templateId?: string;
  /**
   * 巡检模板名称
   */
  public templateName?: string;
  /**
   * 选择巡检项1
   */
  public inspectionItemList?: InspectionItemForm[];
  /**
   * 选择巡检项1
   */
  public inspectionTemplateItemList?: InspectionItemForm[];
  /**
   * 备注
   */
  public remark?: string;
  /**
   * 巡检项
   */
  public templateItemName?: string;
  /**
   * 操作
   */
  public option?: string;
  /***
   * 是否选中
   */
  public checked?: boolean;
  /**
   * 排序
   */
  public sort?: string;
  /**
   * 巡检项id
   */
  public templateItemId?: string;
  /**
   * 是否新增
   */
  public isAdd?: boolean;
}
