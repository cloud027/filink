import {getControlType, getExecStatus, getPolicyType, getProgramStatus, getStrategyStatus} from './application.util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ApplicationFinalConst, ClassStatusConst, ExecStatusConst, StrategyListConst} from '../const/application-system.const';
import * as lodash from 'lodash';
import {StrategyListModel} from '../model/policy.control.model';
import {ConditionTypeEnum} from '../enum/condition-type.enum';
import {ApplicationScopeTypeEnum} from '../enum/policy.enum';
import {NzI18nService} from 'ng-zorro-antd';

/**
 * 策略详情的枚举和多语言
 * @ param item
 * @ param $nzI18n
 */
export function detailsFmt(item: StrategyListModel, $nzI18n: NzI18nService): StrategyListModel {
  setStrategyRefList(item);
  const newObject = lodash.cloneDeep(item);
  if (newObject.strategyType) {
    newObject._strategyType = newObject.strategyType;
    newObject.strategyType = getPolicyType($nzI18n, newObject.strategyType);
  }
  if (newObject.execStatus) {
    newObject.execStatus = getExecStatus($nzI18n, newObject.execStatus);
  } else {
    newObject.execStatus = getExecStatus($nzI18n, ExecStatusConst.free);
  }
  if (newObject.effectivePeriodStart) {
    newObject.effectivePeriodStart = CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(newObject.effectivePeriodStart));
  } else {
    newObject.effectivePeriodStart = '';
  }
  if (newObject.effectivePeriodEnd) {
    newObject.effectivePeriodEnd = CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(newObject.effectivePeriodEnd));
  } else {
    newObject.effectivePeriodEnd = '';
  }
  if (newObject.createTime) {
    newObject.createTime = CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(newObject.createTime));
  }
  if (newObject.strategyStatus) {
    newObject._strategyStatus = newObject.strategyStatus;
    newObject.strategyStatus = getStrategyStatus($nzI18n, newObject.strategyStatus);
  }
  if (newObject.controlType) {
    newObject.controlType = getControlType($nzI18n, newObject.controlType);
  }
  if (newObject.programStatus) {
    newObject.programStatus = getProgramStatus($nzI18n, newObject.programStatus);
  }
  if (newObject.workOrderStatus) {
    newObject.workOrderStatus = getProgramStatus($nzI18n, newObject.workOrderStatus);
  }
  return newObject;
}

/**
 * 如果是 触发器将设备加入到 关联设施回显
 * param newObject
 */
export function setStrategyRefList(newObject: StrategyListModel): void {
  if (newObject.linkageStrategyInfo && newObject.linkageStrategyInfo.conditionType === ConditionTypeEnum.trigger) {
    if (typeof newObject.linkageStrategyInfo.actionBackup === 'string') {
      newObject.linkageStrategyInfo.actionBackup = JSON.parse(newObject.linkageStrategyInfo.actionBackup);
    }
    if (typeof newObject.linkageStrategyInfo.multipleConditions === 'string' && !newObject.linkageStrategyInfo.triggerSelectedList) {
      newObject.linkageStrategyInfo.triggerSelectedList = JSON.parse(newObject.linkageStrategyInfo.multipleConditions);
    }
    // 当前事件源类型为触发时 第三步（完成界面）使用strategyRefList进行地图回显点
    newObject.strategyRefList = [];
    newObject.linkageStrategyInfo.actionBackup.forEach(_item => {
      _item.selectedEquipment.forEach(equipment => {
        newObject.strategyRefList.push({
          refName: equipment.equipmentName,
          refEquipmentType: equipment.equipmentType,
          refType: ApplicationScopeTypeEnum.equipment,
          refId: equipment.equipmentId,
        });
      });
    });
    newObject.linkageStrategyInfo.triggerSelectedList.forEach(equipment => {
      newObject.strategyRefList.push({
        refName: equipment.equipmentName,
        refEquipmentType: equipment.equipmentType,
        refType: ApplicationScopeTypeEnum.equipment,
        refId: equipment.equipmentId,
      });
    });
  }
}

/**
 * 切换步骤条样式
 */
export function changeStepsStyle(setData, isActiveSteps: number): void {
  setData.forEach(item => {
    if (isActiveSteps > item.number) {
      item.activeClass = ` ${ClassStatusConst.stepsFinish}`;
    } else if (isActiveSteps === item.number) {
      item.activeClass = ` ${ClassStatusConst.stepsActive}`;
    } else {
      item.activeClass = '';
    }
  });
}

/**
 * 处理应用范围列表数据分类
 * @ param data
 */
export function listFmt(data) {
  const equipment = data.filter(item => item.refType === StrategyListConst.lighting);
  const group = data.filter(item => item.refType === StrategyListConst.centralizedControl);
  const loop = data.filter(item => item.refType === StrategyListConst.information);
  return {equipment, group, loop};
}
