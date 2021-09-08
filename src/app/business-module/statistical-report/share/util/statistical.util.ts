import {NzI18nService} from 'ng-zorro-antd';
import {DeviceTypeCode} from '../enum/work-order-device.enum';
import {WORK_ORDER_ERROR_REASON_CODE} from '../enum/work-order-error.enum';
import {WORK_ORDER_PROCESSING_CODE} from '../enum/work-order-processing.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';

export class StatisticalUtil {
  public static initTreeSelectorConfig(language, treeNodes) {
    const treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: false,
          idKey: 'areaId',
        },
        key: {
          name: 'areaName',
          children: 'children'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    return {
      // 选择区域
      title: language.selectArea,
      width: '1000px',
      height: '300px',
      treeNodes: treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: language.areaName, key: 'areaName', width: 100,
        },
        {
          title: language.areaLevel, key: 'areaLevel', width: 100,
        }
      ]
    };
  }

  public static getDeviceType(i18n: NzI18nService, code = null): any {
    return this._codeTranslate(DeviceTypeCode, i18n, code);
  }


  public static getErrorReason(i18n: NzI18nService, code = null) {
    return this.codeTranslate(WORK_ORDER_ERROR_REASON_CODE, i18n, code);
  }


  public static getProcessing(i18n: NzI18nService, code = null) {
    return this.codeTranslate(WORK_ORDER_PROCESSING_CODE, i18n, code);
  }

  /**
   * 枚举翻译
   */
  public static codeTranslate(codeEnum, i18n: NzI18nService, code = null) {
    if (code !== null) {
      for (const i of Object.keys(codeEnum)) {
        if (codeEnum[i] === code) {
          return i18n.translate(`workOrder.${i}`);
        }
      }
    } else {
      return Object.keys(codeEnum)
        .map(key => ({ label: i18n.translate(`workOrder.${key}`), code: codeEnum[key] }));
    }
  }


  public static _codeTranslate(codeEnum, i18n: NzI18nService, code = null) {
    if (code !== null) {
      for (const i of Object.keys(codeEnum)) {
        if (codeEnum[i] === code) {
          return i18n.translate(`facility.config.${i}`);
        }
      }
    } else {
      return Object.keys(codeEnum)
        .map(key => ({ label: i18n.translate(`facility.config.${key}`), code: codeEnum[key] }));
    }
  }

  /**
   * 获取当前用户能看到的设施类型
   */
  public static getUserCanLookDeviceType(canSeeList) {
    const list = [];
    canSeeList.forEach(item => {
      item.value = item.code;
      if (SessionUtil.getUserInfo().role.roleDevicetypeList.filter(_item => _item.deviceTypeId === item.code).length > 0) {
        list.push(item);
      }
    });
    canSeeList = list
    return  canSeeList;
  }
}
