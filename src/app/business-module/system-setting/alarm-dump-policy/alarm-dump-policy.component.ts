import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FormItem} from '../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../shared-module/component/form/form-operate.service';
import {ColumnConfigService} from '../share/service/column-config.service';
import {SystemParameterService} from '../share/service';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {AlarmDumpEnum, KeyEnum, PageTypeEnum, TaskStatusEnum} from '../share/enum/system-setting.enum';
import {ResultModel} from '../../../shared-module/model/result.model';
import {SystemParamModel} from '../share/mode/system-param.model';
import {DumpInfoModel} from '../share/mode/dump-info.model';
import {DateFormatStringEnum} from '../../../shared-module/enum/date-format-string.enum';
import {SystemInterface} from '../../../../assets/i18n/system-setting/system.interface';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {DUMP_INTERVAL_CONST, TRIGGER_CONDITION_CONST} from '../share/const/system.const';
import {FormGroup} from '@angular/forms';
import {AlarmDumpModel} from '../share/mode/alarm-dump.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {SystemDumpPageEnum} from '../../../core-module/enum/system/system-dump-page.enum';

/**
 * 转储设置
 */
@Component({
  selector: 'app-alarm-dump-policy',
  templateUrl: './alarm-dump-policy.component.html',
  styleUrls: ['./alarm-dump-policy.component.scss']
})
export class AlarmDumpPolicyComponent implements OnInit {
  // 下次执行时间
  @ViewChild('monthTemp') monthTemp: TemplateRef<any>;
  // 立即执行
  @ViewChild('implementationTemp') implementationTemp: TemplateRef<any>;
  // 执行进度
  @ViewChild('progressTemp') progressTemp: TemplateRef<any>;
  // 立即执行底部按钮
  @ViewChild('footerTemp') footerTemp: TemplateRef<any>;
  // 按钮loading状态
  public btnLoading: boolean = false;
  // 进度值
  public progress: string | number;
  // 页面标题
  public pageTitle: string;
  // 页面类型
  public pageType: string;
  // 页面类型编号 11为告警
  public pageTypeNum: number;
  // 国际化
  public DumpLanguage: SystemInterface;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 立即执行表单配置
  public formColumnImplementation: FormItem[] = [];
  public formStatus: FormOperate;
  public formStatusImplementation: FormOperate;
  // 表单禁用
  public formDisable: Array<string> = [];
  // 表单启用list
  public formEnable: Array<string> = [];
  // 启用禁用转储
  public enableAlarmDumpList: Array<string> = [];
  // 默认转储策略
  private defaultDump: AlarmDumpModel;
  // 当前转储策略
  public nowDump: AlarmDumpModel;
  // 立即执行状态
  public taskStatus: number;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 确定按钮的状态
  public isSystemDisabled: boolean = false;
  // 当前转储策略id
  private paramId: string;
  // 当前转储任务id
  private taskId: string;
  // 立即执行modal框
  private implementationModal;
  // 国际化
  private commonLanguage: CommonLanguageInterface;


  constructor(private $activatedRoute: ActivatedRoute,
              private $nzI18n: NzI18nService,
              public modalService: NzModalService,
              private $columnConfigService: ColumnConfigService,
              private $dumpService: SystemParameterService,
              private $modal: NzModalService,
              private $message: FiLinkModalService
  ) {
  }

  public ngOnInit(): void {
    this.DumpLanguage = this.$nzI18n.getLocaleData(LanguageEnum.systemSetting);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.pageType = this.$activatedRoute.snapshot.url[1].path;
    this.pageTitle = this.getPageTitle(this.pageType);
    this.queryDefaultDumpPolicy();
    this.initFormColumn();
  }

  /**
   * 获取表单实例
   * param event
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 校验表单
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isSystemDisabled = this.formStatus.getRealValid();
    });
  }

  /**
   * 立即执行表单实例
   * param event
   */
  public formInstanceImplementation(event): void {
    this.formStatusImplementation = event.instance;
  }

