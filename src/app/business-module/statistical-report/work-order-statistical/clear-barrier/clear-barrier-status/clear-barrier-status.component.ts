import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {WorkCommon} from '../../work-common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-clear-barrier-status',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})
export class ClearBarrierStatusComponent extends WorkCommon {
  public checkBoxSelectShow = true;
  public showTab = true;
  public dateRangeShow = true;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute
  ) {
    super($nzI18n, $facilityCommonService, $workOrder_Service, $message, $activatedRoute);
  }

  public getDeviceType(data): void {
    this.queryCondition.filterConditions = [{
      'filterValue': data.code,
      'filterField': 'deviceType',
      'operator': 'eq'
    },
      {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}];
    this.refreshStatusData({'queryType': '7', 'procType': '2'}, true);
  }

  public getEquipmentType(data): void {
    this.queryCondition.filterConditions = [{
      'filterValue': data.code,
      'filterField': 'equipmentType',
      'operator': 'eq'
    },
      {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}];
    this.refreshStatusData({'queryType': '7', 'procType': '2'}, true);
  }

  /**
   * 统计
   */
  public statistical(): void {
    // 选择设施类型
    if (this.deviceTypeList.length && this.equipmentTypeList.length === 0) {
      this.isShowDevice = true;
    }
    // 选择设备类型
    if (this.equipmentTypeList.length && this.deviceTypeList.length === 0) {
      this.isShowDevice = false;
    }
    this.initStatusTableConfig('clearBarrierStatusExport');
    this.refreshStatusData({'queryType': '7', 'procType': '2'});
  }
}
