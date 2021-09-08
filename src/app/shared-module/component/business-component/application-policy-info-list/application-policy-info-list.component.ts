import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../model/page.model';
import {PageSizeEnum} from '../../../enum/page-size.enum';
import {TableConfigModel} from '../../../model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../enum/language.enum';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {CommonUtil} from '../../../util/common-util';
import {ExecStatusEnum, ExecTypeEnum, PolicyStatusEnum, PolicyTypeEnum} from '../../../../core-module/enum/equipment/policy.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {ApplicationFinalConst} from '../../../../business-module/application-system/share/const/application-system.const';
import {PolicyEnum, StrategyStatusEnum} from '../../../../business-module/application-system/share/enum/policy.enum';
import {OperatorEnum} from '../../../enum/operator.enum';
import {Router} from '@angular/router';
import {ApplicationPolicyListModel} from '../../../../core-module/model/application-system/application-policy-list.model';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';

/**
 * 设备下面的分组信息
 * created by PoHe
 */
@Component({
  selector: 'application-policy-info-list',
  templateUrl: './application-policy-info-list.component.html'
})
export class ApplicationPolicyInfoListComponent implements OnInit {
  // 策略信息是否展示
  @Input()
  set policyVisible(params) {
    this._policyVisible = params;
    this.policyVisibleChange.emit(this._policyVisible);
  }

  // 设备id
  @Input() equipmentId: string;
  // 显示隐藏变化
  @Output() public policyVisibleChange = new EventEmitter<boolean>();
  // 策略状态
  @ViewChild('policyStatusTemp') policyStatusTemp: TemplateRef<HTMLDocument>;
  // 策略类型
  @ViewChild('policyTypeTemp') policyTypeTemp: TemplateRef<HTMLDocument>;
  // 执行状态
  @ViewChild('execStatusTemp') execStatusTemp: TemplateRef<HTMLDocument>;
  // 执行周期
  @ViewChild('execTimeTemp') execTimeTemp: TemplateRef<HTMLDocument>;

  // 获取modal框显示状态
  get policyVisible() {
    return this._policyVisible;
  }

