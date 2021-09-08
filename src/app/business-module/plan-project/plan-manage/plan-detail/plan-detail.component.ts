import {Component, OnInit} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {PlanApiService} from '../../share/service/plan-api.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PlanInfoModel} from '../../../../core-module/model/plan/plan-info.model';
import {Observable} from 'rxjs';
import {SessionUtil} from '../../../../shared-module/util/session-util';

/**
 * 规划详情（新增、修改页面）
 */
@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss']
})
export class PlanDetailComponent implements OnInit {
  // 页面是否加载
  public pageLoading = false;
  // 页面标题
  public pageTitle: string;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 是否加载
  public isLoading = false;
  // 表单状态
  public formStatus: FormOperate;
  // 表单校验
  public isDisabled: boolean;
  // 规划语言包
  public language: PlanProjectLanguageInterface;
  // 公共国际化语言包
  public commonLanguage: CommonLanguageInterface;
  // 页面类型
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 当前规划id
  private planId: string;

  constructor(private $router: Router,
              private $nzI18n: NzI18nService,
              private $active: ActivatedRoute,
              private $message: FiLinkModalService,
              private $ruleUtil: RuleUtil,
              private $planApiService: PlanApiService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initFormColumn();
    this.$active.queryParams.subscribe(params => {
      this.pageType = this.$active.snapshot.params.type;
      this.pageTitle = this.getPageTitle(this.pageType);
      if (this.pageType !== OperateTypeEnum.add) {
        // 修改页面逻辑
        this.planId = params.id;
        this.queryPlanById(this.planId);
      }
    });
  }

  /**
   * 保存规划
   */
  public savePlan(): void {
    const planData = this.formStatus.getRealData();
    // 将时间转换为时间戳格式
    if (planData.planFinishTime) {
      planData.planFinishTime = planData.planFinishTime.getTime();
      if (planData.planFinishTime < new Date().getTime()) {
        this.$message.error(this.language.planFinishTimeMsg);
        return;
      }
    }
    this.isLoading = true;
    // 如果是新增设备调用新增的接口
    let response: Observable<ResultModel<string>>;
    if (this.pageType === OperateTypeEnum.add) {
      response = this.$planApiService.insertPlan(planData);
    } else {
      planData.planId = this.planId;
      response = this.$planApiService.updatePlan(planData);
    }
    response.subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        if (this.pageType === OperateTypeEnum.add) {
          this.planId = result.data;
          // 判断是否有新增规划点位权限
          const flag: boolean = SessionUtil.checkHasRole('18-1-7');
          if (flag) {
            this.$router.navigate([`business/plan-project/plan-point-detail/add`],
              {queryParams: {id: this.planId, planName: planData.planName}}).then();
          } else {
            this.$message.error(this.language.noPageRole);
          }
        } else {
          this.$message.success(this.language.editPlanSuccess);
          this.$router.navigate([`business/plan-project/plan-list`]).then();
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 返回
   */
  public goBack(): void {
    this.$router.navigateByUrl(`business/plan-project/plan-list`).then();
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
  }

  /**
   * 通过规划id查询规划信息
   */
  private queryPlanById(planId: string): void {
    this.pageLoading = true;
    this.$planApiService.selectPlanInfo(planId).subscribe((result: ResultModel<PlanInfoModel>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        if (result.data.planFinishTime) {
          result.data.planFinishTime = new Date(result.data.planFinishTime);
        }
        this.formStatus.resetData(result.data);
      }
    }, () => {
      this.pageLoading = false;
    });
  }

  /**
   * 获取页面标题类型
   * param type
   * returns {string}
   */
  private getPageTitle(type: OperateTypeEnum): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = `${this.language.add}${this.language.plan}`;
        break;
      case OperateTypeEnum.update:
        title = `${this.language.modify}${this.language.plan}`;
        break;
      default:
        title = '';
        break;
    }
    return title;
  }

  /**
   * 初始化表单配置
   */
  private initFormColumn(): void {
    this.formColumn = [
      { // 规划名称
        label: this.language.planName,
        key: 'planName',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$planApiService.checkPlanName(
            {planId: this.planId, planName: value}),
            res => res.code === ResultCodeEnum.success && res.data)
        ],
      },
      { // 规划编号
        label: this.language.planCode,
        key: 'planCode',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(40)],
        customRules: [],
      },
      { // 预计完成时间
        label: this.language.planFinishTime,
        key: 'planFinishTime',
        type: 'time-picker',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      }
    ];
  }
}
