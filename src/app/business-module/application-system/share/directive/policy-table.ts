import {EnableOrDisableModel, PolicyControlModel} from '../model/policy.control.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ExecStatusEnum, ExecTypeEnum, PolicyEnum, StrategyStatusEnum} from '../enum/policy.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {execType, getControlType, getExecStatus, getPolicyType} from '../util/application.util';
import {ApplicationFinalConst, RouterJumpConst} from '../const/application-system.const';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {Router} from '@angular/router';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationService} from '../service/application.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {BroadcastPolicyEnum, LightPolicyEnum, LinkagePolicyEnum, ReleasePolicyEnum} from '../enum/auth.code.enum';
import {SelectDataConfig} from '../config/select.data.config';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {CheckEquipmentParamModel} from '../../../../core-module/model/application-system/check-equipment-param.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';

export class PolicyTable {
  // 策略状态
  @ViewChild('policyStatus') policyStatus: TemplateRef<any>;
  // 表格数据
  public dataSet: PolicyControlModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 表格的配置项
  public tableConfig: TableConfigModel;
  // 表格所需要的条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 表格的多语言
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 路由
  public $router: Router;
  // 提示
  public $message: FiLinkModalService;
  // 接口服;
  public $applicationService: ApplicationService;
  // 多语言
  public $nzI18n: NzI18nService;
  // 策略类型集合
  private strategyTypeData = [];
  // 枚举  因为枚举不一样 所以用any类型
  private primaryKey: any;

  constructor(
    $nzI18n, $router, $message, $applicationService
  ) {
    this.language = $nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = $nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    this.$router = $router;
    this.$nzI18n = $nzI18n;
    this.$message = $message;
    this.$applicationService = $applicationService;

  }

