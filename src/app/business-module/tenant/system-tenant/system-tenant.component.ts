import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../shared-module/model/page.model';
import {Operation, TableConfigModel} from '../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {TenantLanguageInterface} from '../../../../assets/i18n/tenant/tenant.language.interface';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {Router} from '@angular/router';
import {TableComponent} from '../../../shared-module/component/table/table.component';
import {TenantApiService} from '../share/sevice/tenant-api.service';
import {Result} from '../../../shared-module/entity/result';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {UserForCommonService} from '../../../core-module/api-service/user';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {LoginTypeEnum, PushTypeEnum, UserStatusEnum} from '../../../shared-module/enum/user.enum';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {DepartmentUnitModel} from '../../../core-module/model/work-order/department-unit.model';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';
import {RoleListModel} from '../../../core-module/model/user/role-list.model';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {FilterValueModel} from '../../../core-module/model/work-order/filter-value.model';
import {TenantModel} from '../share/model/tenant.model';
import {DateFormatStringEnum} from '../../../shared-module/enum/date-format-string.enum';
import {UserListModel} from '../../../core-module/model/user/user-list.model';


@Component({
  selector: 'app-system-tenant',
  templateUrl: './system-tenant.component.html',
  styleUrls: ['./system-tenant.component.scss']
})
export class SystemTenantComponent implements OnInit {

  // 表格组件
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 租户状态
  @ViewChild('TenantStatusTemp') TenantStatusTemp: TemplateRef<any>;
  // 用户状态
  @ViewChild('userStatusTemp') userStatusTemp: TemplateRef<any>;
  // 角色名模板
  @ViewChild('roleTemp') private roleTemp: TemplateRef<any>;
  // 单位部门过滤选择框模板
  @ViewChild('unitNameSearch') private unitNameSearch: TemplateRef<any>;
  // 单位部门模板
  @ViewChild('departmentTemp') private departmentTemp: TemplateRef<any>;
  // 推送方式模板
  @ViewChild('pushTypeTemp') private pushTypeTemp: TemplateRef<HTMLDocument>;
  // 用户模式模板
  @ViewChild('loginTypeTemp') private loginTypeTemp: TemplateRef<any>;
  // 国际化
  public language: TenantLanguageInterface;
  // 通用模块国际化
  public commonLanguage: CommonLanguageInterface;
  // 设施模块国际化语言
  public areaLanguage: FacilityLanguageInterface;
  // 租户列表数据
  public dataSet = [];
  // 用户列表数据
  public usersDataSet = [];
  // 租户列表分页
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 用户列表分页
  public usersPageBean: PageModel = new PageModel(10, 1, 1);
  // 租户列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 用户列表查询参数
  public usersQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 租户列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 用户列表配置
  public usersTableConfig: TableConfigModel;
  // 初始密码
  public defaultPassWord: string = '123456';
  // 租户下用户列表责任单位弹窗显示开关
  public isVisible: boolean = false;
  // 租户下用户列表弹窗显示开关
  public userListVisible: boolean = false;
  // 用户列表过滤条件
  private filterObject = {};
  // 租户ID
  public tenantID: string = '';
  // 角色下拉框数据
  public roleArray = [];
  // 推送方式模板
  public pushTypeEnum = PushTypeEnum;
  // 用户模式模板
  public loginTypeEnum = LoginTypeEnum;
  // 责任单位下拉树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 单位过滤
  public filterValue: FilterValueModel;
  // 责任单位下拉树
  public treeNodes: DepartmentUnitModel[] = [];
  // 选择的单位名称
  public selectUnitName: string;
  // 用户状态枚举
  public userStatusEnum = UserStatusEnum;
  // 树节点配置
  public treeSetting = {};
  // 删除弹框提示次数
  public deleteIndex: number = 0;