  /**
   * 获取标题
   * param type
   * returns {string}
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case SystemDumpPageEnum.systemLog:
        title = this.DumpLanguage.systemLogDumpStrategy;
        this.pageTypeNum = PageTypeEnum.systemLog;
        this.formColumn = this.$columnConfigService.getSystemDumpSettingConfig({modelChange: this.modelChange});
        break;
      case SystemDumpPageEnum.alarm:
        title = this.DumpLanguage.alarmDumpStrategy;
        this.pageTypeNum = PageTypeEnum.alarm;
        this.formColumn = this.$columnConfigService.getAlarmDumpSettingConfig({modelChange: this.modelChange});
        break;
      case SystemDumpPageEnum.facilityLog:
        title = this.DumpLanguage.equipmentLogDumpStrategy;
        this.pageTypeNum = PageTypeEnum.facilityLog;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange}, type);
        break;
      case SystemDumpPageEnum.inspection:
        title = this.DumpLanguage.inspectionDumpStrategy;
        this.pageTypeNum = PageTypeEnum.inspection;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange}, type);
        break;
      case SystemDumpPageEnum.clearBarrier:
        title = this.DumpLanguage.clearBarrierLogDumpStrategy;
        this.pageTypeNum = PageTypeEnum.clearBarrier;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange}, type);
        break;
      case SystemDumpPageEnum.installation:
        title = this.DumpLanguage.installDumpStrategy;
        this.pageTypeNum = PageTypeEnum.installation;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange}, type);
        break;
      case SystemDumpPageEnum.alarmConfirm:
        this.pageTypeNum = PageTypeEnum.alarmConfirm;
        title = this.DumpLanguage.alarmConfirmDumpStrategy;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange}, type);
        break;
      case SystemDumpPageEnum.trouble:
        this.pageTypeNum = PageTypeEnum.trouble;
        title = this.DumpLanguage.troubleDumpStrategy;
        this.formColumn = this.$columnConfigService.getFacilityDumpSettingConfig({modelChange: this.modelChange}, type);
        break;
    }
    return title;
  }

  /**
   * 监听表单数据变化
   * param controls
   * param $event
   * param key
   */
  modelChange = (controls: FormGroup, $event: string, key: string) => {
    if (key === KeyEnum.enableDump) {
      this.enableAlarmDumpList = ['triggerCondition', 'dumpOperation', 'turnOutNumber'];
      if ($event === AlarmDumpEnum.disable) {
        this.setValueForRadio(this.enableAlarmDumpList);
        this.setFormDisable(this.enableAlarmDumpList);
      } else {
        this.setValueForRadio(this.enableAlarmDumpList);
        this.setFormEnable(this.enableAlarmDumpList);
      }
    }
    if (key === KeyEnum.triggerCondition) {
      this.formDisable = ['dumpQuantityThreshold'];
      this.formStatus.group.controls['dumpInterval'].setValue(DUMP_INTERVAL_CONST);
      this.formEnable = ['dumpInterval'];
      if (this.formStatus.group.controls['enableDump'].value === AlarmDumpEnum.enable) {
        if ($event === AlarmDumpEnum.disable) {
          this.setFormEnable(this.formDisable);
          this.formStatus.group.controls['dumpInterval'].setValue(DUMP_INTERVAL_CONST);
          this.setFormDisable(this.formEnable);
        } else {
          this.setFormEnable(this.formEnable);
          this.setFormDisable(this.formDisable);
        }
      } else {
        this.setFormDisable(this.formDisable.concat(this.formEnable));
      }
    }
    if (key === KeyEnum.dumpOperation) {
      this.formDisable = ['dumpPlace'];
      if (this.formStatus.group.controls['enableDump'].value === AlarmDumpEnum.enable) {
        if ($event === AlarmDumpEnum.disable) {
          this.formStatus.group.controls['dumpPlace'].setValue(AlarmDumpEnum.disable);
          this.setFormDisable(this.formDisable);
        } else {
          this.setFormEnable(this.formDisable);
        }
      } else {
        this.setFormDisable(this.formDisable);
      }
    }
  }

  /**
   * 表单禁用
   * param controlNameList 需要表单禁用list
   */
  private setFormDisable(controlNameList: Array<string>): void {
    controlNameList.forEach(item => {
      this.formStatus.group.controls[item].disable();
    });
  }

  /**
   * 表单启用
   * param controlNameList 需要表单启用list
   */
  private setFormEnable(controlNameList: Array<string>): void {
    controlNameList.forEach(item => {
      this.formStatus.group.controls[item].enable();
    });
  }

  /**
   * 为表单设置值，避免单选按钮启用禁用失效
   * param radioList 需要设置的单选按钮的值
   * param bol true为单选按钮时，false为下拉框时 将值置为空
   */
  private setValueForRadio(radioList: Array<string>, bol = true): void {
    radioList.forEach(item => {
      this.formStatus.group.controls[item].setValue(bol ? this.formStatus.group.controls[item].value : null);
    });
  }

