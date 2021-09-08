import {AlarmSelectorInitialValueModel} from '../../../../../shared-module/model/alarm-selector-config.model';

export class TemplateConditionModel {
  /**
   * 开始日期
   */
  beginTime: number;
  /**
   * 结束日期
   */
  endTime: number;
  /**
   * 设施id
   */
  deviceIds: string[];
  /**
   * 区域列表
   */
  areaList: AlarmSelectorInitialValueModel;

  alarmList: any;
}
