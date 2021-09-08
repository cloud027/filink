import {EquipmentModel} from '../../model/equipment.model';
import {EquipmentDeviceTypeModel} from '../../model/equipment-device-type.model';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {levelClassEnum, HandleStatusEnum, TroubleSourceEnum, TroubleTypeEnum} from '../../enum/trouble/trouble-common.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {SelectModel} from '../../../shared-module/model/select.model';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import * as _ from 'lodash';
import {EquipmentTypeEnum} from '../../../core-module/enum/equipment/equipment.enum';
import {Injectable} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../assets/i18n/alarm/alarm-language.interface';
import {TroubleForCommonService} from '../../api-service/trouble/trouble-for-common.service';
import {EquipmentOrDeviceInfoModel} from '../../model/equipment-device-info.model';
@Injectable()
export class TroubleUtil {
  constructor(
    public $troubleService: TroubleForCommonService) {
  }

  /**
   * 背景色反映射
   * enumType: any 传枚举
   */
  public static getColorName(value: string | number, enumType: any): string {
    if (value) {
      for (const key in enumType) {
        if (key && enumType[key] === value) {
          return key;
        }
      }
    } else {
      return '';
    }
  }

  /**
   * 获取卡片等级图标
   */
  public static getLevelClass(level) {
    return `iconfont ${levelClassEnum[level]}`;
  }

  /**
   * 获取下拉框设施类型容器映射
   */
  public static getDeviceType(facilityList, i18n: NzI18nService): SelectModel[] {
    const deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, i18n) as SelectModel[];
    if (!_.isEmpty(facilityList)) {
      return deviceType.filter(item => facilityList.includes(item.code)) || [];
    }
    return [];
  }

  /**
   * 获取下拉框设备类型容器映射
   */
  public static getEquipmentType(equipmentList, i18n: NzI18nService): SelectModel[] {
    const equipmentType: SelectModel[] = CommonUtil.codeTranslate(EquipmentTypeEnum, i18n) as SelectModel[];
    if (!_.isEmpty(equipmentList)) {
      return equipmentType.filter(item => equipmentList.includes(item.code)) || [];
    }
    return [];
  }

  /**
   * 页面展示故障类型信息
   */
  public static showTroubleTypeInfo(list: SelectModel[], type: string): string {
    let troubleTypeName = '';
    list.forEach(entity => {
      if (entity.value === type) {
        troubleTypeName = entity.label;
      }
    });
    return troubleTypeName;
  }

  /**
   * 多个设备
   * param arr { label: string, code: any }[]
   */
  public static getEquipmentArr(language, list: EquipmentModel[]) {
    const resultData = new EquipmentOrDeviceInfoModel();
    list.forEach(item => {
      const equipmentObj = new EquipmentDeviceTypeModel();
      // 设备名称
      equipmentObj.name = item.equipmentName;
      // 设备类型图标
      equipmentObj.picture = CommonUtil.getEquipmentIconClassName(item.equipmentType);
      // 设备类型名称
      equipmentObj.typeName = TroubleUtil.equipmentType(item.equipmentType, language);
      resultData.resultInfo.push(equipmentObj);
      resultData.resultNames.push(item.equipmentName);
    });
    return resultData;
  }

  /**
   * 获取设备类型名称
   */
  public static equipmentType(code: string, language: AlarmLanguageInterface) {
    if (code) {
      for (const k in EquipmentTypeEnum) {
        if (k && EquipmentTypeEnum[k] === code) {
          return language[k];
        }
      }
    } else {
      return '';
    }
  }

  /**
   * 电子锁相关的设施类型
   */
  public static filterDeviceType() {
    let deviceTypeList = [];
    const retainDeviceType = ['D002', 'D003'];
    // tslint:disable-next-line:forin
    for ( const k in DeviceTypeEnum) {
      deviceTypeList.push(DeviceTypeEnum[k]);
    }
    deviceTypeList = deviceTypeList.filter(item => {
      return retainDeviceType.includes(item);
    });
    return deviceTypeList;
  }
  /**
   * 处理状态
   */
  public static translateHandleStatus(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(HandleStatusEnum, i18n, code);
}

  /**
   * 故障来源
   */
  public static translateTroubleSource(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(TroubleSourceEnum, i18n, code, 'fault.config');
  }

  /**
   * 故障类型
   */
  public static translateTroubleType(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(TroubleTypeEnum, i18n, code, 'fault');
  }
}