  public _policyVisible: boolean = false;
  // 列表数据
  public dataSet: ApplicationPolicyListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 表格配置信息
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 国际化
  public commonLanguage: CommonLanguageInterface;
  // 应用系统国际化
  public applicationLanguage: ApplicationInterface;
  // 资产国际化
  public language: FacilityLanguageInterface;
  // 状态
  public policyStatusEnum = PolicyStatusEnum;
  // 类型
  public policyTypeEnum = PolicyTypeEnum;
  // 执行状态
  public execStatusEnum = ExecStatusEnum;
  // 执行周期
  public execTypeEnum = ExecTypeEnum;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   *  构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $router: Router,
              private $facilityCommonService: FacilityForCommonService) {
  }

  /**
   *  初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.applicationLanguage = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initTableConfig();
    this.queryPolicyList();
  }

  /**
   * 页面切换事件
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryPolicyList();
  }

  /**
   * 初始化表格参数
   */
  private initTableConfig(): void {
    // 根据照明，信息屏，安防展示对应的策略类型的值
    const url = this.$router.url;
    const strategyStatusData = CommonUtil.codeTranslate(PolicyTypeEnum, this.$nzI18n,
      null, 'application.policyControl');
    let filterStrategy;
    if (url.includes(ApplicationFinalConst.lighting)) {
      if (typeof strategyStatusData !== 'string') {
        filterStrategy = strategyStatusData.filter(item => item.code === StrategyStatusEnum.lighting);
      }
    } else if (url.includes(ApplicationFinalConst.release)) {
      if (typeof strategyStatusData !== 'string') {
        filterStrategy = strategyStatusData.filter(item => item.code === StrategyStatusEnum.information);
      }
    } else if (url.includes(ApplicationFinalConst.security)) {
      if (typeof strategyStatusData !== 'string') {
        filterStrategy = strategyStatusData.filter(item => item.code === StrategyStatusEnum.centralizedControl);
      }
    } else {
      filterStrategy = strategyStatusData;
    }
    filterStrategy = filterStrategy.filter(item => item.label !== '安防监控策略' && item.label !== '广播发布策略');
    this.tableConfig = {
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '1200px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.commonLanguage.serialNumber,
        },
        { // 策略名称
          title: this.applicationLanguage.strategyList.strategyName,
          width: 120,
          key: 'strategyName',
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 策略状态
          title: this.applicationLanguage.strategyList.strategyStatus,
          width: 120,
          key: 'strategyStatus',
          type: 'render',
          renderTemplate: this.policyStatusTemp,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(PolicyStatusEnum,
              this.$nzI18n, null, 'application.strategyStatus'),
            label: 'label',
            value: 'code'
          }
        },
        { // 策略类型
          title: this.applicationLanguage.strategyList.strategyType,
          width: 170,
          key: 'strategyType',
          configurable: false,
          type: 'render',
          renderTemplate: this.policyTypeTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: filterStrategy,
            label: 'label',
            value: 'code'
          }
        },
        { // 开始时间
          title: this.applicationLanguage.strategyList.effectivePeriodStart,
          width: 180,
          key: 'effectivePeriodStart',
          configurable: false,
          searchable: true,
          isShowSort: true,
          pipe: 'dateDay',
          searchConfig: {type: 'date'}
        },
        { // 结束时间
          title: this.applicationLanguage.strategyList.effectivePeriodEnd,
          width: 180,
          key: 'effectivePeriodEnd',
          configurable: false,
          searchable: true,
          isShowSort: true,
          pipe: 'dateDay',
          searchConfig: {type: 'date'}
        },
        { // 执行状态
          title: this.applicationLanguage.strategyList.execStatus,
          width: 150,
          key: 'execStatus',
          type: 'render',
          renderTemplate: this.execStatusTemp,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(ExecStatusEnum, this.$nzI18n, null, 'application.execStatus'),
            label: 'label',
            value: 'code'
          }
        },
        { // 执行周期
          title: this.applicationLanguage.strategyList.execCron,
          width: 150,
          key: 'execType',
          type: 'render',
          renderTemplate: this.execTimeTemp,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(ExecTypeEnum, this.$nzI18n, null, 'application.executionCycleType'),
            label: 'label',
            value: 'code'
          }
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 100,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryPolicyList();
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.queryPolicyList();
      }
    };
  }

  /**
   * 默认查询条件
   */
  private defaultQuery(): void {
    // 通过路由参数来判断页面
    const url = this.$router.url;
    let strategyType;
    // 解决默认条件重复push
    const flag = this.queryCondition.filterConditions.some(item => item.filterField === PolicyEnum.strategyType);
    if (flag) {
      return;
    }
    if (url.includes(ApplicationFinalConst.lighting)) {
      strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.like, StrategyStatusEnum.lighting);
    } else if (url.includes(ApplicationFinalConst.release)) {
      strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.like, StrategyStatusEnum.information);
    } else if (url.includes(ApplicationFinalConst.security)) {
      strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.like, StrategyStatusEnum.centralizedControl);
    } else {
      return;
    }
    this.queryCondition.filterConditions.push(strategyType);
  }

  /**
   * 查询列表数据
   */
  private queryPolicyList(): void {
    this.tableConfig.isLoading = true;
    // 这个条件是过滤照明，信息发布，安防三个平台的策略列表
    this.defaultQuery();
    const body = {
      equipmentId: this.equipmentId,
      queryCondition: this.queryCondition
    };
    // 调用后台的查询应用策略信息列表的接口
    this.$facilityCommonService.listStrategyByCondAndEquipIdPage(body).subscribe(
      (res: ResultModel<ApplicationPolicyListModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          this.dataSet = res.data || [];
          this.tableConfig.isLoading = false;
          this.pageBean.pageSize = res.size;
          this.pageBean.Total = res.totalCount;
          this.pageBean.pageIndex = res.pageNum;
        } else {
          this.tableConfig.isLoading = false;
          this.$message.error(res.msg);
        }
      }, () => this.tableConfig.isLoading = false);
  }
}
