import {Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {UserUtilService} from '../../share/service/user-util.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {TelephoneInputComponent} from '../../../../shared-module/component/telephone-input/telephone-input.component';
import {UpdateUserNameService} from '../../../../core-module/mission/update-username-service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {LoginTypeEnum} from '../../share/enum/login-type.enum';
import {UserService} from '../../share/service/user.service';
import {DateTypeEnum} from '../../../../shared-module/enum/date-type.enum';
import {MixinTemplateUserEdit} from '../../share/minix-component/mixin-template-user-edit/mixin-template-user-edit';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';
import {PhoneSetModel} from '../../../../core-module/model/user/phone-set.model';
import {UserForCommonService} from '../../../../core-module/api-service';

/**
 * 修改用户模块
 */
@Component({
  selector: 'app-modify-user',
  templateUrl: '../../share/minix-component/mixin-template-user-edit/mixin-template-user-edit.html',
  styleUrls: ['./modify-user.component.scss']
})

export class ModifyUserComponent extends MixinTemplateUserEdit implements OnInit {
  // 账户有效期模板
  @ViewChild('accountLimit') private accountLimitTemp;
  // 部门选择模板
  @ViewChild('department') private departmentTep;
  // 手机号模板
  @ViewChild('telephoneModify') private telephoneTemp;
  // 手机号输入框
  @ViewChild('telephoneInput') private telephoneInput: TelephoneInputComponent;
  // 树节点数据
  public treeNodes: any = [];
  // 提交按钮loading
  public isLoading = false;
  // 时间类型
  public timeType: string = DateTypeEnum.day;
  // 部门名称
  public deptName: string = '';
  // 手机号
  public telephone;
  // 手机号校验
  public phoneNumberMsg: string = '';
  public phoneValue: string = '';
  // 最大用户数
  private maxUsers: number;
  // 用户模式
  private loginType: string;
  // 手机号国际码
  private countryCode: string = '86';

  constructor(
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $userForCommonService: UserForCommonService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $userUtilService: UserUtilService,
    public $ruleUtil: RuleUtil,
    public $updateUserNameService: UpdateUserNameService
  ) {
    super($nzI18n, $userService, $userForCommonService, $message, $active, $router, $userUtilService, $ruleUtil);
  }

  public ngOnInit(): void {
    // 初始化页面
    this.initPage(this.accountLimitTemp, this.departmentTep, this.telephoneTemp, [
      this.$ruleUtil.getNameAsyncRule(value => this.$userService.verifyUserInfo(
        this.getCheckParams('phoneNumber', value)
        ),
        res => {
          if (res.code === 0) {
            if (res.data.length === 0) {
              return true;
            } else if (res.data.length > 0) {
              if (res.data[0].id === this.userId) {
                return true;
              } else {
                this.phoneNumberMsg = this.language.phoneNumberExistTips;
                return false;
              }
            }
          } else {
            return false;
          }
        })
    ]);
    this.$active.queryParams.subscribe(queryParams => {
      // 获取用户id
      this.userId = queryParams.id;
      this.getDept().then(() => {
        // 获取部门信息后进行获取用户信息
        this.getUserInfoById(this.userId);
      });
    });
  }


  /**
   * 修改用户
   */
  public submit(): void {
    this.isLoading = true;
    // 获取表单数据
    let results = this.formStatus.getData();
    // 账户有效期设置
    results = this.subObjDeal(results);
    // 获取用户id
    results.id = this.userId;
    // 用户模式设置
    if (results.loginType === LoginTypeEnum.singleUser) {
      results.maxUsers = 1;
    }
    // 手机号码设置
    const telephoneCode = this.telephoneInput.telephoneCode;
    results.countryCode = telephoneCode.substr(1, telephoneCode.length - 1);  // 电话号码国际码
    // 调用接口查询用户信息
    this.$userService.queryUserInfoById(this.userId).subscribe((result: ResultModel<UserListModel>) => {
      if (result.code === ResultCodeEnum.userNotExist) {
        this.isLoading = false;
        // 用户不存在提示，转回列表
        this.$message.info(this.language.existTips);
        this.$router.navigate(['/business/user/user-list']).then();
      } else {
        this.$userService.modifyUser(results).subscribe((res: ResultModel<any>) => {
          this.isLoading = false;
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.modifyUserSuccess);
            this.$router.navigate(['business/user/user-list']).then();
            const userInfo = SessionUtil.getUserInfo();
            const userName = results.userName;
            if (results.id === userInfo.id) {
              this.$updateUserNameService.sendMessage(userName);  // 更新用户姓名
            }
          } else if (res.code === ResultCodeEnum.fail) {
            this.$message.error(this.language.modifyUserFail);
          } else {
            this.$message.info(res.msg);
          }
        });
      }
    });
  }

  /**
   * 取消按钮，回列表
   */
  public cancel(): void {
    this.$router.navigate(['/business/user/user-list']).then();
  }


  /**
   * 时间类型下拉框
   */
  public timeTypeChange(): void {
    // 当发生改变时为空
    this.formStatus.resetControlData('countValidityTime', null);
  }

  /**
   * 初始化电话号码
   */
  public getPhoneInit(event: any): void {
    this.telephone = event;
  }


  /**
   * 获取电话号码国际码
   */
  public getPhone(event: PhoneSetModel): void {
    this.countryCode = event.dialCode;
  }

  /**
   * 监听手机号码输入状态
   */
  public inputNumberChange(event: string): void {
    this.phoneNumberMsg = '';
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    const _reg = /^\d+$/;
    const data = this.getCheckParams('phoneNumber', event);
    if (this.telephoneInput && this.telephoneInput.telephoneCode === '+86') {
      if (reg.test(event)) {
        this.$userService.verifyUserInfo(data).subscribe((res: ResultModel<UserListModel[]>) => {
          if (res.code === 0) {
            if (res.data.length === 0) {
              this.formStatus.resetControlData('phoneNumber', event);
            } else if (res.data.length > 0) {
              this.formStatus.resetControlData('phoneNumber', event);
            } else if (res.data.length > 0 && (res.data[0].phoneNumber === this.phoneValue)) {
              this.formStatus.resetControlData('phoneNumber', null);
            }
          } else {
            this.formStatus.resetControlData('phoneNumber', null);
          }
        });
      } else {
        this.phoneNumberMsg = event && this.language.phoneNumberTips;
        this.formStatus.resetControlData('phoneNumber', null);
      }
    } else {
      if (_reg.test(event)) {
        this.formStatus.resetControlData('phoneNumber', event);
      } else {
        this.formStatus.resetControlData('phoneNumber', null);
      }

    }
  }

  /**
   * 根据id获取用户详情
   */
  private getUserInfoById(userId: string): void {
    this.$userService.queryUserInfoById(userId).subscribe((res: ResultModel<UserListModel>) => {
      const userInfo = res.data;
      // 推送方式数据处理
      if (userInfo.pushType) {
        const pushType = (userInfo.pushType as string).split(',');
        this.pushTypeCheckbox.forEach(item => {
          if (pushType.includes(item.value)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      } else {
        this.pushTypeCheckbox.forEach(item => item.checked = false);
      }
      userInfo.pushType = this.pushTypeCheckbox;
      // 手机号
      this.phoneValue = res.data.phoneNumber;
      if (userInfo.countryCode) {
        this.telephoneInput.telephoneCode = `+${userInfo.countryCode}`; // 国际码
      }
      this.telephoneInput._phoneNum = userInfo.phoneNumber; // 电话号码
      // 账户有效期设置
      const validityTime = res.data.countValidityTime;
      let fontValue = '';
      if (validityTime) {
        const endVal = validityTime.charAt(validityTime.length - 1);
        fontValue = validityTime.substring(0, validityTime.length - 1);
        if (endVal === 'y') {
          this.timeType = DateTypeEnum.year;
        } else if (endVal === 'm') {
          this.timeType = DateTypeEnum.month;
        } else {
          this.timeType = DateTypeEnum.day;
        }
      } else {
        userInfo.countValidityTime = null;
        this.formStatus.resetControlData('countValidityTime', null);
        this.timeType = DateTypeEnum.day;
      }
      // 用户模式登录方式
      this.userDisable = userInfo.loginType;
      // 所选部门
      if (userInfo.department) {
        this.selectUnitName = userInfo.department.deptName;
      }
      setTimeout(() => {
        // 表单设值
        this.formStatus.resetData(userInfo);
        this.formStatus.resetControlData('countValidityTime', fontValue);
      }, 0);
      // 递归设置部门的选择情况
      this.$userUtilService.setAreaNodesStatus(this.treeNodes, userInfo.deptId);
    });
  }
}
