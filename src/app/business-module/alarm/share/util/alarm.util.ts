import {ResultModel} from '../../../../shared-module/model/result.model';
import {AlarmService} from '../service/alarm.service';
import {AlarmLevelModel} from '../../../../core-module/model/alarm/alarm-level.model';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from 'src/app/shared-module/util/common-util';
import {
  AlarmDisableStatusEnum,
  AlarmEnableStatusEnum, AlarmOperatorEnum, AlarmPropertyEnum, AlarmReasonPropertyEnum,
  AlarmTriggerTypeEnum,
  AlarmWorkOrderTypeEnum, CorrelationAlarmActionEnum, CorrelationAlarmPropertyEnum, OutputTypeEnum,
  ProcessStatusEnum, rootAlarmActionEnum, RuleConditionEnum, TaskStatusEnum, TaskTypeEnum, TranslateOperatorEnum,
} from '../enum/alarm.enum';
import {AlarmRemoteModel} from '../model/alarm-remote.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {AlarmOrderModel} from '../model/alarm-order.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {AlarmEquipmentTypeModel} from '../model/alarm-equipment-type.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {EquipmentOrDeviceInfoModel} from '../../../../core-module/model/equipment-device-info.model';
import {EquipmentDeviceTypeModel} from '../../../../core-module/model/equipment-device-type.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmRemoteDeviceModel} from '../model/alarm-remote-device.model';
import {AlarmRemoteEquipmentModel} from '../model/alarm-remote-equipment.model';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {StepsModel} from '../../../../core-module/enum/application-system/policy.enum';
import {RuleConditionModel} from '../model/rule-condition.model';

export class AlarmUtil {
  /**
   * 查询所有告警级别
   */
  public static queryAlarmLevel(alarmService: AlarmService) {
    return new Promise((resolve, reject) => {
        let alarmLevelArray = [];
        alarmService.queryAlarmLevel().subscribe((res: ResultModel<AlarmLevelModel[]>) => {
          if (res.data.length) {
            alarmLevelArray = res.data.map(item => {
              return {
                label: item.alarmLevelName,
                value: item.alarmLevelCode,
              };
            });
          }
          resolve(alarmLevelArray);
        }, (error) => {
          reject(error);
        });
      },
    );
  }

  /**
   * 根据区域id获取区域名称
   */
  public static getAreaName(alarmService: AlarmService, areaIds: string[]) {
    return new Promise((resolve, reject) => {
        alarmService.getAreaNameFromAreaIds(areaIds).subscribe((res: ResultModel<AreaModel[]>) => {
          if (res.code === ResultCodeEnum.success) {
            resolve(res.data);
          }
        }, (error) => {
          reject(error);
        });
      },
    );
  }

  /**
   * 根据区域id筛选对应区域名称--告警通知
   */
  public static joinAlarmForwardRuleAreaName(dataSet: AlarmRemoteModel[], areaData: AreaModel[]) {
    dataSet.forEach(item => {
      item.alarmForwardRuleAreaList.forEach(aItem => {
        areaData.forEach(bItem => {
          if (bItem.areaId === aItem.areaId) {
            item.alarmForwardRuleAreaName.push(bItem.areaName);
          }
        });
      });
      if (item.alarmForwardRuleAreaName && item.alarmForwardRuleAreaName.length) {
        item.areaName = item.alarmForwardRuleAreaName.join(',');
      }
    });
  }

  /**
   * 根据区域id筛选对应区域名称--告警转工单
   */
  public static joinAlarmWorkOrderForwardRuleAreaName(dataSet: AlarmOrderModel[], areaData: AreaModel[]) {
    dataSet.forEach(item => {
      item.alarmOrderRuleArea.forEach(areaId => {
        areaData.forEach(bItem => {
          if (bItem.areaId === areaId) {
            item.alarmOrderRuleAreaName.push(bItem.areaName);
          }
        });
      });
      if (item.alarmOrderRuleAreaName && item.alarmOrderRuleAreaName.length) {
        item.areaName = item.alarmOrderRuleAreaName.join(',');
      }
    });
  }

