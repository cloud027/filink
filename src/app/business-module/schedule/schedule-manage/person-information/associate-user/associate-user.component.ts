import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ScheduleLanguageInterface} from '../../../../../../assets/i18n/schedule/schedule.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {StatusChangeEnum} from '../../../share/enum/status-change.enum';
import {UserLanguageInterface} from '../../../../../../assets/i18n/user/user-language.interface';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {CurrencyEnum} from '../../../../../core-module/enum/operator-enable-disable.enum';
import {UserListModel} from '../../../../../core-module/model/user/user-list.model';
import {DateTypeEnum} from '../../../../../shared-module/enum/date-type.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {RoleListModel} from '../../../../../core-module/model/user/role-list.model';
import {SystemForCommonService, UserForCommonService} from '../../../../../core-module/api-service';
import {LoginTypeEnum} from '../../../../user/share/enum/login-type.enum';
import {CREATE_USERS_COLUMN} from '../../../share/const/schedule.const';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {UserTypeEnum} from '../../../../user/share/enum/user-type.enum';
import {ScheduleApiService} from '../../../share/service/schedule-api.service';
import {PersonInfoModel} from '../../../share/model/person-info.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AccountSecurityModel} from '../../../../../core-module/model/user/account-security.model';

/**
 * 关联用户
 */
