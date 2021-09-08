import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {ChartTypeEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {WorkOrderStatisticalModel} from '../../share/model/clear-barrier-model/work-order-statistical.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {InstallationTableComponent} from '../installation-table/installation-table.component';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {InstallWorkOrderService} from '../../share/service/installation';
import {StatisticalPercentageColor} from '../../share/const/work-order-chart-color';

/**
 * 历史安装工单
 */
@Component({
  selector: 'app-finished-install',
  templateUrl: './finished-install.component.html',
  styleUrls: ['./finished-install.component.scss']
})
export class FinishedInstallComponent implements OnInit, OnDestroy {

  // 状态模板
  @ViewChild('installTable') installTable: InstallationTableComponent;
  // 国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  public inspectionLanguage: InspectionLanguageInterface;
  // 设施类型统计报表显示的类型  chart 图表   text 文字
  public equipmentTypeChartType: string = ChartTypeEnum.text;
  // 工单状态统计报表显示的类型  chart 图表   text 文字
  public statusChartType: string = ChartTypeEnum.text;
  // 统计图类型
  public chartType = ChartTypeEnum;
  // 环形图配置，无法使用模型定义类型
  public completedChart: any;
  public singleBackChart: any;
  // 柱状图配置
  public barChartOption;
  // 页面类型
  public orderPageType = WorkOrderPageTypeEnum.finished;
  // 去重
  private finishedOrder: boolean = false;
  constructor(
    public $nzI18n: NzI18nService,
    private $router: Router,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $installService: InstallWorkOrderService,
  ) { }

  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    // 获取统计图数据
    this.getChartData();
  }
  public ngOnDestroy(): void {
    this.installTable = null;
  }

  /**
   * 统计图数据
   */
  private getChartData(): void {
    // 设备类型
    this.$installService.equipmentStatistics().subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      this.equipmentTypeChartType = ChartTypeEnum.chart;
      if (result.code === ResultCodeEnum.success) {
        WorkOrderClearInspectUtil.orderEquipmentChart(this, this.$nzI18n, result.data, true);
      } else {
        WorkOrderClearInspectUtil.orderEquipmentChart(this, this.$nzI18n, [], true);
      }
    }, () => {
      this.equipmentTypeChartType = ChartTypeEnum.chart;
      WorkOrderClearInspectUtil.orderEquipmentChart(this, this.$nzI18n, [], true);
    });
    // 工单状态统计
    this.$installService.historyStatusStatistics().subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      this.statusChartType = ChartTypeEnum.chart;
      if (result.code === ResultCodeEnum.success && result.data) {
        result.data.forEach(v => {
          if (v.orderStatus === WorkOrderStatusEnum.completed) {
            this.completedChart = ChartUtil.initCirclesChart(v.percentage, this.workOrderLanguage[v.orderStatus], StatisticalPercentageColor.completed);
          } else {
            this.singleBackChart = ChartUtil.initCirclesChart(v.percentage, this.workOrderLanguage[v.orderStatus], StatisticalPercentageColor.singleBack);
          }
          this.finishedOrder = true;
        });
      } else {
        this.completedChart = ChartUtil.initCirclesChart(0, this.workOrderLanguage.completed, StatisticalPercentageColor.completed);
        this.singleBackChart = ChartUtil.initCirclesChart(0, this.workOrderLanguage.singleBack, StatisticalPercentageColor.singleBack);
      }
    }, () => {
      this.statusChartType = ChartTypeEnum.chart;
      this.completedChart = ChartUtil.initCirclesChart(0, this.workOrderLanguage.completed, StatisticalPercentageColor.completed);
      this.singleBackChart = ChartUtil.initCirclesChart(0, this.workOrderLanguage.singleBack, StatisticalPercentageColor.singleBack);
    });
  }
}
