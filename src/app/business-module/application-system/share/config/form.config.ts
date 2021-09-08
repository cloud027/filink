export class FormConfig {
  /**
   * 策略状态
   * @ param policyControl
   */
  static formDataConfig(policyControl) {
    return [
      {label: policyControl.lighting, code: '1'},
      {label: policyControl.information, code: '3'},
      {label: policyControl.broadcast, code: '4'},
      {label: policyControl.linkage, code: '5'}
    ];
  }

  /**
   * 执行周期
   */
  static strategyDataConfig(execType) {
    return [
      {label: execType.nothing, code: '1'},
      {label: execType.daily, code: '2'},
      {label: execType.workingDay, code: '3'},
      {label: execType.vacations, code: '4'},
      {label: execType.execution, code: '5'},
      {label: execType.custom, code: '6'}
    ];
  }

  /**
   * 平台类型
   */
  static controlDataConfig(controlType) {
    return [
      {label: controlType.platform, code: '1'},
      {label: controlType.equipment, code: '2'}
    ];
  }
}
