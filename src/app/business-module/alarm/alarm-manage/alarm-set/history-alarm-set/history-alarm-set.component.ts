import {Component, OnInit} from '@angular/core';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {AlarmService} from '../../../share/service/alarm.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AlarmHistorySetModel} from '../../../share/model/alarm-history-set.model';

/**
 * 告警设置 历史告警设置
 */
@Component({
  selector: 'app-history-alarm-set',
  templateUrl: './history-alarm-set.component.html',
  styleUrls: ['./history-alarm-set.component.scss']
})
export class HistoryAlarmSetComponent implements OnInit {
  // 历史告警设置title
  public pageTitle: string;
  // 历史告警设置表单项
  public formColumn: FormItem[] = [];
  // 历史告警表单项实例
  public formStatus: FormOperate;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 保存按钮加载中
  public isLoading: boolean = false;
  // 控制提交按钮
  public isSubmit: boolean;
  // 告警id
  private alarmId: string;

  constructor(
    private $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $message: FiLinkModalService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // 初始化表单项
    this.initForm();
    this.initColumn();
    this.pageTitle = this.language.historyAlarmSettings;
  }

  /**
   * 表单实例对象
   * param event
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isSubmit = this.formStatus.getValid();
    });
  }

  /**
   * 历史告警设置
   */
  public submit(): void {
    const data: AlarmHistorySetModel = this.formStatus.getData();
    data.id = this.alarmId;
    this.isLoading = true;
    this.$alarmService.updateAlarmDelay(data).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res.code === 0) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }
  /**
   * 表单项配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: this.language.delayTime,
        key: 'delay',
        type: 'input',
        require: true,
        rule: [{ required: true },
          {pattern: /^\+?[1-9][0-9]*$/, msg: this.language.enterNormalTime },
          { min: 0, max: 720, msg: this.language.enterMaxTime}],
        asyncRules: []
      }
    ];
  }

  /**
   * 初始化设置
   */
  private initForm(): void {
    this.$alarmService.queryAlarmDelay().subscribe((res: ResultModel<AlarmHistorySetModel>) => {
      if (res.code === 0) {
        const data = res.data;
        const initData = data.delay;
        this.alarmId = data.id;
        // 表单回显
        this.formStatus.resetData({ delay: String(initData) });
      }
    });
  }
}
