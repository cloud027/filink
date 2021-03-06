import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {SystemForCommonService} from '../../../../core-module/api-service/system-setting';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {DateFormatStringEnum} from '../../../../shared-module/enum/date-format-string.enum';
import {DownloadService} from '../../share/service/download.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {UserUtilService} from '../../share/service/user-util.service';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {UserService} from '../../share/service/user.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {LoginTypeEnum} from '../../share/enum/login-type.enum';
import {PushTypeEnum} from '../../share/enum/push-type.enum';
import {UserStatusEnum} from '../../share/enum/user-status.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {MixinUnitSelector} from '../../share/minix-component/mixin-selector/mixin-unit-selector';
import {UserTypeEnum} from '../../share/enum/user-type.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';
import {AccountSecurityModel} from '../../../../core-module/model/user/account-security.model';
import {RoleListModel} from '../../../../core-module/model/user/role-list.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';

/**
 * ????????????
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent extends MixinUnitSelector implements OnInit {
  // ??????????????????
  @ViewChild('userStatusTemp') private userStatusTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('departmentTemp') private departmentTemp: TemplateRef<any>;
  // ???????????????
  @ViewChild('roleTemp') private roleTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('loginTypeTemp') private loginTypeTemp: TemplateRef<any>;
  // ??????
  @ViewChild('importTemp') private importTemp: TemplateRef<any>;
  // ?????????????????????????????????
  @ViewChild('unitNameSearch') private unitNameSearch: TemplateRef<any>;
  // ???????????????????????????
  @ViewChild('selectLogTemp') private selectLogTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('pushTypeTemp') private pushTypeTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  public _dataSet = [];
  // ????????????
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  private filterObject = {};
  // ????????????????????????????????????
  public operationDis: boolean = true;
  // ????????????????????????????????????
  public securityDis: boolean = true;
  // ?????????????????????
  public language: UserLanguageInterface;
  // ?????????????????????
  public commonLanguage: CommonLanguageInterface;
  // ??????id
  private userId: string = '';
  // ?????????????????????
  private flag: boolean = true;
  // ????????????
  private defaultPassWord: string;
  // ?????????????????????
  public fileList: UploadFile[] = [];
  // ???????????????
  public areaSelectVisible: boolean = false;
  // ?????????????????????
  public areaSelectorConfig: any = new TreeSelectorConfigModel();
  // ????????????????????????
  public radioValue: string;
  // ??????????????????
  public loginTypeEnum = LoginTypeEnum;
  // ??????????????????
  public pushTypeEnum = PushTypeEnum;
  // ??????????????????
  public userStatusEnum = UserStatusEnum;
  // ?????????????????????
  private fileArray = [];
  // ?????????????????????
  private fileType: string;
  // ????????????????????????
  private accountMinLength: number = 1;
  // ?????????????????????
  private roleArray = [];
  // ??????????????????
  private areaNodes: AreaModel[] = [];

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $userService: UserService,
              public $userForCommonService: UserForCommonService,
              public $message: FiLinkModalService,
              public $nzModalService: NzModalService,
              public $dateHelper: DateHelperService,
              private $downloadService: DownloadService,
              private $systemForCommonService: SystemForCommonService,
              private $facilityCommonService: FacilityForCommonService,
              private $userUtilService: UserUtilService) {
    super($router, $nzI18n, $userService, $userForCommonService, $message, $dateHelper);
  }


  public ngOnInit(): void {
    // ??????????????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // ?????????????????????
    this.initTableConfig();
    // ??????????????????
    this.initTreeSelectorConfig();
    // ?????????????????????
    this.queryDeptList();
    // ????????????
    this.refreshData();
    // ??????????????????
    this.queryUserPassWord();
    // ??????????????????
    this.queryAccountSecurity();
    // ??????????????????
    this.queryAllRoles();
    // ????????????????????????
    this.getLogRole();
  }


  /**
   * ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ????????????
   */
  public beforeUpload = (file: UploadFile): boolean => {
    this.fileArray = this.fileArray.concat(file);
    if (this.fileArray.length > 1) {
      this.fileArray.splice(0, 1);
    }
    this.fileList = this.fileArray;
    const fileName = this.fileList[0].name;
    const index = fileName.lastIndexOf('\.');
    this.fileType = fileName.substring(index + 1, fileName.length);
    return false;
  }

  /**
   * ??????????????????
   */
  public areaSelectChange(event): void {
  }

  /**
   * ????????????????????????
   * param event
   */
  private getLogRole(): void {
    const menuList = JSON.parse(localStorage.getItem('menuList'));
    menuList.map(item => {
      if (item.menuId === '06') {
        item.children.map(_item => {
          if (_item.menuId === '6-2') {
            _item.children.map(__item => {
              if (__item.menuId === '6-2-1') {
                this.operationDis = false;
              } else if (__item.menuId === '6-2-3') {
                this.securityDis = false;
              }
            });
          }
        });
      }
    });
  }
  /**
   * ????????????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$userForCommonService.queryUserLists(this.queryCondition).subscribe((res: ResultModel<UserListModel[]>) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      this.pageBean.Total = res.totalCount;
      this.pageBean.pageIndex = res.pageNum;
      this.pageBean.pageSize = res.size;
      this._dataSet.forEach(item => {
        item.isShowDeleteIcon = !item.defaultUser;
        // ???????????????
        if (item.countValidityTime && item.createTime) {
          const validTime = item.countValidityTime;
          const createTime = item.createTime;
          const endVal = validTime.charAt(validTime.length - 1);
          const fontVal = validTime.substring(0, validTime.length - 1);
          const now = new Date(createTime);
          if (endVal === 'y') {
            const year_date = now.setFullYear(now.getFullYear() + Number(fontVal));
            item.countValidityTime = this.$dateHelper.format(new Date(year_date), DateFormatStringEnum.date);
          } else if (endVal === 'm') {
            const week_date = now.setMonth(now.getMonth() + Number(fontVal));
            item.countValidityTime = this.$dateHelper.format(new Date(week_date), DateFormatStringEnum.date);
          } else if (endVal === 'd') {
            const day_date = now.setDate(now.getDate() + Number(fontVal));
            item.countValidityTime = this.$dateHelper.format(new Date(day_date), DateFormatStringEnum.date);
          }
        }
        // admin????????????????????????????????????????????????????????????????????????
        if (item.userCode === UserTypeEnum.admin || item.tenantAdmin) {
          item.isDisabled = true;
        }
      });
    }, () => {
      this.tableConfig.isLoading = false;
    });

  }

  /**
   * ????????????????????????
   */
  private openAddUser(): void {
    this.$router.navigate(['business/user/add-user/add'], {
      queryParams: {minLength: this.accountMinLength}
    }).then();
  }

  /**
   * ????????????????????????
   */
  private openModifyUser(userId: string): void {
    this.$router.navigate(['business/user/modify-user/update'], {
      queryParams: {id: userId}
    }).then();
  }

  /**
   * ??????????????????
   */
  private clickSwitch(data: UserListModel): void {
    let statusValue;
    this._dataSet.forEach(item => {
      if (item.id === data.id) {
        item.clicked = true;
      }
    });
    data.userStatus === UserStatusEnum.enable ? statusValue = UserStatusEnum.disable : statusValue = UserStatusEnum.enable;
    this.$userService.updateUserStatus(statusValue, [data.id]).subscribe((res: ResultModel<number>) => {
      if (res.code === 0) {
        this._dataSet.forEach(item => {
          item.clicked = false;
          if (item.id === data.id) {
            item.userStatus === UserStatusEnum.enable ? item.userStatus = UserStatusEnum.disable : item.userStatus = UserStatusEnum.enable;
          }
        });
      } else {
        // ?????????????????????,???????????????loading????????????false
        this._dataSet.forEach(item => item.clicked = false);
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ????????????????????????
   */
  private queryUserPassWord(): void {
    this.$userService.queryPassword().subscribe((res: ResultModel<string>) => {
      this.defaultPassWord = res.data;
    });
  }

  /**
   * ????????????
   */
  private goToFirstPage(): void {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }



  /**
   * ????????????
   */
  private importUser(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    if (this.fileList.length === 1) {
      if (this.fileType === 'xls' || this.fileType === 'xlsx') {
        this.$userService.importUser(formData).subscribe((res: ResultModel<any>) => {
          this.fileList = [];
          this.fileType = null;
          if (res.code === 0) {
            this.$message.success(res.msg);
            this.refreshData();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.info(this.language.fileTypeTips);
      }

    } else {
      this.$message.info(this.language.selectFileTips);
    }

  }

  /**
   * ????????????
   */
  private exportUser(body): void {
    this.$userService.exportUserList(body).subscribe((res: ResultModel<any>) => {
      if (res.code === 0) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ??????????????????
   */
  private downloadExcelFile(): void {
    this.$downloadService.downloadTemplate().subscribe((result: Blob) => {
      const data = result;
      const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', 'userTemplate.xlsx');
      a.click();
      document.body.removeChild(a);
      // ??????URL??????
      URL.revokeObjectURL(objectUrl);
    });

  }

  /**
   * ????????????????????????
   */
  private queryAccountSecurity(): void {
    this.$systemForCommonService.queryAccountSecurity().subscribe((res: ResultModel<AccountSecurityModel>) => {
      this.accountMinLength = res.data.minLength;
    });
  }

  /**
   * ????????????
   */
  private queryAllRoles(): void {
    this.$userForCommonService.queryAllRoles().subscribe((res: ResultModel<RoleListModel[]>) => {
      const roleArr = res.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({'label': item.roleName, 'value': item.roleName});
        });
      }

    });
  }

  /**
   * ????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '01-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '2200px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      notShowPrint: true,
      showPagination: true,
      columnConfig: [
        // ??????
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
        // ??????
        {
          type: 'serial-number', width: 60, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        // ??????
        {
          title: this.language.userCode, key: 'userCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '120px'}}
        },
        // ??????
        {
          title: this.language.userName, key: 'userName', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.userNickname, key: 'userNickname', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.language.userStatus, key: 'userStatus', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          minWidth: 80,
          renderTemplate: this.userStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.disable, value: UserStatusEnum.disable},
              {label: this.language.enable, value: UserStatusEnum.enable}
            ]
          }
        },
        // ??????
        {
          title: this.language.role, key: 'role', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          renderTemplate: this.roleTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        // ??????/??????
        {
          title: this.language.unit, key: 'department', width: 200, configurable: true,
          searchKey: 'departmentNameList',
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.unitNameSearch},
          type: 'render',
          renderTemplate: this.departmentTemp
        },
        // ?????????
        {
          title: this.language.phoneNumber, key: 'phoneNumber', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.email, key: 'email', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.language.pushType, key: 'pushType', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render', renderTemplate: this.pushTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: [
              {label: this.language.mail, value: PushTypeEnum.mail},
              {label: this.language.note, value: PushTypeEnum.note},
              {label: 'app', value: PushTypeEnum.app},
              {label: 'web', value: PushTypeEnum.web}
            ]
          }
        },
        // ??????
        {
          title: this.language.address, key: 'address', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????????????????
        {
          title: this.language.lastLoginTime, key: 'lastLoginTime', width: 180, isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        // ??????????????????IP
        {
          title: this.language.lastLoginIp, key: 'lastLoginIp', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.language.loginType, key: 'loginType', width: 120, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          renderTemplate: this.loginTypeTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.singleUser, value: LoginTypeEnum.singleUser},
              {label: this.language.multiUser, value: LoginTypeEnum.multiUser}
            ]
          }
        },
        // ???????????????
        {
          title: this.language.maxUsers, key: 'maxUsers', width: 120, isShowSort: true, configurable: true
        },
        // ???????????????
        {
          title: this.language.countValidityTime, key: 'countValidityTime', width: 150, configurable: true
        },
        // ??????
        {
          title: this.language.userDesc, key: 'userDesc', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        // ????????????????????????
        {
          text: this.language.addUser,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '01-1-1',
          handle: () => {
            this.openAddUser();
          }
        },
        // ????????????????????????
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '01-1-3',
          handle: (data: UserListModel[]) => {
            this.flag = true;
            data.forEach(item => {
              if (item.userName === 'admin') {
                this.flag = false;
              }
            });
            if (!this.flag) {
              this.$message.info(this.language.defaultUserTips);
            }
            if (data.some(item => item.defaultUser === 1)) {
              this.$message.info(this.language.tenantAdminNotDelete);
              return;
            }
            if (this.flag) {
              const ids = data.map(item => item.id);
              const params = {firstArrayParameter: ids};
              this.$userService.deleteUser(params).subscribe((res: ResultModel<any>) => {
                if (res.code === ResultCodeEnum.deleteOnlineUser) {
                  this.$nzModalService.confirm({
                    nzTitle: this.language.deleteOnlineUserTips,
                    nzContent: '',
                    nzMaskClosable: false,
                    nzOkText: this.language.cancelText,
                    nzCancelText: this.language.okText,
                    nzOkType: 'danger',
                    nzOnOk: () => {
                    },
                    nzOnCancel: () => {
                      const onlineParams = {firstArrayParameter: ids, flag: true};
                      this.deleteUser(onlineParams);
                    }
                  });
                } else if (res.code === ResultCodeEnum.deleteDefaultUser) {
                  this.$message.info(this.language.defaultUserTips);
                } else if (res.code === ResultCodeEnum.deleteInfo) {
                  this.$message.info(res.msg);
                } else if (res.code === ResultCodeEnum.deleteInfoTip) {
                  this.$message.info(res.msg);
                  this.goToFirstPage();
                } else if (res.code === ResultCodeEnum.hasEnable) {  // ????????????????????????
                  this.$message.info(res.msg);
                } else if (res.code === ResultCodeEnum.hasWorkOrder) {  // ?????????????????????
                  this.$message.info(res.msg);
                } else if (res.code === ResultCodeEnum.success) {
                  this.$message.success(this.language.deleteUserSuccess);
                  this.goToFirstPage();
                } else {
                  this.$message.error(res.msg);
                }
              });
            }

          }
        }
      ],
      operation: [
        // ????????????
        {
          text: this.language.viewArea,
          className: 'fiLink-view-area',
          permissionCode: '01-1-9',
          handle: (currentIndex: UserListModel) => {
            this.$userService.queryUserInfoById(currentIndex.id).subscribe((res: ResultModel<UserListModel>) => {
              if (res.code === ResultCodeEnum.userNotExist) {
                // ???????????????
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
                  const data = result.data || [];
                  this.areaNodes = data;
                  this.initAreaSelectorConfig(data);
                  this.queryAreaByDeptId(currentIndex.deptId);
                });
              }
            });
          }
        },
        // ????????????
        {
          text: this.language.resetPassword,
          className: 'fiLink-password-reset',
          key: 'isShowDeleteIcon',
          permissionCode: '01-1-4',
          handle: (data: UserListModel) => {
            this.$userService.queryUserInfoById(data.id).subscribe((res: ResultModel<UserListModel>) => {
              if (res.code === ResultCodeEnum.userNotExist) {
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                this.userId = data.id;
                const params = {userId: this.userId};
                this.$nzModalService.confirm({
                  nzTitle: this.language.resetPasswordTitle,
                  nzContent: this.language.resetPasswordContent + this.defaultPassWord,
                  nzMaskClosable: false,
                  nzOkText: this.language.cancelText,
                  nzCancelText: this.language.okText,
                  nzOkType: 'danger',
                  nzOnOk: () => {
                  },
                  nzOnCancel: () => {
                    this.$userService.restPassword(params).subscribe((result: ResultModel<number>) => {
                      if (result.code === 0) {
                        this.$message.success(this.language.resetSuccessTips);
                      } else {
                        this.$message.error(this.language.resetFailTips);
                      }
                    });
                  }
                });

              }
            });
          }
        },
        // ??????
        {
          text: this.language.update,
          className: 'fiLink-edit',
          key: 'isShowDeleteIcon',
          permissionCode: '01-1-2',
          handle: (currentIndex: UserListModel) => {
            this.$userService.queryUserInfoById(currentIndex.id).subscribe((res: ResultModel<UserListModel>) => {
              if (res.code === ResultCodeEnum.userNotExist) {
                // ???????????????
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                this.openModifyUser(currentIndex.id);
              }
            });
          }
        },
        // ??????
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          key: 'isShowDeleteIcon',
          className: 'fiLink-delete red-icon',
          permissionCode: '01-1-3',
          handle: (currentIndex: UserListModel) => {
            this.$userService.queryUserInfoById(currentIndex.id).subscribe((response: ResultModel<UserListModel>) => {
              if (response.code === ResultCodeEnum.userNotExist) {
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                const userName = currentIndex.userName;
                if (userName && userName === 'admin') {
                  this.$message.info(this.language.defaultUserTips);
                  return;
                } else {
                  const params = {firstArrayParameter: [currentIndex.id]};
                  this.$userService.deleteUser(params).subscribe((res: ResultModel<any>) => {
                    if (res.code === ResultCodeEnum.deleteOnlineUser) {
                      this.$nzModalService.confirm({
                        nzTitle: this.language.deleteOnlineUserTips,
                        nzContent: '',
                        nzMaskClosable: false,
                        nzOkText: this.language.cancelText,
                        nzCancelText: this.language.okText,
                        nzOkType: 'danger',
                        nzOnOk: () => {
                        },
                        nzOnCancel: () => {
                          const onlineParams = {firstArrayParameter: [currentIndex.id], flag: true};
                          this.deleteUser(onlineParams);
                        }
                      });
                    } else if (res.code === ResultCodeEnum.deleteDefaultUser) {
                      this.$message.info(this.language.defaultUserTips);
                    } else if (res.code === ResultCodeEnum.deleteInfo) {
                      this.$message.info(res.msg);
                    } else if (res.code === ResultCodeEnum.deleteInfoTip) {
                      this.$message.info(res.msg);
                      this.goToFirstPage();
                    } else if (res.code === ResultCodeEnum.hasEnable) {  // ????????????????????????
                      this.$message.info(res.msg);
                    } else if (res.code === ResultCodeEnum.hasWorkOrder) {  // ?????????????????????
                      this.$message.info(res.msg);
                    } else if (res.code === ResultCodeEnum.success) {
                      this.$message.success(this.language.deleteUserSuccess);
                      this.goToFirstPage();
                    } else {
                      this.$message.error(res.msg);
                    }
                  });
                }
              }
            });
          }
        }
      ],
      leftBottomButtons: [
        // ????????????????????????
        {
          text: this.language.enable,
          canDisabled: true,
          permissionCode: '01-1-5',
          handle: (data: UserListModel[]) => {
            const ids = [];
            const newArray = data.filter(item => item.userStatus === UserStatusEnum.disable);
            newArray.forEach(item => {
              ids.push(item.id);
            });
            if (ids.length === 0) {
              this.$message.info(this.language.enableTips);
            } else {
              this.updateUserStatus(ids, 1, this.language.userStatusIsEnabledSuccessfully);
            }
          }
        },
        // ????????????????????????
        {
          text: this.language.disable,
          canDisabled: true,
          permissionCode: '01-1-5',
          handle: (data: UserListModel[]) => {
            const ids = [];
            const newArray = data.filter(item => item.userStatus === UserStatusEnum.enable);
            newArray.forEach(item => {
              ids.push(item.id);
            });
            if (ids.length === 0) {
              this.$message.info(this.language.disableTips);
            } else {
              this.updateUserStatus(ids, 0, this.language.userStatusDisabledSuccessfully);
            }
          }
        }
      ],
      rightTopButtons: [
        // ??????
        {
          text: this.language.importUser,
          iconClassName: 'fiLink-import',
          permissionCode: '01-1-6',
          handle: () => {
            const modal = this.$nzModalService.create({
              nzTitle: this.language.selectImport,
              nzContent: this.importTemp,
              nzOkType: 'danger',
              nzClassName: 'custom-create-modal',
              nzFooter: [
                {
                  label: this.language.okText,
                  onClick: () => {
                    this.importUser();
                    modal.destroy();
                  }
                },
                {
                  label: this.language.cancelText,
                  type: 'danger',
                  onClick: () => {
                    this.fileList = [];
                    modal.destroy();
                  }
                },
              ]
            });
          }
        },
        // ????????????
        {
          text: this.language.downloadTemplate,
          iconClassName: 'fiLink-download',
          permissionCode: '01-1-7',
          handle: () => {
            this.downloadExcelFile();
          }
        },
        // ????????????
        {
          text: this.language.flowSearch,
          iconClassName: 'fiLink-search-water',
          permissionCode: '01-1-8',
          handle: (data: UserListModel[]) => {
            const ids = [];
            // const userCode = [];
            data.forEach(item => {
              ids.push(item.id);
              // userCode.push(item.userCode);
            });
            if (ids.length > 0) {
              const modal = this.$nzModalService.create({
                nzTitle: this.language.flowSearch,
                nzContent: this.selectLogTemp,
                nzOkType: 'danger',
                nzClassName: 'custom-create-modal',
                nzFooter: [
                  {
                    label: this.language.okText,
                    onClick: () => {
                      if (this.radioValue === 'operation') {
                        // ?????????????????????
                        this.$router.navigate(['/business/system/log'], {queryParams: {id: ids, name: 'user'}}).then();
                      } else if (this.radioValue === 'security') {
                        // ?????????????????????
                        this.$router.navigate(['/business/system/log/security'], {queryParams: {id: ids, name: 'user'}}).then();
                      }
                      modal.destroy();
                      this.radioValue = '';
                    }
                  },
                  {
                    label: this.language.cancelText,
                    type: 'danger',
                    onClick: () => {
                      modal.destroy();
                      this.radioValue = '';
                    }
                  },
                ]
              });
            } else {
              this.$message.info(this.language.selectedUsersTips);
            }
          }
        }
      ],
      // ????????????
      sort: (event: SortCondition) => {
        const obj = {
          sortProperties: event.sortField,
          sort: event.sortRule
        };
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      // ????????????
      handleSearch: (event:  FilterCondition[]) => {
        const obj: any = {};
        event.forEach(item => {
          if (item.operator === OperatorEnum.gte) {
            obj.lastLoginTime = item.filterValue;
          } else if (item.operator === OperatorEnum.lte) {
            obj.lastLoginTimeEnd = item.filterValue;
          } else if (item.filterField === 'role') {
            obj.roleNameList = item.filterValue;
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        if (event.length === 0) {
          this.selectUnitName = '';
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      // ????????????
      handleExport: (event: ListExportModel<any>) => {
        for (let i = 0; i < event.columnInfoList.length; i++) {
          if (event.columnInfoList[i].propertyName === 'area') {
            event.columnInfoList.splice(i, 1);
            i--;
          }
          if (['userStatus', 'role', 'department', 'lastLoginTime', 'loginType', 'countValidityTime'].includes(event.columnInfoList[i].propertyName)) {
            // ????????????????????????
            event.columnInfoList[i].isTranslation = 1;
          }
        }
        // ????????????
        const body = {
          queryCondition: new QueryConditionModel(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        const obj: any = {};
        // ?????????????????????
        if (event.selectItem.length > 0) {
          body.queryCondition.bizCondition['ids'] = event.selectItem.map(item => item.id);
        } else {
          // ??????????????????
          event.queryTerm.forEach(item => {
            if (item.filterField === 'lastLoginTime') {
              obj.lastLoginTime = item.filterValue;
              obj.lastLoginTimeRelation = item.operator;
            } else if (item.filterField === 'role') {
              obj.roleNameList = item.filterValue;
            } else {
              obj[item.filterField] = item.filterValue;
            }
          });
          body.queryCondition.bizCondition = obj;
        }
        this.exportUser(body);
      }
    };

  }

  /**
   * ????????????
   */
  private deleteUser(onlineParams: {firstArrayParameter: string[], flag: boolean}): void {
    this.$userService.deleteUser(onlineParams).subscribe((result: ResultModel<any>) => {
      if (result.code === 0) {
        this.$message.success(this.language.deleteOnlineUserSuccessTips);
        this.goToFirstPage();
      } else {
        this.$message.error(this.language.deleteOnlineUserFailTips);
      }
    });
  }

  /**
   * ??????????????????????????????
   */
  private updateUserStatus(ids: string[], e: number, msg: string): void {
    this._dataSet.forEach(item => {
      ids.forEach(child => {
        if (child === item.id) {
          item.clicked = true;
        }
      });
    });
    this.$userService.updateUserStatus(e, ids)
      .subscribe((res: ResultModel<number>) => {
        if (res.code === 0) {
          this._dataSet.forEach(item => {
            item.clicked = false;
            ids.forEach(child => {
              if (child === item.id) {
                item.userStatus === UserStatusEnum.enable ? item.userStatus = UserStatusEnum.disable : item.userStatus = UserStatusEnum.enable;
              }
            });
          });
          this.$message.success(`${msg}`);
        } else {
          this._dataSet.forEach(item => item.clicked = false);
          this.$message.error(res.msg);
        }
      });
  }

  /**
   * ???????????????????????????
   */
  private initAreaSelectorConfig(nodes: AreaModel[]): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: this.language.viewArea,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {'Y': 'ps', 'N': 'ps'}
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName',
            children: 'children'
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
   * ????????????id??????????????????
   */
  private queryAreaByDeptId(id: string): void {
    this.$facilityCommonService.queryAreaByDeptId([id]).subscribe((result: ResultModel<AreaModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const areaInfo = result.data;
        const areaIds = [];
        areaInfo.forEach(item => {
          areaIds.push(item.areaId);
        });
        if (areaInfo.length > 0 && areaIds.length > 0) {
          // ?????????????????????????????????
          this.$userUtilService.setDeptAreaNodesStatus(this.areaNodes, areaIds);
          this.areaSelectorConfig.treeNodes = this.areaNodes;
          this.areaSelectVisible = true;
        } else {
          this.$message.info(this.language.areaInfoTips);
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
