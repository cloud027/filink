import {SelectTemplateModel} from './select-template.model';

/**
 *巡检模板弹窗模型
 */
export class TemplateModalModel {
  /**
   * 页面类型
   */
  pageType: string;
  /**
   * 已选择模板数据
   */
  selectTemplateData: SelectTemplateModel;
}
