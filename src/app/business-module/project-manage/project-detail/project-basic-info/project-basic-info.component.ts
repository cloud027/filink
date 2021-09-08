import {Component, OnInit} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {PlanProjectApiService} from '../../share/service/plan-project.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {DateFormatStringEnum} from '../../../../shared-module/enum/date-format-string.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {Observable} from 'rxjs';
import {ProjectInfoModel} from '../../share/model/project-info.model';

/**
 * 项目编辑-项目基本信息
 */
@Component({
  selector: 'project-basic-info',
  templateUrl: './project-basic-info.component.html',
  styleUrls: ['./project-basic-info.component.scss']
})
export class ProjectBasicInfoComponent implements OnInit {
  // 项目规划语言包
  public language: PlanProjectLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // form表单配置
  public formColumn: FormItem[];
  // 表单实例
  public formStatus: FormOperate;
  // 提交loading
  public isSaveLoading: boolean = false;
  // 页面标题
  public pageTitle: string;
  // 项目id
  public projectId: string;
  // 判断当前页新增还是修改
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 表单校验
  public isDisabled: boolean;

  constructor(
    private $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
    private $router: Router,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    // 日期服务
    private $dateHelper: DateHelperService,
    // 项目接口
    private $planProjectApiService: PlanProjectApiService
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initForm();
    // url路径获取参数
    this.$active.queryParams.subscribe(param => {
      if (!param.id) {
        this.pageType = OperateTypeEnum.add;
        // 新增
        this.pageTitle = `${this.language.add}${this.language.project}`;
      } else {
        this.pageType = OperateTypeEnum.update;
        // 修改
        this.pageTitle = `${this.language.modify}${this.language.project}`;
        this.projectId = param.id;
        this.queryProjectInfoById(this.projectId);
      }
    });
  }

  /**
   * 表单实例状态
   * @param event 表单操作数据
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
    // 监听开始时间值变化
    this.formStatus.group.get('planStart').valueChanges.subscribe((param => {
      const planStop = this.formStatus.getData('planStop');
      if (planStop && param && new Date(param).getTime() > new Date(planStop).getTime()) {
        this.$message.error(this.language.planStartError);
        this.formStatus.resetControlData('planStart', null);
      }
    }));

    // 监听结束时间值变化
    this.formStatus.group.get('planStop').valueChanges.subscribe((param => {
      const planStart = this.formStatus.getData('planStart');
      if (planStart && param && new Date(planStart).getTime() > new Date(param).getTime()) {
        this.$message.error(this.language.planStartError);
        this.formStatus.resetControlData('planStop', null);
      }
    }));
  }

  /**
   * 保存基本信息
   */
  public onSaveBasicInfo(): void {
    this.isSaveLoading = true;
    // 获取表单数据
    const projectInfoData = this.formStatus.getRealData();
    // 转化为时间戳
    projectInfoData.planStart = CommonUtil.getTimeStamp(new Date(projectInfoData.planStart));
    projectInfoData.planStop = CommonUtil.getTimeStamp(new Date(projectInfoData.planStop));
    if (projectInfoData.planStop < new Date().getTime()) {
      this.$message.error(this.language.planStopError);
      this.isSaveLoading = false;
      return;
    }
    // 接口请求路径
    let request: Observable<ResultModel<string>>;
    if (this.pageType === OperateTypeEnum.add) {
      // 新增项目
      request = this.$planProjectApiService.addProjectInfo(projectInfoData);
    } else if (this.pageType === OperateTypeEnum.update) {
      // 修改项目
      request = this.$planProjectApiService.updateProjectInfo(projectInfoData);
      projectInfoData.projectId = this.projectId;
    }
    // 新增或修改项目
    request.subscribe((res: ResultModel<string>) => {
      this.isSaveLoading = false;
      if (res.code === ResultCodeEnum.success) {
        if (this.pageType === OperateTypeEnum.add) {
          // 跳转至点位新增页
          this.$router.navigate([`business/project-manage/point-detail/add`], {
            queryParams: {
              id: res.data
            }
          }).then();
        } else {
          this.$message.success(`${this.language.modified}${this.language.projectSuccess}`);
          // 跳转至项目列表
          this.$router.navigate([`business/project-manage/project-list`]).then();
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 取消
   */
  public cancel(): void {
    // 跳转至项目列表页
    this.$router.navigate(['business/project-manage/project-list']).then();
  }

  /**
   * 表单配置初始化
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 项目名称
        label: this.language.projectName,
        key: 'projectName',
        type: 'input',
        col: 24,
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(32),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [],
        asyncRules: [
          // 校验名称是否已存在
          this.$ruleUtil.getNameAsyncRule(value =>
            this.$planProjectApiService.checkProjectName({projectId: this.projectId, projectName: value}), res => {
            return res.code === ResultCodeEnum.success && res.data;
          }),
        ]
      },
      {
        // 项目编号
        label: this.language.projectCode,
        key: 'projectCode',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(32)],
        customRules: [],
        asyncRules: [
          // 校验项目编号是否已存在
          this.$ruleUtil.getNameAsyncRule(value =>
            this.$planProjectApiService.checkProjectCode({projectId: this.projectId, projectCode: value}), res => {
            return res.code === ResultCodeEnum.success && res.data;
          }, '此编号已经存在！'),
        ]

      },
      {
        // 计划开始日期
        label: this.language.planStart,
        key: 'planStart',
        type: 'time-picker',
        col: 24,
        timePickerWidth: '300px',
        require: true,
        rule: [
          {required: true}
        ],
      },
      {
        // 计划结束日期
        label: this.language.planStop,
        key: 'planStop',
        type: 'time-picker',
        timePickerWidth: '300px',
        col: 24,
        require: true,
        rule: [
          {required: true}
        ],
      },
      {
        // 建设部门
        label: this.language.builtDept,
        key: 'builtDept',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(32)],
      },
      {
        // 项目经理
        label: this.language.manager,
        key: 'manager',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(32)],
      },
      {
        // 设计单位
        label: this.language.designUnit,
        key: 'designUnit',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(32)],
      },
      {
        // 建设单位
        label: this.language.buildUnit,
        key: 'buildUnit',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(32)],
      },
      {
        // 监理单位
        label: this.language.supervisionUnit,
        key: 'supervisionUnit',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(32)],
      },
      {
        // 备注
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(255)],
      },
    ];
  }

  /**
   * 根据项目id查询项目基本信息
   * @param data 项目id
   */
  private queryProjectInfoById(data: string): void {
    this.$planProjectApiService.queryProjectInfoById(data).subscribe((result: ResultModel<ProjectInfoModel>) => {
      const projectBasicInfo = result.data;
      if (projectBasicInfo.planStart) {
        projectBasicInfo.planStart = this.$dateHelper.format(new Date(projectBasicInfo.planStart), DateFormatStringEnum.dateTime);
      }
      if (projectBasicInfo.planStop) {
        projectBasicInfo.planStop = this.$dateHelper.format(new Date(projectBasicInfo.planStop), DateFormatStringEnum.dateTime);
      }
      this.formStatus.resetData(projectBasicInfo);
    });
  }
}
