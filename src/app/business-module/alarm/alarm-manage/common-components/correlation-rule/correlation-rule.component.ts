import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {Router} from '@angular/router';
import {AlarmDisableStatusEnum} from '../../../share/enum/alarm.enum';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AnalysisCorrelationRuleModel} from '../../../share/model/analysis-correlation-rule.model';
import {AlarmService} from '../../../share/service/alarm.service';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {StaticRuleEnableModel} from '../../../share/model/static-rule-enable.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../../shared-module/model/alarm-selector-config.model';

/**
 * 静态相关性规则
 */
@Component({
  selector: 'app-correlation-rule',
  templateUrl: './correlation-rule.component.html',
  styleUrls: ['./correlation-rule.component.scss']
})
export class CorrelationRuleComponent implements OnInit {
  // 表格启用禁用模板
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<HTMLDocument>;
  // 根原因告警
  @ViewChild('alarmReason') private alarmReason;
  // 相关告警
  @ViewChild('correlationAlarm') private correlationAlarm;
  // 分析周期
  @ViewChild('analyzePeriodTemp') private analyzePeriodTemp;
  // 国际化接口
  public language: AlarmLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 告警相关性规则数据
  public dataSet: AnalysisCorrelationRuleModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 是否禁启用
  public isStatus = AlarmDisableStatusEnum;
  // 查看规则
  public isShowViewRule: boolean = false;
  // 规则id
  public ruleId: string;
  // 禁启用节流阀
  public isSwitch: boolean = false;
  // 根原因告警配置
  public alarmReasonConfig: AlarmSelectorConfigModel;
  // 勾选的根原因告警名称
  public alarmReasonName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 相关告警配置
  public correlationAlarmConfig: AlarmSelectorConfigModel;
  // 勾选的相关告警名称
  public correlationAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  constructor(
    public $nzI18n: NzI18nService,
    public $router: Router,
    private $alarmService: AlarmService,
    private $message: FiLinkModalService,
  ) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableConfig();
    // 根原因告警
    this.initAlarmReason();
    // 相关告警
    this.initRelevanceAlarm();
    // 获取列表数据
    this.refreshData();
  }
  /**
   * 表格翻页查询
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   *  列表中启用和禁用 的开关
   *  param data
   */
  public clickSwitch(data: AnalysisCorrelationRuleModel) {
    this.isSwitch = true;
    if (data && data.id) {
      // 处理loading
      data.clicked = true;
      const type = data.status === AlarmDisableStatusEnum.enable ? AlarmDisableStatusEnum.disable : AlarmDisableStatusEnum.enable;
      const queryData: StaticRuleEnableModel = new StaticRuleEnableModel(type, [data.id]);
      this.$alarmService.staticEnableAndDisable(queryData).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.language.editStaticStatusEnableStatus);
          data.clicked = false;
          // 改变当条数据状态
          data.status = type;
          // 改变状态名称
          this.switchStatusRole(data);
          // 遮罩层
          this.isSwitch = false;
        } else {
          this.isSwitch = false;
          data.clicked = false;
          this.$message.error(res.msg);
        }
      });
    }
  }
  /**
   * 获取表格的数据
  **/
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$alarmService.staticRelevanceRuleList(this.queryCondition).subscribe((res: ResultModel<AnalysisCorrelationRuleModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.dataSet = res.data || [];
        this.dataSet.forEach( item => {
          this.switchStatusRole(item);
          // 相关告警
          if (item.relevanceAlarmAction) {
            item.relevanceAlarmAction = AlarmUtil.translateAlarmAction(this.$nzI18n, item.relevanceAlarmAction) as string;
          }
          // 根原因告警
          if (item.rootAlarmAction) {
            item.rootAlarmAction = AlarmUtil.translateRootAction(this.$nzI18n, item.rootAlarmAction) as string;
          }
        });
      } else {
          // 请求错误
          this.$message.error(res.msg);
          this.tableConfig.isLoading = false;
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }
  /**
   * 切换权限
   * param item
   */
  private switchStatusRole(item: AnalysisCorrelationRuleModel): void {
    item.statusName = AlarmUtil.translateEnableAndDisable(this.$nzI18n, item.status);
    // 启/禁用权限
    item.appAccessPermission = item.status === AlarmDisableStatusEnum.disable ? '02-3-7-0-4' : '02-3-7-0-5';
  }

  /**
   * 更多操作禁启用处理
   */
  private checkDisableEnable(type: AlarmDisableStatusEnum, data: AnalysisCorrelationRuleModel[]): void {
    const ids = data.map(item => item.id);
    const queryData: StaticRuleEnableModel = new StaticRuleEnableModel(type, ids);
    this.$alarmService.staticEnableAndDisable(queryData).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.language.editStaticStatusEnableStatus);
        this.isSwitch = false;
          this.refreshData();
      } else {
        this.isSwitch = false;
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 全部禁启用处理
   */
  private checkAllDisableEnable(type: AlarmDisableStatusEnum): void {
    this.$alarmService.AllStaticEnableAndDisable(type).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.language.editAllStaticStatusEnableStatus);
        this.refreshData();
      } else {
        this.$message.error(res.msg);
      }
    });
  }
  /**
   * 删除
   * param ids
   */
  private delTemplate(ids: string[]) {
    this.$alarmService.deleteStaticRelevanceRule(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.commonLanguage.deleteSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-7-0',
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      scroll: {x: '1200px', y: '600px'},
      setColumnPlacement: 'bottomCenter',
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 规则名称
          title: this.language.ruleName, key: 'staticRelevanceRuleName', isShowSort: true,
          width: 150, configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 根告警原因
          title: this.language.alarmReason, key: 'rootAlarmName', isShowSort: true,
          searchKey: 'rootAlarmName',
          width: 150, configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.alarmReason
          }
        },
        {
          // 根告警动作
          title: this.language.alarmAction, key: 'rootAlarmAction', isShowSort: true,
          width: 150, configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: AlarmUtil.translateRootAction(this.$nzI18n, null),
            label: 'label', value: 'code'
          },
        },
        {
          // 相关告警
          title: this.language.alarmCorrelation, key: 'relevanceAlarmName', isShowSort: true,
          width: 150, configurable: true, searchKey: 'relevanceAlarmNameId',
          searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.correlationAlarm
          },
        },
        {
          // 相关告警动作
          title: this.language.correlationAlarmAction, key: 'relevanceAlarmAction', isShowSort: true,
          width: 150, configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmUtil.translateAlarmAction(this.$nzI18n, null),
            label: 'label', value: 'code'
          },
        },
        {
          // 状态
          title: this.language.status, key: 'status', isShowSort: true,
          width: 150, configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.disable, value: AlarmDisableStatusEnum.disable},
              {label: this.language.enable, value: AlarmDisableStatusEnum.enable}
            ]
          },
        },
        {
          // 分析周期
          title: this.language.analyseCycle, key: 'analyzePeriod', isShowSort: true,
          width: 150, configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.analyzePeriodTemp,
          },
        },
        {
          // 备注
          title: this.language.remark, key: 'remark', isShowSort: true,
          width: 150, configurable: true,
          searchable: true, remarkPipe: 'remark',
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 120, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [
        {
          // 编辑
          text: this.language.update,
          permissionCode: '02-3-7-0-2',
          className: 'fiLink-edit',
          handle: (event: AnalysisCorrelationRuleModel) => {
            this.$router.navigate(['business/alarm/alarm-correlation-setting/edit-correlation-analysis'],
              {queryParams : {type: OperateTypeEnum.update, id: event.id}}).then();
          }
        },
        {
          // 查看
          text: this.language.viewCondition,
          permissionCode: '02-3-7-0-8',
          className: 'fiLink-view-results',
          handle: (currentIndex: AnalysisCorrelationRuleModel) => {
            this.ruleId = currentIndex.id;
            this.isShowViewRule = true;
          }
        },
        {
          // 删除
          text: this.language.deleteHandle,
          permissionCode: '02-3-7-0-3',
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data: AnalysisCorrelationRuleModel) => {
            if (data.status === AlarmDisableStatusEnum.enable) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const id = data.id;
              if (id) {
               this.delTemplate([id]);
              }
            }
          }
        }
      ],
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '02-3-7-0-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-correlation-setting/add-correlation-analysis'],
              {queryParams : {type: OperateTypeEnum.add}}).then();
          }
        }, {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-7-0-3',
          handle: (data: AnalysisCorrelationRuleModel[]) => {
            if (data.find(item => item.status === AlarmDisableStatusEnum.enable)) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.map(item => item.id);
              if (ids) {
                this.delTemplate(ids);
              }
            }
          }
        }
      ],
      moreButtons: [
        {
          // 启用
          text: this.language.enable,
          iconClassName: 'fiLink-enable',
          permissionCode: '02-3-7-0-4',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isNoAllEnable,
          handle: (e: AnalysisCorrelationRuleModel[]) => {
            this.checkDisableEnable(AlarmDisableStatusEnum.enable, e);
          }
        },
        {
          // 禁用
          text: this.language.disable,
          iconClassName: 'fiLink-disable-o',
          permissionCode: '02-3-7-0-5',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isNoAllDisable,
          handle: (e: AnalysisCorrelationRuleModel[]) => {
            this.checkDisableEnable(AlarmDisableStatusEnum.disable, e);
          }
        },
        {
          // 全部启用
          text: this.language.allEnable,
          iconClassName: 'fiLink-enable',
          permissionCode: '02-3-7-0-6',
          needConfirm: true,
          confirmContent: this.language.isAllEnable,
          handle: () => {
            this.checkAllDisableEnable(AlarmDisableStatusEnum.enable);
          }
        },
        {
          // 全部禁用
          text: this.language.allDisable,
          iconClassName: 'fiLink-disable-o',
          permissionCode: '02-3-7-0-7',
          needConfirm: true,
          confirmContent: this.language.isAllDisable,
          handle: () => {
            this.checkAllDisableEnable(AlarmDisableStatusEnum.disable);
          }
        }
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        if (!event.length) {
          // 根原因告警
          this.alarmReasonName = new AlarmSelectorInitialValueModel();
          this.initAlarmReason();
          // 相关告警
          this.correlationAlarmName = new AlarmSelectorInitialValueModel();
          this.initRelevanceAlarm();
          this.queryCondition.filterConditions = event;
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          event.forEach( item => {
           if (item.filterField === 'analyzePeriod') {
             item.operator =  OperatorEnum.lte;
           } else if (item.filterField === 'rootAlarmNameId') {
             item.operator =  OperatorEnum.in;
           } else if (item.filterField === 'relevanceAlarmNameId') {
             item.operator =  OperatorEnum.in;
           }
          });
          this.pageBean = new PageModel(this.queryCondition.pageCondition.pageSize);
          this.queryCondition.filterConditions = event;
          this.queryCondition.pageCondition = new PageCondition(this.pageBean.pageIndex, this.pageBean.pageSize);
          this.refreshData();
        }
      }
    };
  }
  /**
   * 告警名称配置
   */
  private initAlarmReason(): void {
    this.alarmReasonConfig = {
      clear: !this.alarmReasonName.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.alarmReasonName = event;
      }
    };
  }
  /**
   * 相关告警配置
   */
  private initRelevanceAlarm(): void {
    this.correlationAlarmConfig = {
      clear: !this.correlationAlarmName.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.correlationAlarmName = event;
      }
    };
  }
}
