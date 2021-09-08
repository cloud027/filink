import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmService} from '../../../../share/service/alarm.service';
import {AlarmForCommonService} from '../../../../../../core-module/api-service/alarm';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {FilterCondition} from '../../../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {AlarmWarningModel} from '../../../../share/model/alarm-warning.model';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {AlarmLevelEnum} from '../../../../../../core-module/enum/alarm/alarm-level.enum';
import {SessionUtil} from '../../../../../../shared-module/util/session-util';
import {AlarmUtil} from '../../../../share/util/alarm.util';

/**
 * 新增/编辑告警预警
 */
@Component({
  selector: 'app-add-alarm-warning-set',
  templateUrl: './add-alarm-warning-set.component.html',
  styleUrls: ['./add-alarm-warning-set.component.scss']
})
export class AddAlarmWarningSetComponent implements OnInit {
  // 告警名称
  @ViewChild('alarmWarmingTemp') private alarmWarmingTemp: TemplateRef<any>;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  public language: AlarmLanguageInterface;
  // 加载状态
  public isLoading: boolean;
  // 告警预警标志位
  public isDisabled: boolean = false;
  // 告警预警页面表单项
  public formColumn: FormItem[];
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 过滤条件
  public filterCondition: FilterCondition = new FilterCondition();
  // 页面类型
  public pageType: string;
  // 页面标题
  public pageTitle: string;
  // 是否是编辑
  private isEdit: boolean = false;
  // 预警id
  private alarmId: string;
  // 勾选的告警名称
  private checkAlarmObj: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 当前数据
  private currentData: AlarmWarningModel;
  // 告警预警表单实例
  private formStatus: FormOperate;

  constructor(
    private $message: FiLinkModalService,
    private $router: Router,
    private $active: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $alarmForCommonService: AlarmForCommonService,
    private $ruleUtil: RuleUtil
  ) { }

  ngOnInit() {
    // 国际化语言初始化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initAlarmWarningName();
    this.initPage();
  }

  /**
   * 告警编辑弹窗表单实例
   * param event
   */
  public formInstanceSecond(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    const that = this;
    this.formStatus.group.valueChanges.subscribe(param => {
      let flag = false;
      // 循环判断，除去告警名称和告警编码的每一项是否为true
      for (const key in param) {
        if (key !== 'alarmWarningSettingName' && key !== 'alarmWarningCode') {
          flag = that.formStatus.getValid(key);
          if (!flag) {
            break;
          }
        }
      }
      if (this.pageType === OperateTypeEnum.add) {
        const name = CommonUtil.trim(param.alarmWarningSettingName);
        const code = CommonUtil.trim(param.alarmWarningCode);
        // 告警名称为空或者长度超过64位或者告警编码为空或者长度超过64位
        if (!name || name.length > 64 || !code || code.length > 64) {
          flag = false;
        }
      }
      that.isDisabled = flag;
    });
  }