  /**
   * 分页查询
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 初始化表格配置
   */
  public initTableConfig(): void {
    const url = this.$router.url;
    if (url.includes(ApplicationFinalConst.lighting)) {
      this.primaryKey = LightPolicyEnum;
      this.strategyTypeData = SelectDataConfig.strategyTypeData(this.languageTable).filter(item =>
        item.code === StrategyStatusEnum.lighting);
    } else if (url.includes(ApplicationFinalConst.release)) {
      this.primaryKey = ReleasePolicyEnum;
      this.strategyTypeData = SelectDataConfig.strategyTypeData(this.languageTable).filter(item =>
        item.code === StrategyStatusEnum.information);
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      this.primaryKey = BroadcastPolicyEnum;
      this.strategyTypeData = SelectDataConfig.strategyTypeData(this.languageTable).filter(item =>
        item.code === StrategyStatusEnum.broadcast);
    } else {
      this.primaryKey = LinkagePolicyEnum;
      this.strategyTypeData = SelectDataConfig.strategyTypeData(this.languageTable);
    }
    this.tableConfig = {
      outHeight: 108,
      primaryKey: this.primaryKey.primaryKey,
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
        {
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        // 序号
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // 策略名称
        {
          title: this.languageTable.strategyList.strategyName,
          key: 'strategyName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // 策略状态
        {
          title: this.languageTable.strategyList.strategyStatus,
          key: 'strategyStatus',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.policyStatus,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: SelectDataConfig.strategyStatusData(this.languageTable),
            label: 'label',
            value: 'code'
          }
        },
        // 策略类型
        {
          title: this.languageTable.strategyList.strategyType,
          key: 'strategyType',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.strategyTypeData,
            label: 'label',
            value: 'code'
          }
        },
        // 控制类型
        {
          title: this.languageTable.strategyList.controlType,
          key: 'controlType',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: SelectDataConfig.controlTypeData(this.languageTable),
            label: 'label',
            value: 'code'
          }
        },
        // 开始时间
        {
          title: this.languageTable.strategyList.effectivePeriodStart,
          key: 'effectivePeriodStart',
          width: 150,
          isShowSort: true,
          pipe: 'dateDay',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 结束时间
        {
          title: this.languageTable.strategyList.effectivePeriodEnd,
          key: 'effectivePeriodEnd',
          width: 150,
          isShowSort: true,
          configurable: true,
          pipe: 'dateDay',
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 执行状态
        {
          title: this.languageTable.strategyList.execStatus,
          key: 'execStatus',
          width: 180,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: SelectDataConfig.execStatusData(this.languageTable),
            label: 'label',
            value: 'code'
          }
        },
        // 执行类型
        {
          title: this.languageTable.strategyList.execCron,
          key: 'execType',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: SelectDataConfig.execTypeData(this.languageTable),
            label: 'label',
            value: 'code'
          }
        },
        // 创建时间
        {
          title: this.languageTable.strategyList.createTime,
          key: 'createTime',
          width: 150,
          isShowSort: true,
          configurable: true,
          pipe: 'date',
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 创建人
        {
          title: this.languageTable.strategyList.createUser,
          key: 'createUser',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 申请人
        {
          title: this.languageTable.strategyList.applyUser,
          key: 'applyUser',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 备注
        {
          title: this.languageTable.strategyList.remark,
          key: 'remark',
          width: 150,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 操作
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 150,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      topButtons: [
        // 新增
        {
          text: this.languageTable.strategyList.strategyAdd,
          className: 'fiLink-add-no-circle',
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: this.primaryKey.primaryAddKey,
          handle: () => {
            this.openAddPolicyControl();
          }
        },
        // 删除
        {
          text: this.languageTable.strategyList.strategyDelete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: this.primaryKey.primaryDeleteKey,
          confirmContent: `${this.languageTable.strategyList.confirmDelete}?`,
          handle: (data: PolicyControlModel[]) => {
            this.deleteLightStrategy(data);
          }
        },
      ],
      moreButtons: [
        // 启用
        {
          text: this.languageTable.strategyList.enable,
          iconClassName: 'fiLink-enable',
          needConfirm: true,
          canDisabled: true,
          permissionCode: this.primaryKey.primaryEnableKey,
          confirmContent: `${this.languageTable.strategyList.confirmEnable}?`,
          handle: (data: PolicyControlModel[]) => {
            this.lightingEnableStrategy(data);
          }
        },
        // 禁用
        {
          text: this.languageTable.strategyStatus.close,
          iconClassName: 'fiLink-disable-o',
          needConfirm: true,
          canDisabled: true,
          permissionCode: this.primaryKey.primaryDisableKey,
          confirmContent: `${this.languageTable.strategyList.confirmDeactivation}?`,
          handle: (data: PolicyControlModel[]) => {
            this.lightingDisableStrategy(data);
          }
        },
      ],
      operation: [
        // 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: this.primaryKey.primaryDetailsKey,
          handle: (data: PolicyControlModel) => {
            this.handPolicyDetails(data);
          },
        },
        // 编辑
        {
          text: this.languageTable.strategyList.strategyEdit,
          className: 'fiLink-edit',
          permissionCode: this.primaryKey.primaryEditKey,
          handle: (data: PolicyControlModel) => {
            // 启用后无法编辑
            if (data.strategyStatus) {
              //
              this.$message.error(this.languageTable.strategyList.editInfo);
              return;
              // 启动策略
            }
            this.handPolicyEdit(data);
          }
        },
        // 策略下发
        {
          text: this.languageTable.equipmentTable.distribution,
          className: 'fiLink-filink-celuexiafa-icon',
          needConfirm: true,
          permissionCode: this.primaryKey.primaryIssueKey,
          confirmContent: `${this.languageTable.equipmentTable.strategyOperationIssued}?`,
          handle: (data: PolicyControlModel) => {
            if (!data.strategyStatus && data._strategyType === '1') {
              this.checkEquipmentModel(data);
            }
            this.strategyDistribution(data);
          }
        },
        // 删除
        {
          text: this.languageTable.strategyList.strategyDelete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          permissionCode: this.primaryKey.primaryDeleteKey,
          confirmContent: `${this.languageTable.strategyList.confirmDelete}?`,
          handle: (currentIndex: PolicyControlModel) => {
            this.deleteLightStrategy([currentIndex]);
          }
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      //  导出数据
      handleExport: (event) => {
        this.handelExportPolicy(event);
      },
    };
  }

  /**
   * 启用策略
   * @ param data
   */
  public lightingEnableStrategy(data: PolicyControlModel[]): void {
    const isEnable = data.some(item => item.strategyStatus as boolean);
    if (isEnable) {
      this.$message.error(`${this.languageTable.strategyList.hasEnableData}!`);
    } else {
      const params = [];
      data.forEach(item => {
        params.push({
          strategyType: item._strategyType,
          operation: ExecStatusEnum.implement,
          strategyId: item.strategyId
        });
      });
      this.tableConfig.isLoading = true;
      this.enableOrDisableStrategy(params, true);
      // 有禁用状态切换启用状态时
      if (data && data.length > 0) {
        /*this.$message.error(this.languageTable.strategyList.deviceModeDoesItMatch);
      } else {*/
        // 只有一条数据且是照明策略的启用时需要校验
        if (data[0]._strategyType === '1' && !data[0].strategyStatus) {
          this.checkEquipmentModel(data[0]);
        }
      }
    }
  }

  /**
   * 禁用策略
   * @ param data
   */
  public lightingDisableStrategy(data: PolicyControlModel[]): void {
    const isDisable = data.some(item => !item.strategyStatus);
    if (isDisable) {
      this.$message.error(`${this.languageTable.strategyList.hasDisableData}!`);
    } else {
      const params = [];
      data.forEach(item => {
        params.push({
          strategyType: item._strategyType,
          operation: ExecStatusEnum.free,
          strategyId: item.strategyId
        });
      });
      this.tableConfig.isLoading = true;
      this.enableOrDisableStrategy(params, false);
    }
  }

  /**
   * 启用禁用
   * @ param params
   */
  public enableOrDisableStrategy(params: EnableOrDisableModel[], status: boolean): void {
    this.enableOrDisableStrategyStatus(params, true);
    this.$applicationService.enableOrDisableStrategy(params).subscribe((result: ResultModel<string>) => {
      this.tableConfig.isLoading = false;
      if (params.length > 1) {
        // 批量启用禁用策略
        if (result.code !== ResultCodeEnum.success) {
          this.$message.error(result.msg);
          this.enableOrDisableStrategyStatus(params, false);
        } else  {
          this.$message.success(`操作成功，批量所选的策略已在处理中，结果可稍后在消息通知查看详情`);
          setTimeout(() => {
            this.refreshData();
          }, 1000);
          this.enableOrDisableStrategyStatus(params, false);
        }
      } else {
        // 启用禁用单个测量
        if (result.code !== ResultCodeEnum.success) {
          this.$message.error(result.msg);
          this.enableOrDisableStrategyStatus(params, false);
        } else  {
          this.enableOrDisableStrategyStatus(params, false, status);
        }
      }
    }, error => {
      this.tableConfig.isLoading = false;
      this.enableOrDisableStrategyStatus(params, false);
    });
  }

  /**
   * 监听switch开关事件
   * @ param event
   */
  public switchChange(data): void {
    const params = {
      strategyType: data._strategyType,
      operation: !!data.strategyStatus ? ExecStatusEnum.free : ExecStatusEnum.implement,
      strategyId: data.strategyId
    };
    if (data.strategyStatus) {
      if (!SessionUtil.checkHasRole(this.primaryKey.primaryDisableKey)) {
        this.$message.warning(this.commonLanguage.permissionMsg);
        return;
      }
    } else {
      if (!SessionUtil.checkHasRole(this.primaryKey.primaryEnableKey)) {
        this.$message.warning(this.commonLanguage.permissionMsg);
        return;
      }
    }
    // 手动控制switch开关，每次给后台传的值为当前状态的相反值，当请求成功之后，再改变switch开关的值，否则不改变
    this.enableOrDisableStrategy([params], !data.strategyStatus);
    // 照明策略是需要校验
    if (data._strategyType === '1' && !data.strategyStatus) {
      this.checkEquipmentModel(data);
    }
  }

  /**
   * 删除策略
   * @ param params
   */
  public deleteLightStrategy(data: PolicyControlModel[]): void {
    if (this.tableConfig.isLoading === true) {
      return;
    }
    this.tableConfig.isLoading = true;
    const params = data.map(item => item.strategyId);
    this.$applicationService.deleteStrategy(params).subscribe((result: ResultModel<string>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        // 删除跳第一页
        this.queryCondition.pageCondition.pageNum = 1;
        this.$message.success(this.languageTable.strategyList.deleteMsg);
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 刷新表格数据
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.defaultQuery(this.queryCondition);
    this.$applicationService.getLightingPolicyList(this.queryCondition).subscribe((result: ResultModel<PolicyControlModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const {data, totalCount, pageNum, size} = result;
        this.dataSet = data || [];
        this.resultFmt(data);
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        this.dataSet.forEach(item => item.switchLoading = false);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 默认查询条件
   */
  public defaultQuery(queryCondition) {
    // 通过路由参数来判断页面
    const url = this.$router.url;
    // 解决默认条件重复push
    const flag = queryCondition.filterConditions.some(item => item.filterField === PolicyEnum.strategyType);
    if (flag) {
      return;
    }
    let strategyType;
    if (url.includes(ApplicationFinalConst.lighting)) {
      strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.eq, StrategyStatusEnum.lighting);
    } else if (url.includes(ApplicationFinalConst.release)) {
      strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.eq, StrategyStatusEnum.information);
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.eq, StrategyStatusEnum.broadcast);
    } else {
      // strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.like, StrategyStatusEnum.linkage);
    }
    if (strategyType) {
      queryCondition.filterConditions.push(strategyType);
    }

  }

  /**
   * 处理数据格式
   * @ param data
   */
  public resultFmt(data: PolicyControlModel[]) {
    data.forEach(item => {
      item._strategyType = item.strategyType;
      item.strategyType = getPolicyType(this.$nzI18n, item.strategyType);
      item.controlTypeCode = item.controlType;
      item.controlType = getControlType(this.$nzI18n, item.controlType) as { label: string; code: string; }[];
      item.execStatus = getExecStatus(this.$nzI18n, item.execStatus);
      item.execType = execType(this.$nzI18n, item.execType) as ExecTypeEnum;
      item.strategyStatus = item.strategyStatus === ExecStatusEnum.implement;
    });
  }

  /**
   * 跳转到新增页面
   */
  public openAddPolicyControl(): void {
    const url = this.$router.url;
    let path;
    if (url.includes(ApplicationFinalConst.lighting)) {
      path = RouterJumpConst.lightingPolicyControlAdd;
    } else if (url.includes(ApplicationFinalConst.release)) {
      path = RouterJumpConst.releaseWorkbenchAdd;
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      path = RouterJumpConst.broadcastWorkbenchAdd;
    } else {
      path = RouterJumpConst.strategyAdd;
    }
    this.$router.navigate([path], {}).then();
  }

  /**
   * 跳转到详情位置
   */
  public handPolicyDetails(data: PolicyControlModel): void {
    const url = this.$router.url;
    let path;
    if (url.includes(ApplicationFinalConst.lighting)) {
      path = RouterJumpConst.lightingDetails;
    } else if (url.includes(ApplicationFinalConst.release)) {
      path = RouterJumpConst.releaseWorkbenchDetails;
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      path = RouterJumpConst.broadcastWorkbenchDetails;
    } else  {
      path = RouterJumpConst.strategyDetails;
    }
    this.$router.navigate([`${path}/${data.strategyId}`], {
      queryParams: {
        id: data.strategyId,
        strategyType: data._strategyType,
      }
    }).then();
  }

  /**
   * 跳转到编辑页面
   */
  public handPolicyEdit(data: PolicyControlModel): void {
    const url = this.$router.url;
    let path;
    if (url.includes(ApplicationFinalConst.lighting)) {
      path = RouterJumpConst.lightingPolicyControlEdit;
    } else if (url.includes(ApplicationFinalConst.release)) {
      path = RouterJumpConst.releaseWorkbenchEdit;
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      path = RouterJumpConst.broadcastWorkbenchEdit;
    } else {
      path = RouterJumpConst.strategyEdit;
    }
    this.$router.navigate([path], {
      queryParams: {
        id: data.strategyId,
        strategyType: data._strategyType,
      }
    }).then();
  }

  /**
   * 策略列表导出
   * @ param data
   */
  private handelExportPolicy(event): void {
    // 处理参数
    const body = new ExportRequestModel(event.columnInfoList, event.excelType, new QueryConditionModel());
    body.columnInfoList.forEach(item => {
      if (['strategyStatus', 'strategyType', 'controlType',
        'effectivePeriodStart', 'effectivePeriodEnd', 'execStatus', 'execType', 'createTime'].includes(item.propertyName)) {
        // 后台处理字段标示
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // 处理选择的项目
    if (event.selectItem.length > 0) {
      const ids = event.selectItem.map(item => item.strategyId);
      const filter = new FilterCondition('strategyId', OperatorEnum.in, ids);
      body.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      body.queryCondition.filterConditions = event.queryTerm;
    }
    this.defaultQuery(body.queryCondition);
    this.$applicationService.exportStrategyList(body).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 改变禁用启用loading状态
   * @ param data
   * @ param flag
   */
  private enableOrDisableStrategyStatus(data: EnableOrDisableModel[], loadingFlag: boolean, status?: boolean): void {
    data.forEach(value => {
      this.dataSet.forEach(item => {
        if (value.strategyId === item.strategyId) {
          item.switchLoading = loadingFlag;
          if (typeof status === 'boolean') {
            item.strategyStatus = status;
          }
        }
      });
    });
  }

  /**
   * 策略下发
   * @ param data
   */
  private strategyDistribution(data: PolicyControlModel): void {
    if (!data.strategyStatus) {
      this.$message.error(this.languageTable.strategyList.disabledPolicy);
      return;
    }
    const params = {
      strategyId: data.strategyId,
      strategyType: data._strategyType
    };
    // const url = this.$router.url;
    // let request;
    // if (url.includes(ApplicationFinalConst.lighting)) {
    //   request = this.$applicationService.distributeLightStrategy(params);
    // } else if (url.includes(ApplicationFinalConst.release)) {
    //   request = this.$applicationService.distributeInfoStrategy(params);
    // } else {
    //   request = this.$applicationService.distributeLinkageStrategy(params);
    // }
    this.$applicationService.distributeLinkageStrategy(params).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.languageTable.equipmentTable.strategyIssued);
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 校验设备模式
   */
  private checkEquipmentModel(data: PolicyControlModel): void {
    const param = new CheckEquipmentParamModel();
    param.strategyId = data.strategyId;  // 策略id
    param.mode = (data.controlTypeCode === '1' || data.controlTypeCode === '01') ?  '01' : '00';  // 平台控制类型的策略：01  设备控制类型的策略：00
    this.$applicationService.checkEnable(param).subscribe((res: ResultModel<string>) => {
      if (res.code !== ResultCodeEnum.success) {
        this.$message.error(res.msg);
      }
    });
  }
}
