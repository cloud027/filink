import {
  AlarmCleansStatusEnum,
  WorkOrderAlarmEvaluateEnum, WorkOrderRemainDaysEnum,
  WorkOrderAlarmCleanStatusEnum,
  WorkOrderAlarmConfirmStatusEnum,
} from '../enum/refAlarm-faultt.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {
  InspectionTaskTypeEnum,
  WorkOrderResultEnum,
  EnableStatusEnum,
  FaultSourceEnum,
  WorkOrderErrorReasonNameEnum,
  WorkOrderErrorReasonCodeEnum,
  WorkOrderProcessingSchemeCodeEnum,
  WorkOrderProcessingSchemeNameEnum, InspectionTaskStatusEnum
} from '../enum/clear-barrier-work-order.enum';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';

/**
 * 工单公共工具类
 */
export class WorkOrderBusinessCommonUtil {

  /**
   * 告警确认状态
   */
  public static getAlarmConfirmStatus(value: string): string {
    if (value) {
      for (const key in WorkOrderAlarmConfirmStatusEnum) {
        if (key && WorkOrderAlarmConfirmStatusEnum[key] === value) {
          return key;
        }
      }
    } else {
      return '';
    }
  }

  /**
   * 告警清除状态
   */
  public static getAlarmCleanStatus(value: string): string {
    if (value) {
      for (const key in WorkOrderAlarmCleanStatusEnum) {
        if (key && WorkOrderAlarmCleanStatusEnum[key] === value) {
          return key;
        }
      }
    } else {
      return '';
    }
  }

  /**
   * 告警评分图片选择
   */
  public static getAlarmEvaluate(value: string): string {
    if (value) {
      for (const key in WorkOrderAlarmEvaluateEnum) {
        if (key && WorkOrderAlarmEvaluateEnum[key] === value) {
          return key;
        }
      }
    } else {
      return '';
    }
  }

  /**
   * 故障工单剩余天数背景色选择
   */
  public static getAlarmRemainDays(value: string): string {
    if (value) {
      for (const key in WorkOrderRemainDaysEnum) {
        if (key && WorkOrderRemainDaysEnum[key] === value) {
          return key;
        }
      }
    } else {
      return '';
    }
  }

  /**
   * 日期时间转化yyyy:hh-mm-ss
   */
  public static formatterDate(time: number | string | Date): string {
    if (!time) {
      return '';
    }
    const date = new Date(time);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mm = date.getMinutes();
    const s = date.getSeconds();
    // 设置小于10的数字
    function setNum(t) {
      return t < 10 ? '0' + t : t;
    }
    return `${y}-${setNum(m)}-${setNum(d)} ${setNum(h)}:${setNum(mm)}:${setNum(s)}`;
  }

  /**
   * 取userID
   */
  public static getUserId() {
    if (SessionUtil.getToken()) {
      return (SessionUtil.getUserInfo()).id;
    } else {
      return '';
    }
  }

  /**
   * 工单状态国际化
   */
  public static workOrderStatus(i18n: NzI18nService, code = null, prefix = 'inspection') {
    return CommonUtil.codeTranslate(WorkOrderStatusEnum, i18n, code, prefix);
  }

  /**
   * 任务状态
   */
  public static taskStatus(i18n: NzI18nService, code = null, prefix = 'inspection') {
    return CommonUtil.codeTranslate(InspectionTaskStatusEnum, i18n, code, prefix);
  }

  /**
   * 任务类型
   */
  public static taskType(i18n: NzI18nService, code = null, prefix = 'inspection') {
    return CommonUtil.codeTranslate(InspectionTaskTypeEnum, i18n, code, prefix);
  }

  /**
   *
   */
  public static workOrderResult(i18n: NzI18nService, code = null, prefix = 'inspection') {
    return CommonUtil.codeTranslate(WorkOrderResultEnum, i18n, code, prefix);
  }

  /**
   * 启用/禁用
   */
  public static getEnableStatus(i18n: NzI18nService, code = null, prefix = 'inspection') {
    return CommonUtil.codeTranslate(EnableStatusEnum, i18n, code, prefix);
  }

  /**
   * 工单中故障来源
   */
  public static getOrderTroubleSource(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(FaultSourceEnum, i18n, code);
  }

  /**
   * 获取设施类型名称
   */
  public static deviceTypeNames(i18n: NzI18nService, code = null, prefix = 'facility.config') {
    return CommonUtil.codeTranslate(DeviceTypeEnum, i18n, code, prefix);
  }

  /**
   * 获取设备类型名称
   */
  public static equipTypeNames(i18n: NzI18nService, code = null, prefix = LanguageEnum.facility) {
    return CommonUtil.codeTranslate(EquipmentTypeEnum, i18n, code, prefix);
  }

  /**
   * 故障原因名称code
   */
  public static getErrorReasonNameCode(code: string) {
    for (const key in WorkOrderErrorReasonCodeEnum) {
      if (WorkOrderErrorReasonCodeEnum[key] === code) {
        return key;
      }
    }
  }

  /**
   * 故障原因名称code
   */
  public static getErrorReasonName(i18n: NzI18nService, code = null, prefix = 'workOrder') {
    return CommonUtil.codeTranslate(WorkOrderErrorReasonNameEnum, i18n, code, prefix);
  }

  /**
   * 退单原因code
   */
  public static getSchemeCode(code: string) {
    for (const key in WorkOrderProcessingSchemeCodeEnum) {
      if (WorkOrderProcessingSchemeCodeEnum[key] === code) {
        return key;
      }
    }
  }
  /**
   * 退单原因名称
   */
  public static getSchemeName(i18n: NzI18nService, code = null, prefix = 'workOrder') {
    return CommonUtil.codeTranslate(WorkOrderProcessingSchemeNameEnum, i18n, code, prefix);
  }

  /**
   * 告警清除状态
   */
  public static getAlarmCleanStatusName(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmCleansStatusEnum, i18n, code);
  }

  /**
   * 获取枚举key
   */
  public static getEnumKey(code: string, enums: Object) {
    if (code) {
      for (const key in enums) {
        if (enums[key] === code) {
          return key;
        }
      }
    }
    return '';
  }

  /**
   * 根据设施过滤设备类型
   */
  public static filterEquipmentTypes(deviceType: string, i18n: NzI18nService) {
    const typeList = FacilityForCommonUtil.getRoleEquipmentType(i18n);
    // 设施类型为智慧杆或者配电箱时，设备类型不展示门禁锁
    // 反之设备类型值展示门禁锁
    const param = {equipList: [], equipType: []};
    if (deviceType === DeviceTypeEnum.wisdom || deviceType === DeviceTypeEnum.distributionPanel) {
      typeList.forEach(item => {
        if (item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock) {
          param.equipList.push(item);
          param.equipType.push(item.code);
        }
      });
    } else {
      typeList.forEach(item => {
        if (item.code === EquipmentTypeEnum.intelligentEntranceGuardLock) {
          param.equipList.push(item);
          param.equipType.push(item.code);
        }
      });
    }
    return param;
  }
}
