import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {UserLanguageInterface} from '../../../../../../assets/i18n/user/user-language.interface';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {UserForCommonService} from '../../../../../core-module/api-service';
import {AlarmNotifierRequestModel} from '../../../../../core-module/model/alarm/alarm-notifier-request.model';
import {UserListModel} from '../../../../../core-module/model/user/user-list.model';
import {PageModel} from '../../../../model/page.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../model/query-condition.model';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../model/alarm-selector-config.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../enum/alarm-selector-config-type.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';

/**
 * 通知人组件
 */
@Component({
  selector: 'xc-app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../alarm-name/alarm-name.component.scss']
})
export class UserComponent implements OnInit {
  /** 表格过滤条件输入框中使用时，传入的过滤条件*/
  @Input() filterValue: FilterCondition;
  /** 父组件传入的通知人配置项*/
  @Input() set alarmUserConfig(alarmUserConfig: AlarmSelectorConfigModel) {
    if (alarmUserConfig) {
      this.initTableConfigUser();
      this.alarmUserConfigBackups = alarmUserConfig;
      this.handleInputConfigData();
    }
  }
  /** 用户列表数据*/
  public userListData: UserListModel[] = [];
  /** 勾选的通知人*/
  public checkAlarmNotifier: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  /** 勾选的通知人数据备份*/
  public checkAlarmNotifierBackups: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  /** 是否展示通知人弹框*/
  public isVisibleUserTable: boolean = false;
  /** 控制展示通知人弹框的按钮是否可点击*/
  public isDisabled: boolean = false;
  /** 通知人列表表格分页信息*/
  public pageBeanUser: PageModel = new PageModel();
  /** 通知人表格配置项*/
  public tableConfigUser: TableConfigModel;
  /** 告警国际化*/
  public language: AlarmLanguageInterface;
  /** 用户国际化*/
  public userLanguage: UserLanguageInterface;
  /** 公共国际化*/
  public commonLanguage: CommonLanguageInterface;
  /** 父组件传入的通知人配置项备份*/
  public alarmUserConfigBackups: AlarmSelectorConfigModel;
  /** 该组件被使用的类型 表单/表格*/
  public useType: AlarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum.table;
  /** 被使用的类型枚举*/
  public alarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum;
  /** 远程通知中 新增 编辑 通过 区域和设施类型选择的条件*/
  private deptAndDeviceTypeCondition: AlarmNotifierRequestModel;
  /** 根据区域和设施类型选择的条件查询出所有的用户*/
  private allUserByDeptAndDeviceType: UserListModel[] = [];
  /** 过滤时的查询条件*/
  private queryConditions: UserListModel;

  constructor(
    public $alarmCommonService: AlarmForCommonService,
    public $userCommonService: UserForCommonService,
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  ngOnInit() {
    this.initTableConfigUser();
  }

  /**
   * 关闭通知人列表弹窗
   */
  public closeModal(): void {
    this.isVisibleUserTable = false;
    this.checkAlarmNotifierBackups = _.cloneDeep(this.checkAlarmNotifier);
  }

  /**
   * 弹框确定按钮事件
   */
  public handleConfirm(): void {
    this.isVisibleUserTable = false;
    this.checkAlarmNotifier = _.cloneDeep(this.checkAlarmNotifierBackups);
    if (this.useType === AlarmSelectorConfigTypeEnum.table) {
      this.filterValue.filterValue = this.checkAlarmNotifier.ids;
      this.filterValue.filterName = this.checkAlarmNotifier.name;
    }
    this.alarmUserConfigBackups.handledCheckedFun(this.checkAlarmNotifier);
  }

  /**
   * 打开通知人弹框
   */
  public openUserSelector(): void {
    this.isVisibleUserTable = true;
    // 在表格和表单中使用时，调用的接口不一样
    if (this.useType === AlarmSelectorConfigTypeEnum.table) {
      this.refreshUserData();
    } else {
      this.getAllUserData();
    }
  }

  /**
   * 表格分页事件
   * param event
   */
  public pageUserChange(event: PageModel): void {
    this.refreshUserData();
  }

  /**
   * 选择器里面清空已选数据
   * 只清空选择器数据
   */
  public clearSelectData(): void {
    this.checkAlarmNotifierBackups = new AlarmSelectorInitialValueModel();
    this.refreshUserData();
  }

  /**
   * 对传入的配置项做相应的处理
   */
  private handleInputConfigData(): void {
    if (this.alarmUserConfigBackups.type) {
      this.useType = this.alarmUserConfigBackups.type;
    }
    if (this.alarmUserConfigBackups.initialValue && this.alarmUserConfigBackups.initialValue.ids && this.alarmUserConfigBackups.initialValue.ids.length) {
      this.checkAlarmNotifierBackups = _.cloneDeep(this.alarmUserConfigBackups.initialValue);
      this.checkAlarmNotifier = _.cloneDeep(this.alarmUserConfigBackups.initialValue);
    }
    // 禁用和启用
    this.isDisabled = this.alarmUserConfigBackups.disabled;
    // 条件
    if (this.alarmUserConfigBackups.condition) {
      this.deptAndDeviceTypeCondition = this.alarmUserConfigBackups.condition;
    }
    // 清空选中信息
    if (this.alarmUserConfigBackups.clear) {
      this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
      this.checkAlarmNotifierBackups = new AlarmSelectorInitialValueModel();
    }
  }

  /**
   * 勾选数据时
   * param currentItem
   */
  private checkData(currentItem: UserListModel): void {
    this.checkAlarmNotifierBackups.ids.push(currentItem.id);
    const names = this.checkAlarmNotifierBackups.name + ',' + currentItem.userName;
    this.checkAlarmNotifierBackups.name = this.checkAlarmNotifierBackups.name === '' ? currentItem.userName : names;
  }

  /**
   * 取消勾选
   * param currentItem
   */
  private cancelCheck(currentItem: UserListModel): void {
    this.checkAlarmNotifierBackups.ids = this.checkAlarmNotifierBackups.ids.filter(id => {
      return currentItem.id !== id && id;
    });
    const names = this.checkAlarmNotifierBackups.name.split(',');
    this.checkAlarmNotifierBackups.name = names.filter(name => currentItem.userName !== name && name).join(',');
  }

  /**
   * 通知人请求列表数据
   */
  private refreshUserData(): void {
    this.tableConfigUser.isLoading = true;
    if (this.useType === AlarmSelectorConfigTypeEnum.table) {
      // 在列表中显示 后端分页过滤
      const data: QueryConditionModel = {
        filterConditions: [],
        pageCondition: {
          pageNum: this.pageBeanUser.pageIndex,
          pageSize: this.pageBeanUser.pageSize
        },
        sortCondition: new SortCondition(),
        bizCondition: this.queryConditions
      };
      this.$userCommonService.queryUserLists(data).subscribe((res) => {
        this.tableConfigUser.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.pageBeanUser = new PageModel(res.size, res.pageNum, res.totalCount);
          this.userListData = res.data.map(item => {
            // 点击如果input框中有值 就默认勾选
            this.checkAlarmNotifierBackups.ids.forEach(_item => {
              if (item.id === _item) {
                item.checked = true;
              }
            });
            // 处理责任单位名称数据
            let deptName;
            if (item.department && item.department.deptName) {
              deptName = item.department.deptName;
            }
            return {...item, departmentName: deptName};
          });
        }
      });
    } else {
      // 在表单中显示，前端分页过滤
      this.getUserDataByPage();
    }

  }