  /**
   * 新增告警预警
   */
  public saveData(): void {
    this.isLoading = true;
    const data = this.formStatus.group.getRawValue();
    data.alarmOverList = this.checkAlarmObj.ids;
    data.alarmNameList = this.checkAlarmObj.name.split(',');
    data.alarmCodeList = this.checkAlarmObj.alarmCodes;
    if (this.pageType === OperateTypeEnum.add) {
      this.$alarmService.addWarning(data).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.cancel();
          this.$message.success(this.language.addSuccess);
        } else {
          this.$message.error(result.msg);
        }
      }, error => {
        this.isLoading = false;
      });
    } else {
      data.id = this.alarmId;
      data.tenantId = SessionUtil.getTenantId();
      data.status = this.currentData.status;
      this.$alarmService.editWarning(data).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.editSuccess);
          this.cancel();
        } else {
          this.$message.error(result.msg);
        }
      }, error => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 取消
   */
  public cancel(): void {
    this.$router.navigate(['business/alarm/alarm-warning-setting']).then();
  }

  /**
   * 校验
   */
  private checkOnly(): boolean {
    let flag = false;
    this.formColumn.forEach(item => {
      if (item.key !== 'alarmWarningSettingName' && item.key !== 'alarmWarningCode') {
        flag = this.formStatus.getValid(item.key);
        if (!flag) {
          return;
        }
      }
    });
    return flag;
  }

  /**
   * 初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 名称
        label: this.language.name, key: 'alarmWarningSettingName',
        type: 'input', require: true,
        disabled: this.isEdit,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(64),
          RuleUtil.getAlarmNamePatternRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$alarmService.checkWarnName(value),
            res => {
              if (this.pageType === OperateTypeEnum.add) {
                if (res.code === ResultCodeEnum.success) {
                  this.isDisabled = this.checkOnly() && this.formStatus.getValid('alarmWarningCode');
                  return true;
                } else {
                  this.isDisabled = false;
                  return false;
                }
              }
            })
        ],
      },
      {
        // 告警代码
        label: this.language.AlarmCode, key: 'alarmWarningCode',
        type: 'input', require: true,
        disabled: this.isEdit,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(64),
          RuleUtil.getCodeRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule((value) => {
            return this.$alarmService.checkWarnCode(value);
          }, res => {
            if (this.pageType === OperateTypeEnum.add) {
              if (res.code === ResultCodeEnum.success) {
                this.isDisabled = this.checkOnly() && this.formStatus.getValid('alarmWarningSettingName');
                return true;
              } else {
                this.isDisabled = false;
                return false;
              }
            }
          }, this.language.alarmCodeExits)
        ],
      },
      { // 告警等级
        label: this.language.alarmFixedLevel, key: 'alarmWarningLevel',
        require: true, type: 'select',
        rule: [{required: true}],
        selectInfo: {
          data: AlarmUtil.enumToArray(this.language, AlarmLevelEnum),
          label: 'label', value: 'value'
        },
      },
      { // 越限次数
        label: this.language.crossCount, key: 'limitNum',
        type: 'input', require: true,
        rule: [{required: true}, this.$ruleUtil.getAlarmLimit()],
      },
      { // 越限时长（分）
        label:  this.language.crossDuration, key: 'limitTime',
        type: 'input', require: true,
        rule: [{required: true}, this.$ruleUtil.getAlarmLimit()],
      },
      { // 越限告警
        label: this.language.crossAlarm, key: 'alarmNames',
        type: 'custom', require: true,
        rule: [{required: true}],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        template: this.alarmWarmingTemp,
      },
    ];
  }


  /**
   * 告警名称配置
   */
  private initAlarmWarningName(): void {
    this.alarmNameConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      clear: !this.checkAlarmObj.ids.length,
      initialValue: this.checkAlarmObj,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmObj = event;
        this.formStatus.resetControlData('alarmNames', event.name);
      }
    };
  }

  /**
   * 初始化页面
   */
  private initPage(): void {
    const that = this;
    this.$active.queryParams.subscribe(param => {
      this.pageType = param.type;
      if (param.type === OperateTypeEnum.add) {
        that.pageTitle = that.language.addNewAlarmWarning;
      } else if (param.type === OperateTypeEnum.update) {
        this.isEdit = true;
        that.pageTitle = that.language.editAlarmWarning;
        that.isDisabled = true;
        that.alarmId = param.warnId;
        that.defaultData(param.warnId);
      }
      that.initForm();
    });
  }

  /**
   * 编辑回填数据
   */
  private defaultData(id: string): void {
    this.$alarmService.getWarnDetail(id).subscribe((result: ResultModel<AlarmWarningModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.currentData = result.data;
        this.checkAlarmObj = {
          ids: result.data.alarmOverList,
          name: result.data.alarmNameList.join(','),
          alarmCodes: result.data.alarmCodeList
        };
        this.formStatus.resetData(result.data);
        this.formStatus.resetControlData('alarmNames', result.data.alarmNameList.join(','));
        this.initAlarmWarningName();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
