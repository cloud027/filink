import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ApplicationService} from '../../share/service/application.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PolicyTable} from '../../share/directive/policy-table';

@Component({
  selector: 'app-broadcast-policy-control',
  templateUrl: './broadcast-policy-control.component.html',
  styleUrls: ['./broadcast-policy-control.component.scss']
})
export class BroadcastPolicyControlComponent extends PolicyTable implements OnInit, OnDestroy {
  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    // 提示
    public $message: FiLinkModalService,
    // 路由
    public $router: Router,
    // 接口服务
    public $applicationService: ApplicationService,
  ) {
    super($nzI18n, $message, $router, $applicationService);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.policyStatus = null;
  }
}
