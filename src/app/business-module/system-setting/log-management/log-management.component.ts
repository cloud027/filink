import {Component, OnInit, ViewChild, TemplateRef, OnDestroy} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../share/service/column-config.service';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {SystemParameterService} from '../share/service';
import {TimerSelectorService} from '../../../shared-module/service/time-selector/timer-selector.service';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {BasicConfig} from '../share/service/basic-config';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {INDEX_DAY_NUMBER} from '../../../core-module/const/index/index.const';
import {DangerLevelEnum, ExportLogEnum, LogNameEnum, LogTypeEnum, OptResultEnum, OptTypeEnum} from '../share/enum/system-setting.enum';
import {OperateLogModel} from '../../../core-module/model/system-setting/operate-log.model';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ExportRequestModel} from '../../../shared-module/model/export-request.model';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {TIME_EXTRA} from '../../../shared-module/const/time-extra';
import {IS_TRANSLATION_CONST} from '../../../core-module/const/common.const';
import {ListExportModel} from '../../../core-module/model/list-export.model';
import {TableComponent} from '../../../shared-module/component/table/table.component';

/**
 * 日志
 */
@Component({
  selector: 'app-log-management',
  templateUrl: './log-management.component.html',
  styleUrls: ['./log-management.component.scss'],
  providers: [TimerSelectorService]
})
export class LogManagementComponent extends BasicConfig implements OnInit, OnDestroy {
  // 危险级别
  @ViewChild('dangerLevel') private dangerLevel: TemplateRef<HTMLDocument>;
  // 操作结果
  @ViewChild('optResult') private optResult: TemplateRef<HTMLDocument>;
  // 操作类型
  @ViewChild('optType') private optTypeTem: TemplateRef<HTMLDocument>;
  // 表单模板
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 日志类型
  public optType = LogTypeEnum.operate;
  // 导出日志类型
  public exportLog: string;
  // 主键
  public primaryKey = '';
  // 当前默认事件
  public countTime;
  // 详情弹窗
  public particulars: boolean = false;
  // 详情标题
  public particularsTitle: string;
  // 日志信息
  public logInfo: OperateLogModel = new OperateLogModel();
  // 操作结果枚举
  public optResultEnum = OptResultEnum;
  // 危险级别枚举
  public dangerLevelEnum = DangerLevelEnum;
  // 操作类型枚举
  public optTypeEnum = OptTypeEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;

  constructor(public $nzI18n: NzI18nService,
              private $timerSelectorService: TimerSelectorService,
              private $columnConfigService: ColumnConfigService,
              private $message: FiLinkModalService,
              private $logManageService: SystemParameterService,
              private $activatedRoute: ActivatedRoute,
  ) {
    super($nzI18n);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始化一周的事件
    this.initSetting();
    // 初始化表格
    this.initTable();
  }

