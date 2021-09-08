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
 * 用户列表
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent extends MixinUnitSelector implements OnInit {
  // 用户状态模板
  @ViewChild('userStatusTemp') private userStatusTemp: TemplateRef<any>;
  // 单位部门模板
  @ViewChild('departmentTemp') private departmentTemp: TemplateRef<any>;
  // 角色名模板
  @ViewChild('roleTemp') private roleTemp: TemplateRef<any>;
  // 用户模式模板
  @ViewChild('loginTypeTemp') private loginTypeTemp: TemplateRef<any>;
  // 导入
  @ViewChild('importTemp') private importTemp: TemplateRef<any>;
  // 单位部门过滤选择框模板
  @ViewChild('unitNameSearch') private unitNameSearch: TemplateRef<any>;
  // 流水查询弹出框模板
  @ViewChild('selectLogTemp') private selectLogTemp: TemplateRef<any>;
  // 推送方式模板
  @ViewChild('pushTypeTemp') private pushTypeTemp: TemplateRef<HTMLDocument>;
  // 用户列表信息
  public _dataSet = [];
  // 分页数据
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 过滤条件
  private filterObject = {};
  // 流水查询操作日志权限控制
  public operationDis: boolean = true;
  // 流水查询安全日志权限控制
  public securityDis: boolean = true;
  // 用户模块国际化
  public language: UserLanguageInterface;
  // 通用模块国际化
  public commonLanguage: CommonLanguageInterface;
  // 用户id
  private userId: string = '';
  // 删除操作的控制
  private flag: boolean = true;
  // 初始密码
  private defaultPassWord: string;
  // 上传的文件序列
  public fileList: UploadFile[] = [];
  // 区域选择器
  public areaSelectVisible: boolean = false;
  // 区域选择框配置
  public areaSelectorConfig: any = new TreeSelectorConfigModel();
  // 流水查询选择数值
  public radioValue: string;
  // 登录方式枚举
  public loginTypeEnum = LoginTypeEnum;
  // 推送方式枚举
  public pushTypeEnum = PushTypeEnum;
  // 用户状态枚举
  public userStatusEnum = UserStatusEnum;
  // 上传的文件序列
  private fileArray = [];
  // 上传的文件类型
  private fileType: string;
  // 用户密码最小长度
  private accountMinLength: number = 1;
  // 角色下拉框数据
  private roleArray = [];
  // 区域节点数据
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
    // 获取语言模块
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表格配置
    this.initTableConfig();
    // 初始化树配置
    this.initTreeSelectorConfig();
    // 查询所有的区域
    this.queryDeptList();
    // 刷新列表
    this.refreshData();
    // 查询初始密码
    this.queryUserPassWord();
    // 查询安全策略
    this.queryAccountSecurity();
    // 查询所有角色
    this.queryAllRoles();
    // 获取流水查询权限
    this.getLogRole();
  }


  /**
   * 翻页事件
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 上传文件
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
   * 区域选中结果
   */
  public areaSelectChange(event): void {
  }

  /**
   * 获取流水查询权限
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
   * 获取用户列表信息
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
        // 账号有效期
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
        // admin账号和租户管理员账号默认启用状态，不能被禁用操作
        if (item.userCode === UserTypeEnum.admin || item.tenantAdmin) {
          item.isDisabled = true;
        }
      });
    }, () => {
      this.tableConfig.isLoading = false;
    });

  }

  /**
   * 跳转新增用户页面
   */
  private openAddUser(): void {
    this.$router.navigate(['business/user/add-user/add'], {
      queryParams: {minLength: this.accountMinLength}
    }).then();
  }

  /**
   * 跳转修改用户页面
   */
  private openModifyUser(userId: string): void {
    this.$router.navigate(['business/user/modify-user/update'], {
      queryParams: {id: userId}
    }).then();
  }

  /**
   * 用户状态操作
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
        // 如果启禁用失败,当前按钮的loading状态置为false
        this._dataSet.forEach(item => item.clicked = false);
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 查询用户默认密码
   */
  private queryUserPassWord(): void {
    this.$userService.queryPassword().subscribe((res: ResultModel<string>) => {
      this.defaultPassWord = res.data;
    });
  }

  /**
   * 跳第一页
   */
  private goToFirstPage(): void {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }



  /**
   * 导入用户
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
   * 导出用户
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
   * 下载用户模板
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
      // 释放URL地址
      URL.revokeObjectURL(objectUrl);
    });

  }

  /**
   * 查询账号安全策略
   */
  private queryAccountSecurity(): void {
    this.$systemForCommonService.queryAccountSecurity().subscribe((res: ResultModel<AccountSecurityModel>) => {
      this.accountMinLength = res.data.minLength;
    });
  }

  /**
   * 查询角色
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
   * 表格数据
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
        // 选择
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
        // 序号
        {
          type: 'serial-number', width: 60, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        // 账号
        {
          title: this.language.userCode, key: 'userCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '120px'}}
        },
        // 姓名
        {
          title: this.language.userName, key: 'userName', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 昵称
        {
          title: this.language.userNickname, key: 'userNickname', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 用户状态
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
        // 角色
        {
          title: this.language.role, key: 'role', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          renderTemplate: this.roleTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        // 单位/部门
        {
          title: this.language.unit, key: 'department', width: 200, configurable: true,
          searchKey: 'departmentNameList',
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.unitNameSearch},
          type: 'render',
          renderTemplate: this.departmentTemp
        },
        // 手机号
        {
          title: this.language.phoneNumber, key: 'phoneNumber', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 邮箱
        {
          title: this.language.email, key: 'email', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 推送方式
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
        // 地址
        {
          title: this.language.address, key: 'address', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 最后一次登录时间
        {
          title: this.language.lastLoginTime, key: 'lastLoginTime', width: 180, isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        // 最后一次登录IP
        {
          title: this.language.lastLoginIp, key: 'lastLoginIp', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 用户模式
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
        // 最多用户数
        {
          title: this.language.maxUsers, key: 'maxUsers', width: 120, isShowSort: true, configurable: true
        },
        // 账户有效期
        {
          title: this.language.countValidityTime, key: 'countValidityTime', width: 150, configurable: true
        },
        // 备注
        {
          title: this.language.userDesc, key: 'userDesc', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        // 操作
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        // 表格头部新增按钮
        {
          text: this.language.addUser,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '01-1-1',
          handle: () => {
            this.openAddUser();
          }
        },
        // 表格头部删除按钮
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
                } else if (res.code === ResultCodeEnum.hasEnable) {  // 已启用不能被删除
                  this.$message.info(res.msg);
                } else if (res.code === ResultCodeEnum.hasWorkOrder) {  // 有工单的不能删
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
        // 查看区域
        {
          text: this.language.viewArea,
          className: 'fiLink-view-area',
          permissionCode: '01-1-9',
          handle: (currentIndex: UserListModel) => {
            this.$userService.queryUserInfoById(currentIndex.id).subscribe((res: ResultModel<UserListModel>) => {
              if (res.code === ResultCodeEnum.userNotExist) {
                // 判断未存在
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
        // 重置密码
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
        // 编辑
        {
          text: this.language.update,
          className: 'fiLink-edit',
          key: 'isShowDeleteIcon',
          permissionCode: '01-1-2',
          handle: (currentIndex: UserListModel) => {
            this.$userService.queryUserInfoById(currentIndex.id).subscribe((res: ResultModel<UserListModel>) => {
              if (res.code === ResultCodeEnum.userNotExist) {
                // 判断未存在
                this.$message.info(this.language.existTips);
                this.goToFirstPage();
              } else {
                this.openModifyUser(currentIndex.id);
              }
            });
          }
        },
        // 删除
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
                    } else if (res.code === ResultCodeEnum.hasEnable) {  // 已启用不能被删除
                      this.$message.info(res.msg);
                    } else if (res.code === ResultCodeEnum.hasWorkOrder) {  // 有工单的不能删
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
        // 表格左下启用按钮
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
        // 表格左下停用按钮
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
        // 导入
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
        // 下载模板
        {
          text: this.language.downloadTemplate,
          iconClassName: 'fiLink-download',
          permissionCode: '01-1-7',
          handle: () => {
            this.downloadExcelFile();
          }
        },
        // 流水查询
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
                        // 跳转到操作日志
                        this.$router.navigate(['/business/system/log'], {queryParams: {id: ids, name: 'user'}}).then();
                      } else if (this.radioValue === 'security') {
                        // 跳转到安全日志
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
      // 排序事件
      sort: (event: SortCondition) => {
        const obj = {
          sortProperties: event.sortField,
          sort: event.sortRule
        };
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      // 搜索事件
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
      // 导出事件
      handleExport: (event: ListExportModel<any>) => {
        for (let i = 0; i < event.columnInfoList.length; i++) {
          if (event.columnInfoList[i].propertyName === 'area') {
            event.columnInfoList.splice(i, 1);
            i--;
          }
          if (['userStatus', 'role', 'department', 'lastLoginTime', 'loginType', 'countValidityTime'].includes(event.columnInfoList[i].propertyName)) {
            // 后台处理字段标示
            event.columnInfoList[i].isTranslation = 1;
          }
        }
        // 处理参数
        const body = {
          queryCondition: new QueryConditionModel(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        const obj: any = {};
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          body.queryCondition.bizCondition['ids'] = event.selectItem.map(item => item.id);
        } else {
          // 处理查询条件
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
   * 删除用户
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
   * 启用停用更新用户状态
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
   * 初始化选择区域配置
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
   * 根据部门id获取区域详情
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
          // 递归设置区域的选择情况
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
