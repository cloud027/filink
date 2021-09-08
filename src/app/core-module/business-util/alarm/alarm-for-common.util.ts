import {SelectModel} from '../../../shared-module/model/select.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {AlarmForCommonService} from '../../api-service/alarm/alarm-for-common.service';
import { NzI18nService } from 'ng-zorro-antd';
import { CommonUtil } from '../../../shared-module/util/common-util';
import { AlarmCleanStatusEnum } from '../../enum/alarm/alarm-clean-status.enum';
import { AlarmLevelEnum } from '../../enum/alarm/alarm-level.enum';
import { AlarmConfirmStatusEnum } from '../../enum/alarm/alarm-confirm-status.enum';
import {AlarmTypeCodeEnum} from '../../enum/alarm/alarm-type.enum';
import {AlarmSuggestEnum} from '../../enum/alarm/alarm-suggest.enum';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {LanguageTypeEnum} from '../../enum/language-type.enum';

export class AlarmForCommonUtil {
  /**
   * 页面展示告警类别信息
   */
  public static showAlarmTypeInfo(alarmList: SelectModel[], type: string): string {
    let alarmTypeName = '';
    alarmList.forEach(entity => {
      if (entity.value === type) {
        alarmTypeName = entity.label;
      }
    });
    return alarmTypeName;
  }

  /**
   * 动态设置频次字体大小
   */
  public static setFontSize(len: string | number) {
    const countLength = String(len).length;
    let fontSize = 0;
    if (countLength > 4) {
      fontSize = 16;
    } else if (countLength > 2) {
      fontSize = 22;
    } else {
      fontSize = 28;
    }
    return fontSize;
  }

  /**
   * 告警类别
   */
  public static getAlarmTypeList(alarmService: AlarmForCommonService) {
    return new Promise((resolve, reject) => {
      alarmService.getAlarmTypeList().subscribe((res: ResultModel<SelectModel[]>) => {
        if (res.code === 0) {
          const data = res.data;
          const alarmList = data.map(item => {
            return ({'label': item.value, 'value': item.key, 'code': item.key});
          });
          resolve(alarmList);
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 获取清除状态
   */
  public static translateAlarmCleanStatus(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmCleanStatusEnum, i18n, code);
  }

  /**
   * 获取告警等级
   */
  public static translateAlarmLevel(i18n: NzI18nService, code = null): any {
    return CommonUtil.codeTranslate(AlarmLevelEnum, i18n, code, 'alarm');
  }

  /**
   * 获取告警确认状态
   */
  public static translateAlarmConfirmStatus(i18n: NzI18nService, code = null): any {
    return CommonUtil.codeTranslate(AlarmConfirmStatusEnum, i18n, code);
  }

  /**
   * 告警类型
   */
  public static translateAlarmType(i18n: NzI18nService, code = null): any {
    return CommonUtil.codeTranslate(AlarmTypeCodeEnum, i18n, code, 'alarm');
  }

  /**
   * 运维建议
   */
  public static translateSuggest(i18n: NzI18nService, code = null): any {
    return CommonUtil.codeTranslate(AlarmSuggestEnum, i18n, code, 'alarm');
  }

  /**
   * 告警名称
   * @param i18n 语言库服务
   * @param code 告警code码
   */
  public static translateAlarmNameByCode(i18n: NzI18nService, code: string): string {
    /**
     *  从租户国际化中提取告警元素翻译
     *  1、国际化中存在当前翻译，采用当前翻译
     *  2、不存在时，判断当前语言环境
     *  3、当前语言为英文时，取告警code码为翻译
     *  4、为中文时，采用原有告警名称
     */
    if (!code) { return null; }
    const language = i18n.getLocaleData(LanguageEnum.tenant);
    if (language && language[code]) {
      return language[code];
    } else {
      const lang = localStorage.getItem('localId');
      if (lang === LanguageTypeEnum.en) {
        return code;
      } else {
        return null;
      }
    }
  }
}