@Component({
  selector: 'app-associate-user',
  templateUrl: './associate-user.component.html',
  styleUrls: ['./associate-user.component.scss']
})
export class AssociateUserComponent implements OnInit {
  // 在人员新增、编辑第二步时不展示标题和确认、取消按钮
  @Input() public notShowStepSecond: boolean = false;
  // 第一步基础信息数据
  @Input() public stepsFirstParams;
  // 表单校验
  @Output() private formValid = new EventEmitter<boolean>();
  // 关联用户模板
  @ViewChild('associatedUsers') public associatedUsersTemp;
  // 账户有效期模板
  @ViewChild('accountLimit') private accountLimitTemp;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 用户国际化
  public userLanguage: UserLanguageInterface;
  // 表单参数
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 确定保存按钮是否可点击
  public isDisabled: boolean = true;
  // 确定按钮是否加载
  public isLoading = false;
  // 角色列表
  public roleList: { label: string, value: string }[] = [];
  // 关联用户id
  public selectAssociatedUserId: string;
  // 关联用户弹窗是否显示
  public userModalVisible: boolean = false;
  // 时间类型
  public timeType: string = DateTypeEnum.day;
  // 编辑关联用户 当前用户信息
  public personInfo: PersonInfoModel = new PersonInfoModel();
  // 编辑时当前关联的用户id
  public currentUserId: string = '';
  // 当前人员id
  private personId: string = '';
  // 账号最小长度
  private accountMinLength: number = 1;
  constructor(public $nzI18n: NzI18nService,
              public $router: Router,
              public $ruleUtil: RuleUtil,
              public $scheduleService: ScheduleApiService,
              public $systemForCommonService: SystemForCommonService,
              public $message: FiLinkModalService,
              public $userForCommonService: UserForCommonService,
              private $active: ActivatedRoute) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    // 获取角色
    this.queryAllRoles();
    // 查询安全策略
    this.queryAccountSecurity();
    if (!this.notShowStepSecond) {
      this.$active.queryParams.subscribe(params => {
        this.personId = params.personId;
        // 编辑数据回显
        this.getAssociateUserData();
      });
    }
  }

  /**
   * 表单实例校验
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 表单校验 当关联已有用户 是 时，关联用户有值则确认按钮状态为true
    // 若为 否，立即创建用户 否，按钮状态为true, 是，检验创建用户的各字段值 控制确定按钮状态
    this.formStatus.group.statusChanges.subscribe(() => {
      if (this.formStatus.getData('relateExistUsers') === StatusChangeEnum.yes) {
        this.isDisabled = !this.formStatus.getData('associatedUser');
      } else if (this.formStatus.getData('isCreate') === StatusChangeEnum.no) {
        this.isDisabled = false;
      } else {
        this.isDisabled = !this.formStatus.getValid();
      }
      this.formValid.emit(this.isDisabled);
    });
  }

  /**
   * 提交按钮
   */
  public submit(): void {
    this.isLoading = true;
    // 调用接口
    const data = this.formStatus.getRealData();
    const arr = ['id', 'deptCode', 'deptId', 'phoneNumber', 'personName'];
    Object.keys(this.personInfo).forEach(key => {
      if (arr.includes(key)) {
        data[key] = this.personInfo[key];
      }});
    // 如果用户编辑时未关联用户，则当前的关联用户id为空
    if (data.relateExistUsers === StatusChangeEnum.no) {
      data.associatedUser = '';
    } else {
      data.associatedUser = this.selectAssociatedUserId;
    }
    this.$scheduleService.associatedUsers(data).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.scheduleLanguage.associatedUserSuccess);
        this.goBack();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 取消按钮
   */
  public goBack(): void {
    this.$router.navigate(['business/schedule/person-information']).then();
  }

  /**
   * 选择用户变化
   * param event
   */
  public selectDataChange(event: UserListModel[]): void {
    this.userModalVisible = false;
    if (!_.isEmpty(event)) {
      this.selectAssociatedUserId = event[0].id;
      // 设置关联用户值为选择的用户名
      this.formStatus.resetControlData('associatedUser', event[0].userName);
    }
  }

  /**
   * 时间类型下拉框
   */
  public timeTypeChange(): void {
    // 当发生改变时为空
    this.formStatus.resetControlData('countValidityTime', null);
  }
  /**
   * 初始化表单时异步校验获取params
   */
  public getCheckParams(filterField: string, value: any): QueryConditionModel {
    const params = new QueryConditionModel;
    params.filterConditions[0] = new FilterCondition(filterField, OperatorEnum.eq, value);
    return params;
  }
  /**
   * 查询账号安全策略
   */
  public queryAccountSecurity(): void {
    this.$systemForCommonService.queryAccountSecurity().subscribe((res: ResultModel<AccountSecurityModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.accountMinLength = res.data.minLength;
        // 初始化表单
        this.initFormColumn();
      }
    });
  }
  /**
   * 查询角色
   */
  private queryAllRoles(): void {
    const userInfo = SessionUtil.getUserInfo();
    this.$userForCommonService.queryAllRoles().subscribe((res: ResultModel<RoleListModel[]>) => {
      const roleArray = res.data;
      if (roleArray) {
        if (userInfo.userCode === UserTypeEnum.admin) {
          roleArray.forEach(item => {
            // 角色栏下拉框数据
            this.roleList.push({label: item.roleName, value: item.id});
          });
        } else {
          // 非admin用户不能使用超级管理员角色
          const _roleArray = roleArray.filter(item => item.id !== UserTypeEnum.superAdmin);
          _roleArray.forEach(item => {
            // 角色栏下拉框数据
            this.roleList.push({label: item.roleName, value: item.id});
          });
        }
      }
    });
  }

  /**
   * 当前关联用户回显
   */
  private getAssociateUserData(): void {
    // 获取当前整条信息进行回显
    this.$scheduleService.getPersonListById(this.personId).subscribe((res: ResultModel<PersonInfoModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.personInfo = res.data;
        this.selectAssociatedUserId = res.data.associatedUser;
        this.formStatus.resetData(res.data);
        this.formStatus.resetControlData('relateExistUsers', StatusChangeEnum.yes);
        this.formStatus.resetControlData('associatedUser', res.data.userName);
      }
    });
  }

  /**
   * 校验人员名称、手机号
   */
  private checkParams(): void {
    // 校验姓名在用户姓名中是否存在
    let userNameExist = false;
    let phoneNumberExist = false;
    let userName = '';
    let phoneNumber = '';
    if (this.stepsFirstParams) {
      userName = this.stepsFirstParams.personName;
      phoneNumber = this.stepsFirstParams.phoneNumber;
    } else {
      userName = this.personInfo.personName;
      phoneNumber = this.personInfo.phoneNumber;
    }
    this.$userForCommonService.checkUserNameExist({userName: userName}).subscribe((res: ResultModel<number>) => {
      if (res.code === ResultCodeEnum.success) {
        userNameExist = res.data === 1 || res.data === 2;
      }
      // 校验手机号在用户中是否存在
      const param = new QueryConditionModel();
      param.filterConditions[0] = new FilterCondition('phoneNumber', OperatorEnum.eq, phoneNumber);
      this.$userForCommonService.verifyUserInfo(param).subscribe((result: ResultModel<UserListModel[]>) => {
        if (result.code === 0) {
          phoneNumberExist = result.data.length !== 0;
        }
        // 处理校验姓名、手机号后的操作
        if (userNameExist === true && phoneNumberExist === false) {
          this.$message.warning(this.scheduleLanguage.duplicateUsername);
          this.formStatus.resetControlData('isCreate', StatusChangeEnum.no);
        } else if (userNameExist === false && phoneNumberExist === true) {
          this.$message.warning(this.scheduleLanguage.duplicatePhone);
          this.formStatus.resetControlData('isCreate', StatusChangeEnum.no);
        } else if (userNameExist === true && phoneNumberExist === true) {
          this.$message.warning(this.scheduleLanguage.duplicate);
          this.formStatus.resetControlData('isCreate', StatusChangeEnum.no);
        } else {
          // 当立即创建用户为 是 时， 创建用户的信息显示，否则不显示
          this.formStatus.setColumnHidden(CREATE_USERS_COLUMN, false);
          CREATE_USERS_COLUMN.forEach(item => {
            if (item === 'userStatus') {
              this.formStatus.resetControlData(item, CurrencyEnum.enable);
            } else if (item === 'loginType') {
              this.formStatus.resetControlData(item, LoginTypeEnum.singleUser);
            } else {
              this.formStatus.resetControlData(item, '');
            }
            this.formStatus.group.controls['maxUsers'].disable();
            this.formStatus.resetControlData('maxUsers', 1);
          });
        }
      });
    });
  }

  /**
   * 初始化表单配置
   */
  private initFormColumn(): void {
    this.formColumn = [
      {
        // 是否关联已有用户
        label: this.scheduleLanguage.relateExistUsers,
        key: 'relateExistUsers',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: StatusChangeEnum.yes,
        radioInfo: {
          data: [
            // 是
            {label: this.scheduleLanguage.yes, value: StatusChangeEnum.yes},
            // 否
            {label: this.scheduleLanguage.no, value: StatusChangeEnum.no},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event) => {
          // 当点击是否关联已有用户时， 将立即创建用户单选框的值置为 否
          this.formStatus.resetControlData('isCreate', StatusChangeEnum.no);
          // 当关联已有用户为 是 时 只显示关联用户搜索框; 否则显示是否立即创建用户
          this.formStatus.setColumnHidden(['associatedUser'], $event === StatusChangeEnum.no);
          this.formStatus.setColumnHidden(['isCreate'], $event !== StatusChangeEnum.no);
        }
      },
      {
        // 关联用户
        label: this.scheduleLanguage.associatedUsers,
        col: 24,
        key: 'associatedUser',
        type: 'custom',
        template: this.associatedUsersTemp,
        require: true,
        rule: [],
        asyncRules: []
      },
      {
        // 是否立即创建用户
        label: this.scheduleLanguage.createUsers,
        key: 'isCreate',
        type: 'radio',
        require: true,
        hidden: true,
        rule: [{required: true}],
        initialValue: StatusChangeEnum.no,
        radioInfo: {
          data: [
            // 是
            {label: this.scheduleLanguage.yes, value: StatusChangeEnum.yes},
            // 否
            {label: this.scheduleLanguage.no, value: StatusChangeEnum.no},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (control, $event) => {
          if ($event === StatusChangeEnum.yes) {
            this.checkParams();
          } else {
            this.formStatus.setColumnHidden(CREATE_USERS_COLUMN, true);
          }
        }
      },
      {
        // 账号
        label: this.userLanguage.userCode,
        key: 'userCode',
        type: 'input',
        require: true,
        hidden: true,
        rule: [
          {required: true},
          {minLength: this.accountMinLength},
          {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        // 自定义校验规则
        customRules: [this.$ruleUtil.getNameCustomRule()],
        // 异步校验规则
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userForCommonService.verifyUserInfo(
            this.getCheckParams('userCode', value)
            ),
            res => {
              // 获取检验结果
              if (res.code === 0) {
                return res.data.length === 0;
              }
            }, this.scheduleLanguage.userCodeExist)
        ],
      },
      {
        // 昵称
        label: this.userLanguage.userNickname,
        key: 'userNickname',
        type: 'input',
        require: false,
        hidden: true,
        rule: [{maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: []
      },
      {
        // 用户状态
        label: this.userLanguage.userStatus,
        key: 'userStatus',
        type: 'radio',
        require: true,
        hidden: true,
        rule: [{required: true}],
        initialValue: CurrencyEnum.enable,
        radioInfo: {
          data: [
            // 启用
            {label: this.userLanguage.enable, value: CurrencyEnum.enable},
            // 停用
            {label: this.userLanguage.disable, value: CurrencyEnum.disabled},
          ],
          label: 'label',
          value: 'value'
        }
      },
      {
        // 角色
        label: this.userLanguage.roleId,
        key: 'roleId',
        type: 'select',
        require: true,
        hidden: true,
        rule: [{required: true}],
        asyncRules: [],
        selectInfo: {
          data: this.roleList,
          label: 'label',
          value: 'value'
        }
      },
      {
        // 地址
        label: this.userLanguage.address,
        key: 'address',
        type: 'input',
        require: false,
        hidden: true,
        rule: [{maxLength: 64}],
        asyncRules: []
      },
      {
        // 邮箱
        label: this.userLanguage.email,
        key: 'email',
        type: 'input',
        require: true,
        hidden: true,
        rule: [
          {required: true},
          {maxLength: 32},
          this.$ruleUtil.getMailRule()],
        // 异步校验规则
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userForCommonService.verifyUserInfo(
            this.getCheckParams('email', value)
            ),
            res => {
              // 获取检验结果
              if (res.code === 0) {
                return res.data.length === 0;
              }
            }, this.scheduleLanguage.emailExist)
        ]
      },
      {
        // 账户有效期
        label: this.userLanguage.countValidityTime,
        key: 'countValidityTime',
        type: 'custom',
        require: false,
        hidden: true,
        col: 24,
        rule: [{max: 999, msg: this.userLanguage.pleaseEnterAnIntegerLessThan999},
          {pattern: /^([0-9]|[1-9][0-9]+)$/, msg: this.commonLanguage.mustInt}],
        customRules: [],
        asyncRules: [],
        template: this.accountLimitTemp
      },
      {
        // 用户模式
        label: this.userLanguage.loginType,
        key: 'loginType',
        type: 'radio',
        require: true,
        hidden: true,
        rule: [{required: true}],
        initialValue: LoginTypeEnum.singleUser,
        radioInfo: {
          data: [
            // 单用户
            {label: this.userLanguage.singleUser, value: LoginTypeEnum.singleUser},
            // 多用户
            {label: this.userLanguage.multiUser, value: LoginTypeEnum.multiUser},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, event) => {
          if (event === LoginTypeEnum.singleUser) {
            this.formStatus.group.controls['maxUsers'].disable();
            this.formStatus.resetControlData('maxUsers', 1);
          } else {
            this.formStatus.group.controls['maxUsers'].enable();
            this.formStatus.resetControlData('maxUsers', 100);
          }
        }
      },
      {
        // 最多用户数
        label: this.userLanguage.maxUsers,
        key: 'maxUsers',
        type: 'input',
        require: false,
        hidden: true,
        initialValue: 1,
        rule: [
          {pattern: /^([2-9]|[1-9]\d|2|100)$/, msg: this.userLanguage.maxUsersTips},
        ],
        asyncRules: []
      },
      {
        // 备注
        label: this.userLanguage.userDesc,
        key: 'remark',
        type: 'textarea',
        col: 24,
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
    ];
  }
}
