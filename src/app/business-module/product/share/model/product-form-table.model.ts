/**
 * 产品设备配置表单列表
 */
import {SelectModel} from '../../../../shared-module/model/select.model';

export class ProductFormTableModel {
  // id
  id?: string;
  // 名称
  sensorName?: string;
  // 传感器类型
  sensorType?: string;
  sensorTypeName?: string | SelectModel[];
  // 传感器型号
  typeCode?: string;
  // 端口类型
  portType?: string;
  portTypeName?: string | SelectModel[];
  // 端口号
  portCode?: string;
}
