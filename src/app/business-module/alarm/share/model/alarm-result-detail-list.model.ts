import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {SelectModel} from '../../../../shared-module/model/select.model';

/**
 * 查看结果详情列表
 */
export class AlarmResultDetailListModel extends AlarmListModel {
  /**
   * 等级
   */
  alarmLevel?: string;
  /**
   * 等级名称
   */
  levelName?: string;
  /**
   * 等级样式
   */
  levelStyle?: string;
  /**
   * 设施class
   */
  deviceClass?: string;
  /**
   * 设施类型
   */
  alarmDeviceType?: string;
  /**
   * 设备类型名称
   */
  equipmentTypeName?: string  | SelectModel[];
  /**
   * 设备class
   */
  equipmentClass?: string;
  /**
   * 子集
   */
  childList?: AlarmResultDetailListModel[];
  /**
   * 父集
   */
  father?: AlarmResultDetailListModel[];
  /**
   * 勾选
   */
  checked?: boolean;
}