  /**
   * 查询日志列表
   */
  public searchList(): void {
    let httpName = '';
    if (this.optType === LogTypeEnum.security) {
      // 安全日志
      httpName = LogNameEnum.findSecurityLog;
      this.exportLog = ExportLogEnum.exportSecurityLogExport;
      this.primaryKey = '04-2-1';
    } else if (this.optType === LogTypeEnum.system) {
      // 系统日志
      httpName = LogNameEnum.findSystemLog;
      this.exportLog = ExportLogEnum.exportSysLogExport;
      this.primaryKey = '04-2-2';
    } else {
      // 操作日志
      httpName = LogNameEnum.findOperateLog;
      this.exportLog = ExportLogEnum.exportOperateLogExport;
      this.primaryKey = '04-2-3';
    }
    this.tableConfig.isLoading = true;
    this.tableConfig.primaryKey = this.primaryKey;
    this.$logManageService[httpName](this.queryConditions).subscribe((result: ResultModel<OperateLogModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this._dataSet = result.data;
        this.pageBean.Total = result.totalCount;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 创建查询条件 分页
   */
  public pageChange(event): void {
    this.queryConditions.pageCondition = new PageCondition(event.pageIndex, event.pageSize);
    this.searchList();
  }

  /**
   * 销毁钩子 将模型设置成空
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
  }
  /**
   * 初始化默认设置
   */
  private initSetting(): void {
    this.countTime = this.$timerSelectorService.getDateRang(INDEX_DAY_NUMBER.oneWeek);
    const item = new FilterCondition('optTime', OperatorEnum.gte, CommonUtil.getTimeStamp(new Date(this.countTime[0])));
    item.extra = TIME_EXTRA;
    const anotherItem = new FilterCondition('optTime', OperatorEnum.lte, CommonUtil.getTimeStamp(new Date(this.countTime[1])));
    anotherItem.extra = TIME_EXTRA;
    const event = [item, anotherItem];
    this.queryConditions.filterConditions = event;
  }

  /**
   * 初始化表格
   */
  private initTable(): void {
    this.tableConfig = {
      isDraggable: true,
      primaryKey: '',
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '2000px', y: '325px'},
      columnConfig: this.$columnConfigService.getLogManagementColumnConfig(
        {dangerLevel: this.dangerLevel, optResult: this.optResult, optType: this.optTypeTem, optTime: this.countTime}),
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        {
          // 详情
          text: this.language.log.particulars,
          permissionCode: '02-3-3-6',
          className: 'icon-fiLink iconfont fiLink-view-detail',
          handle: (data: OperateLogModel) => {
            this.clickLogDetail(data);
          }
        }
      ],
      topButtons: [],
      sort: (e: SortCondition) => {
        this.queryConditions.sortCondition = e;
        this.createQueryConditions(false);
        this.searchList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.createQueryConditions(true);
        this.handleSearch(event);
      },
      // 导出任务
      handleExport: (event: ListExportModel<OperateLogModel[]>) => {
        event.columnInfoList.forEach(item => {
          if (item.propertyName === 'optTime') {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        const body = new ExportRequestModel(event.columnInfoList, event.excelType, new QueryConditionModel());
        body.columnInfoList.forEach(item => {
          if (item.propertyName === 'dangerLevel' || item.propertyName === 'optType' || item.propertyName === 'optResult') {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          event.queryTerm['logIds'] = event.selectItem.map(item => item.logId);
          body.queryCondition.filterConditions = [];
          body.queryCondition.filterConditions.push(
            new FilterCondition('logId', OperatorEnum.in, event.queryTerm['logIds'])
          );
        } else {
          body.queryCondition.filterConditions = this.queryConditions.filterConditions;
        }
        this.$logManageService[this.exportLog](body).subscribe((result: ResultModel<string>) => {
          if (result.code === 0) {
            this.$message.success(this.language.log.exportSuccess);
          } else {
            this.$message.info(result.msg);
          }
        });
      }
    };
    // 判断页面  用户日志和系统日志 没有操作类型
    this.$activatedRoute.url.subscribe((urlSegmentList: Array<UrlSegment>) => {
      if (urlSegmentList.find(urlSegment => urlSegment.path === 'security' || urlSegment.path === 'system')) {
        if (urlSegmentList.find(urlSegment => urlSegment.path === 'security')) {
          this.optType = LogTypeEnum.security;
        } else {
          this.optType = LogTypeEnum.system;
        }
        this.tableConfig.columnConfig = this.tableConfig.columnConfig.filter(item => item.key !== 'optType');
      }
    });
    this.$activatedRoute.queryParams.subscribe(result => {
      this.createQueryConditions(false);
      this.searchList();
    });
  }

  /**
   * 创建查询条件  主要是条件拼接
   */
  private createQueryConditions(isHandleSearch?: boolean): void {

    if (isHandleSearch) {
      this.queryConditions.pageCondition = {
        pageNum: 1,
        pageSize: this.pageBean.pageSize
      };
    } else {
      this.queryConditions.pageCondition = {
        pageNum: this.pageBean.pageIndex,
        pageSize: this.pageBean.pageSize
      };
    }

    // 默认操作时间降序
    if (!this.queryConditions.sortCondition['sortField']) {
      this.queryConditions.sortCondition = {
        sortField: 'optTime',
        sortRule: 'desc'
      };
    }

    // 别的页面跳转过来参数拼接
    if (isHandleSearch) {
      if (!this.queryConditions.filterConditions.some(item => item.filterField === 'optObjId')) {
        this.queryConditions.filterConditions = this.queryConditions.filterConditions.filter(item => item.filterField !== 'optObjId');
      }
    } else {
      if ('id' in this.$activatedRoute.snapshot.queryParams) {
        const ids = this.$activatedRoute.snapshot.queryParams.id;
        if (ids instanceof Array) {
          if (!this.queryConditions.filterConditions.some(item => item.filterField === 'optObjId') &&
            !this.queryConditions.filterConditions.some(item => item.filterField === 'optUserCode')) {
            this.queryConditions.filterConditions.push(new FilterCondition('optUserCode', OperatorEnum.in, ids));
          }
        } else {
          if (!this.queryConditions.filterConditions.some(item => item.filterField === 'optObjId')) {
            this.queryConditions.filterConditions.push(
              new FilterCondition('optObjId', OperatorEnum.eq, this.$activatedRoute.snapshot.queryParams.id)
            );
          }
        }

      } else {
        this.queryConditions.filterConditions = this.queryConditions.filterConditions.filter(item => item.filterField !== 'optObjId');
      }
    }
  }

  /**
   * 点击展示详情弹窗
   */
  private clickLogDetail(data: OperateLogModel): void {
    this.particulars = true;
    this.logInfo = data;
    // 判断日志类型 显示对应类型的标题
    if (this.optType === LogTypeEnum.operate) {
      this.particularsTitle =  this.language.systemSetting.operateLog + this.language.log.particulars;
    } else if (this.optType === LogTypeEnum.security) {
      this.particularsTitle =  this.language.systemSetting.securityLog + this.language.log.particulars;
      this.logInfo.optType = '';
    } else {
      this.particularsTitle = this.language.systemSetting.systemLog + this.language.log.particulars;
      this.logInfo.optType = '';
    }
  }
}
