import {WorkOrderStatusClassEnum} from '../../enum/work-order/work-order-status-class.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {WorkOrderStatusEnum} from '../../enum/work-order/work-order-status.enum';
import {WorkOrderTypesEnum} from '../../enum/work-order/work-order-type.enum';
import {IndexWorkOrderTypeStatisticsEnum} from '../../enum/work-order/work-order.enum';
import {SessionUtil} from '../../../shared-module/util/session-util';

/**
 * 工单状态图标及国际化
 */
export class WorkOrderStatusUtil {
  /**
   * 获取工单图标
   * param {string} type
   * returns {string}
   */
  public static getWorkOrderIconClassName(type: string): string {
    let iconClass = '';
    if (type) {
      for (const k in WorkOrderStatusClassEnum) {
        if (WorkOrderStatusClassEnum[k] && k === type) {
          iconClass = `iconfont icon-fiLink ${WorkOrderStatusClassEnum[k]}`;
          break;
        }
      }
    }
    return iconClass;
  }

  /**
   * 获取状态名称
   */
  public static getWorkOrderStatus(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(WorkOrderStatusEnum, i18n, code, LanguageEnum.workOrder);
  }

  /**
   * 获取工单状态列表
   */
  public static getWorkOrderStatusList(i18n: NzI18nService) {
    const list = [];
    for (const key in WorkOrderStatusEnum) {
      if (WorkOrderStatusEnum[key]) {
        const label = WorkOrderStatusUtil.getWorkOrderStatus(i18n, WorkOrderStatusEnum[key]);
        if (label) {
          list.push({
            value: WorkOrderStatusEnum[key],
            label: label
          });
        }
      }
    }
    return list;
  }

  /**
   * 获取工单类型
   */
  public static getWorkOrderType(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(WorkOrderTypesEnum, i18n, code, LanguageEnum.inspection);
  }

  /**
   * 判断是否有工单权限，返回对应工单类型租户
   */
  public static checkProcAuthority(i18n: NzI18nService, procKey?: string[]) {
    const accessKey = [
      {key: '06-1-1', tenant: '1-1-3-4', code: 'INSPECTION', value: 'inspection'},
      {key: '06-2-1', tenant: '1-1-3-5', code: 'CLEAR_FAILURE', value: 'clear_failure'},
      {key: '06-5-1', tenant: '1-1-3-7', code: 'PROC_CONFIRM', value: 'confirm'},
      {key: '06-4-1', tenant: '1-1-3-6', code: 'PROC_INSTALL', value: 'proc_install'},
      {key: '06-6-1', tenant: '1-1-3-8', code: 'REMOVE', value: 'remove'}
    ];
    let keyMap = [];
    if (procKey && procKey.length) {
      accessKey.forEach(v => {
        if (procKey.includes(v.key)) {
          keyMap.push(v);
        }
      });
    } else {
      keyMap = accessKey;
    }
    // 获取所有权限工单
    const list = CommonUtil.codeTranslate(IndexWorkOrderTypeStatisticsEnum, i18n, null, LanguageEnum.inspection) as any[];
    // 获取有工单权限的数据
    const result = [];
    list.forEach(item => {
      keyMap.forEach(v => {
        if (v.code === item.code && SessionUtil.checkHasRole(v.key)) {
          result.push(Object.assign(item, v));
        }
      });
    });
    return result;
  }
}
