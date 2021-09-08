import {Component, OnInit, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, UploadFile} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {AlarmDisableStatusEnum, OutputTypeEnum, TaskTypeEnum} from '../../../../share/enum/alarm.enum';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {DynamicCorrelationRuleModel} from '../../../../share/model/dynamic-correlation-rule.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {AlarmService} from '../../../../share/service/alarm.service';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {differenceInCalendarDays} from 'date-fns';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {WebUploadService} from '../../../../../../shared-module/service/web-upload/web-upload.service';
import {SupportFileType, WebUploaderModel} from '../../../../../../shared-module/model/web-uploader.model';
import {UploadBusinessModulesEnum} from '../../../../../../shared-module/enum/upload-business-modules.enum';
import {WebUploaderRequestService} from '../../../../../../core-module/api-service/web-uploader';
import {RequestParamModel} from '../../../../share/model/request-param.model';
import {ALARM_SET_SERVER} from '../../../../../../core-module/api-service/api-common.config';
import {SessionUtil} from '../../../../../../shared-module/util/session-util';

/**
 * 新增/编辑动态相关性规则
 */
@Component({
  selector: 'app-dynamic-correlation-rule-detail',
  templateUrl: './dynamic-correlation-rule-detail.component.html',
  styleUrls: ['./dynamic-correlation-rule-detail.component.scss']
})
export class DynamicCorrelationRuleDetailComponent implements OnInit, OnDestroy {
  // 任务数据
  @ViewChild('taskDataTemp') taskDataTemp: TemplateRef<any>;
  // 周期执行时间点
  @ViewChild('periodTimeTemp') periodTimeTemp: TemplateRef<any>;
  // 立即启动
  @ViewChild('autoStart') public autoStart: TemplateRef<any>;
  // 国际化
  public alarmLanguage: AlarmLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 页面标题
  public pageTitle: string;
  // form表单配置
  public formColumn: FormItem[] = [];
  // 表单校验
  public isFormDisabled: boolean = false;
  // 列表初始加载图标
  public isLoading: boolean = false;
  // 上传的文件序列
  public fileList: UploadFile[] = [];
  // 显示文件弹窗
  public isVisible: boolean = false;
  // 显示文件名
  public fileName: string;
  // 业务模块id
  public businessId: string = UploadBusinessModulesEnum.alarm;
  // 文件提示信息
  public uploadMsg: string;
  // 是否禁用编辑
  public isCanUpdate: boolean = false;
  // 支持的文件类型
  public defaultAccepts: SupportFileType = {
    title: '',
    extensions: 'xls,xlsx',
    mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  // 启动-停止
  public startEnum = AlarmDisableStatusEnum;
  // 是否立即启动
  private isStartAction: string = AlarmDisableStatusEnum.enable;
  // 页面类型
  private pageType: string;
  // 任务id
  private taskId: string = '';
  // 巡检模板表单实例
  private formStatus: FormOperate;
  // 新增或编辑成功
  private isUpdate: boolean = false;
  // 编辑之前的文件信息
  private fileMd5: string;
  // 编辑时数据
  private updateData: DynamicCorrelationRuleModel;
  // 在线编辑
  private isOnLine: boolean = false;
  // 记录切换状态
  private isChangeType: boolean = false;
  // 任务名称是否合法
  private taskNameCheck: boolean = true;

  constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $active: ActivatedRoute,
    private $ruleUtil: RuleUtil,
    private $message: FiLinkModalService,
    private $alarmService: AlarmService,
    private $webUpload: WebUploadService,
    private $uploadService: WebUploaderRequestService
  ) { }

  public ngOnInit(): void {
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.uploadMsg = this.alarmLanguage.fileMsg;
    this.pageJumpInit();
  }

  public ngOnDestroy(): void {
    localStorage.setItem('alarmSetTabsIndex', '1');
    if (!this.isUpdate) {
      this.$webUpload.deleteLoadFile.emit();
    }
  }

  /**
   * 日期禁用
   */
  public disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * 返回
   */
  public goBack(): void {
    this.$router.navigate([`/business/alarm/alarm-correlation-setting`]).then();
  }

  /**
   * 选择文件
   */
  public selectFile(): void {
    this.isVisible = true;
  }

  /**
   * 组件返回的文件信息
   */
  public getInputFile(data: WebUploaderModel): void {
    if (data) {
      this.fileName = data.fileName;
      this.formStatus.resetControlData('taskData', data);
    } else {
      this.formStatus.resetControlData('taskData', null);
      this.fileName = null;
    }
  }

