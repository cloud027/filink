import {Component, OnDestroy, OnInit} from '@angular/core';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {AlarmRoleEnum} from '../../../../../core-module/enum/alarm/alarm-role.enum';

/**
 * 告警相关性分析设置
 */
@Component({
  selector: 'app-alarm-correlation-setting',
  templateUrl: './alarm-correlation-setting.component.html',
  styleUrls: ['./alarm-correlation-setting.component.scss']
})
export class AlarmCorrelationSettingComponent implements OnInit, OnDestroy {
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 序号
  public tabIndex: number = 0;
  // 静态相关性规则权限
  public isStaticRole: boolean;
  // 动态相关性规则权限
  public isDynamicRole: boolean;
  constructor(
    public $nzI18n: NzI18nService,
  ) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // 进入时判断打开哪一个tab页
    const index = Number(localStorage.getItem('alarmSetTabsIndex'));
    if (index === 1) {
      this.tabIndex = index;
    }
    // 静态相关性规则
    this.isStaticRole = SessionUtil.checkHasRole(AlarmRoleEnum.staticRole);
    // 动态相关性规则
    this.isDynamicRole =  SessionUtil.checkHasRole(AlarmRoleEnum.dynamicRole);
  }
  // 销毁
  public ngOnDestroy(): void {
    localStorage.removeItem('alarmSetTabsIndex');
  }
}
