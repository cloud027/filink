import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {WorkCommon} from '../../work-common';
import {ActivatedRoute} from '@angular/router';
import {ExportWorkOrderDeviceTypeEnum} from '../../../share/enum/export-work-order.enum';

@Component({
  selector: 'app-facility-type',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})
export class FacilityTypeComponent extends WorkCommon {
  public checkBoxSelectShow = true;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute
  ) {
    super($nzI18n, $facilityCommonService, $workOrder_Service, $message, $activatedRoute);
  }

  /**
   * 统计
   */
  public statistical(): void {
    this.initTableClearConfig();
    this.ProgressShow = true;
    this.refreshTypeData({'queryType': '6', 'procType': '1'});
  }

  public initTableClearConfig(): void {
    this.initPublicTableConfig(180, this.getSelectTypeColumn(), 'inspectionDeviceTypeExport', '1000px', ExportWorkOrderDeviceTypeEnum);
  }
}
