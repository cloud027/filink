import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ApplicationService} from '../../share/service/application.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PolicyTable} from '../../share/directive/policy-table';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {EnableStrategyResultService} from '../../../../core-module/mission/enable-strategy-result.service';

@Component({
  selector: 'app-release-policy-control',
  templateUrl: './release-policy-control.component.html',
  styleUrls: ['./release-policy-control.component.scss']
})
export class ReleasePolicyControlComponent extends PolicyTable implements OnInit, OnDestroy {
  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    // 提示
    public $message: FiLinkModalService,
    // 路由
    public $router: Router,
    // 接口服务
    public $applicationService: ApplicationService,
    private $enableStrategyResultService: EnableStrategyResultService
  ) {
    super($nzI18n, $message, $router, $applicationService);
  }
  // 关闭订阅流
  private destroy$ = new Subject<void>();
  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.$enableStrategyResultService.refreshStrategyList.pipe(takeUntil(this.destroy$)).subscribe((value => {
      if (value) {
        this.refreshData();
      }
    }));
    this.initTableConfig();
    this.refreshData();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.policyStatus = null;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
