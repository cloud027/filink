import {ConfigSelectParamsModel} from './config-selectParams.model';

/**
 * 设备配置项响应内容configurations嵌套模型
 */
export class ConfigFormContentModel {
  /**
   * 配置内容id和name
   */
  configParams: ConfigSelectParamsModel[];
  /**
   * id
   */
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * code
   */
  code: string;
  /**
   * 默认值
   */
  defaultValue: string;
  /**
   * 占位符
   */
  placeholder: null;
  /**
   * 校验规则
   */
  rules: null;
  /**
   * 表单类型
   */
  type: string;
  /**
   * unit
   */
  unit: null;
}
