import {WorkOrderStateStatusEnum} from '../../../../core-module/enum/work-order/work-order.enum';
import {StrategyStatusEnum} from '../enum/policy.enum';
import {FilterSelectEnum} from '../../../../shared-module/enum/operator.enum';
import {SystemCommonUtil} from './system-common-util';
import {SunriseOrSunsetEnum} from '../enum/sunrise-or-sunset.enum';

/**
 * 选择时段
 */
export class InstructUtil {
  static instructLight(data, languageTable) {
    data.forEach(item => {
      // 时段在列表上的回显
      if (item.sunriseOrSunset === SunriseOrSunsetEnum.custom) {
        if (item.startTime && item.endTime) {
          item.timeInterval = `${SystemCommonUtil.dateFmt(item.startTime)}-${SystemCommonUtil.dateFmt(item.endTime)}`;
        } else if (item.startTime) {
          item.timeInterval = `${SystemCommonUtil.dateFmt(item.startTime)}`;
        } else if (item.endTime) {
          item.timeInterval = `${SystemCommonUtil.dateFmt(item.endTime)}`;
        }
      } else if (item.sunriseOrSunset === SunriseOrSunsetEnum.sunrise) {
        item.timeInterval = languageTable.strategyList.sunrise;
      } else if (item.sunriseOrSunset === SunriseOrSunsetEnum.sunset) {
        item.timeInterval = languageTable.strategyList.sunset;
      }
      // 如果开关有值
      if (item.switchLight) {
        item.switches = item.switchLight === StrategyStatusEnum.lighting ?
          languageTable.equipmentTable.switch : languageTable.equipmentTable.shut;
      } else {
        item.switches = '';
      }
      item.sensorList = item.sensorName ? `${item.sensorName} ${FilterSelectEnum[item.operator]} ${item.lightIntensity}` : '';
      item.eventName = !item.eventId ?
        languageTable.equipmentStatus.alarm : languageTable.frequentlyUsed.incident;
    });
  }

  /**
   * 获取设施状态图标样式
   */
  public static getStatusClassName(workOrderStatus: WorkOrderStateStatusEnum): { iconClass: string, colorClass: string } {
    let iconClass = '', colorClass = '';
    switch (workOrderStatus) {
      case WorkOrderStateStatusEnum.assigning:
        iconClass = 'fiLink-assigned-w';
        colorClass = 'statistics-assigned-color';
        break;
      case WorkOrderStateStatusEnum.assigned:
        iconClass = 'fiLink-turnProcess-icon';
        colorClass = 'statistics-assigned-color';
        break;
      case WorkOrderStateStatusEnum.underReview:
        iconClass = 'fiLink-processing';
        colorClass = 'statistics-processing-color';
        break;
      case WorkOrderStateStatusEnum.completed:
        iconClass = 'fiLink-completed-o';
        colorClass = 'statistics-completed-color';
        break;
      case WorkOrderStateStatusEnum.chargeback:
        iconClass = 'fiLink-chargeback';
        colorClass = 'statistics-singleBack-color';
        break;
      case WorkOrderStateStatusEnum.cancelled:
        iconClass = 'fiLink-fail';
        colorClass = 'statistics-add-color';
        break;
    }
    return {iconClass, colorClass};
  }
}
