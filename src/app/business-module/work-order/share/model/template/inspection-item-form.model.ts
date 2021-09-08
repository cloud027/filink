/**
 * 巡检项模型
 */
export class InspectionItemForm {
  /**
   * 排序
   */
  sort?: string;
  /**
   * 巡检项名称
   */
  templateItemName?: string;
  /**
   * 巡检项id
   */
  templateItemId?: string;
  /**
   * 是否选中
   */
  checked?: boolean;
  /**
   * 备注
   */
  remark?: string;
}
