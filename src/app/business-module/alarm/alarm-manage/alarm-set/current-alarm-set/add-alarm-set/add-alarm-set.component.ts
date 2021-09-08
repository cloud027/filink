import {Component, OnInit} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {SelectModel} from '../../../../../../shared-module/model/select.model';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {Router} from '@angular/router';
import {AlarmSetFormUtil} from '../../../../share/util/alarm-set-form.util';
import {AlarmForCommonUtil} from '../../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmForCommonService} from '../../../../../../core-module/api-service/alarm/alarm-for-common.service';
import {AlarmService} from '../../../../share/service/alarm.service';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {AlarmNameListModel} from '../../../../../../core-module/model/alarm/alarm-name-list.model';

/**
 * 当前告警设置 新增页面
 */
@Component({
  selector: 'app-add-alarm-set',
  templateUrl: './add-alarm-set.component.html',
  styleUrls: ['./add-alarm-set.component.scss']
})
export class AddAlarmSetComponent implements OnInit {
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 加载状态
  public isLoading: boolean;
  // 告警类别枚举
  public isDisabled: boolean;
  // title
  public pageTitle: string;
  // 告警编辑页面表单项
  public tableColumn: FormItem[];
  // 告警编辑表单实例
  private formStatus: FormOperate;
  // 告警类别
  private alarmTypeList: SelectModel[] = [];
  // 告警级别
  private alarmLevelArray: SelectModel[] = [];

  constructor(
    public $router: Router,
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $message: FiLinkModalService,
    private $alarmService: AlarmService,
    private $alarmForCommonService: AlarmForCommonService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.pageTitle = this.language.addCurrentAlarmSet;
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      data.forEach(item => this.alarmTypeList.push(item));
    });
    // 告警级别
    AlarmUtil.queryAlarmLevel(this.$alarmService).then((data: SelectModel[]) => {
      data.forEach(item => {
        this.alarmLevelArray.push({
          label: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, item.value),
          code: item.value,
          value: item.value
        });
      });
    });
    this.initEditForm();
  }

  /**
   * 告警编辑弹窗表单实例
   * param event
   */
  public formInstanceSecond(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
  }

  /**
   * 新增和编辑告警设置
   */
  public submit(): void {
    this.isLoading = true;
    const addData: AlarmNameListModel = this.formStatus.getData();
    // isOrder暂时写固定值
    addData.isOrder = '1';
    this.$alarmService.insertAlarmCurrentSet(addData).subscribe((res: ResultModel<string>) => {
      if (res.code === 0) {
        this.$message.success(this.language.addAlarmSetSuccess);
        this.$router.navigate(['business/alarm/current-alarm-set']).then();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 取消
   */
  public cancel(): void {
    window.history.back();
  }
  /**
   * 编辑告警设置
   */
  private initEditForm() {
    this.tableColumn = AlarmSetFormUtil.initEditForm(
      this.language,
      this.commonLanguage,
      this.$ruleUtil,
      this.$alarmService,
      this.alarmLevelArray,
      this.alarmTypeList
    );
  }
}
