import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import * as _ from 'lodash';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {CorrelationAnalysisModel} from '../../../../share/model/correlation-analysis.model';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';

/**
 * 步骤3其他设置
 */
@Component({
  selector: 'app-other-setting',
  templateUrl: './other-setting.component.html',
})
export class OtherSettingComponent implements OnInit, OnChanges {
  // 存储form表单
  @Input() public stepsFirstData: CorrelationAnalysisModel;
  // 其他设置
  @Output() public otherSetValidChange = new EventEmitter<boolean>();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 其他设置表单
  public formColumn: FormItem[] = [];
  // 其他设置表单实例
  private formStatus: FormOperate;
  constructor(
    public $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
  ) { }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.initForm();
  }
  /**
   * 监听表单数据变化
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (this.formStatus) {
      this.formStatus.resetData(this.stepsFirstData);
    }
  }
  /**
   * 提交按钮禁启用
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe((params) => {
      this.otherSetValidChange.emit(this.formStatus.getRealValid());
    });
  }
  /**
   * 完成
   */
  public handFinishSteps() {
    const data: CorrelationAnalysisModel = this.formStatus.group.getRawValue();
    _.assign(this.stepsFirstData, data);
    return data;
  }
  /**
   * 表单
   */
  private initForm() {
    this.formColumn = [
      {
        // 分析周期
        label: this.language.analyseCycle,
        key: 'analyzePeriod',
        type: 'input', labelWidth: 170,
        require: true,
        rule: [{required: true}, this.$ruleUtil.getAlarmLimit()],
        asyncRules: [],
      },
      {
        // 根原因告警动作
        label: this.language.remark,
        key: 'remark', labelWidth: 170,
        type: 'textarea',
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }
}
