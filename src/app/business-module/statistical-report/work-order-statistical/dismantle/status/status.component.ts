import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {WorkCommon} from '../../work-common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dismantle-status',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})
export class DismantleStatusComponent extends WorkCommon {
  public dateRangeShow  = true;
  public showTab = true;
  public checkBoxSelectShow  = true;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute
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
    this.initStatusTableConfig('dismantleStatusExport');
    this.refreshStatusData({'queryType': '7', 'procType': '5'});
  }

  public getDeviceType(data): void {
    this.queryCondition.filterConditions = [
      {
        'filterValue': data.code,
        'filterField': 'deviceType',
        'operator': 'eq'
      },
      {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}
    ];
    this.refreshStatusData({'queryType': '7', 'procType': '5'}, true);
  }
  public getEquipmentType(data): void {
    this.queryCondition.filterConditions = [
      {
        'filterValue': data.code,
        'filterField': 'equipmentType',
        'operator': 'like'
      },
      {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}
    ];
    this.refreshStatusData({'queryType': '7', 'procType': '5'}, true);
  }
}
