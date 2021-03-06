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
 * ????????????
 */
@Component({
  selector: 'app-associate-user',
  templateUrl: './associate-user.component.html',
  styleUrls: ['./associate-user.component.scss']
})
export class AssociateUserComponent implements OnInit {
  // ???????????????????????????????????????????????????????????????????????????
  @Input() public notShowStepSecond: boolean = false;
  // ???????????????????????????
  @Input() public stepsFirstParams;
  // ????????????
  @Output() private formValid = new EventEmitter<boolean>();
  // ??????????????????
  @ViewChild('associatedUsers') public associatedUsersTemp;
  // ?????????????????????
  @ViewChild('accountLimit') private accountLimitTemp;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????
  public scheduleLanguage: ScheduleLanguageInterface;
  // ???????????????
  public userLanguage: UserLanguageInterface;
  // ????????????
  public formColumn: FormItem[] = [];
  // ????????????
  public formStatus: FormOperate;
  // ?????????????????????????????????
  public isDisabled: boolean = true;
  // ????????????????????????
  public isLoading = false;
  // ????????????
  public roleList: { label: string, value: string }[] = [];
  // ????????????id
  public selectAssociatedUserId: string;
  // ??????????????????????????????
  public userModalVisible: boolean = false;
  // ????????????
  public timeType: string = DateTypeEnum.day;
  // ?????????????????? ??????????????????
  public personInfo: PersonInfoModel = new PersonInfoModel();
  // ??????????????????????????????id
  public currentUserId: string = '';
  // ????????????id
  private personId: string = '';
  // ??????????????????
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
   * ?????????
   */
  public ngOnInit(): void {
    // ?????????
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    // ????????????
    this.queryAllRoles();
    // ??????????????????
    this.queryAccountSecurity();
    if (!this.notShowStepSecond) {
      this.$active.queryParams.subscribe(params => {
        this.personId = params.personId;
        // ??????????????????
        this.getAssociateUserData();
      });
    }
  }

  /**
   * ??????????????????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // ???????????? ????????????????????? ??? ????????????????????????????????????????????????true
    // ?????? ???????????????????????? ?????????????????????true, ??????????????????????????????????????? ????????????????????????
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
   * ????????????
   */
  public submit(): void {
    this.isLoading = true;
    // ????????????
    const data = this.formStatus.getRealData();
    const arr = ['id', 'deptCode', 'deptId', 'phoneNumber', 'personName'];
    Object.keys(this.personInfo).forEach(key => {
      if (arr.includes(key)) {
        data[key] = this.personInfo[key];
      }});
    // ???????????????????????????????????????????????????????????????id??????
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
   * ????????????
   */
  public goBack(): void {
    this.$router.navigate(['business/schedule/person-information']).then();
  }

  /**
   * ??????????????????
   * param event
   */
  public selectDataChange(event: UserListModel[]): void {
    this.userModalVisible = false;
    if (!_.isEmpty(event)) {
      this.selectAssociatedUserId = event[0].id;
      // ??????????????????????????????????????????
      this.formStatus.resetControlData('associatedUser', event[0].userName);
    }
  }

  /**
   * ?????????????????????
   */
  public timeTypeChange(): void {
    // ????????????????????????
    this.formStatus.resetControlData('countValidityTime', null);
  }
  /**
   * ????????????????????????????????????params
   */
  public getCheckParams(filterField: string, value: any): QueryConditionModel {
    const params = new QueryConditionModel;
    params.filterConditions[0] = new FilterCondition(filterField, OperatorEnum.eq, value);
    return params;
  }
  /**
   * ????????????????????????
   */
  public queryAccountSecurity(): void {
    this.$systemForCommonService.queryAccountSecurity().subscribe((res: ResultModel<AccountSecurityModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.accountMinLength = res.data.minLength;
        // ???????????????
        this.initFormColumn();
      }
    });
  }
  /**
   * ????????????
   */
  private queryAllRoles(): void {
    const userInfo = SessionUtil.getUserInfo();
    this.$userForCommonService.queryAllRoles().subscribe((res: ResultModel<RoleListModel[]>) => {
      const roleArray = res.data;
      if (roleArray) {
        if (userInfo.userCode === UserTypeEnum.admin) {
          roleArray.forEach(item => {
            // ????????????????????????
            this.roleList.push({label: item.roleName, value: item.id});
          });
        } else {
          // ???admin???????????????????????????????????????
          const _roleArray = roleArray.filter(item => item.id !== UserTypeEnum.superAdmin);
          _roleArray.forEach(item => {
            // ????????????????????????
            this.roleList.push({label: item.roleName, value: item.id});
          });
        }
      }
    });
  }