  /**
   *  清除文件
   */
  public clearFile(event: boolean): void {
    if (event) {
      this.formStatus.resetControlData('taskData', null);
      this.fileName = null;
    }
  }
  /**
   * 表单绑定
   * @param event 表单对象
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    const that = this;
    this.formStatus.group.statusChanges.subscribe(param => {
      setTimeout(() => {
        that.isFormDisabled = that.formStatus.getRealValid();
      }, 2100);
      /*if (param.taskType === TaskTypeEnum.onLine) {
        delete param.action;
        delete param.taskData;
      } else {
        delete param.taskPeriod;
        delete param.periodExecutionTime;
      }
      let flag = false;
      for (const key in param) {
        if (param.hasOwnProperty(key)) {
          flag = that.formStatus.getValid(key);
          if (!flag) {
            break;
          }
        }
      }*/
      /*if (CommonUtil.trim(param.taskName)) {
        if (CommonUtil.trim(param.taskName).length > 64) {
          that.isFormDisabled = false;
          return;
        } else {
          that.isFormDisabled = !(!flag && this.taskNameCheck);
        }
      } else {
        that.isFormDisabled = false;
      }*/
    });
  }
  /**
   * 添加/修改/
   */
  public saveFormData(): void {
    const data = Object.assign({}, this.formStatus.getRealData());
    data.action = this.isStartAction;
    // 离线
    if (data.taskType === TaskTypeEnum.offLine) {
      delete data.taskPeriod;
      delete data.periodExecutionTime;
      data.fileMd5 = data.taskData.fileMd5;
      data.fileName = data.taskData.fileName;
      data.fileFullPath = data.taskData.fileFullPath;
      data.taskData = null;
    } else { // 在线
      delete data.taskData;
      if (data.periodExecutionTime) {
        const time = (new Date(data.periodExecutionTime)).getTime();
        data.periodExecutionTime = AlarmUtil.formatterMinutesAndSeconds(time, true);
      }
    }
    data.minSup = (data.minSup <= 0) ? '' : data.minSup;
    data.minConf = (data.minConf <= 0) ? '' : data.minConf;
    this.isLoading = true;
    // 新增
    if (this.pageType === OperateTypeEnum.add) {
      this.$alarmService.addDynamicRules(data).subscribe((result: ResultModel<RequestParamModel>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success && result.data) {
          this.isUpdate = true;
          this.goBack();
          this.$message.success(this.alarmLanguage.addSuccess);
          if (data.action === AlarmDisableStatusEnum.enable) {
            this.uploadFileIsFinished(result.data);
          }
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else if (this.pageType === OperateTypeEnum.update) {
      // 编辑
      data.id = this.taskId;
      this.$alarmService.editDynamicRules(data).subscribe((res: ResultModel<RequestParamModel>) => {
        this.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.isUpdate = true;
          this.$message.success(this.alarmLanguage.editSuccess);
          // 判断是否立即执行
          if (data.action === AlarmDisableStatusEnum.enable) {
            this.uploadFileIsFinished(res.data);
          }
          this.goBack();
        } else {
          this.$message.error(res.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 校验文件是否上传完成
   */
  private uploadFileIsFinished(param: RequestParamModel): void {
    const data = Object.assign({}, this.formStatus.getRealData());
    // 离线时，新增或者编辑成功后需要判断文件状态
    if (data.taskType === TaskTypeEnum.offLine) {
      // 文件上传完成且存在最小支持度和最小置信度，调用立即执行，数据挖掘
      if (data.taskData.fileFullPath && data.minConf && data.minSup) {
        data.id = param.id;
        data.filePath = data.taskData.fileFullPath;
        data.fileName = data.taskData.fileName;
        data.fileFullPath = data.taskData.fileFullPath;
        data.taskData = null;
        const userInfo = SessionUtil.getUserInfo();
        data.deptCode = userInfo.department.deptCode;
        this.$alarmService.executeRuleImmediately(data).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.alarmLanguage.executeSuccess);
          } else {
            this.$message.error(result.msg);
          }
        });
      } else {
        // 文件没有上传成功时，调用设置回调参数
        const callbackParam = new WebUploaderModel();
        callbackParam.fileMd5 = data.taskData.fileMd5;
        callbackParam.businessId = this.businessId;
        callbackParam.callBackParams = param.id;
        callbackParam.callBackUrl = `http://${ALARM_SET_SERVER}${param.url}`;
        this.$uploadService.callbackUpload(callbackParam).subscribe();
      }
    }
  }

  /**
   * 页面跳转初始化
   */
  private pageJumpInit(): void {
    const that = this;
    this.$active.queryParams.subscribe(param => {
      this.pageType = param.type;
      // 新增
      if (param.type === OperateTypeEnum.add) {
        that.pageTitle = that.alarmLanguage.addDynamicRules;
      } else {
        that.pageTitle = that.alarmLanguage.editDynamicRules;
        that.taskId = param.taskId;
        this.isCanUpdate = true;
        that.defaultData(param.taskId);
      }
      that.initColumn();
    });
  }

  /**
   * 编辑时回显数据
   * @param id 任务id
   */
  private defaultData(id: string): void {
    this.$alarmService.getRulesDetailById(id).subscribe((result: ResultModel<DynamicCorrelationRuleModel>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.periodExecutionTime >= 0) {
          const time = result.data.periodExecutionTime - 8 * 3600 * 1000;
          result.data.periodExecutionTime = new Date(CommonUtil.convertTime(time));
        }
        this.isStartAction = result.data.action ? result.data.action : AlarmDisableStatusEnum.disable;
        const obj = {
          fileFullPath: result.data.fileFullPath,
          fileName: result.data.fileName,
          fileMd5: result.data.fileMd5
        };
        this.fileName = obj.fileName;
        this.fileMd5 = obj.fileMd5;
        this.updateData = result.data;
        // this.isOnLine = result.data.taskType !== TaskTypeEnum.onLine;
        this.formStatus.resetData(result.data);
        if (result.data.taskType === TaskTypeEnum.offLine) {
          this.formStatus.resetControlData('taskData', obj);
        }
        this.isFormDisabled = true;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 初始化form表单
   */
  private initColumn(): void {
    this.formColumn = [
      { // 任务名称
        label: this.alarmLanguage.taskName,
        key: 'taskName', type: 'input',
        width: 300, require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(64),
          RuleUtil.getAlarmNamePatternRule(this.commonLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$alarmService.checkDynamicName(value, this.taskId),
            res => {
              if (res.code === ResultCodeEnum.success) {
                return true;
              } else {
                this.isFormDisabled = false;
                return false;
              }
            })
        ]
      },
      {// 任务类型
        label: this.alarmLanguage.taskType,
        key: 'taskType', type: 'radio',
        require: true, disabled: this.isCanUpdate,
        rule: [{required: true}],
        initialValue: TaskTypeEnum.onLine,
        radioInfo: {
          data: [
            {label: this.alarmLanguage.onLine, value: TaskTypeEnum.onLine}, // 在线
            {label: this.alarmLanguage.offLine, value: TaskTypeEnum.offLine}, // 离线
          ],
          label: 'label', value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          this.changeTaskType(event);
        }
      },
      {// 任务周期
        label: this.alarmLanguage.taskPeriod,
        hidden: this.isOnLine, require: true,
        key: 'taskPeriod', type: 'input',
        rule: [{required: true}, this.$ruleUtil.getTaskPeriodRule()],
      },
      { // 周期执行时间点
        label: this.alarmLanguage.executionTime,
        key: 'periodExecutionTime', type: 'custom',
        template: this.periodTimeTemp, require: true,
        hidden: this.isOnLine, rule: [{required: true}],
      },
      {// 任务数据
        label: this.alarmLanguage.taskData,
        hidden: !this.isOnLine, require: true,
        rule: [{required: true}],
        key: 'taskData', type: 'custom',
        template: this.taskDataTemp,
      },
      {// 输出类型
        label: this.alarmLanguage.outputType,
        key: 'outputType', type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: OutputTypeEnum.automatic,
        radioInfo: {
          data: [
            {label: this.alarmLanguage.automatic, value: OutputTypeEnum.automatic}, // 自动
            {label: this.alarmLanguage.manual, value: OutputTypeEnum.manual}, // 手动
          ],
          label: 'label', value: 'value'
        },
      },
      {// 时间窗口（秒）
        label: this.alarmLanguage.timeWindow,
        key: 'timeWindow', type: 'input',
        require: true, initialValue: 10,
        rule: [{required: true}, this.$ruleUtil.getAlarmLimit()],
      },
      {// 最小支持度
        label: this.alarmLanguage.minimumSupport,
        key: 'minSup', type: 'input',
        initialValue: 0.6,
        rule: [this.$ruleUtil.getTaskMinSup()],
      },
      {// 最小置信度
        label: this.alarmLanguage.minimumConfidence,
        key: 'minConf', type: 'input',
        initialValue: 0.6,
        rule: [this.$ruleUtil.getTaskMinSup()],
      },
      {// 是否立即启动
        label: this.alarmLanguage.isStartNow,
        key: 'action', type: 'custom',
        rule: [], hidden: true,
        template: this.autoStart,
      },
      {// 备注
        label: this.alarmLanguage.remark,
        key: 'remark', type: 'textarea',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
    ];
    this.formColumn.forEach(item => item.labelWidth = 170);
  }

  /**
   * 切换任务类型
   * @param type string
   */
  private changeTaskType(type: string): void {
    if (type === TaskTypeEnum.onLine) {
      this.isStartAction = AlarmDisableStatusEnum.enable;
      // 在线清空任务数据
      this.formStatus.resetControlData('taskData', null);
    } else {
      // 离线清空任务周期和时间点
      this.formStatus.resetControlData('taskPeriod', null);
      this.formStatus.resetControlData('periodExecutionTime', null);
    }
    this.formColumn.forEach((item, index) => {
      // 在线
      if (type === TaskTypeEnum.onLine) {
        if (item.key === 'taskPeriod' || item.key === 'periodExecutionTime') {
          item.hidden = false;
        }
        if (item.key === 'taskData' || item.key === 'action') {
          item.hidden = true;
        }
      } else if (type === TaskTypeEnum.offLine) {  // 离线
        if (item.key === 'taskPeriod' || item.key === 'periodExecutionTime') {
          item.hidden = true;
        }
        if (item.key === 'taskData' || item.key === 'action') {
          item.hidden = false;
        }
      }
    });
  }

}
