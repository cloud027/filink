import {SelectModel} from '../../../shared-module/model/select.model';

/**
 * 设施/设备对象
 */
export class WorkOrderDeviceModel {
  /**
   * 设施/设备名称
   */
  public name: string | SelectModel[];
  /**
   * 设施/设备图片
   */
  public picture?: string;
  /**
   * 类型名称
   */
  public typeName?: string | SelectModel[];
  constructor() {
    this.name = '';
    this.picture = '';
  }
}
