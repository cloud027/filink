/**
 * 设备配置项响应内容
 */
import {FormOperate} from '../../../shared-module/component/form/form-operate.service';
import {FormItem} from '../../../shared-module/component/form/form-config';
import {ControlInstructEnum} from '../../enum/instruct/control-instruct.enum';

export class ConfigurationsModel {
  /**
   * 重组生成的表单
   */
  public formColumn?: FormItem[];
  /**
   * 表单formInstance
   */
  public formInstance?: { instance: FormOperate };
  /**
   * 后台返回的配置
   */
  public configParams: any[];
  /**
   * id
   */
  public id: string;
  /**
   *单个tab里面多个form 的标题
   */
  public name: string;
}

export class ConfigParam {
  id: string;
  name: string;
  code: string;
  type: string;
  display: boolean;
  unit: string;
  placeholder: string;
  defaultValue: any;
  selectParams: any[];
  rules: any[];
}

export class ConfigurationList {
  id: string;
  name: string;
  commandId: string;
  url: string;
  configParamList: ConfigParam[];
  /**
   * 重组生成的表单
   */
  public formColumn?: FormItem[];
  /**
   * 表单formInstance
   */
  public formInstance?: { instance: FormOperate };
}
export class ConfigurationsList {
  id: string;
  name: string;
  commandId: string;
  url: string;
  configurationList: ConfigurationList[];
}
export class ConfigResponseContentModel {
  /**
   * tabId 表单标识
   */
  public tabId: string;
  /**
   * 指令
   */
  public commandId: ControlInstructEnum;
  /**
   * 表单名称
   */
  public name: string;

  /**
   * url
   */
  public url: string;
  /**
   * 动态表单配置内容
   */
  public configurations: ConfigurationsModel[];
  /**
   * 动态表单配置内容
   */
  public configurationsList: ConfigurationsList[];

}
