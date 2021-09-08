import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {AlarmIsConfirmEnum} from '../enum/alarm.enum';

export class AlarmSetFormUtil {
  static initEditForm(language, commonLanguage, $ruleUtil, $alarmService, alarmLevelArray, alarmTypeList) {
    return [
      {
        // 告警名称
        label: language.alarmName, key: 'alarmName',
        type: 'input', require: true,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(64),
        ],
        customRules: [$ruleUtil.getNameCustomRule()],
        asyncRules: [
          $ruleUtil.getNameAsyncRule((value) => {
            return $alarmService.queryAlarmNameExist(value.replace(/(^\s*)|(\s*$)/g, ''));
          }, (res) => {
            if (res.code === 0) {
              return true;
            }
            return false;
          })
        ],
      },
      {
        // 告警代码
        label: language.AlarmCode, key: 'alarmCode',
        type: 'input', require: true,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(64),
          RuleUtil.getCodeRule(commonLanguage.nameCodeMsg),
        ],
        customRules: [$ruleUtil.getNameCustomRule()],
        asyncRules: [
          $ruleUtil.getNameAsyncRule((value) => {
            return $alarmService.queryAlarmCodeExist(value);
          }, res => res.code === 0, commonLanguage.codeExit)
        ],
      },
      { // 告警级别
        label: language.alarmDefaultLevel, key: 'alarmDefaultLevel',
        type: 'select', require: true,
        col: 24,
        selectInfo: {
          data: alarmLevelArray,
          label: 'label',
          value: 'value'
        },
        rule: [{required: true}], asyncRules: []
      },
      { // 告警类别
        label: language.AlarmType, key: 'alarmClassification',
        type: 'select', require: true,
        col: 24,
        selectInfo: {
          data: alarmTypeList,
          label: 'label',
          value: 'code'
        },
        rule: [{required: true}], asyncRules: []
      },
      { // 定制级别
        label: language.alarmLevel, key: 'alarmLevel',
        type: 'select', require: true,
        col: 24,
        selectInfo: {
          data: alarmLevelArray,
          label: 'label',
          value: 'value'
        },
        rule: [{required: true}], asyncRules: []
      },
      { // 是否自动确认
        label: language.alarmAutomaticConfirmation,
        key: 'alarmAutomaticConfirmation',
        type: 'radio',
        require: true,
        col: 24,
        initialValue: '0',
        radioInfo: {
          data: [
            {label: language.yes, value: AlarmIsConfirmEnum.yes},
            {label: language.no, value: AlarmIsConfirmEnum.no},
          ],
          label: 'label',
          value: 'value'
        },
        rule: [],
        asyncRules: []
      },
    ];
  }
}
