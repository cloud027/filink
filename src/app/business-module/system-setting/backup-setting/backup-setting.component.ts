import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup } from '@angular/forms';
import {NzI18nService} from 'ng-zorro-antd';
import {FormItem} from '../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../shared-module/component/form/form-operate.service';
import {Observable} from 'rxjs';
import { BackupCycleUnitEnum, BackupLocationEnum, BackupEnableEnum, SystemParameterConfigEnum } from '../share/enum/system-setting.enum';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {SystemParameterService} from '../share/service';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import { BackupSettingModel } from '../share/mode/backup-setting.model';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 备份设置组件
 */
@Component({
  selector: 'app-backup-setting',
  templateUrl: './backup-setting.component.html',
  styleUrls: ['./backup-setting.component.scss']
})
export class BackupSettingComponent implements OnInit {
  /** 备份周期模板*/
  @ViewChild('backupCycleTemplate') backupCycleTemplate: TemplateRef<any>;
  /** 备份时间点模板*/
  @ViewChild('backupTimePointTemplate') backupTimePointTemplate: TemplateRef<any>;
  /** 备份数据存储地址模板*/
  @ViewChild('backupDataSaveAddressTemplate') backupDataSaveAddressTemplate: TemplateRef<any>;
  public pageTitle: string = '';
  /** 表单行信息*/
  public formColumn: FormItem[] = [];
  /** 表单状态*/
  public formStatus: FormOperate;
  /** 备份周期(几个小时 几天 几个星期或几个月)*/
  public backupCycleTime: string = '0';
  /** 备份周期的单位 小时/天/星期/月*/
  public backupCycleUnit: BackupCycleUnitEnum = BackupCycleUnitEnum.hour;
  /** 备份周期输入框是否置灰*/
  public backupCycleIsDisabled: boolean = false;
  /** 备份周期输入框提示语*/
  public backupCycleTimePlaceholder: string = '0~255';
  /** 备份周期单位 枚举*/
  public backupCycleUnitEnum = BackupCycleUnitEnum;
  /** 表单校验 判断确定按钮是否置灰*/
  public isEnable: boolean = false;
  /** 加载状态*/
  public isLoading: boolean = false;
  /** 国际化信息*/
  public language;
  /** 参数id*/
  private paramId: string;
  /** 当前值*/
  private presentValue: BackupSettingModel = new BackupSettingModel();
  constructor(private $nzI18n: NzI18nService,
              private $systemParameterService: SystemParameterService,
              private $message: FiLinkModalService) {
    this.language = this.$nzI18n.getLocale();
  }

  ngOnInit(): void {
    this.pageTitle = this.language.systemSetting.backupSetting;
    this.initForm();
    this.queryInitData();
  }

  /**
   * 表单初始化完成后执行的事件
   * param event
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.isEnableBackupChange(this.formStatus.group.controls['enableBackup'].value);
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isEnable = this.formStatus.getValid();
    });
  }

  /**
   * 触发表单备份周期字段的异步校验
   */
  public triggerBackupCycleValid() {
    this.formStatus.group.controls['backupCycle'].markAsDirty();
    this.formStatus.group.controls['backupCycle'].updateValueAndValidity();
  }

  /**
   * 备份周期单位切换事件
   * param event
   */
  public backupCycleUnitChange(event: BackupCycleUnitEnum) {
    this.triggerBackupCycleValid();
    switch (event) {
      case BackupCycleUnitEnum.hour:
      case BackupCycleUnitEnum.day:
        this.backupCycleTimePlaceholder = '0~255';
        break;
      case BackupCycleUnitEnum.week:
        this.backupCycleTimePlaceholder = '0~50';
        break;
      case BackupCycleUnitEnum.month:
        this.backupCycleTimePlaceholder = '0~24';
        break;
    }
  }

