import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ChartUtil} from '../../../../../shared-module/util/chart-util';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {StatisticalUtil} from '../../../share/util/statistical.util';
import {WorkCommon} from '../../work-common';
import {ActivatedRoute} from '@angular/router';
import {ExportWorkOrderFailureEnum} from '../../../share/enum/export-work-order.enum';

@Component({
  selector: 'app-failure',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})
export class FailureComponent extends WorkCommon {
  public checkBoxSelectShow = true;
  public dateRangeShow = true;
  public showTab = true;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute
  ) {
    super($nzI18n, $facilityCommonService, $workOrder_Service, $message, $activatedRoute);
  }

  public initTableFailureConfig(): void {
    const columnConfigs = [
      {title: this.wLanguage.other, key: '0', width: 180, searchable: true, searchConfig: {type: 'input'}},
      {title: this.wLanguage.personDamage, key: '1', width: 180, searchable: true, searchConfig: {type: 'input'}},
      {title: this.wLanguage.RoadConstruction, key: '2', width: 180, searchable: true, searchConfig: {type: 'input'}},
      {title: this.wLanguage.stealWear, key: '3', width: 180, searchable: true, searchConfig: {type: 'input'}},
      {title: this.wLanguage.clearBarrier, key: '4', width: 180, searchable: true, searchConfig: {type: 'input'}}
    ];
    this.initPublicTableConfig(200, columnConfigs, 'clearBarrierFailureExport', '1000px', ExportWorkOrderFailureEnum);
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
    this.initTableFailureConfig();
    this.refreshData();
  }

  /**
   * 设置图表数据
   */
  public setChartData(data, that): void {
    const dataMap = that.setFirstChartData(data);
    Object.keys(dataMap).forEach(key => {
      if (key !== 'areaName') {
        dataMap[key] = dataMap[key].reduce((a, b) => Number(a) + Number(b));
        that.ringData.push({
          value: dataMap[key],
          name: StatisticalUtil.getErrorReason(that.$nzI18n, key)
        });
        that.ringName.push(StatisticalUtil.getErrorReason(that.$nzI18n, key));
        that.barData.push(dataMap[key]);
        that.barName.push(StatisticalUtil.getErrorReason(that.$nzI18n, key));
      }
    });
    setTimeout(() => that.ringChartInstance.setOption(ChartUtil.setRingChartOption(that.ringData, that.ringName,
      `${that.statisticalLanguage[that.chartTitle]}-${that.statisticalLanguage.pieChart}`)));
    setTimeout(() => that.barChartInstance.setOption(ChartUtil.setBarChartOption(that.barData, that.barName,
      `${that.statisticalLanguage[that.chartTitle]}-${that.statisticalLanguage.barChart}`)));
  }

  /**
   * 请求数据
   */
  public refreshData(e?): void {
    this.ProgressShow = true;
    const failureType = {
      'procType': '2',
      'queryType': '4'
    };
    if (!e) {
      this.setReqObj(true);
    }
    const req = Object.assign({}, this.queryCondition, failureType);
    this.queryData(req, this.setChartData);
  }
}