  /**
   * ????????????????????????
   */
  private getAssociateUserData(): void {
    // ????????????????????????????????????
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
   * ??????????????????????????????
   */
  private checkParams(): void {
    // ??????????????????????????????????????????
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
      // ???????????????????????????????????????
      const param = new QueryConditionModel();
      param.filterConditions[0] = new FilterCondition('phoneNumber', OperatorEnum.eq, phoneNumber);
      this.$userForCommonService.verifyUserInfo(param).subscribe((result: ResultModel<UserListModel[]>) => {
        if (result.code === 0) {
          phoneNumberExist = result.data.length !== 0;
        }
        // ??????????????????????????????????????????
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
          // ???????????????????????? ??? ?????? ?????????????????????????????????????????????
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
   * ?????????????????????
   */
  private initFormColumn(): void {
    this.formColumn = [
      {
        // ????????????????????????
        label: this.scheduleLanguage.relateExistUsers,
        key: 'relateExistUsers',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: StatusChangeEnum.yes,
        radioInfo: {
          data: [
            // ???
            {label: this.scheduleLanguage.yes, value: StatusChangeEnum.yes},
            // ???
            {label: this.scheduleLanguage.no, value: StatusChangeEnum.no},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event) => {
          // ??????????????????????????????????????? ?????????????????????????????????????????? ???
          this.formStatus.resetControlData('isCreate', StatusChangeEnum.no);
          // ???????????????????????? ??? ??? ??????????????????????????????; ????????????????????????????????????
          this.formStatus.setColumnHidden(['associatedUser'], $event === StatusChangeEnum.no);
          this.formStatus.setColumnHidden(['isCreate'], $event !== StatusChangeEnum.no);
        }
      },
      {
        // ????????????
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
        // ????????????????????????
        label: this.scheduleLanguage.createUsers,
        key: 'isCreate',
        type: 'radio',
        require: true,
        hidden: true,
        rule: [{required: true}],
        initialValue: StatusChangeEnum.no,
        radioInfo: {
          data: [
            // ???
            {label: this.scheduleLanguage.yes, value: StatusChangeEnum.yes},
            // ???
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
        // ??????
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
        // ?????????????????????
        customRules: [this.$ruleUtil.getNameCustomRule()],
        // ??????????????????
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userForCommonService.verifyUserInfo(
            this.getCheckParams('userCode', value)
            ),
            res => {
              // ??????????????????
              if (res.code === 0) {
                return res.data.length === 0;
              }
            }, this.scheduleLanguage.userCodeExist)
        ],
      },
      {
        // ??????
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
        // ????????????
        label: this.userLanguage.userStatus,
        key: 'userStatus',
        type: 'radio',
        require: true,
        hidden: true,
        rule: [{required: true}],
        initialValue: CurrencyEnum.enable,
        radioInfo: {
          data: [
            // ??????
            {label: this.userLanguage.enable, value: CurrencyEnum.enable},
            // ??????
            {label: this.userLanguage.disable, value: CurrencyEnum.disabled},
          ],
          label: 'label',
          value: 'value'
        }
      },
      {
        // ??????
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
        // ??????
        label: this.userLanguage.address,
        key: 'address',
        type: 'input',
        require: false,
        hidden: true,
        rule: [{maxLength: 64}],
        asyncRules: []
      },
      {
        // ??????
        label: this.userLanguage.email,
        key: 'email',
        type: 'input',
        require: true,
        hidden: true,
        rule: [
          {required: true},
          {maxLength: 32},
          this.$ruleUtil.getMailRule()],
        // ??????????????????
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$userForCommonService.verifyUserInfo(
            this.getCheckParams('email', value)
            ),
            res => {
              // ??????????????????
              if (res.code === 0) {
                return res.data.length === 0;
              }
            }, this.scheduleLanguage.emailExist)
        ]
      },
      {
        // ???????????????
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
        // ????????????
        label: this.userLanguage.loginType,
        key: 'loginType',
        type: 'radio',
        require: true,
        hidden: true,
        rule: [{required: true}],
        initialValue: LoginTypeEnum.singleUser,
        radioInfo: {
          data: [
            // ?????????
            {label: this.userLanguage.singleUser, value: LoginTypeEnum.singleUser},
            // ?????????
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
        // ???????????????
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
        // ??????
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
