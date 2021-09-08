import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import {DeptLevel, getDeptLevel} from '../../user.config';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {DateFormatStringEnum} from '../../../../shared-module/enum/date-format-string.enum';
import {UnitLanguageInterface} from '../../../../../assets/i18n/unit/unit-language.interface';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {UserService} from '../../share/service/user.service';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {UserForCommonService} from '../../../../core-module/api-service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DepartmentListModel} from '../../share/model/department-list.model';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';
import {RoleListModel} from '../../../../core-module/model/user/role-list.model';

/**
 * 单位列表
 */
@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit {
  // 单位级别模板
  @ViewChild('deptLevelTemp') private deptLevelTemp: TemplateRef<any>;
  @ViewChild('DeptNameTemp') private DeptNameTemp: TemplateRef<any>;
  // 单位下属人员列表模态框
  @ViewChild('subordinatesTemp') private subordinatesTemp: TemplateRef<any>;
  // 角色名
  @ViewChild('roleTemp') private roleTemp: TemplateRef<any>;
  // 单位树形列表数据
  public _dataSet = [];
  // 单位树形表格配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  private queryCondition = new QueryConditionModel();
  // 下属人员信息
  public staffDataSet = [];
  // 下属人员列表分页
  public staffPageBean: PageModel = new PageModel();
  // 下属人员信息表格配置
  public staffTableConfig: TableConfigModel;
  // 下属人员列表查询条件
  private _queryCondition: QueryConditionModel = new QueryConditionModel();
  // 下属人员列表查询条件
  private userFilterObject = {};
  // 单位模块语言配置
  public language: UnitLanguageInterface;
  // 用户模块语言配置
  public userLanguage: UserLanguageInterface;
  // 单位级别枚举
  public deptLevel;
  // 单位下拉选择展开
  public selectedOption = [];
  // 单位id
  private deptId: string = '';
  // 角色数据
  private roleArray = [];


  constructor(
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $http: HttpClient,
    public $userService: UserService,
    public $userForCommonService: UserForCommonService,
    public $message: FiLinkModalService,
    public $modal: NzModalService,
    private $dateHelper: DateHelperService
  ) {
  }

  public ngOnInit(): void {
    // 语言配置
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.unit);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    // 初始化表格
    this.initTableConfig();
    // 初始化内联表格
    this._initTableConfig();
    // 查询角色
    this.queryAllRoles();
    this.deptLevel = DeptLevel;
    // 刷新列表数据
    this.refreshData();
    // 拼装下拉选择展开单位数据
    this.selectedOption = [
      {label: `${this.language.open}${this.language.config.deptLevelOne}${this.language.unit}`},
      {label: `${this.language.open}${this.language.config.deptLevelTwo}${this.language.unit}`},
      {label: `${this.language.open}${this.language.config.deptLevelThree}${this.language.unit}`},
      {label: `${this.language.open}${this.language.config.deptLevelFour}${this.language.unit}`},
      {label: `${this.language.open}${this.language.config.deptLevelFive}${this.language.unit}`},
    ];
  }

  /**
   * 获取部门列表信息
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$userService.queryAllDept(this.queryCondition).subscribe((res: ResultModel<DepartmentListModel[]>) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data || [];
      this.dataSet(this._dataSet);
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 数据处理
   */
  private dataSet(data: DepartmentListModel[]): void {
    data.forEach(item => {
      item['isShowDeleteIcon'] = !item.defaultDept;
      if (item.childDepartmentList && item.childDepartmentList.length > 0) {
        this.dataSet(item.childDepartmentList);
      }
    });
  }

  /**
   * 获取下属人员信息
   */
  private subordinatesData(body?: any): void {
    this.staffTableConfig.isLoading = true;
    this.$userForCommonService.queryUserLists(body || this._queryCondition).subscribe((res: ResultModel<UserListModel[]>) => {
      this.staffTableConfig.isLoading = false;
      this.staffDataSet = res.data;
      this.staffPageBean.Total = res.totalCount;
      this.staffPageBean.pageIndex = res.pageNum;
      this.staffPageBean.pageSize = res.size;
      this.staffDataSet.forEach(item => {
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
      });
    }, () => {
      this.staffTableConfig.isLoading = false;
    });
  }

  /**
   * 分页查询
   */
  public staffPageChange(event: PageModel): void {
    this._queryCondition.pageCondition.pageNum = event.pageIndex;
    this._queryCondition.pageCondition.pageSize = event.pageSize;
    const queryConditions = new QueryConditionModel();
    queryConditions.bizCondition = {deptId: this.deptId};
    queryConditions.filterConditions = [];
    queryConditions.pageCondition = {
      pageNum: this._queryCondition.pageCondition.pageNum,
      pageSize: this._queryCondition.pageCondition.pageSize
    };
    queryConditions.sortCondition = new SortCondition();
    this.subordinatesData(queryConditions);
  }

  /**
   * 跳转新增用户页面
   */
  private openUnitDetail(): void {
    this.$router.navigate(['business/user/unit-detail/add']).then();
  }

  /**
   * 跳第一页
   */
  private goToFirstPage(): void {
    this.refreshData();
  }

  /**
   * 查询角色
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
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '01-2',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1500px', y: '340px'},
      noIndex: true,
      notShowPrint: true,
      searchReturnType: 'object',
      columnConfig: [
        {
          type: 'expend', width: 30, expendDataKey: 'childDepartmentList', levelKey: 'deptLevel',
        },
        {
          type: 'select', width: 62,
        },
        {
          key: 'serialNumber', width: 62, title: this.language.serialNumber,
        },
        {
          title: this.language.deptName, key: 'deptName', width: 124, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.parentDepartmentName, key: 'parentDepartmentName', width: 124, isShowSort: true,
          configurable: true,
          renderTemplate: this.DeptNameTemp
        },
        {
          title: this.language.deptLevel, key: 'deptLevel', width: 100,
          configurable: true,
          type: 'render',
          searchable: true,
          searchConfig: {
            type: 'select', selectInfo: getDeptLevel(this.$nzI18n), label: 'label', value: 'code',
            notAllowClear: true, initialValue: DeptLevel.deptLevelOne
          },
          renderTemplate: this.deptLevelTemp
        },
        {
          title: this.language.deptChargeUser, key: 'deptChargeUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.deptPhoneNum, key: 'deptPhoneNum', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.address, key: 'address', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: this.language.addUnit,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '01-2-1',
          handle: () => {
            this.openUnitDetail();
          }
        },
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '01-2-3',
          handle: (currentIndex: DepartmentListModel[]) => {
            const ids = currentIndex.map(item => item.id);
            const params = {firstArrayParameter: ids};
            this.$userService.deleteDept(params).subscribe((res: ResultModel<any>) => {
              if (res.code === ResultCodeEnum.success) {
                this.$message.success(this.language.deleteUnitSuccess);
                this.goToFirstPage();
              } else if (res.code === ResultCodeEnum.fail) {
                this.$message.error(res.msg);
              } else {
                this.$message.info(res.msg);
              }
            });
          }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      operation: [
        // 下属人员
        {
          text: this.language.staff,
          className: 'fiLink-subordinates',
          permissionCode: '01-2-4',
          handle: (currentIndex: DepartmentListModel) => {
            this._initTableConfig();
            this.deptId = currentIndex.id;
            this.$userService.queryDeptInfoById(currentIndex.id).subscribe((res: ResultModel<DepartmentListModel>) => {
              if (res.code === ResultCodeEnum.success) {
                const modal = this.$modal.create({
                  nzTitle: this.language.staff,
                  nzContent: this.subordinatesTemp,
                  nzOkText: this.language.cancelText,
                  nzCancelText: this.language.okText,
                  nzOkType: 'danger',
                  nzClassName: 'custom-create-modal',
                  nzWidth: '1000',
                  nzFooter: [
                    {
                      label: this.language.okText,
                      show: false,
                      onClick: () => {
                        modal.destroy();
                      }
                    },
                    {
                      label: this.language.cancelText,
                      show: false,
                      type: 'danger',
                      onClick: () => {
                        modal.destroy();
                      }
                    },
                  ]
                });
                const queryConditions = new QueryConditionModel();
                queryConditions.bizCondition = {
                  deptId: currentIndex.id   // 单位id
                };
                queryConditions.filterConditions = [];
                queryConditions.pageCondition = {
                  pageNum: this._queryCondition.pageCondition.pageNum,
                  pageSize: this._queryCondition.pageCondition.pageSize
                };
                queryConditions.sortCondition = new SortCondition();
                this.subordinatesData(queryConditions);
              } else if (res.code === ResultCodeEnum.roleOrDeptNotExist) {
                // 不存在提示
                this.$message.info(this.language.deptExistTips);
                this.goToFirstPage();
              }
            });
          }
        },
        {
          text: this.language.update,
          className: 'fiLink-edit',
          key: 'isShowDeleteIcon',
          permissionCode: '01-2-2',
          handle: (currentIndex: DepartmentListModel) => {
            this.$userService.queryDeptInfoById(currentIndex.id).subscribe((res: ResultModel<DepartmentListModel>) => {
              if (res.code === ResultCodeEnum.success) {
                this.navigateToDetail('business/user/unit-detail/update', {queryParams: {id: currentIndex.id}});
              } else if (res.code === ResultCodeEnum.roleOrDeptNotExist) {
                this.$message.info(this.language.deptExistTips);
                this.goToFirstPage();
              }
            });

          }
        },
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          permissionCode: '01-2-3',
          handle: (currentIndex: DepartmentListModel) => {
            const params = {firstArrayParameter: [currentIndex.id]};
            this.$userService.queryDeptInfoById(currentIndex.id).subscribe((res: ResultModel<DepartmentListModel>) => {
              if (res.code === ResultCodeEnum.success) {
                this.$userService.deleteDept(params).subscribe((result: ResultModel<string>) => {
                  if (result.code === ResultCodeEnum.success) {
                    this.$message.success(this.language.deleteUnitSuccess);
                    this.goToFirstPage();
                  } else if (result.code === ResultCodeEnum.fail) {
                    this.$message.error(result.msg);
                  } else {
                    this.$message.info(result.msg);
                  }
                });
              } else if (res.code === ResultCodeEnum.roleOrDeptNotExist) {
                this.$message.info(this.language.deptExistTips);
                this.goToFirstPage();
              }
            });
          }
        },

      ],
      handleSearch: (event:  FilterCondition[]) => {
        this.queryCondition.bizCondition = event;
        this.refreshData();
      }
    };

  }

  /**
   * 初始化单位下属人员列表配置
   */
  private _initTableConfig(): void {
    // 单位下属人员列表配置
    this.staffTableConfig = {
      primaryKey: '01-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1500px', y: '340px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.userLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: this.userLanguage.userCode, key: 'userCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: this.userLanguage.userName, key: 'userName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.userLanguage.userNickname, key: 'userNickname', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.userLanguage.address, key: 'address', width: 150, configurable: true, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.userLanguage.email, key: 'email', width: 150, configurable: true, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.userLanguage.role, key: 'role', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          type: 'render',
          renderTemplate: this.roleTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        {
          title: this.userLanguage.lastLoginTime, key: 'lastLoginTime', width: 280, isShowSort: true,
          searchable: true, pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          title: this.userLanguage.lastLoginIp, key: 'lastLoginIp', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.userLanguage.maxUsers, key: 'maxUsers', width: 150, configurable: true, isShowSort: true,
        },
        {
          title: this.userLanguage.countValidityTime, key: 'countValidityTime', width: 150, configurable: true,
        },
        {
          title: this.userLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      sort: (event: SortCondition) => {
        const obj = {
          sortProperties: event.sortField,
          sort: event.sortRule
        };
        let queryConditions_ = new QueryConditionModel();
        queryConditions_.bizCondition = obj;
        queryConditions_.filterConditions = [];
        queryConditions_.pageCondition = {
          pageNum: this._queryCondition.pageCondition.pageNum,
          pageSize: this._queryCondition.pageCondition.pageSize
        };
        queryConditions_.sortCondition = new SortCondition();
        queryConditions_.bizCondition['deptId'] = this.deptId;
        queryConditions_ = Object.assign(this.userFilterObject, queryConditions_);
        this.subordinatesData(queryConditions_);
      },
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
        let queryConditions = new QueryConditionModel();
        queryConditions.bizCondition = obj;
        queryConditions.filterConditions = [];
        queryConditions.pageCondition = {
          pageNum: this._queryCondition.pageCondition.pageNum,
          pageSize: this._queryCondition.pageCondition.pageSize
        };
        queryConditions.sortCondition = new SortCondition();
        queryConditions.bizCondition['deptId'] = this.deptId;
        this._queryCondition.pageCondition.pageNum = 1;
        this.userFilterObject = queryConditions;
        queryConditions = Object.assign(this.userFilterObject, queryConditions);
        this.subordinatesData(queryConditions);

      }
    };
  }

  /**
   * 跳转到详情
   *
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }
}

