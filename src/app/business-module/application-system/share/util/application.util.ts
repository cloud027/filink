import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {
  AlarmLevelStatisticsConst,
  alarmLevelStatusConst,
  ControlTypeConst,
  EquipmentStatusConst,
  ExecStatusConst,
  StrategyListConst,
  StrategyStatusConst
} from '../const/application-system.const';
import {FileTypeEnum, ProgramStatusEnum} from '../enum/program.enum';
import {WorkOrderStateStatusEnum} from '../../../../core-module/enum/work-order/work-order.enum';
import {ExecTypeEnum} from '../../../../core-module/enum/equipment/policy.enum';
import {EnableOnvifStatusEnum} from '../enum/camera.enum';
import {CameraTypeEnum, EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {DeviceStatusEnum} from '../../../../core-module/enum/facility/facility.enum';

/**
 * 策略类型枚举
 * @ param i18n
 * @ param code
 */
export function getPolicyType(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(StrategyListConst, i18n, code, 'application.policyControl');
}

/**
 * 执行状态枚举
 * @ param i18n
 * @ param code
 */
export function getExecStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(ExecStatusConst, i18n, code, 'application.execStatus');
}

/**
 * 控制类型
 * @ param i18n
 * @ param code
 */
export function getControlType(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(ControlTypeConst, i18n, code, 'application.controlType');
}

/**
 *策略状态
 * @ param i18n
 * @ param code
 */
export function getStrategyStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(StrategyStatusConst, i18n, code, 'application.strategyStatus');
}

/**
 * 设备状态统计枚举
 */
export function getEquipmentStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(EquipmentStatusConst, i18n, code, 'application.equipmentStatus');
}

/**
 * 告警状态统计枚举
 */
export function getAlarmLevelStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(alarmLevelStatusConst, i18n, code, 'application.alarmLevelStatus');
}

/**
 * 告警级别统计
 */
export function getAlarmLevel(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(AlarmLevelStatisticsConst, i18n, code, 'application.alarmLevel');
}


/**
 * 获取设备状态
 */
export function getEquipmentState(i18n: NzI18nService, code = null): any {
  return CommonUtil.codeTranslate(EquipmentStatusEnum, i18n, code, LanguageEnum.facility);
}

/**
 * 获取设备类型
 */
export function getEquipmentType(i18n: NzI18nService, code = null): any {
  return CommonUtil.codeTranslate(EquipmentTypeEnum, i18n, code, LanguageEnum.facility);
}

/**
 *节目状态
 * @ param i18n
 * @ param code
 */
export function getProgramStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(ProgramStatusEnum, i18n, code, 'application.programStatus');
}

/**
 * 文件类型
 * @ param i18n
 * @ param code
 */
export function getFileType(i18n: NzI18nService, code = null) {
  if (code && FileTypeEnum.image.includes(code)) {
    code = FileTypeEnum.image;
  }
  return CommonUtil.codeTranslate(FileTypeEnum, i18n, code, 'application.fileType');
}


/**
 *工单状态
 * @ param i18n
 * @ param code
 */
export function workOrderStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(WorkOrderStateStatusEnum, i18n, code, 'application.workOrderState');
}

/**
 * 执行类型
 * @ param i18n
 * @ param code
 */
export function execType(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(ExecTypeEnum, i18n, code, 'application.executionCycleType');
}

/**
 * 设施状态
 * @ param i18n
 * @ param code
 */
export function getDeviceStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(DeviceStatusEnum, i18n, code);
}

/**
 *是否启用ONVIF探测
 * @ param i18n
 * @ param code
 */
export function enableOnvifStatus(i18n: NzI18nService, code = null) {
  return CommonUtil.codeTranslate(EnableOnvifStatusEnum, i18n, code, 'application.enableOnvifState');
}

export function getEquipmentTypeIcon(data: EquipmentListModel): string {
  // 设置设备类型的图标
  let iconClass = '';
  if (data.equipmentType === EquipmentTypeEnum.camera && data.equipmentModelType === CameraTypeEnum.bCamera) {
    // 摄像头球型
    iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
  } else {
    iconClass = CommonUtil.getEquipmentIconClassName(data.equipmentType);
  }
  return iconClass;
}

/**
 * 设备状态枚举
 * @ param data
 * @ param $nzI18n
 */
export function equipmentFmt(data, $nzI18n) {
  data.forEach(item => {
    item.equipmentType = getEquipmentType($nzI18n, item.equipmentType);
    item.equipmentStatus = getEquipmentState($nzI18n, item.equipmentStatus);
  });
}