  /**
   * 根据区域id获取设施类型
   * AlarmService 服务  areaIds区域id  allDeviceType所有设施类型
   */
  public static getAreaIdDeviceType(alarmService: AlarmService, areaIds: string[], allDeviceType: SelectModel[]) {
    return new Promise((resolve, reject) => {
      alarmService.getDeviceType(areaIds).subscribe((res: ResultModel<string[]>) => {
        if (res.code === 0) {
          // 过滤区域下的设施类型
          const deviceTypeList = [];
          allDeviceType.forEach(item => {
            res.data.forEach(id => {
              if (id === item.code) {
                deviceTypeList.push(item);
              }
            });
          });
          resolve(deviceTypeList);
        }
      }, err => {
        reject(err);
      });
    });
  }

  /**
   * 根据区域id获取设施类型
   * desc alarmService 服务 params 区域code和设施类型 allEquipmentType 所有设备类型
   */
  public static getAreaCodeEquipmentType(alarmService: AlarmService, params: AlarmEquipmentTypeModel, allEquipmentType) {
    return new Promise((resolve, reject) => {
      alarmService.getEquipmentTypeList(params).subscribe((res: ResultModel<EquipmentListModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          const equipmentTypeList = [];
          // 过滤区域下的设备类型
          allEquipmentType.forEach(item => {
            res.data.forEach(itemEquipmentType => {
              if (itemEquipmentType.equipmentType === item.code) {
                equipmentTypeList.push(item);
              }
            });
          });
          resolve(equipmentTypeList);
        }
      }, err => {
        reject(err);
      });
    });
  }

  /**
   * 多个设施类型
   * @param list 设施类型数据
   */
  public static setDeviceTypeList(list: AlarmRemoteDeviceModel[], i18n: NzI18nService) {
    const resultData = new EquipmentOrDeviceInfoModel();
    list.forEach(item => {
      const deviceObj = new EquipmentDeviceTypeModel();
      const deviceType = item.deviceTypeId as string;
      // 设施类型图标
      deviceObj.picture = CommonUtil.getFacilityIconClassName(deviceType);
      // 设施类型名称
      deviceObj.typeName = FacilityForCommonUtil.translateDeviceType(i18n, deviceType);
      resultData.resultInfo.push(deviceObj);
      // 设施类型名称集合
      resultData.resultNames.push(deviceObj.typeName);
    });
    return resultData;
  }

  /**
   * 多个设备类型
   * @param list 设备类型数据
   * @param key 设备类型
   */
  public static setEquipmentTypeList(list: AlarmRemoteEquipmentModel[], key: string, i18n: NzI18nService) {
    const resultData = new EquipmentOrDeviceInfoModel();
    list.forEach(item => {
      const equipmentObj = new EquipmentDeviceTypeModel();
      const equipmentType = item[key];
      // 设备类型图标
      equipmentObj.picture = CommonUtil.getEquipmentIconClassName(equipmentType);
      // 设备类型名称
      equipmentObj.typeName = FacilityForCommonUtil.translateEquipmentType(i18n, equipmentType) as string;
      resultData.resultInfo.push(equipmentObj);
      // 设备类型名称集合
      resultData.resultNames.push(equipmentObj.typeName);
    });
    return resultData;
  }

  /**
   * 组装静态告警规则条件表格数据
   */
   public static ruleCondition(data: RuleConditionModel[], languageTable: AlarmLanguageInterface, i18n: NzI18nService) {
     data.forEach(item => {
       // 根原因告警属性
       const rootCauseAlarmAttribute = AlarmUtil.translateReasonProperty(i18n, item.rootCauseAlarmAttribute);
       // 相关告警属性
       const relevanceAlarmProperties = AlarmUtil.translateReasonProperty(i18n, item.relevanceAlarmProperties);
       // 运算符
       let operator = AlarmUtil.translateAlarmOperator(i18n, item.operator);
       operator = operator === TranslateOperatorEnum.equal ? '=' : operator === TranslateOperatorEnum.unequal ? '≠' : operator;
       item.ruleCondition = `(${languageTable.root}) ${ rootCauseAlarmAttribute} ${operator} (${languageTable.correlation}) ${relevanceAlarmProperties}`;
     });
     return data;
   }

  /**
   * 步骤条数据组装
   */
  public static assemblyStep(stepData, languageStep: AlarmLanguageInterface) {
    const stepDataList = [];
    for ( const key in stepData) {
      if (key) {
        const newObj = new StepsModel();
        // 步骤
        newObj.number = Number(stepData[key]);
        // 样式
        newObj.activeClass = Number(stepData[key]) === 1 ? 'active' : '';
        // 名称
        newObj.title = languageStep[key];
        stepDataList.push(newObj);
      }
    }
    return stepDataList;
  }
  /**
   * 规则条件操作符
   */
  public static ruleConditionOperator(i18n: NzI18nService) {
    const operator = AlarmUtil.translateAlarmOperator(i18n, null) as SelectModel[];
    const resultOperator = operator.map(item => {
      if (item.code === AlarmOperatorEnum.electricityLink || item.code === AlarmOperatorEnum.communicationLink) {
        item['disable'] = true;
      } else {
        item['disable'] = false;
      }
      return item;
    });
    return resultOperator;
  }

  /**
   * 时分秒转时间戳
   * param flag 转换方式
   */
  public static formatterMinutesAndSeconds(time: number, flag: boolean): number | string {
    // 时分秒转number时间戳
    if (flag) {
      const date = new Date(time);
      const h = date.getHours();
      const m = date.getMinutes();
      const s = date.getSeconds();
      return (h * 3600 + m * 60 + s) * 1000;
    } else {
      // number时间戳转string时分秒
      const date = new Date(Number(time) - 8 * 3600 * 1000);
      const h = date.getHours();
      const m = date.getMinutes();
      const s = date.getSeconds();
      const timeStr = `${(h < 10) ? '0' + h : h}:${(m < 10) ? '0' + m : m}:${(s < 10) ? '0' + s : s}`;
      return timeStr;
    }
  }

  /**
   * 根据枚举及国际化返回查询数组
   */
  public static enumToArray(language, enumType) {
    const list = [];
    if (enumType) {
      Object.keys(enumType).forEach(key => {
        list.push({
          label: language[key],
          value: enumType[key]
        });
      });
    }
    return list;
  }

  /**
   * 启用禁用
   */
  public static translateDisableAndEnable(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmEnableStatusEnum, i18n, code, 'alarm');
  }
  /**
   * 启用禁用
   */
  public static translateEnableAndDisable(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmDisableStatusEnum, i18n, code, 'alarm');
  }


  /**
   * 进程状态
   */
  public static translateProcessesStatus(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(ProcessStatusEnum, i18n, code, 'alarm');
  }

  /**
   * 工单类型
   */
  public static translateOrderType(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmWorkOrderTypeEnum, i18n, code, 'alarm');
  }

  /**
   * 触发条件
   */
  public static translateTriggerType(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmTriggerTypeEnum, i18n, code, 'alarm');
  }

  /**
   * 告警相关性分析运算符
   */
  public static translateAlarmOperator(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmOperatorEnum, i18n, code, 'alarm');
  }
  /**
   * 根原因告警属性
   */
  public static translateReasonProperty(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmReasonPropertyEnum, i18n, code, 'alarm');
  }
  /**
   * 值
   */
  public static translateCorrelationProperty(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(CorrelationAlarmPropertyEnum, i18n, code, 'alarm');
  }
  /**
   * 属性
   */
  public static translateProperty(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(AlarmPropertyEnum, i18n, code, 'alarm');
  }
  /**
   * 根原因告警动作
   */
  public static translateRootAction(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(rootAlarmActionEnum, i18n, code, 'alarm');
  }
  /**
   * 相关告警动作
   */
  public static translateAlarmAction(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(CorrelationAlarmActionEnum, i18n, code, 'alarm');
  }

  /**
   * 任务状态
   */
  public static translateTaskStatus(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(TaskStatusEnum, i18n, code, 'alarm');
  }

  /**
   * 任务类型
   */
  public static translateTaskType(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(TaskTypeEnum, i18n, code, 'alarm');
  }

  /**
   * 输出类型
   */
  public static translateOutputType(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(OutputTypeEnum, i18n, code, 'alarm');
  }

  /**
   * 规则条件
   */
  public static translateCondition(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(RuleConditionEnum, i18n, code, 'alarm');
  }
}
