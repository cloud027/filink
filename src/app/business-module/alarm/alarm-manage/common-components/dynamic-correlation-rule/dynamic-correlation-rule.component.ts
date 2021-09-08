import {Component, OnInit, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {Router} from '@angular/router';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {DynamicCorrelationRuleModel} from '../../../share/model/dynamic-correlation-rule.model';
import {AlarmService} from '../../../share/service/alarm.service';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {AlarmDisableStatusEnum, OutputTypeEnum, TaskStatusEnum, TaskTypeEnum} from '../../../share/enum/alarm.enum';
import {AlarmOperationModel} from '../../../share/model/alarm-operation.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {WebUploaderRequestService} from '../../../../../core-module/api-service/web-uploader';
import {UploadBusinessModulesEnum} from '../../../../../shared-module/enum/upload-business-modules.enum';
import {SessionUtil} from '../../../../../shared-module/util/session-util';

/**
 * 动态相关性规则列表
 */
@Component({
  selector: 'app-dynamic-correlation-rule',
  templateUrl: './dynamic-correlation-rule.component.html',
  styleUrls: ['./dynamic-correlation-rule.component.scss']
})
export class DynamicCorrelationRuleComponent implements OnInit, OnDestroy {
  // 进度
  @ViewChild('completeSchedule') completeSchedule: TemplateRef<any>;
  // 周期执行时间点
  @ViewChild('periodTimeQueryTemp') periodTimeQueryTemp: TemplateRef<any>;
  // 任务周期
  @ViewChild('taskPeriodTemp') taskPeriodTemp: TemplateRef<any>;
  // 时间窗口
  @ViewChild('timeWindowTemp') timeWindowTemp: TemplateRef<any>;
  // 最小支持度
  @ViewChild('minSupTemp') minSupTemp: TemplateRef<any>;
  // 最小置信度
  @ViewChild('minConfTemp') minConfTemp: TemplateRef<any>;
  // 表格启用禁用模板
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 告警相关性规则数据
  public dataSet: DynamicCorrelationRuleModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 是否禁启用
  public ableStatus = AlarmDisableStatusEnum;
  // 任务状态
  public taskTypeEnum = TaskTypeEnum;
  // 定时刷新
  private timer: any;
  // 列表查询时的周期时间，用于定时刷新
  private selectPeriodTime: number | string;
  constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $alarmService: AlarmService,
    private $uploadService: WebUploaderRequestService,
  ) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.initTableConfig();
    this.refreshData();
    this.refreshList();
  }

  public ngOnDestroy(): void {
    clearInterval(this.timer);
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
   * 输入校验
   */
  public checkInputValue(filter, event): void {
    // 小数或者整数
    const val = CommonUtil.trim(event.target.value);
    if (event.key !== '.') {
      const reg = new RegExp(/^([0-9]{1,2})+(.[0-9]{1,5})?$/);
      if (reg.test(val)) {
        filter.filterValue = val;
        event.target.value = val;
      } else {
        filter.filterValue = '';
        event.target.value = '';
      }
    } else {
      // 有两位小数点时
      if ((val.split('.')).length > 2) {
        filter.filterValue = '';
        event.target.value = '';
      }
    }
  }
  /**
   *  单个启用和禁用
   */
  public clickSwitch(data: DynamicCorrelationRuleModel) {
    data.isDisabled = true;
    const param = new AlarmOperationModel();
    param.ids = [data.id];
    if (data.action === AlarmDisableStatusEnum.enable) {
      param.action = AlarmDisableStatusEnum.disable;
    } else {
      param.action = AlarmDisableStatusEnum.enable;
    }
    this.$alarmService.changeStatus(param).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        if (data.action === AlarmDisableStatusEnum.enable) {
          data.action = AlarmDisableStatusEnum.disable;
          this.$message.success(this.language.disabledSuccess);
        } else {
          data.action = AlarmDisableStatusEnum.enable;
          this.$message.success(this.language.enabledSuccess);
        }
        data.isDisabled = false;
      } else {
        this.$message.error(result.msg);
        data.isDisabled = false;
      }
    });
    data.isDisabled = false;
  }
  /**
   * 动态相关性规则列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const keys = ['taskPeriod', 'timeWindow', 'minSup', 'minConf'];
    this.queryCondition.filterConditions.forEach(item => {
      if (keys.includes(item.filterField)) {
        item.operator = OperatorEnum.lte;
      }
      if (item.filterField === 'periodExecutionTime') {
        item.filterValue = this.selectPeriodTime;
        item.operator = OperatorEnum.lte;
      }
    });
    this.$alarmService.queryDynamicList(this.queryCondition).subscribe((result: ResultModel<DynamicCorrelationRuleModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(item => {
          // 任务状态
          item.taskStatusName = '';
          if (item.taskStatus) {
            item.taskStatusName = AlarmUtil.translateTaskStatus(this.$nzI18n, item.taskStatus);
          }
          // 任务类型
          item.taskTypeName = '';
          if (item.taskType) {
            item.taskTypeName = AlarmUtil.translateTaskType(this.$nzI18n, item.taskType);
          }
          // 输出类型
          item.outputTypeName = '';
          if (item.outputType) {
            item.outputTypeName = AlarmUtil.translateOutputType(this.$nzI18n, item.outputType);
          }
          if (!item.completeProgress) {
            item.completeProgress = 0;
          }
          // 周期时间
          item.periodDate = '';
          if (item.taskType === TaskTypeEnum.onLine && item.periodExecutionTime >= 0) {
            item.periodDate = AlarmUtil.formatterMinutesAndSeconds(item.periodExecutionTime, false);
          }
          // 离线的规则不能修改状态
          item.isDisabled = item.taskType === TaskTypeEnum.offLine;
          // 执行中的任务不能编辑和删除
          item.isExecute = item.taskStatus !== TaskStatusEnum.executing;
          // 任务数据
          item.filePath = item.fileFullPath;
          /*if (item.fileFullPath && JSON.parse(item.fileFullPath)) {
            item.fileName = JSON.parse(item.fileFullPath).fileName;
            item.filePath = JSON.parse(item.fileFullPath).fileFullPath;
          }*/
        });
        this.dataSet = list;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
      } else {
        this.$message.error(result.msg);
      }
      this.tableConfig.isLoading = false;
    }, error => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 定时刷新, 30秒刷新一次列表
   */
  private refreshList(): void {
    this.timer = setInterval(() => {
      this.refreshData();
    }, 30000);
  }

  /**
   * 表格配置初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-7-1',
      showSearchSwitch: true,
      notShowPrint: false,
      showRowSelection: false,
      showSizeChanger: true,
      noIndex: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 任务名称
          title: this.language.taskName, key: 'taskName',
          width: 150, configurable: true,
          searchable: true, isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          // 任务状态
          title: this.language.taskStatus, key: 'taskStatusName',
          width: 150, configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'taskStatus',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmUtil.enumToArray(this.language, TaskStatusEnum),
          }
        },
        {
          // 启用状态
          title: this.language.startStatus, key: 'action', width: 130,
          configurable: true, isShowSort: true,
          type: 'render', searchable: true, searchKey: 'action',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: [
              {label: this.language.start, value: AlarmDisableStatusEnum.disable},
              {label: this.language.stop, value: AlarmDisableStatusEnum.enable}
            ]
          }
        },
        {
          // 任务类型
          title: this.language.taskType, key: 'taskTypeName',
          width: 150, configurable: true,
          searchKey: 'taskType',
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: [
              {label: this.language.onLine, value: TaskTypeEnum.onLine},
              {label: this.language.offLine, value: TaskTypeEnum.offLine}
            ]
          }
        },
        { // 任务周期
          title: this.language.taskPeriod, key: 'taskPeriod',
          width: 150, configurable: true,
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.taskPeriodTemp,
          },
        },
        { // 周期执行时间点
          title: this.language.executionTime, key: 'periodDate',
          width: 150, configurable: true,
          searchKey: 'periodExecutionTime',
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.periodTimeQueryTemp,
          },
        },
        { // 任务数据
          title: this.language.taskData, key: 'fileName',
          width: 130, configurable: true,
          searchable: true, isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // 开始时间
          title: this.language.startDate, key: 'startTime',
          configurable: true, width: 150,
          isShowSort: true, searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        { // 完成进度
          title: this.language.completeProgress, key: 'completeProgress', width: 150,
          configurable: true,
          searchable: false, isShowSort: true,
          type: 'render',
          renderTemplate: this.completeSchedule,
        },
        { // 输出类型
          title: this.language.outputType, key: 'outputTypeName',
          width: 150, configurable: true,
          searchKey: 'outputType',
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: [
              {label: this.language.automatic, value: OutputTypeEnum.automatic},
              {label: this.language.manual, value: OutputTypeEnum.manual}
            ]
          }
        },
        { // 备注
          title: this.language.remark, key: 'remark', width: 130,
          configurable: true, searchable: false,
          isShowSort: true, remarkPipe: 'remark'
        },
        { // 时间窗口（秒）
          title: this.language.timeWindow, key: 'timeWindow',
          width: 130, configurable: true,
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.timeWindowTemp,
          },
        },
        { // 最小支持度
          title: this.language.minimumSupport, key: 'minSup',
          width: 130, configurable: true,
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.minSupTemp,
          },
        },
        { // 最小置信度
          title: this.language.minimumConfidence, key: 'minConf',
          width: 130, configurable: true,
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.minConfTemp,
          },
        },
        { // 操作
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 120, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'array',
      operation: [
        {
          // 编辑
          text: this.language.update,
          permissionCode: '02-3-7-1-2',
          className: 'fiLink-edit',
          key: 'isExecute',
          handle: (data: DynamicCorrelationRuleModel) => {
            this.$router.navigate([`/business/alarm/alarm-correlation-setting/dynamic-correlation-rule-edit`],
              {queryParams: {type: OperateTypeEnum.update, taskId: data.id}}).then();
          }
        },
        { // 查看结果
          text: this.language.viewResults,
          permissionCode: '02-3-7-1-6',
          className: 'fiLink-view-results',
          handle: (data: DynamicCorrelationRuleModel) => {
            this.$router.navigate([`/business/alarm/alarm-correlation-setting/dynamic-correlation-view`],
              {queryParams: {taskId: data.id}}).then();
          }
        },
        { // 删除
          text: this.language.deleteHandle,
          permissionCode: '02-3-7-1-3',
          needConfirm: true,
          key: 'isExecute',
          className: 'fiLink-delete red-icon',
          handle: (data: DynamicCorrelationRuleModel) => {
            // 执行中的任务不能删除
            if (data.taskStatus === TaskStatusEnum.executing) {
              this.$message.warning(this.language.executingDelete);
              return;
            }
            // 在线且启用的不能删除
            if (data.taskType === TaskTypeEnum.onLine) {
              if (data.action === AlarmDisableStatusEnum.enable) {
                this.$message.warning(this.language.openStateDisableDelect);
              } else {
                this.deleteRules([data.id], [data]);
              }
            } else {
              this.deleteRules([data.id], [data]);
            }
          }
        }
      ],
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '02-3-7-1-1',
          handle: () => {
            this.$router.navigate([`/business/alarm/alarm-correlation-setting/dynamic-correlation-rule-add`],
              {queryParams: {type: OperateTypeEnum.add}}).then();
          }
        }, {
          // 删除
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-7-1-3',
          handle: (data: DynamicCorrelationRuleModel[]) => {
            // 先判断是离线还是在线
            let offTotal = 0;
            let onTotal = 0;
            // 是否有执行中的任务
            let isExecuting = false;
            data.forEach(v => {
              if (v.taskType === TaskTypeEnum.onLine) {
                onTotal++;
              } else {
                offTotal++;
              }
              // 执行中的任务不能删除
              if (v.taskStatus === TaskStatusEnum.executing) {
                isExecuting = true;
              }
            });
            if (isExecuting) {
              this.$message.error(this.language.executingDelete);
              return;
            }
            // 全部是离线， 可以直接删除不用校验状态
            if (offTotal === data.length) {
              const ids = data.map(item => item.id);
              this.deleteRules(ids, data);
            } else if (onTotal === data.length) {
              // 全部是在线，需要校验状态，启用状态不能删除
              if (data.find(item => item.action === AlarmDisableStatusEnum.enable)) {
                this.$message.warning(this.language.openStateDisableDelect);
              } else {
                const ids = data.map(item => item.id);
                this.deleteRules(ids, data);
              }
            } else {
              // 两种类型都有
              if (data.find(item => item.action === AlarmDisableStatusEnum.enable && item.taskType === TaskTypeEnum.onLine)) {
                this.$message.warning(this.language.notDeleteOnLineTask);
              } else {
                const ids = data.map(item => item.id);
                this.deleteRules(ids, data);
              }
            }
          }
        }
      ],
      moreButtons: [
        { // 启用
          text: this.language.start,
          iconClassName: 'fiLink-enable',
          permissionCode: '02-3-7-1-4',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isStart,
          handle: (e: DynamicCorrelationRuleModel[]) => {
            this.changeTaskStatus(e, AlarmDisableStatusEnum.enable);
          }
        },
        { // 禁用
          text: this.language.stop,
          iconClassName: 'fiLink-disable-o',
          permissionCode: '02-3-7-1-4',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isStop,
          handle: (e: DynamicCorrelationRuleModel[]) => {
            this.changeTaskStatus(e, AlarmDisableStatusEnum.disable);
          }
        },
        { // 立即执行
          text: this.language.executeImmediately,
          iconClassName: 'fiLink-implement',
          permissionCode: '02-3-7-1-5',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.language.isExecuteImmediately,
          handle: (e: DynamicCorrelationRuleModel[]) => {
            if (e.length > 1 || e.length === 0) {
              this.$message.error(this.language.executeOneTask);
            } else {
              if (e[0].taskStatus === TaskStatusEnum.executing) {
                this.$message.error(this.language.notExecute);
              } else {
                if (e[0].minConf && e[0].minSup) {
                  this.executeImmediately(e[0]);
                }
              }
            }
          }
        }
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'taskTypeName') {
          event.sortField = 'taskType';
        }
        if (event.sortField === 'taskStatusName') {
          event.sortField = 'taskStatus';
        }
        if (event.sortField === 'outputTypeName') {
          event.sortField = 'outputType';
        }
        if (event.sortField === 'periodDate') {
          event.sortField = 'periodExecutionTime';
        }
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        event.forEach(item => {
          if (item.filterField === 'periodExecutionTime') {
            this.selectPeriodTime = AlarmUtil.formatterMinutesAndSeconds(item.filterValue, true);
          }
        });
        this.refreshData();
      },
    };
  }

  /**
   * 删除规则
   */
  private deleteRules(ids: string[], data: DynamicCorrelationRuleModel[]): void {
    this.$alarmService.deleteDynamicRules(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.deleteSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
        this.deleteUploadFile(data);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 删除文件
   */
  private deleteUploadFile(data: DynamicCorrelationRuleModel[]): void {
    const that = this;
    data.forEach(item => {
      if (item.taskType === TaskTypeEnum.offLine && item.fileMd5) {
        const param = {
          fileMd5: item.fileMd5,
          businessId: UploadBusinessModulesEnum.alarm
        };
        that.$uploadService.deleteLoadFile(param).subscribe((res: ResultModel<string>) => {
          if (res.code === '0') {
            console.log('delete file');
          }
        });
      }
    });
  }

  /**
   *  启用-禁用
   */
  private changeTaskStatus(data: DynamicCorrelationRuleModel[], code: string): void {
    const param = new AlarmOperationModel();
    param.action = code;
    param.ids = [];
    data.forEach(item => {
      item.isDisabled = true;
      // 取在线任务
      if (item.taskType === TaskTypeEnum.onLine) {
        param.ids.push(item.id);
      }
    });
    if (param.ids.length === 0) {
      data.forEach(v => v.isDisabled = false);
      this.refreshData();
      return;
    }
    this.$alarmService.changeStatus(param).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        if (code === AlarmDisableStatusEnum.disable) {
          this.$message.success(this.language.disabledSuccess);
        } else {
          this.$message.success(this.language.enabledSuccess);
        }
        this.refreshData();
      } else {
        this.$message.error(result.msg);
        data.forEach(v => v.isDisabled = false);
      }
    }, res => {
      data.forEach(v => v.isDisabled = false);
    });
  }

  /**
   * 立即执行
   */
  private executeImmediately(data: DynamicCorrelationRuleModel): void {
    // 开始执行时刷新一次列表
    setTimeout(() => {
      this.refreshData();
    }, 750);
    if (!data.deptCode) {
      const userInfo = SessionUtil.getUserInfo();
      data.deptCode = userInfo.department.deptCode;
    }
    this.$alarmService.executeRuleImmediately(data).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.executeSuccess);
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

}
