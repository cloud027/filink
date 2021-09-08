import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlarmOperatorEnum, AlarmPropertyEnum, AlarmReasonPropertyEnum, CorrelationAlarmPropertyEnum} from '../../../../share/enum/alarm.enum';
import {SelectModel} from '../../../../../../shared-module/model/select.model';
import {CorrelationAnalysisModel} from '../../../../share/model/correlation-analysis.model';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import * as lodash from 'lodash';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleConditionModel} from '../../../../share/model/rule-condition.model';
import {PAGE_INDEX, PAGE_NUM} from '../../../../share/const/alarm-common.const';

/**
 * 步骤2 规则条件
 */
@Component({
  selector: 'app-rule-condition',
  templateUrl: './rule-condition.component.html',
  styleUrls: ['./rule-condition.component.scss']
})
export class RuleConditionComponent implements OnInit, OnChanges {
  @Input() public stepsFirstData: CorrelationAnalysisModel = new CorrelationAnalysisModel();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 属性规则表单实例
  public validateForm: FormGroup;
  // 表格配置
  public tableConfig: TableConfigModel;
  // 翻页对象
  public pageBean: PageModel = new PageModel(1, 5);
  // 规则条件的值
  private ruleConditionData: RuleConditionModel = new RuleConditionModel();
  // 属性枚举
  public alarmPropertyEnum = AlarmPropertyEnum;
  // 值枚举
  public correlationPropertyEnum = CorrelationAlarmPropertyEnum;
  // 操作符枚举
  public alarmOperatorData: SelectModel[];
  // 根原因告警属性
  public alarmReasonProperty: SelectModel[] = [];
  // 最终展示的分页数据
  public resultViewData: RuleConditionModel[] = [];
  // 是否展示添加条件
  public isShowAddCondition: boolean = false;
  // 默认页码
  private pageIndex: number = PAGE_INDEX;
  // 默认一页条数
  private pageSize: number = PAGE_NUM;
  // 条件预览数据
  private viewData: RuleConditionModel[] = [];
  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      property: [null],
      rootCauseAlarmAttribute: [null],
      operator: [null],
      propertyValue: [null],
      relevanceAlarmProperties: [null],
    });
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.validateForm.reset(this.ruleConditionData);
    // 操作符
    this.alarmOperatorData = AlarmUtil.ruleConditionOperator(this.$nzI18n);
    // 根原因告警属性
    this.alarmReasonProperty = AlarmUtil.translateReasonProperty(this.$nzI18n, null) as SelectModel[];
    this.initTableConfig();
    this.stepsFirstData.staticRelevanceRuleConditionBeanList = this.viewData;
    // 静态告警规则条件表格数据
    this.viewData = AlarmUtil.ruleCondition(this.viewData, this.language, this.$nzI18n);
    this.refresh(this.pageIndex, this.pageSize);
  }

  /**
   * 监听表单数据变化
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (this.stepsFirstData.staticRelevanceRuleConditionBeanList) {
      this.viewData = this.stepsFirstData.staticRelevanceRuleConditionBeanList;
      this.refresh(this.pageIndex, this.pageSize);
    }
  }
  /**
   * 表格翻页查询
   * param event
   */
  public pageChange(event: PageModel): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refresh(this.pageIndex, this.pageSize);
  }
  /**
   * 确定
   */
  public ensure(): void {
    const formData: RuleConditionModel = this.validateForm.getRawValue();
    let isCanAdd = true;
    if (!formData.property) {
      this.$message.info(this.language.pleaseSelectProperty);
      return;
    }
    if (!formData.rootCauseAlarmAttribute) {
      this.$message.info(this.language.pleaseSelectRootReasonAlarm);
      return;
    }
    if (!formData.propertyValue) {
      this.$message.info(this.language.pleaseSelectValue);
      return;
    }
    if (!formData.relevanceAlarmProperties) {
      this.$message.info(this.language.pleaseSelectRelevanceReasonAlarm);
      return;
    }
    // 校验是否有重复的数据
    this.viewData.forEach(item => {
      if (item.rootCauseAlarmAttribute === formData.rootCauseAlarmAttribute &&
        item.operator === formData.operator && item.relevanceAlarmProperties === formData.relevanceAlarmProperties) {
          this.$message.info(this.language.cannotAdd);
          isCanAdd = false;
          return;
      }
    });
    if (isCanAdd) {
      // 生成id
      formData.id = CommonUtil.getUUid();
      this.viewData.unshift(lodash.cloneDeep(formData));
      const resultData = AlarmUtil.ruleCondition(this.viewData, this.language, this.$nzI18n);
      this.validateForm.reset(this.ruleConditionData);
      this.isShowAddCondition = false;
      this.refresh(PAGE_INDEX, this.pageSize);
      this.stepsFirstData.staticRelevanceRuleConditionBeanList = resultData;
    }
  }
  /**
   * 根原因告警属性
   */
  public selectRootCause(v: AlarmReasonPropertyEnum): void {
    this.controlOperatorData('relevanceAlarmProperties', v);
  }
  /**
   * 相关原因告警属性
   */
  public selectRelevanceAlarm(v: AlarmReasonPropertyEnum): void {
    this.controlOperatorData('rootCauseAlarmAttribute', v);
  }
  /**
   * 取消
   */
  public cancel(): void {
    this.validateForm.reset(this.ruleConditionData);
    this.isShowAddCondition = false;
  }
  /**
   * 最终表格数据
   */
  private refresh(pageIndex, pageSize): void {
    const data = this.viewData;
    this.pageBean.Total = data.length;
    this.pageBean.pageIndex = pageIndex;
    this.pageBean.pageSize = pageSize;
    this.resultViewData = data.slice(((pageIndex - 1) * pageSize), ((pageIndex - 1) * pageSize ) + pageSize);
  }

  /**
   * 控制操作符的禁启用
   */
  private controlOperatorData(key: string, value: AlarmReasonPropertyEnum ): void {
    const formData: RuleConditionModel = this.validateForm.getRawValue();
    // 控制操作符全部启用
    if (formData[key] === AlarmReasonPropertyEnum.alarmObject && value === AlarmReasonPropertyEnum.alarmObject) {
      this.alarmOperatorData = this.alarmOperatorData.map(item => {
        item['disable'] = false;
        return item;
      });
    } else {
      // 控制操作符禁启用
      this.alarmOperatorData = AlarmUtil.ruleConditionOperator(this.$nzI18n);
      if (formData.operator === AlarmOperatorEnum.electricityLink || formData.operator === AlarmOperatorEnum.communicationLink) {
        this.validateForm.controls['operator'].setValue(AlarmOperatorEnum.equal);
      }
    }
  }
  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '1200px'},
      noIndex: true,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
        },
        // 条件预览
        {title: this.language.conditionsPreview, key: 'ruleCondition', width: 800},
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 120, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      operation: [
        {
          // 删除
          text: this.language.deleteHandle,
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          permissionCode: '02-3-1-3',
          className: 'fiLink-delete red-icon',
          handle: (data: RuleConditionModel) => {
            this.viewData = this.viewData.filter(item => {
              return item.id !== data.id;
            });
            this.refresh(PAGE_INDEX, this.pageSize);
            this.stepsFirstData.staticRelevanceRuleConditionBeanList = this.viewData;
          }
        },
      ],
    };
  }
}
