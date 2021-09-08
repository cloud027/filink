import { Component, ViewChild, OnInit } from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {FinalValueEnum} from '../../../../../../core-module/enum/step-final-value.enum';
import {changeStepsStyle} from '../../../../../application-system/share/util/tool.util';
import {CorrelationAnalysisModel} from '../../../../share/model/correlation-analysis.model';
import {StepsModel} from '../../../../../../core-module/enum/application-system/policy.enum';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {AlarmPathEnum, StepDataEnum} from '../../../../share/enum/alarm.enum';
import {StepStatusModel} from '../../../../../../core-module/model/alarm/step-status.model';
import {SelectAlarmComponent} from '../select-alarm/select-alarm.component';
import {OtherSettingComponent} from '../other-setting/other-setting.component';
import {AlarmService} from '../../../../share/service/alarm.service';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
/**
 * 新增/编辑静态相关性规则
 */
@Component({
  selector: 'app-add-correlation-analysis',
  templateUrl: './add-correlation-analysis.component.html',
  styleUrls: ['./add-correlation-analysis.component.scss']
})
export class AddCorrelationAnalysisComponent implements OnInit {
  // 获取基本信息组件的值
  @ViewChild('selectAlarm') selectAlarm: SelectAlarmComponent;
  // 获取其他设置
  @ViewChild('otherSet') otherSet: OtherSettingComponent;
  // 国际化接口
  public language: AlarmLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 页面标题
  public pageTitle: string;
  // 步骤条的步骤枚举
  public finalValueEnum = FinalValueEnum;
  // 选中的步骤数
  public isActiveSteps: number = FinalValueEnum.STEPS_FIRST;
  // 步骤条
  public stepData: StepsModel[] = [];
  // 提交loading
  public isSaveLoading: boolean = false;
  // 下一步
  public nextButtonDisable: boolean = true;
  // 选择告警表单数据
  public stepsFirstData: CorrelationAnalysisModel = new CorrelationAnalysisModel();
  // 判断当前页新增还是修改
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 验证状态
  private validStatus: StepStatusModel = new StepStatusModel();
  // 静态相关性规则id
  private staticRuleId: string;
  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    private $alarmService: AlarmService,
    private $message: FiLinkModalService,
    private $active: ActivatedRoute,
  ) { }

 public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 获取步骤条数据
    this.stepData = AlarmUtil.assemblyStep(StepDataEnum, this.language);
    // 步骤样式
    changeStepsStyle(this.stepData, this.isActiveSteps);
    this.$active.queryParams.subscribe(param => {
      this.pageType = param.type;
      // 新增
      if (param.type === OperateTypeEnum.add) {
        this.pageTitle = this.language.addAlarmCorrelationAnalysis;
      } else {
        this.pageTitle = this.language.editAlarmCorrelationAnalysis;
        this.staticRuleId = param.id;
        this.queryStaticRuleData();
      }
    });
  }
  /**
   * 改变步骤
   * param value
   */
  public changeSteps(value: number): void {
    // 下一步
    if (value > this.isActiveSteps) {
      // 判断上一步有值
      if (value - 1 > 0) {
        // 上一步为第一步
        if ((value - 1) === this.finalValueEnum.STEPS_FIRST) {
          if (!this.validStatus.first) {
            return;
          }
          // 上一步为第二步
        } else if ((value - 1) === this.finalValueEnum.STEPS_SECOND) {
          if (!this.validStatus.second || !this.validStatus.first) {
            return;
          }
        } else if ((value - 1) === this.finalValueEnum.STEPS_THIRD) {
          if (!this.validStatus.three) {
            return;
          }
        }
      }
    } else {
      // 后退不校验
    }
    // 存储第一步的值
    if (value > this.finalValueEnum.STEPS_FIRST) {
      this.selectAlarm.handNextSteps();
    }
    // 存储第三步值
    if (value > this.finalValueEnum.STEPS_SECOND) {
      this.otherSet.handFinishSteps();
    }
    this.isActiveSteps = value;
    changeStepsStyle(this.stepData, this.isActiveSteps);
    this.toggleButtonDisable();
  }
  /**
   * 校验是否可进行下一步
   */
  public infoValid(valid: boolean, isActiveSteps: number): void {
    this.nextButtonDisable = !valid;
    // 记录第一步第二步的校验状态
    if (isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
      this.validStatus.first = valid;
    } else if (isActiveSteps === this.finalValueEnum.STEPS_SECOND) {
      this.validStatus.second = valid;
    } else {
      this.validStatus.three = valid;
    }
  }
  /**
   * 取消操作
   */
  public handCancelSteps(): void {
    window.history.go(-1);
  }
  /**
   * 数据提交
   */
  public handStepsSubmit(): void {
    this.changeSteps(this.finalValueEnum.STEPS_THIRD);
    this.isSaveLoading = true;
    // 新增或编辑
    const urlPath = this.pageType === OperateTypeEnum.add ? AlarmPathEnum.addStaticRule : AlarmPathEnum.editStaticRule;
    this.$alarmService[urlPath](this.stepsFirstData).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.isSaveLoading = false;
        if (this.pageType === OperateTypeEnum.add) {
          // 新增
          this.$message.success(this.commonLanguage.addSuccess);
        } else {
          // 编辑
          this.$message.success(this.commonLanguage.updateSuccess);
        }
        this.$router.navigate(['business/alarm/alarm-correlation-setting']).then();
      } else {
        this.isSaveLoading = false;
        this.$message.error(res.msg);
      }
    });
  }
  /**
   * 数据回显
   */
  private queryStaticRuleData(): void {
    this.$alarmService.staticRelevanceRuleDetail(this.staticRuleId).subscribe((res: ResultModel<CorrelationAnalysisModel>) => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data && res.data.staticRelevanceRuleConditionBeanList.length > 0) {
            // 静态告警规则条件表格数据
          res.data.staticRelevanceRuleConditionBeanList = AlarmUtil.ruleCondition(res.data.staticRelevanceRuleConditionBeanList, this.language, this.$nzI18n);
        }
        this.stepsFirstData = res.data;
      }
    });
  }
  /**
   * 控制按钮是否可点击
   */
  private toggleButtonDisable(): void {
    if (this.isActiveSteps === this.finalValueEnum.STEPS_FIRST) {
      this.nextButtonDisable = !this.validStatus.first;
    } else if (this.isActiveSteps === this.finalValueEnum.STEPS_SECOND) {
      this.nextButtonDisable = !this.validStatus.second;
    } else {
      this.nextButtonDisable = !this.validStatus.three;
    }
  }
}
