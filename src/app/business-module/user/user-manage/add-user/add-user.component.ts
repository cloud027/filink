import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {UserUtilService} from '../../share/service/user-util.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {LoginTypeEnum} from '../../share/enum/login-type.enum';
import {UserService} from '../../share/service/user.service';
import {DateTypeEnum} from 'src/app/shared-module/enum/date-type.enum';
import {MixinTemplateUserEdit} from '../../share/minix-component/mixin-template-user-edit/mixin-template-user-edit';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {PhoneSetModel} from '../../../../core-module/model/user/phone-set.model';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';
import {UserForCommonService} from '../../../../core-module/api-service';

/**
 * 新增用户模块（此页面变量和方法显示灰色为template在外层share导致）
 */
@Component({
  selector: 'app-add-user',
  templateUrl: '../../share/minix-component/mixin-template-user-edit/mixin-template-user-edit.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent extends MixinTemplateUserEdit implements OnInit {
  // 账户有效期模板
  @ViewChild('accountLimit') private accountLimitTemp;
  // 部门选择模板
  @ViewChild('department') private departmentTep;
  // 手机号模板
  @ViewChild('telephone') private telephoneTemp;
  // 加载动画
  public isLoading = false;
  // 时间类型
  public timeType: string = DateTypeEnum.day;
  // 部门名称
  public deptName: string = '';
  // 最大用户数
  public maxUsers: number;
  // 用户模式
  public loginType: string;
  // 手机号
  public telephone;
  // 手机号校验
  public phoneNumberMsg: string = '';
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
    public $ruleUtil: RuleUtil
  ) {
    super($nzI18n, $userService, $userForCommonService, $message, $active, $router, $userUtilService, $ruleUtil);
  }


  public ngOnInit(): void {
    // 初始化页面
    this.initPage(this.accountLimitTemp, this.departmentTep, this.telephoneTemp, []);
    this.getDept();
  }

  /**
   *新增用户
   */
  public submit(): void {
    this.isLoading = true;
    // 获取表单数据
    let userObj = this.formStatus.getData();
    // 账户有效期设置和推送方式数据处理
    userObj = this.subObjDeal(userObj);
    // 用户模式设置
    if (userObj.loginType === LoginTypeEnum.singleUser) {
      userObj.maxUsers = 1;
    }
    // 电话号码国际码
    userObj.countryCode = this.countryCode;
    // 新增用户
    this.$userService.addUser(userObj).subscribe((res: ResultModel<any>) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.$router.navigate(['business/user/user-list']).then();
        this.$message.success(this.language.addUserSuccess);
      } else if (res.code === ResultCodeEnum.fail) {
        this.$message.error(this.language.addUserFail);
      } else {
        this.$message.info(res.msg);
      }
    });
  }

  /**
   * 取消按钮，回列表
   */
  public cancel(): void {
    this.$router.navigate(['business/user/user-list']).then();
  }

  /**
   * 时间类型下拉框
   */
  public timeTypeChange(): void {
    // 当发生改变时为空
    this.formStatus.resetControlData('countValidityTime', null);
  }

  /**
   * 初始化手机号码
   */
  public getPhoneInit(event: any): void {
    this.telephone = event;
  }

  /**
   * 监听手机号国际码
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
    // check中国手机号
    if (this.countryCode === '86') {
      if (reg.test(event)) {
        // 通过验证后进行后台验证
        this.$userService.verifyUserInfo(data).subscribe((res: ResultModel<UserListModel[]>) => {
          if (res.code === 0) {
            if (res.data.length === 0) {
              this.phoneNumberMsg = '';
              this.formStatus.resetControlData('phoneNumber', event);
            } else if (res.data[0].phoneNumber === event) {
              this.phoneNumberMsg = this.language.phoneNumberExistTips;
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
        this.phoneNumberMsg = '';
        this.formStatus.resetControlData('phoneNumber', event);
      } else {
        this.phoneNumberMsg = event && this.language.phoneNumberTips;
        this.formStatus.resetControlData('phoneNumber', null);
      }
    }

  }
}
