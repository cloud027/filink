import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {WorkCommon} from '../../work-common';
import {ActivatedRoute} from '@angular/router';
import {ExportWorkOrderPercentEnum} from '../../../share/enum/export-work-order.enum';

@Component({
  selector: 'app-percent',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})
export class PercentComponent extends WorkCommon {
  public radioSelectShow = true;
  public dateRangeShow = true;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute,
  ) {
    super($nzI18n, $facilityCommonService, $workOrder_Service, $message, $activatedRoute);
  }

  public initTableInspectionConfig(): void {
    const columnConfigs = [
      {title: this.wLanguage.quantityOfInspection, key: 'count', width: 350, searchable: true, searchConfig: {type: 'input'}},
      {title: this.wLanguage.proportionOfInspection, key: 'percent', width: 300, searchable: true, searchConfig: {type: 'input'}}
    ];
    this.initPublicTableConfig(300, columnConfigs, 'inspectionAreaPercentExport', undefined, ExportWorkOrderPercentEnum);
  }

  /**
   * 统计
   */
  public statistical(): void {
    this.ProgressShow = true;
    // 选择设施类型
    if (this.deviceTypeData && !this.equipTypeData) {
      this.isShowDevice = true;
    }
    if (this.equipTypeData && !this.deviceTypeData) {
      this.isShowDevice = false;
    }
    this.initTableInspectionConfig();
    this.refreshPercentData({'queryType': '1', 'procType': '1'});
  }
}
