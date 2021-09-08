import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {UserForCommonService} from '../../../../../core-module/api-service/user';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {UnitCommon} from '../../unit-common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-clear-barrier-unit',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})

export class ClearBarrierUnitComponent extends UnitCommon {
  constructor(public $nzI18n: NzI18nService,
              public $userService: UserForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute,
  ) {
    super($nzI18n, $userService, $workOrder_Service, $message, $activatedRoute);
  }
}
