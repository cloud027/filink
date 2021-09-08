import {TemplateWorkOrder} from './template-work-order';
import {OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {UserForCommonService} from '../../../core-module/api-service/user';
import {WorkOrderService} from '../share/service/work-order.service';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ActivatedRoute} from '@angular/router';

export class UnitCommon extends TemplateWorkOrder implements OnInit {
  public lineChart = true;
  public selectUnitShow = true;
  public dateRangeShow = true;
  public isLoading = true;
  public procType;

  constructor(public $nzI18n: NzI18nService,
              public $userService: UserForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute,
  ) {
    super($nzI18n, $message, null, $userService);
  }

  public ngOnInit(): void {
    this.chartTitle = this.$activatedRoute.snapshot.data.titleName;
    this.initUnitPublicConfig();
    this.getPageType();
  }

  public getPageType(): void {
    if (this.$activatedRoute.snapshot.url[1].path === 'inspection') {
      this.procType = '1';
    } else if (this.$activatedRoute.snapshot.url[1].path === 'clear-barrier')  {
      this.procType = '2';
    } else{
        this.procType = '5';
    }
  }

  /**
   * 统计
   */
  public statistical(): void {
    this.ProgressShow = true;
    // 创建查询条件
    this.queryCondition.bizCondition = {
      accountabilityDeptList: this.selectUnitIdData,
      // timeList: [this.startTime / 1000, this.endTime / 1000],
    };
    this.queryCondition.filterConditions = [
      {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}
    ];
    this.refreshData();
  }


  /**
   * 设置图表数据
   */
  public setChartData(data): void {
    const lineData = [];
    const lineName = [];
    data.forEach(item => {
      lineData.push(item.count);
      lineName.push(item.accountabilityDeptName);
    });
    setTimeout(() => this.lineChartInstance.setOption(ChartUtil.setBarChartOption(lineData, lineName,
      `${this.statisticalLanguage[this.chartTitle]}-${this.statisticalLanguage.barChart}`)));
  }

  /**
   * 请求数据
   */
  public refreshData(): void {
    const req = Object.assign({}, this.queryCondition, {
      'queryType': '3',
      'procType': this.procType
    });
    this.$workOrder_Service.queryProcCount(req).subscribe((res: ResultModel<any>) => {
      this.hide = false;
      this.setChartData(res.data);
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }
}
