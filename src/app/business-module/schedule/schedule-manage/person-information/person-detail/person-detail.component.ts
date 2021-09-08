import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ScheduleLanguageInterface} from '../../../../../../assets/i18n/schedule/schedule.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {FinalValueEnum} from '../../../../../core-module/enum/step-final-value.enum';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {UserForCommonUtil} from '../../../../../core-module/business-util/user/user-for-common.util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {UserForCommonService} from '../../../../../core-module/api-service';
import {JobStatusEnum} from '../../../share/enum/job-status.enum';
import {UserLanguageInterface} from '../../../../../../assets/i18n/user/user-language.interface';
import {TelephoneInputComponent} from '../../../../../shared-module/component/telephone-input/telephone-input.component';
import {PhoneSetModel} from '../../../../../core-module/model/user/phone-set.model';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {ScheduleApiService} from '../../../share/service/schedule-api.service';
import {AssociateUserComponent} from '../associate-user/associate-user.component';
import {StatusChangeEnum} from '../../../share/enum/status-change.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {debounceTime, distinctUntilChanged, first, mergeMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {AsyncValidatorFn, FormControl} from '@angular/forms';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {PersonInfoModel} from '../../../share/model/person-info.model';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {StepsModel} from '../../../../../core-module/enum/application-system/policy.enum';
import {CREATE_USERS_COLUMN} from '../../../share/const/schedule.const';
import {CurrencyEnum} from '../../../../../core-module/enum/operator-enable-disable.enum';
import {LoginTypeEnum} from 'src/app/shared-module/enum/user.enum';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import * as _ from 'lodash';
import { differenceInCalendarDays } from 'date-fns';

/**
 * 人员新增/编辑页面
 */
