import {Component} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ChartUtil} from '../../../../../shared-module/util/chart-util';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkOrderService} from '../../../share/service/work-order.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {StatisticalUtil} from '../../../share/util/statistical.util';
import {WorkCommon} from '../../work-common';
import {ActivatedRoute} from '@angular/router';
import {ExportWorkOrderEnum} from '../../../share/enum/export-work-order.enum';

@Component({
  selector: 'app-processing',
  templateUrl: '../../template-work-order.html',
  styleUrls: ['../../template-work-order.scss']
})
export class ProcessingComponent extends WorkCommon {
  public dateRangeShow = true;
  public checkBoxSelectShow = true;
  public showTab = true;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute
  ) {
    super($nzI18n, $facilityCommonService, $workOrder_Service, $message, $activatedRoute);
  }

  public initTableProcessingConfig(): void {
    const columnConfigs = [
      {title: this.wLanguage.destruction, key: '2', width: 240, searchable: true, searchConfig: {type: 'input'}},
      {title: this.wLanguage.repair, key: '1', width: 240, searchable: true, searchConfig: {type: 'input'}},
      {title: this.wLanguage.other, key: '0', width: 240, searchable: true, searchConfig: {type: 'input'}}
    ];
    this.initPublicTableConfig(240, columnConfigs, 'clearBarrierProcessingExport', '1000px', ExportWorkOrderEnum);
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
    this.initTableProcessingConfig();
    this.refreshData();
  }


  /**
   * 设置图表数据
   */
  public setProcessing(data, that): void {
    const dataMap = that.setFirstChartData(data);
    Object.keys(dataMap).forEach(key => {
      if (key !== 'areaName') {
        dataMap[key] = dataMap[key].reduce((a, b) => Number(a) + Number(b));
        that.ringData.push({
          value: dataMap[key],
          name: StatisticalUtil.getProcessing(that.$nzI18n, key)
        });
        that.ringName.push(StatisticalUtil.getProcessing(that.$nzI18n, key));
        that.barData.push(dataMap[key]);
        that.barName.push(StatisticalUtil.getProcessing(that.$nzI18n, key));
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
    const procType = {
      'queryType': '5',
      'procType': '2'
    };
    if (!e) {
      this.setReqObj(true);
    }
    const req = Object.assign({}, this.queryCondition, procType);
    this.queryData(req, this.setProcessing);
  }
}
