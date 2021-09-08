import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {AbstractControl} from '@angular/forms';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';

/**
 * 新增告警确认工单表单配置
 */
export class AlarmConfirmForm {
  public static initAlarmConfirmConfig(that) {
    that.formColumn = [
      {  // 工单名称
        label: that.workOrderLanguage.name,
        key: 'title', type: 'input', require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(that.InspectionLanguage.nameCodeMsg)
        ],
        customRules: [that.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          that.$ruleUtil.getNameAsyncRule(value => that.$alarmWorkOrderService.checkOrderName(CommonUtil.trim(value), that.orderId),
            res => res.code === ResultCodeEnum.success)
        ]
      },
      { // 工单类型
        label: that.workOrderLanguage.type, key: 'procType', type: 'input',
        disabled: true, require: true,
        initialValue: that.workOrderLanguage.alarmConfirmOrder, rule: []
      },
      {  // 关联告警
        label: that.workOrderLanguage.relevancyAlarm, key: 'refAlarm', type: 'custom',
        require: true, template: that.relevantAlarm,
        rule: [{required: true}], asyncRules: []
      },
      { // 是否自动派单
        label: that.InspectionLanguage.autoDispatch,
        key: 'autoDispatch', type: 'custom',
        require: true, rule: [{required: true}],
        template: that.autoDispatch,
        initialValue: IsSelectAllEnum.deny
      },
      { // 责任单位
        label: that.workOrderLanguage.accountabilityUnitName, key: 'accountabilityDept',
        type: 'custom',
        template: that.accountabilityUnit,
        rule: [], asyncRules: []
      },
      { // 期望完工时间
        label: that.workOrderLanguage.expectedCompleteTime,
        key: 'expectedCompletedTime', type: 'custom',
        template: that.ecTimeTemp, require: true,
        rule: [{required: true}],
        customRules: [{
          code: 'isTime', msg: null, validator: (control: AbstractControl): { [key: string]: boolean } => {
            if (control.value && CommonUtil.sendBackEndTime(new Date(control.value).getTime()) < new Date().getTime()) {
              if (that.formStatus.group.controls['expectedCompletedTime'].dirty) {
                that.$message.info(that.InspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime);
                return {isTime: true};
              }
            } else {
              return null;
            }
          }
        }]
      },
      {  // 待确认原因
        label: that.workOrderLanguage.decidedTrouble,
        key: 'uncertainReason', type: 'input',
        rule: [that.$ruleUtil.getRemarkMaxLengthRule(), that.$ruleUtil.getNameRule()],
        customRules: [that.$ruleUtil.getNameCustomRule()],
      },
      {  // 备注
        label: that.workOrderLanguage.remark,
        key: 'remark', type: 'textarea',
        rule: [that.$ruleUtil.getRemarkMaxLengthRule(), that.$ruleUtil.getNameRule()],
        customRules: [that.$ruleUtil.getNameCustomRule()],
      },
    ];
  }
}
