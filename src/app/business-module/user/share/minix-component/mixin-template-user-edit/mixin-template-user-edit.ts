import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {UserService} from '../../service/user.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserUtilService} from '../../service/user-util.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {UserLanguageInterface} from '../../../../../../assets/i18n/user/user-language.interface';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {UserTypeEnum} from '../../enum/user-type.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {UserStatusEnum} from '../../enum/user-status.enum';
import {LoginTypeEnum} from '../../enum/login-type.enum';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {DateTypeEnum} from '../../../../../shared-module/enum/date-type.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {OrderUserModel} from '../../../../../core-module/model/work-order/order-user.model';
import {UserListModel} from '../../../../../core-module/model/user/user-list.model';
import {DepartmentListModel} from '../../model/department-list.model';
import {RoleListModel} from '../../../../../core-module/model/user/role-list.model';
import {PushTypeEnum} from '../../enum/push-type.enum';
import {CheckboxModel} from '../../../../../shared-module/model/checkbox-model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {UserForCommonService} from '../../../../../core-module/api-service';
import {debounceTime, distinctUntilChanged, first, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {FormControl} from '@angular/forms';
/**
 * 用户编辑模块通用ts
 */
export class MixinTemplateUserEdit {
  // 所选部门
  public selectUnitName: string = '';
  // 用户信息
  public userInfo: OrderUserModel = {};
  // 国际化接口
  public language: UserLanguageInterface;
  // 页面类型
  public pageType = OperateTypeEnum.add;
  // 新增用户title
  public pageTitle: string;
  // 用户名长度
  public accountMinLength: number;
  // 角色列表
  public roleList: { label: string, value: string }[] = [];
  // 树节点数据
  public treeNodes: NzTreeNode[] = [];
  // 新增用户页面表单项
  public formColumn: FormItem[] = [];
  // 表单实例
  public formStatus: FormOperate;
  // 邮件默认选中
  public checkedMail: boolean = true;
  // 短信默认选中
  public checkedNote: boolean = true;
  // 修改的用户id
  public userId: string = '';
  // 部门选择树配置
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  public userDisable: string;
  // 部门弹框显示
  public areaSelectVisible: boolean = false;
  // 时间类型
  public timeType: string = DateTypeEnum.day;
  // 推送方式选择项
  public pushTypeCheckbox: CheckboxModel[] = [];
  // 用户提示
  public checkUserName: string = '';
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;

  constructor(
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $userForCommonService: UserForCommonService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $userUtilService: UserUtilService,
    public $ruleUtil: RuleUtil
  ) {
  }

  public initPage(accountLimitTemp, departmentTep, telephoneTemp, phoneNumberRules): void {
    // 获取初始化国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.pushTypeCheckbox = [
      {label: this.language.mail, value: PushTypeEnum.mail, checked: true},
      {label: this.language.note, value: PushTypeEnum.note, checked: true},
      {label: 'app', value: PushTypeEnum.app, checked: true},
      {label: 'web', value: PushTypeEnum.web, checked: true},
    ];
    this.$active.params.subscribe(params => {
      this.pageType = params.type;
    });
    // 页面类型获取
    this.pageTitle = this.getPageTitle(this.pageType);
    // 获取所有角色
    this.queryAllRoles();
    // 表单初始化
    this.$active.queryParams.subscribe(params => {
      if (this.pageType === OperateTypeEnum.add) {
        // 获取账户最小长度设置
        this.accountMinLength = Number(params.minLength);
      } else {
        // 获取用户id
        this.userId = params.id;
        this.$userService.queryUserInfoById(params.id).subscribe((res: ResultModel<UserListModel>) => {
          // 用户模式登录方式
          this.userDisable = res.data.loginType;
        });
      }
    });
    this.initForm(accountLimitTemp, departmentTep, telephoneTemp, phoneNumberRules);
  }


  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  /**
   * 部门选中结果
   * param event
   */
  public areaSelectChange(event: DepartmentListModel[]): void {
    if (event[0]) {
      this.userInfo.deptId = event[0].id;
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, event[0].id);
      this.selectUnitName = event[0].deptName;
      this.formStatus.resetControlData('deptId', this.userInfo.deptId);
    } else {
      // 置空操作
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, null);
      this.selectUnitName = '';
      this.formStatus.resetControlData('deptId', null);
    }
  }

  /**
   * 判断页面类型
   */
  public getPageTitle(type: string): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = `${this.language.addUser} ${this.language.user}`;
        break;
      case OperateTypeEnum.update:
        title = `${this.language.update} ${this.language.user}`;
        break;
    }
    return title;
  }

  /**
   * 获取所有角色
   */
  public queryAllRoles(): void {
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
   * 获取部门信息
   */
  public getDept() {
    return new Promise((resolve, reject) => {
      this.$userUtilService.getDept().then((data: any) => {
        this.treeNodes = data || [];
        this.initAreaSelectorConfig(data);
        resolve();
      });
    });
  }

  /**
   * 初始化选择区域配置
   */
  public initAreaSelectorConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.departmentSelect,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all',
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
   * 初始化表单时异步校验获取params
   */
  public getCheckParams(filterField: string, value: any): QueryConditionModel {
    const params = new QueryConditionModel;
    params.filterConditions[0] = new FilterCondition(filterField, OperatorEnum.eq, value);
    return params;
  }

  /**
   * 获取状态
   */
  public getStatusForEdit(res: ResultModel<UserListModel[]>): boolean {
    if (res.code === 0) {
      if (res.data.length === 0) {
        return true;
      } else if (res.data.length > 0) {
        return res.data[0].id === this.userId;
      }
    } else {
      return false;
    }
  }

  /**
   * 获取状态
   */
  public getStatusForAdd(res: ResultModel<UserListModel[]>): boolean {
    if (res.code === 0) {
      if (res.data.length === 0) {
        return true;
      } else if (res.data.length > 0) {
        return false;
      }
    } else {
      return false;
    }
  }

  public checkStatus(res: ResultModel<UserListModel[]>): boolean {
    if (this.pageType === OperateTypeEnum.add) {
      return this.getStatusForAdd(res);
    } else {
      return this.getStatusForEdit(res);
    }
  }

  /**
   * 打开部门选择器
   */
  public showDeptSelectorModal(): void {
    this.areaSelectorConfig.treeNodes = this.treeNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 表单信息
   */
  public initForm(accountLimitTemp, departmentTep, telephoneTemp, phoneNumberRules): void {
    this.formColumn = [
      {
        // 账号
        label: this.language.userCode,
        key: 'userCode',
        type: 'input',
        disabled: this.pageType !== OperateTypeEnum.add,
        require: true,
        rule: [
          {required: true},
          {minLength: this.accountMinLength},
          {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        // 自定义校验规则
        customRules: [this.$ruleUtil.getNameCustomRule()],
        // 异步校验规则
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyUserInfo(
            this.getCheckParams('userCode', value)
            ),
            res => {
              // 获取检验结果
              return this.checkStatus(res);
            })
        ],
      },
      {
        // 姓名
        label: this.language.userName,
        key: 'userName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule(), {
          code: 'duplicateSystemAdd',
          msg: this.language.duplicateSystemAdd,
          validator: () => null
        }],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              if (control.value) {
                return control.valueChanges.pipe(
                  distinctUntilChanged(),
                  debounceTime(1000),
                  mergeMap(() => this.$userForCommonService.checkUserNameExist({userName: control.value.trim(), id: this.userId})),
                  mergeMap(res => {
                    if (res.code === ResultCodeEnum.success) {
                      if (res.data === 1) {
                        return of({error: true, duplicateUsernameAdd: true});
                      } else if (res.data === 2) {
                        return of({error: true, duplicateSystemAdd: true});
                      } else {
                        return of(null);
                      }
                    }
                  }),
                  first()
                );
              } else {
                return of(null);
              }
            },
            asyncCode: 'duplicateUsernameAdd', msg: this.language.duplicateUsernameAdd
          },
        ]
      },
      {
        // 昵称
        label: this.language.userNickname,
        key: 'userNickname',
        type: 'input',
        require: false,
        rule: [{maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: []
      },
      {
        // 用户状态
        label: this.language.userStatus,
        key: 'userStatus',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: UserStatusEnum.enable,
        radioInfo: {
          data: [
            // 启用
            {label: this.language.enable, value: UserStatusEnum.enable},
            // 停用
            {label: this.language.disable, value: UserStatusEnum.disable},
          ],
          label: 'label',
          value: 'value'
        }
      },
      {
        // 部门
        label: this.language.deptId,
        key: 'deptId',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: departmentTep
      },
      {
        // 角色
        label: this.language.roleId,
        key: 'roleId',
        type: 'select',
        require: true,
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
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [{maxLength: 64}],
        asyncRules: []
      },
      {
        // 手机号
        label: this.language.phoneNumber,
        key: 'phoneNumber',
        type: 'custom',
        require: true,
        col: 24,
        rule: [
          {required: true}
        ],
        asyncRules: phoneNumberRules,
        template: telephoneTemp
      },
      {
        // 邮箱
        label: this.language.email,
        key: 'email',
        type: 'input',
        require: true,
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
              return this.checkStatus(res);
            }, this.commonLanguage.emailExists)
        ]
      },
      {
        // 推送方式
        label: this.language.pushType,
        key: 'pushType',
        type: 'checkbox',
        require: false,
        rule: [],
        asyncRules: [],
        initialValue: this.pushTypeCheckbox
      },
      {
        // 账户有效期
        label: this.language.countValidityTime,
        key: 'countValidityTime',
        type: 'custom',
        require: false,
        col: 24,
        rule: [{max: 999, msg: this.language.pleaseEnterAnIntegerLessThan999},
          this.$ruleUtil.positiveInteger()],
        customRules: [],
        asyncRules: [],
        template: accountLimitTemp
      },
      {
        // 用户模式
        label: this.language.loginType,
        key: 'loginType',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: LoginTypeEnum.singleUser,
        radioInfo: {
          data: [
            // 单用户
            {label: this.language.singleUser, value: LoginTypeEnum.singleUser},
            // 多用户
            {label: this.language.multiUser, value: LoginTypeEnum.multiUser},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          if (event === '1') {
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
        label: this.language.maxUsers,
        key: 'maxUsers',
        type: 'input',
        require: false,
        initialValue: 1,
        rule: [
          {pattern: /^([2-9]|[1-9]\d|2|100)$/, msg: this.language.maxUsersTips},
        ],
        asyncRules: []
      },
      {
        // 备注
        label: this.language.userDesc,
        key: 'userDesc',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
    if (this.pageType === OperateTypeEnum.add) {
      setTimeout(() => {
        this.formStatus.group.controls['maxUsers'].disable();
      }, 0);
    } else {
      setTimeout(() => {
        if (this.userDisable === LoginTypeEnum.singleUser) {
          this.formStatus.group.controls['maxUsers'].disable();
        } else {
          this.formStatus.group.controls['maxUsers'].enable();
        }
      }, 380);
    }
  }

  /**
   * 提交数据结构处理 （账号有效期字段和推送方式字段的处理）
   */
  public subObjDeal(userObj: UserListModel): UserListModel {
    if (userObj.countValidityTime) {
      if (this.timeType === DateTypeEnum.year) {
        userObj.countValidityTime = userObj.countValidityTime + 'y';
      } else if (this.timeType === DateTypeEnum.month) {
        userObj.countValidityTime = userObj.countValidityTime + 'm';
      } else if (this.timeType === DateTypeEnum.day) {
        userObj.countValidityTime = userObj.countValidityTime + 'd';
      }
    }
    // 处理推送方式字段的数据
    if (this.formStatus.getData('pushType').length) {
      const pushType = [];
      this.formStatus.getData('pushType').forEach(item => {
        if (item.checked) {
          pushType.push(item.value);
        }
      });
      userObj.pushType = pushType.join(',');
    }
    return userObj;
  }

  /**
   * 返回disabled按钮状态
   */
  public getButtonStatus(): boolean {
    return !this.formStatus.getValid();
  }

}