@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent implements OnInit, OnDestroy {
  // 获取关联用户组件的值
  @ViewChild('userInfo') userInfo: AssociateUserComponent;
  // 入职日期模板
  @ViewChild('entryTime') public entryTimeTemp: TemplateRef<HTMLDocument>;
  // 离职日期模板
  @ViewChild('leaveTime') public leaveTimeTemp: TemplateRef<HTMLDocument>;
  // 单位选择
  @ViewChild('department') private departmentTep;
  // 新增手机号模板
  @ViewChild('telephoneTemp') public telephoneTemp;
  // 手机号输入框
  @ViewChild('telephoneInput') public telephoneInput: TelephoneInputComponent;
  // 页面标题
  public pageTitle: string = '';
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 用户国际化
  public userLanguage: UserLanguageInterface;
  // 表单参数
  public formColumn: FormItem[] = [];
  // 表单状态
  public formInstance: FormOperate;
  // 下一步按钮是否可点击
  public isNextStepDisabled: boolean = true;
  // 页面类型
  public pageType: string = OperateTypeEnum.add;
  // 单位选择器配置
  public areaSelectorConfig = new TreeSelectorConfigModel();
  // 显示单位选择器
  public areaSelectVisible: boolean = false;
  // 所选单位名称
  public selectUnitName: string = '';
  // 选中的步骤数
  public isActiveSteps = FinalValueEnum.STEPS_FIRST;
  // 步骤条的步骤枚举
  public finalValueEnum = FinalValueEnum;
  // 步骤条配置
  public setData: StepsModel[] = [];
  // 提交loading
  public isSaveLoading: boolean = false;
  // 确认按钮是否可以点击
  public isConfirmDisabled: boolean = true;
  // 保存基本信息
  public stepsFirstParams: PersonInfoModel = new PersonInfoModel();
  // 选中单位结果
  public selectDeptData: DepartmentUnitModel = new DepartmentUnitModel();
  // 关联用户中在第二步不可见
  public notShowStepSecond: boolean = false;
  // 修改的用户id
  public userId: string = '';
  // 手机号校验
  public phoneNumberMsg: string = '';
  // 手机号数据
  public phoneValue: string = '';
  // 第二步关联用户数据
  public associatedUserData = {userName: '', remark: ''};
  // 手机号
  public telephone;
  // 手机号国际码
  private countryCode: string = '86';
  // 树数据
  private treeNodes: any = [];
  // 人员id
  private personId: string;
  // 在职状态
  private jobStatusSelect: SelectModel[] = [];
  // 编辑回显的全部数据
  private updateAllData;

  constructor(public $nzI18n: NzI18nService,
              public $scheduleService: ScheduleApiService,
              public $message: FiLinkModalService,
              private $router: Router,
              private $active: ActivatedRoute,
              private $modalService: NzModalService,
              private $ruleUtil: RuleUtil,
              private $userForCommonService: UserForCommonService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    // 在职状态单选框值
    this.jobStatusSelect = [
      // 在职
      {label: this.scheduleLanguage.work, code: JobStatusEnum.work}
    ];
    // 初始化步骤条配置
    this.setData = [
      {number: FinalValueEnum.STEPS_FIRST, activeClass: 'active', title: this.scheduleLanguage.basicInformation},
      {number: FinalValueEnum.STEPS_SECOND, activeClass: '', title: this.scheduleLanguage.associatedUsers}];
    // 第二步不可见关联用户的标题和确认、取消按钮
    this.notShowStepSecond = true;
    this.initForm();
    // 获取页面操作类型及标题
    this.initPage();
  }

  public ngOnDestroy(): void {
    this.userInfo = null;
    this.telephoneInput = null;
  }

  /**
   * 表单实例校验
   */
  public personFormInstance(event: { instance: FormOperate }): void {
    this.formInstance = event.instance;
    this.formInstance.group.statusChanges.subscribe(() => {
      this.isNextStepDisabled = !(this.formInstance.getRealValid() && this.selectUnitName);
    });
    // 编辑时需要判断当前修改在职状态的权限，来控制是否可以修改在职状态
    if (this.personId) {
      // 从用户信息里面获取权限列表
      const userInfo = SessionUtil.getUserInfo();
      let role;
      if (userInfo.role && userInfo.role.permissionList) {
        role = userInfo.role.permissionList.map(item => item.id);
      }
      if (!role.includes('17-1-8')) {
        this.formInstance.group.controls['onJobStatus'].disable();
      }
    }
  }

  /**
   * 数据提交
   */
  public handStepsSubmit(): void {
    this.isSaveLoading = true;
    // 第二步得到的数据
    const formData = this.userInfo.formStatus.getRealData();
    // 如果是否关联用户为否，则不传所选的关联用户id
    formData.associatedUser = formData.relateExistUsers !== StatusChangeEnum.no ? this.userInfo.selectAssociatedUserId : '';
    // 拼接第一步和第二步的数据
    const data = Object.assign(this.stepsFirstParams, formData);
    // 处理离职时间
    data.leaveTime = data.onJobStatus === JobStatusEnum.work ? '' : data.leaveTime;
    if (this.personId) {
      data.id = this.personId;
    }
    this.isSaveLoading = true;
    this.$scheduleService.savePersonInfo(data).subscribe((res: ResultModel<any>) => {
      this.isSaveLoading = false;
      if (res.code === ResultCodeEnum.success) {
        if (!this.personId) {
          this.$message.success(this.scheduleLanguage.addPersonSuccess);
        } else {
          this.$message.success(this.scheduleLanguage.updatePersonSuccess);
        }
        this.$router.navigate(['/business/schedule/person-information']).then();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isSaveLoading = false;
    });
  }

  /**
   * 取消操作
   */
  public handCancelSteps(): void {
    window.history.go(-1);
  }

  /**
   * 打开单位选择器
   */
  public showDeptSelectorModal(): void {
    // 编辑状态时选择打开单位选择器 需要判断当前人员是否在排班中 若是 则给出提示不允许修改单位
    if (this.personId) {
      this.$scheduleService.validateWhetherInOther(this.personId).subscribe((res: ResultModel<boolean>) => {
        if (res.code === ResultCodeEnum.success) {
          if (res.data) {
            this.$message.warning(this.scheduleLanguage.personInTeam);
            return;
          } else {
            this.areaSelectorConfig.treeNodes = this.treeNodes;
            this.areaSelectVisible = true;
          }
        }
      });
    } else {
      this.areaSelectorConfig.treeNodes = this.treeNodes;
      this.areaSelectVisible = true;
    }
  }

  /**
   * 单位选中结果
   */
  public deptSelectChange(event: DepartmentUnitModel[]): void {
    this.selectDeptData = event[0];
    if (event[0]) {
      UserForCommonUtil.setAreaNodesStatus(this.treeNodes, event[0].id);
      if (this.selectUnitName !== event[0].deptName) {
        // 重新选择单位 需要将下一步中的关联用户置空，需要选择该单位下的用户
        this.userInfo.selectAssociatedUserId = '';
        this.associatedUserData.userName = '';
        this.selectUnitName = event[0].deptName;
      }
      if (!_.isEmpty(this.updateAllData) && this.updateAllData.deptName === event[0].deptName) {
        this.userInfo.currentUserId = this.updateAllData.associatedUser;
      }
      this.formInstance.resetControlData('deptCode', event[0].deptCode);
    } else {
      UserForCommonUtil.setAreaNodesStatus(this.treeNodes, null);
      this.selectUnitName = '';
      this.formInstance.resetControlData('deptCode', null);
    }
  }

  /**
   * 第二步关联用户表单校验
   */
  public infoValid(valid: boolean): void {
    this.isConfirmDisabled = valid;
  }

  /**
   * 上一步
   * @ param val 当前步骤
   */
  public handPrevSteps(val: number): void {
    this.isActiveSteps = val - 1;
    this.setData.forEach(item => {
      item.activeClass = item.number === this.isActiveSteps ? 'active' : '';
    });
    this.associatedUserData.remark = this.userInfo.formStatus.getData('remark');
    this.associatedUserData.userName = this.userInfo.formStatus.getData('associatedUser');
  }

  /**
   * 下一步
   * @ param val 当前步骤
   */
  public handNextSteps(val: number): void {
    this.isActiveSteps = val + 1;
    this.setData.forEach(item => {
      item.activeClass = item.number === this.isActiveSteps ? 'active' : '';
    });
    // 获取当前表单数据
    const data = this.formInstance.group.getRawValue();
    // 时间需要转化成时间戳
    data.entryTime = data.entryTime ? new Date(data.entryTime).getTime() : null;
    data.leaveTime = data.leaveTime ? new Date(data.leaveTime).getTime() : null;
    data.deptId = this.selectDeptData.id;
    data.countryCode = this.countryCode;
    data.personId = this.personId ? this.personId : null;
    data.deptName = this.selectUnitName;
    // 保存第一步的数据
    this.stepsFirstParams = data;
    // 编辑回显第二步中的数据
    if (this.associatedUserData && this.notShowStepSecond) {
      this.userInfo.formStatus.resetControlData('associatedUser', this.associatedUserData.userName);
      this.userInfo.formStatus.resetControlData('remark', this.associatedUserData.remark);
    }
  }

  /**
   * 获取电话号码国际码
   */
  public getPhone(event: PhoneSetModel): void {
    this.countryCode = event.dialCode;
  }

  /**
   * 初始化电话号码
   */
  public getPhoneInit(event: any): void {
    this.telephone = event;
  }

  /**
   * 监听手机号码输入状态
   */
  public inputNumberChange(event: string): void {
    this.phoneNumberMsg = '';
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    const _reg = /^\d+$/;
    const data = {phoneNumber: event, id: this.personId};
    // check中国手机号
    if (this.countryCode === '86') {
      if (reg.test(event)) {
        this.$scheduleService.checkPhoneNumber(data).subscribe((res: ResultModel<boolean>) => {
          if (res.code === ResultCodeEnum.success) {
            if (!res.data) {
              this.formInstance.resetControlData('phoneNumber', event);
            } else {
              this.phoneNumberMsg = this.scheduleLanguage.phoneNumberExistTip;
              this.formInstance.resetControlData('phoneNumber', null);
            }
          } else {
            this.formInstance.resetControlData('phoneNumber', null);
          }
        });
      } else {
        this.phoneNumberMsg = event && this.userLanguage.phoneNumberTips;
        this.formInstance.resetControlData('phoneNumber', null);
      }
    } else {
      if (_reg.test(event)) {
        this.phoneNumberMsg = '';
        this.formInstance.resetControlData('phoneNumber', event);
      } else {
        this.phoneNumberMsg = event && this.userLanguage.phoneNumberTips;
        this.formInstance.resetControlData('phoneNumber', null);
      }
    }
    // this.formInstance.group.controls['phoneNumber'].markAsDirty();
  }

  /**
   * 离职日期不能早于入职日期
   */
  public disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.formInstance.getData('entryTime')) < 0;
  };
  /**
   * 初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 姓名
        label: this.scheduleLanguage.userName,
        key: 'personName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.getUserNameRule()
        ]
      },
      {
        // 工号
        label: this.scheduleLanguage.jobNumber,
        key: 'jobNumber',
        type: 'input',
        col: 24,
        rule: [RuleUtil.getNameMaxLengthRule(20),
          RuleUtil.getNameMinLengthRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$scheduleService.checkJobNumber(
            {jobNumber: value, id: this.personId}
            ),
            res => {
              // 如果是编辑状态,返回的true,则表单控件值标记为已改变,显示提示信息
              if (this.personId && res.data) {
                this.formInstance.group.controls['jobNumber'].markAsDirty();
              }
              return !res.data;
            }, this.scheduleLanguage.jobNumberExistTip)
        ]
      },
      {
        // 单位
        label: this.scheduleLanguage.unit,
        key: 'deptCode',
        type: 'custom',
        col: 24,
        require: true,
        rule: [],
        template: this.departmentTep
      },
      {
        // 手机号
        label: this.userLanguage.phoneNumber,
        key: 'phoneNumber',
        type: 'custom',
        require: true,
        col: 24,
        rule: [
          {required: true}
        ],
        asyncRules: [
          // 异步校验手机号在用户列表的唯一性
          this.phoneNumberRule()
        ],
        template: this.telephoneTemp
      },
      {
        // 岗位
        label: this.scheduleLanguage.workPosition,
        key: 'workPosition',
        type: 'input',
        col: 24,
        require: false,
        rule: [RuleUtil.getNameMaxLengthRule(20), RuleUtil.getNameMinLengthRule()]
      },
      {
        // 在职状态
        label: this.scheduleLanguage.jobStatus,
        key: 'onJobStatus',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: JobStatusEnum.work,
        radioInfo: {
          data: this.jobStatusSelect,
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event) => {
          this.formInstance.setColumnHidden(['leaveTime'], $event !== JobStatusEnum.resign);
        }
      },
      { // 入职日期
        label: this.scheduleLanguage.entryTime,
        key: 'entryTime',
        type: 'custom',
        initialValue: new Date(),
        require: true,
        template: this.entryTimeTemp,
        rule: [{required: true}],
        asyncRules: []
      },
      { // 离职日期
        label: this.scheduleLanguage.leaveTime,
        key: 'leaveTime',
        type: 'custom',
        initialValue: new Date(),
        require: true,
        hidden: true,
        template: this.leaveTimeTemp,
        rule: [{required: true}],
        asyncRules: []
      }
    ];
  }

  /**
   * 初始化单位选择器配置
   */
  private initAreaSelectorConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.scheduleLanguage.unitSelect,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all'
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'deptFatherId',
            rootPid: null
          },
          key: {
            name: 'deptName',
            children: 'childDepartmentList'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeNodes: nodes
    };
  }

  /**
   * 获取部门列表信息
   */
  private getDept(): Promise<any> {
    return new Promise((resolve) => {
      this.$userForCommonService.queryTotalDept().subscribe((result: ResultModel<any>) => {
        this.treeNodes = result.data || [];
        // 初始化单位选择器配置
        this.initAreaSelectorConfig(result.data);
      });
      resolve();
    });
  }

  /**
   * 编辑数据回显
   */
  private getPersonData(): void {
    this.$scheduleService.getPersonListById(this.personId).subscribe((result: ResultModel<PersonInfoModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.updateAllData = result.data;
        const data = result.data;
        // 单位名称回显
        this.selectUnitName = data.deptName;
        // 保存当前的单位id、单位code
        this.selectDeptData.id = data.deptId;
        this.selectDeptData.deptCode = data.deptCode;
        // 保存当前的关联用户id，用于关联用户选择器回显
        this.userInfo.selectAssociatedUserId = data.associatedUser;
        this.associatedUserData = {userName: data.userName, remark: data.remark};
        // 时间格式特殊需要单独处理
        data.entryTime = data.entryTime ? new Date(data.entryTime) : null;
        this.formInstance.setColumnHidden(['leaveTime'], data.onJobStatus !== JobStatusEnum.resign);
        // 编辑时如果为在职 切换为离职时，离职日期为当前日期；如果为离职，离职日期有值则显示，没有值则为空
        if (data.onJobStatus !== JobStatusEnum.resign) {
          data.leaveTime = new Date();
        } else {
          data.leaveTime = data.leaveTime ? new Date(data.leaveTime) : null;
        }
        // 手机号
        this.phoneValue = data.phoneNumber;
        if (data.countryCode) {
          this.telephoneInput.telephoneCode = `+${data.countryCode}`; // 国际码
        }
        this.telephoneInput._phoneNum = data.phoneNumber; // 电话号码
        this.formInstance.resetData(data);
        // 递归设置部门的选择情况
        UserForCommonUtil.setAreaNodesStatus(this.treeNodes, data.deptId);
      }
    });
  }

  /**
   * 初始化页面
   */
  private initPage(): void {
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.pageType === OperateTypeEnum.update ? this.scheduleLanguage.updatePerson : this.scheduleLanguage.addPerson;
    if (this.pageType !== OperateTypeEnum.add) {
      this.$active.queryParams.subscribe(params => {
        this.personId = params.personId;
        // 当为编辑状态时，需要展示可选的离职状态以及离职日期
        this.jobStatusSelect.push({label: this.scheduleLanguage.resign, code: JobStatusEnum.resign});
        this.getDept().then(() => {
          // 编辑数据回显
          this.getPersonData();
        });
      });
    } else {
      // 获取单位信息
      this.getDept().then();
    }
  }


  /**
   * 姓名在用户列表中的唯一性校验
   */
  private getUserNameRule(): { asyncRule: AsyncValidatorFn, asyncCode: any, msg: string }  {
    return {
      asyncRule: (control: FormControl) => {
        if (control.value) {
          return control.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000),
            mergeMap(() => this.$scheduleService.checkPersonName({personName: control.value.trim(), id: this.personId})),
            mergeMap((res) => {
              if (!res.data) {
                if (this.userInfo && this.userInfo.formStatus.getData('isCreate') === StatusChangeEnum.yes) {
                  return this.$userForCommonService.checkUserNameExist({userName: control.value.trim()});
                } else {
                  return of(null);
                }
              } else {
                return of({error: true, userNameExistTip: true});
              }
            }),
            mergeMap(res => {
              // 当前立即创建用户为否 或者姓名在人员列表中重复有提示信息时，直接返回res;
              // 否则 立即创建用户为是，且res不为空，即姓名在人员中无重复，判断是否在用户中重复
              if (!res || Object.keys(res).some(key => key === 'userNameExistTip')) {
                return of(res);
              } else {
                if (res.code === ResultCodeEnum.success) {
                  if (res.data === 1 || res.data === 2) {
                    return Observable.create(observe => {
                      this.$modalService.confirm({
                        nzTitle: this.scheduleLanguage.isContinueOperation,
                        nzOkType: 'danger',
                        nzContent: `<span>${this.scheduleLanguage.confirmContent1}</span>`,
                        nzOkText: this.commonLanguage.cancel,
                        nzMaskClosable: false,
                        nzOnOk: () => {
                          // 点击取消 则姓名不合法 给出文字提示 姓名已存在 下一步按钮不可点击
                          observe.next({error: true, userNameExistTip: true});
                          observe.complete();
                        },
                        nzCancelText: this.commonLanguage.confirm,
                        nzOnCancel: () => {
                          // 点击确认按钮 默许用户当前行为 可点击下一步进行下面的操作
                          observe.next(null);
                          observe.complete();
                          this.checkClickOk();
                        }
                      });
                    });
                  } else {
                    return of(null);
                  }
                }
              }
            }),
            first()
          );
        } else {
          return of(null);
        }
      },
      asyncCode: 'userNameExistTip', msg: this.scheduleLanguage.userNameExistTip
    };
  }

  /**
   * 验证手机号在用户列表的唯一性
   */
  private phoneNumberRule(): { asyncRule: AsyncValidatorFn, asyncCode: any, msg: string } {
    return {
      asyncRule: (control: FormControl) => {
        if (control.value) {
          // 检验手机号唯一性的参数条件 在用户列表数据中找到与当前输入的手机号相同的那条数据
          const data = new QueryConditionModel;
          data.filterConditions[0] = new FilterCondition('phoneNumber', OperatorEnum.eq, control.value);
          return control.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(1000),
            mergeMap(() => this.$userForCommonService.verifyUserInfo(data)),
            mergeMap(res => {
              // 如果下一步中的立即创建用户为 是 则需要检测手机号在用户列表中的唯一性 并以弹窗的形式进行提醒
              if (this.userInfo && this.userInfo.formStatus.getData('isCreate') === StatusChangeEnum.yes) {
                if (res.code === 0) {
                  if (res.data && res.data.length > 0) {
                    return Observable.create(observe => {
                      // 整个弹窗体
                      this.$modalService.confirm({
                        nzTitle: this.scheduleLanguage.isContinueOperation,
                        nzOkType: 'danger',
                        nzContent: `<span>${this.scheduleLanguage.confirmContent2}</span>`,
                        nzOkText: this.commonLanguage.cancel,
                        nzMaskClosable: false,
                        nzOnOk: () => {
                          // 点击取消按钮时 该手机号不合法 给出文字提示
                          observe.next({error: true, phoneNumberExistTip: true});
                          this.phoneNumberMsg = this.scheduleLanguage.phoneNumberExistTip;
                          observe.complete();
                        },
                        nzCancelText: this.commonLanguage.confirm,
                        nzOnCancel: () => {
                          // 点击确认按钮 允许用户点击下一步 进行下面的操作
                          observe.next(null);
                          observe.complete();
                          this.checkClickOk();
                        }
                      });
                    });
                  } else {
                    return of(null);
                  }
                }
              } else {
                return of(null);
              }
            }),
            first()
          );
        } else {
          return of(null);
        }
      },
      asyncCode: 'phoneNumberExistTip', msg: this.scheduleLanguage.phoneNumberExistTip
    };
  }

  /**
   * 返回上一步校验姓名和手机号，选择确定的操作
   */
  private checkClickOk(): void {
    // 可以进行下一步操作但是立即创建用户置为否 之前填的有关创建用户的数据置为空
    this.userInfo.formStatus.resetControlData('isCreate', StatusChangeEnum.no);
    CREATE_USERS_COLUMN.forEach(item => {
      if (item === 'userStatus') {
        this.userInfo.formStatus.resetControlData(item, CurrencyEnum.enable);
      } else if (item === 'loginType') {
        this.userInfo.formStatus.resetControlData(item, LoginTypeEnum.singleUser);
      } else {
        this.userInfo.formStatus.resetControlData(item, '');
      }
    });
  }
}

