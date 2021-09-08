import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {Result} from '../../../../shared-module/entity/result';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ApplicationService} from '../../share/service/application.service';
import {RouterJumpConst} from '../../share/const/application-system.const';
import {getPolicyType, getExecStatus} from '../../share/util/application.util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {EnableOrDisableModel} from '../../share/model/policy.control.model';

@Component({
  selector: 'app-security-policy-control',
  templateUrl: './security-policy-control.component.html',
  styleUrls: ['./security-policy-control.component.scss']
})
export class SecurityPolicyControlComponent implements OnInit {
  _dataSet = [];
  pageBean: PageModel = new PageModel(10, 1, 1);
  tableConfig: TableConfigModel;
  language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  @ViewChild('policyStatus') policyStatus: TemplateRef<any>;
  queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    public $router: Router,
    public $applicationService: ApplicationService,
  ) {
    this.language = this.$nzI18n.getLocaleData('online');
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData('application');
  }

  ngOnInit() {
    this.initTableConfig();
    this.refreshData();
  }

  pageChange(event) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig() {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      showSearchExport: true,
      showPagination: true,
      bordered: false,
      showSearch: false,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          title: this.languageTable.strategyList.strategyName, key: 'strategyName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          title: this.languageTable.strategyList.strategyType, key: 'strategyType', width: 150, isShowSort: true,
          configurable: true,
        },
        {
          title: this.languageTable.strategyList.effectivePeriodTime, key: 'effectivePeriodTime', width: 250, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          title: this.languageTable.strategyList.execCron, key: 'execCron', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.languageTable.strategyList.execStatus, key: 'execStatus', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.languageTable.strategyList.createTime, key: 'createTime', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'date'}
        },
        {
          title: this.languageTable.strategyList.applyUser, key: 'applyUser', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.languageTable.strategyList.remark, key: 'remark', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.languageTable.strategyList.strategyStatus, key: 'strategyStatus', width: 100, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.policyStatus,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      topButtons: [
        {
          text: '+  ' + this.languageTable.strategyList.strategyAdd,
          permissionCode: '03-1-2',
          handle: (data) => {
            this.openAddPolicyControl();
          }
        },
        {
          text: this.languageTable.strategyList.strategyDelete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-1-4',
          needConfirm: true,
          canDisabled: true,
          confirmContent: `${this.languageTable.strategyList.confirmDelete}?`,
          handle: (data) => {
            this.deleteLightStrategy(data);
          }
        },
      ],
      leftBottomButtons: [
        {
          text: this.languageTable.strategyList.enable,
          needConfirm: true,
          canDisabled: true,
          confirmContent: `${this.languageTable.strategyList.confirmEnable}?`,
          handle: (data) => {
            this.lightingEnableStrategy(data);
          }
        },
        {
          text: this.languageTable.strategyList.deactivation,
          needConfirm: true,
          canDisabled: true,
          confirmContent: `${this.languageTable.strategyList.confirmDeactivation}?`,
          handle: (data) => {
            this.lightingDisableStrategy(data);
          }
        },
      ],
      operation: [
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          handle: (data) => {
            this.handPolicyDetails(data);
          },
        },
        {
          text: this.languageTable.strategyList.strategyEdit,
          className: 'fiLink-edit',
          handle: (data) => {
            this.handPolicyEdit(data);
          }
        },
        {
          text: this.languageTable.strategyList.strategyDelete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          confirmContent: `${this.languageTable.strategyList.confirmDelete}?`,
          handle: (currentIndex) => {
            this.deleteLightStrategy(currentIndex);
          }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }

  /**
   * 启用策略
   * @ param data
   */
  lightingEnableStrategy(data) {
    const isEnable = data.some(item => item.strategyStatus === true);
    if (isEnable) {
      this.$message.error('请选择禁用的数据!');
    } else {
      const params = [];
      data.forEach(item => {
        params.push({
          strategyType: '1',
          operation: '1',
          strategyId: item.strategyId
        });
      });
      this.enableOrDisableStrategy(params);
    }
  }

  /**
   * 禁用策略
   * @ param data
   */
  lightingDisableStrategy(data) {
    const isDisable = data.some(item => item.strategyStatus === false);
    if (isDisable) {
      this.$message.error('请选择启用的数据!');
    } else {
      const params = [];
      data.forEach(item => {
        params.push({
          strategyType: '1',
          operation: '2',
          strategyId: item.strategyId
        });
      });
      this.enableOrDisableStrategy(params);
    }
  }

  /**
   * 刷新表格数据
   */
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$applicationService.getLightingPolicyList(this.queryCondition).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      this._dataSet = result.data;
      this._dataSet.forEach(item => {
        item.strategyType = getPolicyType(this.$nzI18n, item.strategyType);
        item.execStatus = getExecStatus(this.$nzI18n, item.execStatus);
        item.effectivePeriodTime = `${CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(item.effectivePeriodStart))}
        -${CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(item.effectivePeriodEnd))}`;
        item.createTime = `${CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', new Date(item.createTime))}`;
        item.strategyStatus = item.strategyStatus === '1';
      });
      this.pageBean.Total = result.totalCount;
      this.pageBean.pageIndex = result.pageNum;
      this.pageBean.pageSize = result.size;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 启用禁用
   * @ param params
   */
  enableOrDisableStrategy(params: EnableOrDisableModel[]) {
    this.$applicationService.enableOrDisableStrategy(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success('请求成功！');
        this.refreshData();
      }
    }, () => {

    });
  }

  /**
   * 监听switch开关事件
   * @ param event
   */
  switchChange(data, event) {
    const params = {
      strategyType: '1',
      operation: event ? '1' : '2',
      strategyId: data.strategyId
    };
    this.enableOrDisableStrategy([params]);
  }

  /**
   * 删除策略
   * @ param params
   */
  deleteLightStrategy(data) {
    let params = [];
    if (data && data.strategyId) {
      params = [data.strategyId];
    } else {
      data.forEach(item => {
        params.push(item.strategyId);
      });
    }
    this.$applicationService.deleteStrategy(params).subscribe((result: Result) => {
      if (result.code === 0) {
        this.refreshData();
      }
    }, () => {

    });
  }

  /**
   * 跳转到新增页面
   */
  public openAddPolicyControl() {
    this.$router.navigate([RouterJumpConst.securityPolicyControlAdd], {}).then();
  }

  /**
   * 跳转到详情位置
   */
  public handPolicyDetails(data) {
    this.$router.navigate([`${RouterJumpConst.securityPolicyControlDetails}/${data.strategyId}`], {}).then();
  }

  /**
   * 跳转到编辑页面
   */
  public handPolicyEdit(data) {
    this.$router.navigate([`${RouterJumpConst.securityPolicyControlEdit}`], {
      queryParams: {
        id: data.strategyId
      }
    }).then();
  }
}