  /**
   * 获取符合条件的通知人数据
   */
  private getAllUserData(): void {
    this.$alarmCommonService.queryUserInfoByDeptAndDeviceType(this.deptAndDeviceTypeCondition).subscribe((res) => {
      this.allUserByDeptAndDeviceType = res.data.map(item => {
        // 处理责任单位名称数据
        let deptName;
        if (item.department && item.department.deptName) {
          deptName = item.department.deptName;
        }
        return {...item, departmentName: deptName};
      });
      this.getUserDataByPage();
    });
  }

  /**
   * 根据条件查询和过滤获取数据
   * 前端分页过滤操作
   */
  private getUserDataByPage(): void {
    // 根据查询条件过滤数据
    const userData = this.allUserByDeptAndDeviceType.filter(item => this.filterCallBack(item)) || [];
    userData.forEach(item => {
      // 点击如果input框中有值 就默认勾选
      const index = this.checkAlarmNotifierBackups.ids.findIndex(_item => item.id === _item);
      if (index > -1) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    //  分页数据
    this.pageBeanUser.Total = userData.length;
    const startIndex = this.pageBeanUser.pageSize * (this.pageBeanUser.pageIndex - 1);
    const endIndex = startIndex + this.pageBeanUser.pageSize - 1;
    this.userListData = userData.filter((item, index) => {
      return index >= startIndex && index <= endIndex;
    });
    this.tableConfigUser.isLoading = false;
  }

  /**
   * 过滤判断
   * param item
   * returns {boolean}
   */
  private filterCallBack(item: UserListModel): boolean {
    const filter = this.queryConditions;
    if (!filter) {
      return true;
    }
    if (filter.departmentName && !(item.departmentName.includes(filter.departmentName))) {
      return false;
    }
    if (filter.userName && !(item.userName.includes(filter.userName))) {
      return false;
    }
    if (filter.phoneNumber && !(item.phoneNumber.includes(filter.phoneNumber))) {
      return false;
    }
    return true;
  }

  /**
   * 初始化通知人弹框表格配置项
   */
  private initTableConfigUser(): void {
    this.tableConfigUser = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '760px', y: '300px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 50},
        {
          type: 'serial-number', width: 50, title: this.language.serialNumber,
        },
        {
          // 名称
          title: this.language.name, key: 'userName', width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 手机号
          title: this.userLanguage.phoneNumber, key: 'phoneNumber',
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 责任单位
          title: this.language.responsibleDepartment, key: 'departmentName', width: 200,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.refreshUserData();
      },
      handleSelect: (data: UserListModel[], currentItem: UserListModel) => {
        if (!currentItem) {
          // 当前页面全选 获取全部取消时
          if (data && data.length) {
            data.forEach(checkData => {
              if (this.checkAlarmNotifierBackups.ids.indexOf(checkData.id) === -1) {
                // 不存在时 添加进去
                this.checkData(checkData);
              }
            });
          } else {
            // 取消当前页面的全部勾选
            this.userListData.forEach(item => {
              if (this.checkAlarmNotifierBackups.ids.indexOf(item.id) !== -1) {
                // 当该条数据存在于 勾选信息中时 将其移除
                this.cancelCheck(item);
              }
            });
          }
        } else {
          if (currentItem.checked) {
            // 勾选
            this.checkData(currentItem);
          } else {
            // 取消勾选
            this.cancelCheck(currentItem);
          }
        }
      },
      handleSearch: (event: FilterCondition[]) => {
        this.pageBeanUser.pageIndex = 1;
        this.pageBeanUser.pageSize = 10;
        const obj = new UserListModel();
        event.forEach(item => {
          if (this.useType === AlarmSelectorConfigTypeEnum.table && item.filterField === 'departmentName') {
            // 对departmentName做特殊处理，后台分页过滤需要的该字段名称是department
            obj.department = item.filterValue;
          } else {
            obj[item.filterField] = item.filterValue;
          }
        });
        this.queryConditions = obj;
        this.refreshUserData();
      }
    };
  }
}
