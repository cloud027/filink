import {SelectModel} from '../../../../../shared-module/model/select.model';

/***
 * 现场处理模型
 */
export class SiteHandleDataModel {
  /**
   * 设施名称
   */
  objectName: string;
  /**
   * 处理方案
   */
  processingScheme: string;
  /**
   * 故障原因
   */
  troubleReason: string;
  /**
   * 设施/设备
   */
  type: number;
  /**
   * 设施/设备类型
   */
  typeName: string;
  /**
   * 设施/设备名称
   */
  deviceTypeName: string | SelectModel[];
  /**
   * 设施class
   */
  deviceClass: string;
  /**
   * 设备集合
   */
  equipmentTypeList: {key: string, label: string | SelectModel[]}[];
  /**
   * 设备名称
   */
  equipmentTypeName: string;
}
