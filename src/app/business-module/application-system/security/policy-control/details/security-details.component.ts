import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Result} from '../../../../../shared-module/entity/result';
import {ApplicationService} from '../../../share/service/application.service';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-security-details',
  templateUrl: './security-details.component.html',
  styleUrls: ['./security-details.component.scss']
})
export class SecurityDetailsComponent implements OnInit {
  @Output() notify = new EventEmitter();
  @Input() isShowButton = false;
  @Input() isOperation = true;
  // 接收详情数据
  securityData = {};
  isStrategy = false;
  data = [
    {
      key: '1',
      name: 1001,
      age: '节目1',
      address: '记录美好生活'
    }
  ];

  constructor(
    public $nzI18n: NzI18nService,
    public $applicationService: ApplicationService,
    private $activatedRoute: ActivatedRoute,
    public $router: Router,
  ) {
  }

  ngOnInit() {
    if (this.isOperation) {
      this.initDetails();
    }
  }

  /**
   * 获取策略详情
   */
  initDetails() {
    this.$activatedRoute.params.subscribe(params => {
      this.$applicationService.getSecurityPolicyDetails(params.id).subscribe((result: Result) => {
        this.securityData = result.data;
      }, () => {

      });
    });
  }

  handleCancel() {
    this.isStrategy = false;
  }

  handleOk() {
    this.isStrategy = false;
  }

  handEdit() {
    this.$router.navigate(['business/application/security/policy-control/edit'], {}).then();
  }

  handDelete() {
    this.isStrategy = true;
  }

  handPrevSteps() {
    this.notify.emit(2);
  }

  handCancelSteps() {
    this.$router.navigate(['business/application/security/workbench'], {}).then();
  }

  handNextSteps() {
    this.$router.navigate(['business/application/security/workbench'], {}).then();
  }
}
