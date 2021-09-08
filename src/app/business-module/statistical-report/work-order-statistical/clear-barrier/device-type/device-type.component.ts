import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {WorkCommon} from '../../work-common';
import {ActivatedRoute} from '@angular/router';
import {ExportWorkOrderDeviceTypeEnum} from '../../../share/enum/export-work-order.enum';

@Component({
  selector: 'app-device-type',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})
export class DeviceTypeComponent extends WorkCommon {
 public checkBoxSelectShow = true;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute
  ) {
    super($nzI18n, $facilityCommonService, $workOrder_Service, $message, $activatedRoute);
  }

  public initTableClearConfig(): void {
    this.initPublicTableConfig(180, this.getSelectTypeColumn(), 'clearBarrierDeviceTypeExport', '1000px', ExportWorkOrderDeviceTypeEnum);
  }

  /**
   * 统计
   */
  public statistical(): void {
    this.ProgressShow = true;
    this.initTableClearConfig();
    this.refreshTypeData({'queryType': '6', 'procType': '2'});
  }
}
