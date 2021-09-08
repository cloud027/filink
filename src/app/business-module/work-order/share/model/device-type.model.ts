import {SelectModel} from '../../../../shared-module/model/select.model';

export class DeviceTypeModel {
  /**
   * 名称
   */
  label?: string;
  /**
   * 值
   */
  value?: string;
  /**
   * id
   */
  code?: string;
  /**
   * 名称
   */
  name?: string | SelectModel[];
}
