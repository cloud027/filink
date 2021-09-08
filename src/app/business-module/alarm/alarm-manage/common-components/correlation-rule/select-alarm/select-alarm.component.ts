import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges} from '@angular/core';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import * as _ from 'lodash';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {AlarmSelectorConfigTypeEnum} from '../../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {CorrelationAnalysisModel} from '../../../../share/model/correlation-analysis.model';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {rootAlarmActionEnum} from '../../../../share/enum/alarm.enum';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {AlarmService} from '../../../../share/service/alarm.service';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
/**
 * 步骤1 选择告警
 */
@Component({
  selector: 'app-select-alarm',
  templateUrl: './select-alarm.component.html',
})
export class SelectAlarmComponent implements OnInit, OnChanges {
  // 根原因告警
  @ViewChild('alarmReasonTemp') private alarmReasonTemp;
  // 相关告警
  @ViewChild('alarmCorrelationTemp') private alarmCorrelationTemp;
  // 存储form表单
  @Input() public stepsFirstData: CorrelationAnalysisModel;
  @Output()
  private formValid = new EventEmitter<boolean>();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 选择告警表单
  public formColumn: FormItem[] = [];
  // 根原因告警配置
  public alarmReasonConfig: AlarmSelectorConfigModel;
  // 相关告警配置
  public alarmCorrelationConfig: AlarmSelectorConfigModel;
  // 根原因告警名称
  private checkAlarmReason: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 相关告警名称
  private alarmCorrelation: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 选择告警表单实例
  private formStatus: FormOperate;
  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $alarmService: AlarmService,
    ) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initForm();
    // 根原因告警
    this.initAlarmReasonConfig();
    // 相关告警
    this.initAlarmCorrelationConfig();
  }
  // 监听表单数据变化
  public ngOnChanges(): void {
    if (this.formStatus) {
      this.formStatus.resetData(this.stepsFirstData);
      // 根告警原因
      if (this.stepsFirstData.rootAlarmName && this.stepsFirstData.rootAlarmNameId) {
        this.checkAlarmReason = new AlarmSelectorInitialValueModel(this.stepsFirstData.rootAlarmName, [this.stepsFirstData.rootAlarmNameId]);
        this.formStatus.resetControlData('rootAlarmNameId', this.stepsFirstData.rootAlarmNameId);
      }
      // 相关告警
      if (this.stepsFirstData.relevanceAlarmDtoList && this.stepsFirstData.relevanceAlarmDtoList.length > 0) {
        this.alarmCorrelation = {
          name: this.stepsFirstData.relevanceAlarmDtoList.map(item => item.relevanceAlarmName).join(),
          ids:  this.stepsFirstData.relevanceAlarmDtoList.map(item => item.relevanceAlarmNameId),
        };
        this.formStatus.resetControlData('relevanceAlarmNameIdList', this.alarmCorrelation.ids);
      }
      this.initAlarmReasonConfig();
      this.initAlarmCorrelationConfig();
    }
  }
  /**
   * 下一步
   */
  public handNextSteps() {
    const data: CorrelationAnalysisModel = this.formStatus.group.getRawValue();
    _.assign(this.stepsFirstData, data);
    return data;
  }
  /**
   * 提交按钮禁启用
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe((params) => {
      this.formValid.emit(this.formStatus.getRealValid());
    });
  }
  /**
   * 表单
   */
  private initForm(): void {
    const formList: FormItem[] = [
      {
        // 规则名称
        label: this.language.ruleName, key: 'staticRelevanceRuleName',
        type: 'input', require: true,
        rule: [
          {required: true},
          {maxLength: 32},
          RuleUtil.getNamePatternRule(this.commonLanguage.namePattenMsg),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$alarmService.checkStaticRuleName(value, this.stepsFirstData.id),
            res => res.code === ResultCodeEnum.success)
        ],
      },
      {
        // 根原因告警
        label: this.language.alarmReason,
        key: 'rootAlarmNameId',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.alarmReasonTemp,
      },
      {
        // 根原因告警动作
        label: this.language.alarmReasonAction,
        key: 'rootAlarmAction',
        type: 'select',
        initialValue: rootAlarmActionEnum.nothing,
        selectInfo: {
          data: [
            {label: this.language.nothing, value: rootAlarmActionEnum.nothing}
          ],
          label: 'label', value: 'value'
        },
        require: true,
        rule: [{required: true}],
      },
      {
        // 相关告警
        label: this.language.alarmCorrelation,
        key: 'relevanceAlarmNameIdList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.alarmCorrelationTemp,
      },
      {
        // 相关告警动作
        label: this.language.correlationAlarmAction,
        key: 'relevanceAlarmAction',
        type: 'select',
        selectInfo: {
          data: AlarmUtil.translateAlarmAction(this.$nzI18n, null),
          label: 'label', value: 'code'
        },
        require: true,
        rule: [{required: true}],
      },
    ];
    formList.forEach(v => {
      v.labelWidth = 170;
    });
    this.formColumn = formList;
  }
  /**
   * 根原因告警
   */
  private initAlarmReasonConfig() {
    this.alarmReasonConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.checkAlarmReason,
      clear: !this.checkAlarmReason.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmReason = new AlarmSelectorInitialValueModel(event.name, event.ids);
        this.formStatus.resetControlData('rootAlarmNameId', this.checkAlarmReason.ids.join());
      },
    };
  }
  /**
   * 相关告警
   */
  private initAlarmCorrelationConfig() {
    this.alarmCorrelationConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.alarmCorrelation,
      clear: !this.alarmCorrelation.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.alarmCorrelation = new AlarmSelectorInitialValueModel(event.name, event.ids);
        this.formStatus.resetControlData('relevanceAlarmNameIdList', this.alarmCorrelation.ids);
      },
    };
  }
}
