import {Component, OnInit} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {Result} from '../../../../shared-module/entity/result';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {UserForCommonService} from '../../../../core-module/api-service/user/user-for-common.service';

@Component({
  selector: 'app-replay-theater',
  templateUrl: './replay-theater.component.html',
  styleUrls: ['./replay-theater.component.scss']
})
export class ReplayTheaterComponent implements OnInit {
  _dataSet = [];
  pageBean: PageModel = new PageModel(10, 1, 1);
  tableConfig: TableConfigModel;
  language: OnlineLanguageInterface;
  filterObject = {};
  roleArray: Array<any> = [];
  queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    public $userService: UserForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
  }

  pageChange(event) {
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: this.language.userCode, key: 'userCode', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: this.language.userName, key: 'userName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.userNickname, key: 'userNickname', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.role, key: 'roleName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: this.roleArray
          }
        },
        // {
        //   title: this.language.department, key: 'deptName', width: 200, configurable: true,
        //   searchKey: 'departmentNameList',
        //   searchable: true,
        //   searchConfig: { type: 'render', renderTemplate: this.UnitNameSearch }
        // },
        {
          title: this.language.loginTime, key: 'loginTime', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          title: this.language.lastLoginIp, key: 'loginIp', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // {
        //   title: this.language.loginSourse, key: 'loginSource', width: 200, isShowSort: true,
        //   configurable: true,
        //   searchable: true,
        //   type: 'render',
        //   renderTemplate: this.loginSourseTemp,
        //   searchConfig: {
        //     type: 'select',
        //     selectInfo: [
        //       { label: this.language.pcTerminal, value: '1' },
        //       { label: this.language.mobileTerminal, value: '0' }
        //     ]
        //   },
        //   handleFilter: ($event) => {
        //   }
        // },
        {
          title: this.language.phoneNumber, key: 'phoneNumber', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.email, key: 'email', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.address, key: 'address', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
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
          text: '删除',
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-1-4',
          needConfirm: true,
          canDisabled: true,
          confirmContent: '确定删除?',
          handle: (data) => {
          }
        }
      ],
      operation: [
        {
          text: '查看详情',
          className: 'fiLink-view-detail',
          handle: () => {
            this.handPolicyDetails();
          },
        },
        {
          text: '删除',
          className: 'fiLink-lost',
          needConfirm: true,
          confirmContent: '是否确认删除操作?',
          handle: (currentIndex) => {
          }
        }
      ],
      sort: (event: SortCondition) => {
        const obj = {};
        obj['sortProperties'] = event.sortField;
        obj['sort'] = event.sortRule;
        this.queryCondition.bizCondition = Object.assign(this.filterObject, obj);
        this.refreshData();
      },
      handleSearch: (event) => {
      }
    };
  }


  /**
   * 刷新表格数据
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$userService.getOnLineUser(this.queryCondition).subscribe((res: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data.data;
      this.pageBean.Total = res.data.totalCount;
      this.pageBean.pageIndex = res.data.pageNum;
      this.pageBean.pageSize = res.data.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 跳转到详情位置
   */
  public handPolicyDetails() {
    this.$router.navigate(['business/application/security/replay-theater/policy-details'], {}).then();
  }

}
