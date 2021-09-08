import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {UserListModel} from '../../../../../core-module/model/user/user-list.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {ScheduleLanguageInterface} from '../../../../../../assets/i18n/schedule/schedule.language.interface';
import {UserLanguageInterface} from '../../../../../../assets/i18n/user/user-language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {UserForCommonService} from '../../../../../core-module/api-service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {RoleListModel} from '../../../../../core-module/model/user/role-list.model';
import {LoginTypeEnum, UserStatusEnum} from '../../../../../shared-module/enum/user.enum';
import {DateFormatStringEnum} from '../../../../../shared-module/enum/date-format-string.enum';
import {ListUnitSelector} from '../../../../../shared-module/component/business-component/list-unit-selector/list-unit-selector';
import {ScheduleApiService} from '../../../share/service/schedule-api.service';

/**
 * 用户选择器
 */
@Component({
  selector: 'app-user-list-selector',
  templateUrl: './user-list-selector.component.html',
  styleUrls: ['./user-list-selector.component.scss']
})
export class UserListSelectorComponent extends ListUnitSelector implements OnInit {
  // 弹窗是否显示
  @Input() public userVisible: boolean = false;
  // 第一步基础信息数据
  @Input() public stepsFirstParams;
  // 选中用户的id
  @Input() public selectedUserId: string;
  // 当前所选的单位code
  @Input() public currentDeptCode: string;
  // 编辑时当前关联的用户id
  @Input() public currentUserId: string = '';
  // 显示隐藏变化
  @Output() public userVisibleChange = new EventEmitter<boolean>();
  // 选中的值变化
  @Output() public selectUserDataChange = new EventEmitter<UserListModel[]>();
  // 用户状态模板
  @ViewChild('userStatusTemp') private userStatusTemp: TemplateRef<any>;
  // 责任单位选择模板
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // 用户单选框模板
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // 角色名模板
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // 用户模式模板
  @ViewChild('loginTypeTemp') private loginTypeTemp: TemplateRef<any>;
  // 用户列表数据源
  public userDataSet: UserListModel[] = [];
  // 用户列表分页
  public pageBean: PageModel = new PageModel();
  // 用户列表表格配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 用户列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 国际化
  public scheduleLanguage: ScheduleLanguageInterface;
  // 用户国际化
  public userLanguage: UserLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 已选的用户数据
  public selectUserData: UserListModel[] = [];
  // 用户模式枚举
  public loginTypeEnum = LoginTypeEnum;
  // 用户状态枚举
  public userStatusEnum = UserStatusEnum;
  // 角色下拉框数据
  private roleArray = [];
  // 当前关联用户的停用、启用状态
  private currentUserStatus: string = UserStatusEnum.enable;
  // 过滤条件
  private filterObject = {};

  constructor(public $nzI18n: NzI18nService,
              public $userForCommonService: UserForCommonService,
              public $scheduleApiService: ScheduleApiService,
              public $message: FiLinkModalService,
              public $dateHelper: DateHelperService) {
    super($userForCommonService, $nzI18n, $message);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.scheduleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.schedule);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.initTableConfig();
    this.queryAllRoles();
    this.queryUserList();
    this.initTreeSelectorConfig();
  }

  /**
   * 用户列表翻页操作
   */
  public userPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryUserList();
  }

  /**
   * 确认按钮
   */
  public handleOk(): void {
    this.selectUserDataChange.emit(this.selectUserData);
  }

  /**
   * 单选框变化
   */
  public onRadioChange(event: string, data: UserListModel): void {
    this.selectedUserId = event;
    this.selectUserData = [data];
  }
  /**
   * 获取用户列表信息
   */
  public queryUserList(): void {
    this.tableConfig.isLoading = true;
    let deptCode;
    if (this.stepsFirstParams) {
      deptCode = this.stepsFirstParams.deptCode;
    } else {
      deptCode = this.currentDeptCode;
    }
    const id = this.currentUserId ? this.currentUserId : this.selectedUserId;
    this.queryCondition.bizCondition.deptCode = deptCode;
    // 如果是新增、编辑选择用户非搜索时，筛选条件只需要部门、启用、传当前所选的用户id
    if (!this.queryCondition.bizCondition.userStatus) {
      this.queryCondition.bizCondition.userStatus = UserStatusEnum.enable;
      this.queryCondition.bizCondition.id = id;
    }
    // 搜索停用的用户时，若关联的用户状态是停用，则需要传它的id来查询
    if (this.currentUserStatus === this.queryCondition.bizCondition.userStatus && this.queryCondition.bizCondition.userStatus) {
      this.queryCondition.bizCondition.id = id;
    }
    this.$scheduleApiService.queryUserByFieldForPerson(this.queryCondition).subscribe((res: ResultModel<UserListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.userDataSet = res.data || [];
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.userDataSet.forEach(item => {
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
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1400px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        {
          // 序号
          type: 'serial-number', width: 62, title: this.userLanguage.serialNumber,
        },
        {
          // 账号
          title: this.userLanguage.userCode, key: 'userCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 姓名
          title: this.userLanguage.userName, key: 'userName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 用户状态
        {
          title: this.userLanguage.userStatus, key: 'userStatus', width: 120, isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.userStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.userLanguage.enable, value: UserStatusEnum.enable},
              {label: this.userLanguage.disable, value: UserStatusEnum.disable}
            ]
          }
        },
        // 角色
        {
          title: this.userLanguage.role, key: 'role', width: 150, isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.roleTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        // 单位
        {
          title: this.scheduleLanguage.unit, key: 'department', isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.unitNameSearch,
          width: 200,
          searchConfig: {type: 'input'}
        },
        // 用户模式
        {
          title: this.userLanguage.loginType, key: 'loginType', width: 120, isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.loginTypeTemp,
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.userLanguage.singleUser, value: LoginTypeEnum.singleUser},
              {label: this.userLanguage.multiUser, value: LoginTypeEnum.multiUser}
            ]
          }
        },
        {
          // 最多用户数
          title: this.userLanguage.maxUsers, key: 'maxUsers', width: 120, isShowSort: true
        },
        // 账户有效期
        {
          title: this.userLanguage.countValidityTime, key: 'countValidityTime',
          width: 150,
          isShowSort: true,
        },
        {
          // 备注
          title: this.userLanguage.userDesc, key: 'userDesc', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.userLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
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
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.queryUserList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        // 搜索时，获取当前选择关联的用户状态
        const status = this.userDataSet.find(item => item.id === this.selectedUserId);
        if (status) {
          this.currentUserStatus = status.userStatus;
        }
        const obj: any = {};
        event.forEach(item => {
          if (item.filterField === 'role') {
            obj.roleNameList = item.filterValue;
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        // 返回第一页
        this.queryCondition.pageCondition.pageNum = 1;
        this.filterObject = obj;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.queryUserList();
      }
    };
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
}