  /**
   * 测试备份数据存储地址是否正确
   */
  public addressTest() {
    const params = {
      backupLocation: this.formStatus.getData('backupLocation'),
      backupAddr: this.formStatus.getData('backupAddr')
    };
    this.$systemParameterService.backupAddrTest(params).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(res.data);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 确定按钮事件
   */
  public handleSubmit() {
    const backupParams = this.formStatus.getData();
    if (backupParams.enableBackup === BackupEnableEnum.enable) {
      // 处理备份周期
      if (this.backupCycleTime) {
        backupParams.backupCycle = this.backupCycleTime;
        backupParams.cycleUnit = this.backupCycleUnit;
      } else {
        backupParams.backupCycle = null;
        backupParams.cycleUnit = BackupCycleUnitEnum.hour;
      }
      // 处理备份时间点 拼接上当天的日期
      const todayDate = CommonUtil.dateFmt('yyyy-MM-dd', new Date());
      const timePoint = CommonUtil.dateFmt('yyyy-MM-dd hh:mm:ss', backupParams.backupTime).split(' ')[1];
      backupParams.backupTime = CommonUtil.getTimeStamp(new Date(`${todayDate} ${timePoint}`));
    } else {
      backupParams.backupCycle = '0';
      backupParams.cycleUnit = BackupCycleUnitEnum.hour;
      backupParams.backupTime = CommonUtil.getTimeStamp(new Date(CommonUtil.dateFmt('yyyy-MM-dd 00:00:00', new Date())));
      backupParams.backupLocation = null;
      backupParams.backupAddr = '';
    }
    const params = {
      paramId: this.paramId,
      backup: backupParams
    };
    this.isLoading = true;
    // 调用保存备份设置接口
    this.$systemParameterService.updateBackupSetting(params).subscribe(res => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.queryInitData();
        this.$message.success(this.language.systemSetting.backupSettingConfigSucc);
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 取消按钮事件
   */
  public handleCancel(): void {
    this.handleData();
  }

  /**
   * 启用备份 禁用启用切换时执行的事件
   * param value
   */
  private isEnableBackupChange(value: BackupEnableEnum): void {
    if (value === BackupEnableEnum.enable) {
      this.formStatus.group.controls['backupTime'].enable();
      this.formStatus.group.controls['backupLocation'].enable();
      if (this.formStatus.group.controls['backupLocation'].value) {
        this.formStatus.group.controls['backupAddr'].enable();
      }
      this.backupCycleIsDisabled = false;
    } else {
      this.formStatus.group.controls['backupTime'].disable();
      this.formStatus.group.controls['backupLocation'].disable();
      this.formStatus.group.controls['backupAddr'].disable();
      this.backupCycleIsDisabled = true;
      this.isEnable = true;
      // 改为禁用时，如果输入不符合校验规则时，则将备份周期的值置为初始化的值
      if (!this.formStatus.group.controls['backupCycle'].valid) {
        this.backupCycleTime = '0';
        this.backupCycleUnit = BackupCycleUnitEnum.hour;
        this.triggerBackupCycleValid();
      }
    }
  }

  /**
   * 查询初始化数据
   */
  private queryInitData() {
    this.$systemParameterService.queryProtocol(SystemParameterConfigEnum.backupSetting).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        this.paramId = res.data.paramId;
        this.presentValue = JSON.parse(res.data.presentValue);
        this.handleData();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 处理数据并给表单赋值
   */
  private handleData(): void {
    if (this.presentValue.backupCycle || this.presentValue.backupCycle === 0) {
      this.backupCycleTime = this.presentValue.backupCycle.toString();
      this.backupCycleUnit = this.presentValue.cycleUnit || BackupCycleUnitEnum.hour;
    } else {
      // 初始化备份周期的两个值
      this.backupCycleTime = null;
      this.backupCycleUnit = BackupCycleUnitEnum.hour;
    }
    if (this.presentValue.backupTime) {
      this.presentValue.backupTime = new Date(Number(this.presentValue.backupTime));
    } else {
      this.presentValue.backupTime = new Date(CommonUtil.dateFmt('yyyy-MM-dd 00:00:00', new Date()));
    }
    this.formStatus.resetData(this.presentValue);
  }

  /**
   * 初始化表单事件
   */
  private initForm(): void {
    this.formColumn = [
      // 启用备份
      {
        label: this.language.systemSetting.enableBackup,
        key: 'enableBackup',
        type: 'radio',
        col: 24,
        require: true,
        width: 300,
        rule: [{required: true}],
        radioInfo: {
          data: [{
            label: this.language.systemSetting.selectEnable,
            value: BackupEnableEnum.enable
          },
            {
              label: this.language.systemSetting.prohibit,
              value: BackupEnableEnum.disable
            }]
        },
        initialValue: BackupEnableEnum.disable,
        modelChange: (group: FormGroup, value: BackupEnableEnum) => {
          this.isEnableBackupChange(value);
        }
      },
      // 备份周期
      {
        label: this.language.systemSetting.backupCycle,
        key: 'backupCycle',
        type: 'custom',
        col: 24,
        width: 300,
        template: this.backupCycleTemplate,
        rule: [],
        asyncRules: this.initBackupCycleTimeAsyncCode()
      },
      // 备份时间点
      {
        label: this.language.systemSetting.backupTimePoint,
        key: 'backupTime',
        type: 'custom',
        col: 24,
        width: 300,
        template: this.backupTimePointTemplate,
        rule: [],
        initialValue: new Date(CommonUtil.dateFmt('yyyy-MM-dd 00:00:00', new Date()))
      },
      // 备份位置
      {
        label: this.language.systemSetting.backupLocation,
        key: 'backupLocation',
        type: 'select',
        col: 24,
        width: 300,
        require: true,
        selectInfo: {
          data: [
            {label: this.language.systemSetting.backupToLocal, value: BackupLocationEnum.local},
            {label: this.language.systemSetting.backupToFTPServer, value: BackupLocationEnum.ftpServer}
          ],
          label: 'label',
          value: 'value'
        },
        rule: [{required: true}],
        modelChange: (controls, $event) => {
          if ($event) {
            this.formStatus.group.controls['backupAddr'].enable();
          }
        }
      },
      // 备份数据存储地址
      {
        label: this.language.systemSetting.backupDataStorageAddress,
        key: 'backupAddr',
        type: 'custom',
        template: this.backupDataSaveAddressTemplate,
        require: true,
        col: 24,
        width: 400,
        rule: [{required: true}]
      }
    ];
  }

  /**
   * 初始化备份周期异步校验规则
   */
  private initBackupCycleTimeAsyncCode() {
    return [
      {
        asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          // 为空时不做校验
          if (!this.backupCycleTime || /^([0-9]|[1-9][0-9]+)$/.test(this.backupCycleTime)) {
            observer.next(null);
            observer.complete();
          } else {
            observer.next({error: true, notNumber: true});
            observer.complete();
          }
        });
      },
      asyncCode: 'notNumber', msg: this.language.common.mustInt
    }, {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (this.backupCycleUnit === BackupCycleUnitEnum.hour || this.backupCycleUnit === BackupCycleUnitEnum.day) {
            this.rangeAsyncRule(observer, 255, 'hourAndDayRangeIsError');
          } else {
            observer.next(null);
            observer.complete();
          }
        });
      },
      asyncCode: 'hourAndDayRangeIsError', msg: this.language.systemSetting.pleaseEnterAnIntegerLessThan255
    }, {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (this.backupCycleUnit === BackupCycleUnitEnum.week) {
            this.rangeAsyncRule(observer, 50, 'weekRangeIsError');
          } else {
            observer.next(null);
            observer.complete();
          }
        });
      },
      asyncCode: 'weekRangeIsError', msg: this.language.systemSetting.pleaseEnterAnIntegerLessThan50
    }, {
      asyncRule: (control: FormControl) => {
        return Observable.create(observer => {
          if (this.backupCycleUnit === BackupCycleUnitEnum.month) {
            this.rangeAsyncRule(observer, 24, 'monthRangeIsError');
          } else {
            observer.next(null);
            observer.complete();
          }
        });
      },
      asyncCode: 'monthRangeIsError', msg: this.language.systemSetting.pleaseEnterAnIntegerLessThan24
    }];
  }

  /**
   * 备份周期校验规则相同代码抽取
   * param observer
   * param endNumber
   * param asyncCode
   */
  private rangeAsyncRule(observer, endNumber: number, asyncCode: string) {
    const backupCycle = Number(this.backupCycleTime);
    // 为空时不做校验
    if (!backupCycle || (backupCycle >= 0 && backupCycle <= endNumber)) {
      observer.next(null);
      observer.complete();
    } else {
      const obj = {error: true, [asyncCode]: true};
      observer.next(obj);
      observer.complete();
    }
  }
}
