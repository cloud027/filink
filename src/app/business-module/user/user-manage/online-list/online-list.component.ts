import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {UserService} from '../../share/service/user.service';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {LoginSourceEnum} from '../../share/enum/login-source.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {MixinUnitSelector} from '../../share/minix-component/mixin-selector/mixin-unit-selector';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OnlineUserListModel} from '../../share/model/online-user-list.model';
import {RoleListModel} from '../../../../core-module/model/user/role-list.model';
import {DepartmentListModel} from '../../share/model/department-list.model';
import {InnerTablePageModel} from '../../share/model/inner-table-page.model';

/**
 * 在线用户列表模块
 */
@Component({
  selector: 'app-online-list',
  templateUrl: './online-list.component.html',
  styleUrls: ['./online-list.component.scss']
})
export class OnlineListComponent extends MixinUnitSelector implements OnInit {
  // 登录源模板
  @ViewChild('loginSourceTemp') private loginSourceTemp: TemplateRef<any>;
  // 列表数据
  public _dataSet = [];
  // 列表分页配置
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 在线列表模块国际化
  public language: OnlineLanguageInterface;
  // 通用模块国际化语言
  public commonLanguage: CommonLanguageInterface;
  // 列表部门栏位查询条件配置
  public deptArray: Array<any> = [];
  // 进度条初始进度
  public percentOl: number;
  // 显示加载进度条
  public isShowProgressBar: boolean = false;
  // 进度条计时器
  public timer: any;
  // 页面显示登录源枚举
  public loginSourceEnum: any;
  // 进度条增长百分比
  private increasePercentOl;
  // 列表角色栏位查询条件配置
  private roleArray: Array<any> = [];
  // 查询列表条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // bizCondition条件配置
  private filterObject = {};

  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $userService: UserService,
    public $userForCommonService: UserForCommonService,
    public $message: FiLinkModalService,
    public $dateHelper: DateHelperService,
  ) {
    super($router, $nzI18n, $userService, $userForCommonService, $message, $dateHelper);
  }

  public ngOnInit(): void {
    // 获取语言模块
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.loginSourceEnum = LoginSourceEnum;
    // 初始化页面
    this.initPage();
    // 请求列表数据
    this.refreshData();
  }

  /**
   * 页码变化
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }


  /**
   * 跳第一页
   */
  public goToFirstPage(): void {
    this.queryCondition.pageCondition.pageNum = 1;
    this.refreshData();
  }

  /**
   * 显示加载进度条
   */
  public showProgressBarOl(): void {
    this.percentOl = 0;
    this.increasePercentOl = 50;
    this.isShowProgressBar = true;
    this.timer = setInterval(() => {
      // 计时器开启，进度大于100，清除
      if (this.percentOl >= 100) {
        clearInterval(this.timer);
      } else {
        this.percentOl += this.increasePercentOl;
        // 动态设置
        if (this.percentOl === 50) {
          this.increasePercentOl = 2;
        } else if (this.percentOl === 80) {
          this.increasePercentOl = 1;
        } else if (this.percentOl === 99) {
          this.increasePercentOl = 0;
        }
      }
    }, 500);
  }

  /**
   * 刷新列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$userForCommonService.getOnLineUser(this.queryCondition).subscribe((res: ResultModel<InnerTablePageModel<OnlineUserListModel[]>>) => {
      this.tableConfig.isLoading = false;
      // 隐藏进度条
      this.hideProgressBar();
      this._dataSet = res.data.data;
      this.pageBean.Total = res.data.totalCount;
      this.pageBean.pageIndex = res.data.pageNum;
      this.pageBean.pageSize = res.data.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化列表配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '01-4',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 63},
        {
          // 序号
          type: 'serial-number', width: 63, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '63px'}}
        },
        {
          // 账号
          title: this.language.userCode, key: 'userCode',
          searchable: true, width: 150, isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // 姓名
          title: this.language.userName, key: 'userName',
          configurable: true,
          searchable: true,
          width: 150, isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 昵称
          title: this.language.userNickname, key: 'userNickname',
          configurable: true,
          searchable: true,
          width: 150, isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 角色
          title: this.language.role, key: 'roleName',
          configurable: true,
          searchable: true,
          width: 150, isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 单位/部门
          title: this.language.department,
          key: 'deptName',
          searchable: true,
          width: 200, configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 登录时间
          title: this.language.loginTime, key: 'loginTime',
          configurable: true,
          searchable: true,
          width: 180, isShowSort: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 登录IP
          title: this.language.lastLoginIp, key: 'loginIp', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 登录源
          title: this.language.loginSourse, key: 'loginSource', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.loginSourceTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.language.pcTerminal, value: LoginSourceEnum.pcTerminal},
              {label: this.language.mobileTerminal, value: LoginSourceEnum.mobileTerminal}
            ]
          }
        },
        {
          // 手机号码
          title: this.language.phoneNumber,
          configurable: true,
          key: 'phoneNumber',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 邮箱
          title: this.language.email,
          isShowSort: true,
          width: 150,
          configurable: true,
          searchable: true,
          key: 'email',
          searchConfig: {type: 'input'},
        },
        {
          // 地址
          title: this.language.address, searchable: true,
          configurable: true,
          width: 200,
          key: 'address',
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          // 下线处理
          text: this.language.offline,
          needConfirm: true,
          canDisabled: true,
          confirmContent: this.language.mandatoryOfflineTips,
          permissionCode: '01-4-1',
          handle: (data: OnlineUserListModel[]) => {
            const params = {};
            data.forEach(item => {
              params[item.id] = item.userId;
            });
            this.$userService.offline(params).subscribe((res: ResultModel<any>) => {
              this.getTipMessage(res, true);
            });
          }
        },
        {
          // 刷新
          text: this.language.refresh,
          className: 'fiLink-refresh',
          handle: () => {
            if (this.isShowProgressBar) {
              this.$message.warning(this.language.loadingMsg);
              return;
            } else {
              this.showProgressBarOl();
            }
            this.refreshData();
          }
        }
      ],
      operation: [
        {
          text: this.language.offline,
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: this.language.mandatoryOfflineTips,
          permissionCode: '01-4-1',
          handle: (currentIndex: OnlineUserListModel) => {
            const _params = {};
            _params[currentIndex.id] = currentIndex.userId;
            this.$userService.offline(_params).subscribe((res: ResultModel<any>) => {
              this.getTipMessage(res, true);
            });
          }
        }
      ],
      sort: (event: SortCondition) => {
        const obj = {
          sortProperties: event.sortField,
          sort: event.sortRule
        };
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      handleSearch: (event: any) => {
        const obj: any = {};
        event.forEach(item => {
          if (item.operator === OperatorEnum.gte) {
            obj.loginTime = item.filterValue;
          } else if (item.operator === OperatorEnum.lte) {
            obj.loginTimeEnd = item.filterValue;
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      }
    };
  }
  /**
   * 初始化页面
   */
  private initPage(): void {
    // 查询所有的区域
    this.queryDeptList();
    // 查询所有角色
    this.queryAllRoles();
    // 查询所有部门
    this.queryAllDept();
    // 初始化列表配置
    this.initTableConfig();
    // 初始化树结构配置
    this.initTreeSelectorConfig();
  }

  /**
   * 统一获取message信息
   */
  private getTipMessage(res: ResultModel<any>, bool: boolean = false): void {
    if (res.code === 0) {
      this.$message.success(this.language.offlineSuccess);
      if (bool) {
        this.goToFirstPage();
      }
    } else if (res.code === ResultCodeEnum.notOnLine) {
      this.$message.info(res.msg);
    } else {
      this.$message.error(res.msg);
    }
  }

  /**
   * 查询所有角色
   */
  private queryAllRoles(): void {
    this.$userForCommonService.queryAllRoles().subscribe((res: ResultModel<RoleListModel[]>) => {
      const roleArr = res.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({label: item.roleName, value: item.roleName});
        });
      }
    });
  }

  /**
   * 查询所有部门
   */
  private queryAllDept(): void {
    this.$userService.queryTotalDepartment().subscribe((res: ResultModel<DepartmentListModel[]>) => {
      if (res.data) {
        res.data.forEach(item => {
          this.deptArray.push({label: item.deptName, value: item.deptName});
        });
      }
    });
  }

  /**
   * 隐藏加载进度条
   */
  private hideProgressBar(): void {
    this.percentOl = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }
}
