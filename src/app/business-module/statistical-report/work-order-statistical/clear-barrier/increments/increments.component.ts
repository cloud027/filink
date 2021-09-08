import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {differenceInCalendarDays} from 'date-fns';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkCommon} from '../../work-common';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-increments',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})
export class IncrementsComponent extends WorkCommon {
  public checkBoxSelectShow = true;
  public dateRangeShow  = true;
  public lineChart  = true;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute,
  ) {
    super($nzI18n, $facilityCommonService , $workOrder_Service, $message, $activatedRoute);
  }

  /**
   * 统计
   */
  public statistical(): void {
    // 选择设施类型
    if (this.deviceTypeList.length && this.equipmentTypeList.length === 0) {
      this.isShowDevice = true;
    }
    if (this.equipmentTypeList.length && this.deviceTypeList.length === 0) {
      this.isShowDevice = false;
    }
    this.refreshIncrementData({'queryType': '2', 'procType': '2'});
  }

  /**
   * 禁用时间
   */
  public disabledEndDate = (current: Date): boolean => {
    const time = this.getDateStr(-15);
    const currentTime = this.getDateStr(-1);
    return differenceInCalendarDays(current, time) < 0 || differenceInCalendarDays(current, currentTime) > 0;
  }
}