  /**
   * 恢复默认
   */
  public restoreDefault(): void {
    this.setFormValue(this.defaultDump);
  }

  /**
   * 查询策略
   */
  private queryDefaultDumpPolicy(): void {
    this.$dumpService.queryDumpPolicy(this.pageTypeNum).subscribe((result: ResultModel<SystemParamModel>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data) {
          this.defaultDump = JSON.parse(result.data.defaultValue);
          this.paramId = result.data.paramId;
          this.nowDump = JSON.parse(result.data.presentValue);
          this.setFormValue(this.nowDump);
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 设置表单值
   */
  private setFormValue(valueType: AlarmDumpModel): void {
    Object.keys(this.formStatus.group.controls).forEach(item => {
      this.formStatus.group.controls[item].setValue(valueType[item]);
    });
  }

  /**
   * 点击确定更新转储策略
   */
  public updateDump(): void {
    this.btnLoading = true;
    const updateData = {
      paramId: this.paramId,
      paramType: this.pageTypeNum,
      dumpBean: {
        enableDump: this.formStatus.group.controls['enableDump'].value,
        triggerCondition: this.formStatus.group.controls['triggerCondition'].value,
        dumpQuantityThreshold: this.formStatus.group.controls['dumpQuantityThreshold'].value,
        dumpInterval: this.formStatus.group.controls['dumpInterval'].value,
        dumpOperation: this.formStatus.group.controls['dumpOperation'].value,
        dumpPlace: this.formStatus.group.controls['dumpPlace'].value,
        turnOutNumber: this.formStatus.group.controls['turnOutNumber'].value,
      }
    };
    this.$dumpService.updateDumpPolicy(updateData).subscribe((result: ResultModel<string>) => {
      this.btnLoading = false;
      if (result.code === 0) {
        this.queryDefaultDumpPolicy();
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.btnLoading = false;
    });
  }

  /**
   * 立即执行弹框
   */
  public implementation(): void {
    this.$dumpService.queryNowDumpInfo(this.pageTypeNum).subscribe((result: ResultModel<DumpInfoModel>) => {
      if (result.code === 0) {
        this.implementationModal = this.$modal.create({
          nzTitle: this.DumpLanguage.implementation,
          nzContent: this.implementationTemp,
          nzOkText: this.DumpLanguage.executeImmediately,
          nzCancelText: this.DumpLanguage.cancel,
          nzOkType: 'danger',
          nzClassName: 'custom-create-modal',
          nzMaskClosable: false,
          nzFooter: this.footerTemp
        });
        // 初始化配置
        this.progress = '0.00';
        if (result.data) {
          this.taskId = result.data.taskInfoId;
          this.setImplementationData(result.data);
        }
      }
    });
  }

  /**
   * 设置立即执行modal框内表单的值
   * param data
   */
  private setImplementationData(data: DumpInfoModel): void {
    if (this.nowDump.triggerCondition === TRIGGER_CONDITION_CONST) {
      data.nowTime = data.tsCreateTime ? CommonUtil.dateFmt(DateFormatStringEnum.dateTime, new Date(data.tsCreateTime)) : null;
      data.nextTime = data.nextExecutionTime ? CommonUtil.dateFmt(DateFormatStringEnum.dateTime, new Date(data.nextExecutionTime)) : null;
    } else {
      data.nowTime = data.tsCreateTime ? CommonUtil.dateFmt(DateFormatStringEnum.dateTime, new Date(data.tsCreateTime)) : null;
      data.nextTime = null;
    }
    data.implementationNum = data.dumpAllNumber;
    this.taskStatus = data.taskStatus;
    if (data.taskStatus === TaskStatusEnum.success) {
      data.nowStatus = this.DumpLanguage.success;
      this.progress = 100;
    } else if (data.taskStatus === TaskStatusEnum.error) {
      data.nowStatus = this.DumpLanguage.error;
      this.getProgress(data);
    } else if (data.taskStatus === TaskStatusEnum.notPerformed) {
      data.nowStatus = this.DumpLanguage.notPerformed;
      this.getProgress(data);
    } else {
      data.nowStatus = this.DumpLanguage.runImplementation;
      this.getProgress(data);
    }
    setTimeout(() => {
      this.formStatusImplementation.resetData(data);
    }, 500);
    if (data.taskStatus !== TaskStatusEnum.success
      && data.taskStatus !== TaskStatusEnum.error
      && data.taskStatus !== TaskStatusEnum.notPerformed
      && this.taskId) {
      this.pollingTask();
    }
  }

  /**
   * 进度条的值
   */
  private getProgress(data: DumpInfoModel): void {
    if (data.fileNum !== 0) {
      this.progress = (Number(data.fileGeneratedNum / data.fileNum) * 100).toFixed(2);
    } else {
      this.progress = '0.00';
    }
  }

  /**
   * 初始化表单配置
   */
  private initFormColumn(): void {
    this.formColumnImplementation = [
      {
        label: this.DumpLanguage.nowExecutionTime,
        key: 'nowTime',
        type: 'input',
        placeholder: ' ',
        labelWidth: 160,
        disabled: true,
        col: 24,
        rule: [],
      },
      {
        label: this.DumpLanguage.nextExecutionTime,
        key: 'nextTime',
        labelWidth: 160,
        placeholder: ' ',
        col: 24,
        asyncRules: [],
        type: 'input',
        disabled: true,
        rule: [],
      },
      {
        label: this.DumpLanguage.executionNum,
        key: 'implementationNum',
        labelWidth: 160,
        placeholder: ' ',
        col: 24,
        disabled: true,
        type: 'input',
        rule: [],
      },
      {
        label: this.DumpLanguage.executionStatus,
        key: 'nowStatus',
        labelWidth: 160,
        placeholder: ' ',
        type: 'input',
        disabled: true,
        col: 24,
        rule: [],
      },
      {
        label: this.DumpLanguage.executionPro,
        key: 'progress',
        labelWidth: 160,
        type: 'custom',
        template: this.progressTemp,
        col: 24,
        rule: [],
      }
    ];
  }

  /**
   * 对正在执行的任务进行轮询查看
   */
  private pollingTask(): void {
    if (this.formStatusImplementation.group.controls['nowStatus'].value === this.DumpLanguage.runImplementation) {
      this.$dumpService.queryDumpInfo(this.taskId).subscribe((result: ResultModel<DumpInfoModel>) => {
        const data = result.data;
        if (data.taskStatus === TaskStatusEnum.success) {
          this.progress = 100;
          this.formStatusImplementation.group.controls['nowStatus'].setValue(this.DumpLanguage.success);
        } else if (data.taskStatus === TaskStatusEnum.error || data.taskStatus === TaskStatusEnum.notPerformed) {
          this.getProgress(data);
          this.formStatusImplementation.group.controls['nowStatus'].setValue(this.DumpLanguage.error);
        } else {
          this.getProgress(data);
          setTimeout(() => this.pollingTask(), 5000);
        }
      });
    }
  }

  /**
   * 手动执行转储任务
   */
  private handDump(): void {
    let type: number;
    switch (this.pageTypeNum) {
      case PageTypeEnum.alarm:
        type = TaskStatusEnum.alarm;
        break;
      case PageTypeEnum.facilityLog:
        type = TaskStatusEnum.success;
        break;
      case PageTypeEnum.systemLog:
        type = TaskStatusEnum.system;
        break;
      case PageTypeEnum.inspection:
        type = TaskStatusEnum.inspection;
        break;
      case PageTypeEnum.clearBarrier:
        type = TaskStatusEnum.clearBarrier;
        break;
      case PageTypeEnum.installation:
        type = TaskStatusEnum.install;
        break;
      case PageTypeEnum.alarmConfirm:
        type = TaskStatusEnum.alarmOrder;
        break;
      case PageTypeEnum.trouble:
        type = TaskStatusEnum.trouble;
        break;
    }
    this.$dumpService.handDumpData(type).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.info(result.msg);
      }
    });
  }

  /**
   * 点击取消
   */
  public cancel(): void {
    this.setFormValue(this.nowDump);
  }

  /**
   * 立即执行
   */
  public nowImplementation(): void {
    // 提示弹框
    this.modalService.confirm({
      nzTitle: this.indexLanguage.prompt,
      nzContent: this.indexLanguage.alarmDumpPolicy,
      nzOkText: this.commonLanguage.confirm,
      nzCancelText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.handDump();
        this.implementationModal.destroy();
      }
    });
  }

  /**
   * 立即执行modal框点击取消
   */
  public nowCancel(): void {
    this.implementationModal.destroy();
  }
}
