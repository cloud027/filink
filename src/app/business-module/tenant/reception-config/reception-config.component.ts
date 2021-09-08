import {Component, OnInit, ViewChild} from '@angular/core';
import {tenantTabs} from '../share/const/tenant.const';
import {TenantLanguageInterface} from '../../../../assets/i18n/tenant/tenant.language.interface';
import {TenantApiService} from '../share/sevice/tenant-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {RuleUtil} from '../../../shared-module/util/rule-util';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {RoleConfigComponent} from './role-config/role-config.component';
import {IndexConfigComponent} from './index-config/index-config.component';
import {MenuConfigComponent} from './menu-config/menu-config.component';
import {DeviceConfigComponent} from './device-config/device-config.component';
import {AlarmConfigComponent} from './alarm-config/alarm-config.component';

@Component({
  selector: 'app-reception-config',
  templateUrl: './reception-config.component.html',
  styleUrls: ['./reception-config.component.scss']
})
export class ReceptionConfigComponent implements OnInit {

  @ViewChild('menu') menu: MenuConfigComponent;
  @ViewChild('role') role: RoleConfigComponent;
  @ViewChild('index') index: IndexConfigComponent;
  @ViewChild('device') device: DeviceConfigComponent;
  @ViewChild('alarm') alarm: AlarmConfigComponent;

  //  显示菜单配置tab
  public menuConfig = tenantTabs.menuConfig;
  // 显示权限配置tab
  public roleConfig = tenantTabs.roleConfig;
  //  显示首页元素tab
  public indexConfig = tenantTabs.indexConfig;
  //  显示设施元素tab
  public deviceConfig = tenantTabs.deviceConfig;
  // 显示告警元素tab
  public alarmConfig = tenantTabs.alarmConfig;
  // 国际化
  public language: TenantLanguageInterface;
  // 通用模块国际化
  public commonLanguage: CommonLanguageInterface;
  // 记录原数据页面
  public tabIndex;
  // tab页标题
  public tabTitle = [];
  // 默认tab页选中的index
  public selectedIndex = tenantTabs.menuConfig;

  constructor(
    public $tenantApiService: TenantApiService,
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $ruleUtil: RuleUtil,
    public $active: ActivatedRoute,
    public modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    // 通用模块国际化
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 记录原数据页面
    this.tabIndex = tenantTabs.indexConfig;
    // tab页标题
    this.tabTitle = [
      {title: this.language.systemMenu, index: tenantTabs.menuConfig},
      {title: this.language.facilityAndPermission, index: tenantTabs.roleConfig},
      {title: this.language.indexElements, index: tenantTabs.indexConfig},
      {title: this.language.facilitiesListElement, index: tenantTabs.deviceConfig},
      {title: this.language.alarmElement, index: tenantTabs.alarmConfig},
    ];
  }

  /**
   * tab页切换效验
   */
  public titleClick(index): void {
    let change: boolean;
    // 离开当前tab页时效验tab页数据是否有修改
    if (this.selectedIndex === tenantTabs.menuConfig) {
      change = this.menu.comparedDatas();
    }
    if (this.selectedIndex === tenantTabs.roleConfig) {
      change = this.role.comparedDatas();
    }
    if (this.selectedIndex === tenantTabs.indexConfig) {
      change = this.index.comparedDatas();
    }
    if (this.selectedIndex === tenantTabs.deviceConfig) {
      change = this.device.comparedDatas();
    }
    if (this.selectedIndex === tenantTabs.alarmConfig) {
      change = this.alarm.comparedDatas();
    }
    if (change) {
      this.confirm(index);
    } else {
      this.selectedIndex = index;
    }
  }


  /**
   * 确认弹窗
   */
  private confirm(index): void {
    this.modalService.warning({
      nzTitle: this.language.saveConfigMsg,
      nzContent: this.language.beenSaveConfigMsg,
      nzOkText: this.commonLanguage.cancel,
      nzOkType: 'danger',
      nzCancelText: this.commonLanguage.confirm,
      nzMaskClosable: false,
      nzOnCancel: () => {
        // 调用各配置保存方法
        if (this.selectedIndex === tenantTabs.menuConfig) {
          this.menu.updateElement();
        }
        if (this.selectedIndex === tenantTabs.roleConfig) {
          this.role.updateElement();
        }
        if (this.selectedIndex === tenantTabs.indexConfig) {
          this.index.updateElement();
        }
        if (this.selectedIndex === tenantTabs.deviceConfig) {
          this.device.updateElement();
        }
        if (this.selectedIndex === tenantTabs.alarmConfig) {
          this.alarm.updateElement();
        }
        this.selectedIndex = index;
      },
      nzOnOk: () => {
        this.selectedIndex = index;
      }
    });
  }


}