  constructor(
    public $tenantApiService: TenantApiService,
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $nzModalService: NzModalService,
    public $message: FiLinkModalService,
    public $userForCommonService: UserForCommonService,
    public $dateHelper: DateHelperService,
    public modalService: NzModalService,
  ) {
  }


  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.areaLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 加载租户列表配置
    this.tenantInitTableConfig();
    // 刷新租户列表数据
    this.tenantRefreshData();
    // 加载用户列表配置
    this.userInitTableConfig();
    // 初始化树配置
    this.initTreeSelectorConfig();
  }


  /**
   * 租户列表数据刷新
   */
  public tenantRefreshData(): void {
    this.tableConfig.isLoading = true;
    this.$tenantApiService.queryTenantList(this.queryCondition).subscribe((res: ResultModel<TenantModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.dataSet = res.data;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 用户列表数据刷新
   */
  public userRefreshData(): void {
    this.usersTableConfig.isLoading = true;
    this.usersQueryCondition.bizCondition.tenantId = this.tenantID;
    this.$tenantApiService.queryUserListByTenantId(this.usersQueryCondition).subscribe((res: ResultModel<UserListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.usersTableConfig.isLoading = false;
        this.usersDataSet = res.data;
        this.usersPageBean.Total = res.totalCount;
        this.usersPageBean.pageIndex = res.pageNum;
        this.usersPageBean.pageSize = res.size;
        this.usersDataSet.forEach(item => {
          // 账号有效期处理
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
        });
      }
    }, () => {
      this.usersTableConfig.isLoading = false;
    });
  }


  /**
   * 租户列表配置
   */
  private tenantInitTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      notShowPrint: false,
      primaryKey: '16-1',
      scroll: {x: '1600px', y: '340px'},
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        { // 选择
          type: 'select',
          width: 62,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 租户名称
          title: this.language.tenantName, key: 'tenantName', width: 150,
          isShowSort: true,
          configurable: false,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // 状态
          title: this.language.tenantStatus, key: 'status', width: 120, isShowSort: true,
          searchable: true,
          configurable: true,
          type: 'render',
          minWidth: 80,
          renderTemplate: this.TenantStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.disable, value: '0'},
              {label: this.language.enable, value: '1'}
            ]
          }
        },
        { // 电话
          title: this.language.phoneNumber, key: 'phoneNumber', width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 邮箱
          title: this.language.email, key: 'email', width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 通讯地址
          title: this.language.address, key: 'address', width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remark, key: 'remark', width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 操作
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      topButtons: [
        { // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          handle: () => {
            this.$router.navigate(['/business/tenant/system-tenant/add'], {
              queryParams: {type: 'add'}
            }).then();
          }
        },
        { // 批量删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          canDisabled: true,
          needConfirm: false,
          confirmContent: this.language.deleteMsg,
          handle: (event) => {
            const ids = event.map(item => item.id);
            if (ids) {
              // 重置提示次数
              this.deleteIndex = 0;
              // 弹窗确认
              this.deleteModel(ids);
            }
          }
        },
      ],
      operation: [
        { // 编辑
          text: this.language.update, className: 'fiLink-edit', handle: (data) => {
            this.$router.navigate(['business/tenant/system-tenant/update'], {
              queryParams: {id: data.id, type: 'update'}
            }).then();
          },
        },
        { // 前台配置
          text: this.language.receptionConfig, className: 'fiLink-peizhi', handle: (data) => {
            this.$router.navigate(['business/tenant/reception-config'], {
              queryParams: {id: data.id, roleId: data.roleId}
            }).then();
          },
        },
        { // 用户列表
          text: this.language.userList, className: 'fiLink-filink-yonghu-icon', handle: (data) => {
            // 加载用户列表配置
            this.userInitTableConfig();
            // 打开弹窗
            this.userListVisible = true;
            // 租户下用户列表查询条件
            this.tenantID = data.id;
            // 刷新用户列表数据
            this.userRefreshData();
            // 查询所有角色
            this.queryAllRoles();
            // 查询所有的区域
            this.queryDeptList();
          },
        },
        { // 管理员配置
          text: this.language.adminConfig, className: 'fiLink-filink-guanliyuan-icon', handle: (data) => {
            const body = {
              id: data.id
            };
            this.$tenantApiService.queryAdminById(body).subscribe((result: ResultModel<any>) => {
              if (result.code === ResultCodeEnum.success) {
                if (result.data.id !== null) {
                  this.$router.navigate(['business/tenant/tenant-admin-config/update'], {
                    queryParams: {id: data.id, type: 'update'}
                  }).then();
                } else {
                  this.modalService.warning({
                    nzTitle: this.language.addAdminMsg,
                    nzOkText: this.commonLanguage.cancel,
                    nzOkType: 'danger',
                    nzCancelText: this.commonLanguage.confirm,
                    nzMaskClosable: false,
                    nzOnCancel: () => {
                      this.$router.navigate(['business/tenant/tenant-admin-config/add'], {
                        queryParams: {id: data.id, type: 'add'}
                      }).then();
                    },
                    nzOnOk: () => {

                    }
                  });
                }
              } else {
                this.$message.error(result.msg);
              }
            });
          },
        },
        { // 重置密码
          text: this.language.resetPassword,
          className: 'fiLink-password-reset',
          handle: (data) => {
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
                const body = {
                  id: data.id
                };
                this.$tenantApiService.resetAdminPWD(body).subscribe((result: ResultModel<any>) => {
                  if (result.code === ResultCodeEnum.success) {
                    this.$message.success(this.language.resetSuccessTips);
                  } else {
                    this.$message.error(result.msg);
                  }
                });
              }
            });
          },
        },
        { // 删除
          text: this.language.delete,
          className: 'fiLink-delete red-icon',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: false,
          canDisabled: false,
          confirmContent: this.language.deleteMsg,
          handle: (event) => {
            const ids = event.id;
            // 重置提示次数
            this.deleteIndex = 0;
            if (ids) {
              // 弹窗确认
              this.deleteModel([ids]);
            }
          }
        },
      ],
      moreButtons: this.initLeftBottomButton(),
      handleExport: (event) => {
        // 处理参数
        const body = {
          queryCondition: this.queryCondition,
          columnInfoList: event.columnInfoList,
          excelType: event.excelType
        };
        if (event.selectItem.length > 0) {
          event.queryTerm['id'] = event.selectItem.map(item => item.id);
          body.queryCondition.filterConditions.push(
            new FilterCondition('idArray', OperatorEnum.in, event.queryTerm['id'])
          );
        }
        // 导出接口
        this.$tenantApiService.exportTenantProcess(body).subscribe((res: Result) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.exportSuccess);
          } else {
            this.$message.error(this.language.exportFailed);
          }
        });
      },
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.tenantRefreshData();
      },
      // 筛选
      handleSearch: (event: FilterCondition[]) => {
        event.forEach(item => {
          if (item.filterField === 'phoneNumber') {
            item.operator = 'like';
          }
          if (item.filterField === 'email') {
            item.operator = 'like';
          }
        });
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.tenantRefreshData();
      }
    };
  }


  /**
   * 用户列表配置
   */
  public userInitTableConfig(): void {
    this.usersTableConfig = {
      primaryKey: '01-1',
      isDraggable: true,
      showSearchSwitch: true,
      isLoading: false,
      showSizeChanger: true,
      notShowPrint: true,
      noIndex: true,
      closeCacheQueryConditions: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        // 序号
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        // 账号
        {
          title: this.language.userCode, key: 'userCode', width: 180, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '63px'}}
        },
        // 姓名
        {
          title: this.language.userName, key: 'userName', width: 150, isShowSort: true,
          searchable: true, configurable: false,
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
          title: this.language.userStatus, key: 'userStatus', width: 120, isShowSort: true,
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
          searchConfig: {type: 'input'},
        },
        { // 操作
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      // 排序事件
      sort: (event: SortCondition) => {
        const obj = {
          sortProperties: event.sortField,
          sort: event.sortRule
        };
        this.usersQueryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.userRefreshData();
      },
      // 搜索事件
      handleSearch: (event: FilterCondition[]) => {
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
        this.usersQueryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.usersQueryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.userRefreshData();
      },
    };
  }


  /**
   * 租户列表分页
   */
  public tenantPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.tenantRefreshData();
  }


  /**
   * 用户列表分页显
   */
  public usersPageChange(event: PageModel): void {
    this.usersQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.usersQueryCondition.pageCondition.pageSize = event.pageSize;
    this.userRefreshData();
  }


  /**
   * 租户列表更多操作
   */
  private initLeftBottomButton(): Operation[] {
    const leftBottomButtonsTemp = [
      // 启用
      {
        canDisabled: true,
        className: 'small-button',
        iconClassName: 'fiLink-filink-qiyongi-icon',
        needConfirm: true,
        confirmContent: this.language.enableMsg,
        text: this.language.enable,
        handle: (event) => {
          const ids = event.map(item => item.id);
          if (ids.length) {
            this.clickBatchSwitch(ids, '1', '1');
          } else {
            this.$message.warning('请先勾选数据！');
          }
        }
      },
      // 禁用
      {
        canDisabled: true,
        className: 'small-button',
        iconClassName: 'fiLink-filink-jinyong-icon',
        needConfirm: true,
        confirmContent: this.language.disableMsg,
        text: this.language.disable,
        handle: (event) => {
          const ids = event.map(item => item.id);
          if (ids.length) {
            this.clickBatchSwitch(ids, '0', '1');
          } else {
            this.$message.warning('请先勾选数据！');
          }
        }
      },
      // 全部启用
      {
        canDisabled: false,
        className: 'small-button',
        iconClassName: 'fiLink-filink-qiyongi-icon',
        needConfirm: true,
        confirmContent: this.language.enableAllMsg,
        text: this.language.enableAll,
        handle: (event) => {
          const ids = [];
          this.clickBatchSwitch(ids, '1', '0');
        }
      },
      // 全部禁用
      {
        canDisabled: false,
        className: 'small-button',
        iconClassName: 'fiLink-filink-jinyong-icon',
        needConfirm: true,
        confirmContent: this.language.disableAllMsg,
        text: this.language.disableAll,
        handle: (event) => {
          const ids = [];
          this.clickBatchSwitch(ids, '0', '0');
        }
      },
    ];
    return leftBottomButtonsTemp;
  }


  /**
   * 租户状态操作
   */
  clickSwitch(data) {
    let statusValue;
    this.dataSet.forEach(item => {
      if (item.id === data.id) {
        item.clicked = true;
      }
    });
    data.status === '1' ? statusValue = '0' : statusValue = '1';
    const body = {
      ids: [data.id],
      status: statusValue,
      isAll: '1'
    };
    this.$tenantApiService.updateTenantStatus(body).subscribe((res: Result) => {
      if (res.code === ResultCodeEnum.success) {
        this.dataSet.forEach(item => {
          item.clicked = false;
          if (item.id === data.id) {
            item.status === '1' ? item.status = '0' : item.status = '1';
          }
        });
      } else {
        this.$message.error(res.msg);
      }
    });
  }


  /**
   * 租户状态批量操作
   */
  clickBatchSwitch(data, status, isAll) {
    const body = {
      ids: data,
      status: status,
      isAll: isAll
    };
    this.$tenantApiService.updateTenantStatus(body).subscribe((res: Result) => {
      if (res.code === ResultCodeEnum.success) {
        this.queryCondition.pageCondition.pageNum = 1;
        this.tenantRefreshData();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 隐藏用户列表弹框
   */
  public closeModal(): void {
    this.tableComponent = null;
    this.filterValue = null;
    this.userListVisible = false;
    this.isVisible = false;
    this.roleArray = [];
    this.selectUnitName = '';
    this.usersTableConfig.showSearch = false;
    this.usersQueryCondition = new QueryConditionModel();
  }

  /**
   * 删除弹窗提示判断
   */
  public deleteModel(ids) {
    // 提示次数
    this.deleteIndex++;
    // 标题
    let title = '';
    // 内容
    let text = '';

    if (this.deleteIndex === 1) {
      title = this.language.deleteTitleFirst;
      text = this.language.deleteTextFirst;
    } else if (this.deleteIndex === 2) {
      title = this.language.deleteTitleSecond;
      text = this.language.deleteTextSecond;
    } else {
      title = this.language.deleteTitleThird;
      text = this.language.deleteTextThird;
    }

    // 弹窗
    this.modalService.warning({
      nzTitle: title,
      nzContent: text,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzCancelText: this.commonLanguage.confirm,
      nzMaskClosable: false,
      nzOnCancel: () => {
        if (this.deleteIndex === 3) {
          this.delTemplate(ids);
        } else {
          this.deleteModel(ids);
        }
      },
      nzOnOk: () => {

      }
    });
  }


  /**
   * 租户列表删除模板
   * param ids
   */
  private delTemplate(ids: string[]): void {
    const body = {
      ids: ids
    };
    this.$tenantApiService.deleteTenant(body).subscribe((result: Result) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.successDeleteTenant);
        this.queryCondition.pageCondition.pageNum = 1;
        this.tenantRefreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 查询角色
   */
  private queryAllRoles(): void {
    this.$tenantApiService.queryRoleByTenantId(this.tenantID).subscribe((res: ResultModel<RoleListModel[]>) => {
      const roleArr = res.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({'label': item.roleName, 'value': item.roleName});
        });
      }

    });
  }

  /**
   * 查询所有的部门
   */
  public queryDeptList(): void {
    this.$tenantApiService.deptListByTenantId(this.tenantID).subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
      this.treeNodes = result.data || [];
    });
  }


  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterCondition): void {
    if (!this.selectUnitName) {
      FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, []);
    }
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    let selectArr = [];
    let selectNameArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
      selectNameArr = event.map(item => {
        return item.deptName;
      });
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue.filterValue = null;
    } else {
      this.filterValue.filterValue = selectNameArr;
    }
  }

  /**
   * 初始化单位选择器配置
   */
  public initTreeSelectorConfig(): void {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
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
    };
    this.treeSelectorConfig = {
      title: `${this.areaLanguage.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.areaLanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.areaLanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.areaLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }


}
