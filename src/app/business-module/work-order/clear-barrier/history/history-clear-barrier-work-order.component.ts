import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ClearBarrierWorkOrderService} from '../../share/service/clear-barrier';
import {NzI18nService} from 'ng-zorro-antd';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {ChartTypeEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {WorkOrderStatisticalModel} from '../../share/model/clear-barrier-model/work-order-statistical.model';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {DeviceTypeModel} from '../../share/model/device-type.model';
import {WorkOrderChartColor} from '../../share/const/work-order-chart-color';
import {ChartTypeModel} from '../../share/model/clear-barrier-model/chart-type.model';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';

/**
 * 历史销账工单卡片
 */
@Component({
  selector: 'app-history-clear-barrier-work-order',
  templateUrl: './history-clear-barrier-work-order.component.html',
  styleUrls: ['./history-clear-barrier-work-order.component.scss']
})
export class HistoryClearBarrierWorkOrderComponent implements OnInit, AfterViewInit {
  // 图形大小
  public canvasLength: number;
  // 环形图配置，无法使用模型定义类型
  public ringChartOption: any;
  // 饼图配置，无法使用模型定义类型
  public pieChartOption: any;
  // 柱状图配置，无法使用模型定义类型
  public barChartOption: any;
  // 国际化
  // 故障原因统计报表显示的类型  chart 图表   text 文字
  public errorReasonStatisticsChartType: string = ChartTypeEnum.text;
  // 处理方案统计报表显示的类型  chart 图表   text 文字
  public processingSchemeStatisticsChartType: string = ChartTypeEnum.text;
  // 设施类型统计报表显示的类型  chart 图表   text 文字
  public deviceTypeStatisticsChartType: string = ChartTypeEnum.text;
  // 工单状态统计报表显示的类型  chart 图表   text 文字
  public statusStatisticsChartType: string = ChartTypeEnum.text;
  // 已完工工单百分比
  public completedPercent: string;
  // 已退单工单百分比
  public singleBackPercent: string;
  // 统计图类型
  public chartType: ChartTypeModel;
  // 国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  private inspectionLanguage: InspectionLanguageInterface;
  // 环形圆角数值
  private canvasRadius: number;
  // 环形图数据
  private ringChartData: DeviceTypeModel[] = [];

  constructor(private $nzI18n: NzI18nService,
              private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.canvasRadius = 50;
    this.canvasLength = this.canvasRadius * 2;
    this.chartType = ChartTypeEnum;
  }

  /**
   * 页面初始化
   */
  public ngAfterViewInit(): void {
    setTimeout(() => {
      // 故障原因统计
      this.getStatisticsByErrorReason();
      this.getStatisticsByProcessingScheme();
      this.getStatisticsByDeviceType();
      this.getStatisticsByStatus();
    }, 0);
  }

  /**
   * 获取故障原因统计
   */
  private getStatisticsByErrorReason(): void {
    this.$clearBarrierWorkOrderService.getStatisticsByErrorReason({}).subscribe((result: ResultModel<any>) => {
      this.ringChartData = [];
      let total = 0;
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.errorReasonStatisticsChartType = ChartTypeEnum.text;
        } else {
          result.data.sort((a, b) => {
            return b.errorReason - a.errorReason;
          });
          result.data.forEach(item => {
            this.ringChartData.push({
              value: item.count,
              name: WorkOrderBusinessCommonUtil.getErrorReasonName(this.$nzI18n, WorkOrderBusinessCommonUtil.getErrorReasonNameCode(item.errorReason))
            });
            total += item.count;
          });
          this.errorReasonStatisticsChartType = ChartTypeEnum.chart;
        }
      } else {
        this.errorReasonStatisticsChartType = ChartTypeEnum.chart;
        const list = [];
        for (let i = 0; i < 5; i++) {
          list.push({'errorReason': `${i}`, 'count': 0});
        }
        list.forEach(item => {
          this.ringChartData.push({
            value: item.count,
            name: WorkOrderBusinessCommonUtil.getErrorReasonName(this.$nzI18n, WorkOrderBusinessCommonUtil.getErrorReasonNameCode(item.errorReason))
          });
        });
      }
      this.ringChartOption = ChartUtil.setWorkOrderReasonChartOption(this.workOrderLanguage.errorReason, this.ringChartData, total);
    });
  }

  /**
   * 获取设施类型统计
   */
  private getStatisticsByDeviceType(): void {
    this.$clearBarrierWorkOrderService.getStatisticsByDeviceType({}).subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      const name = [], data = [];
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.deviceTypeStatisticsChartType = ChartTypeEnum.text;
        } else {
          const list = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
          if (!list || list.length === 0) {
            return;
          }
          this.deviceTypeStatisticsChartType = ChartTypeEnum.chart;
          result.data.forEach(item => {
            for (let i = 0; i < list.length; i++) {
              if (list[i].code === item.deviceType) {
                name.push(list[i].label);
                data.push({
                  value: item.count,
                  itemStyle: {color: WorkOrderChartColor[WorkOrderBusinessCommonUtil.getEnumKey(item.deviceType, DeviceTypeEnum)]}
                });
                break;
              }
            }
          });
          this.barChartOption = ChartUtil.setWorkBarChartOption(data, name);
        }
      } else {
        this.deviceTypeStatisticsChartType = ChartTypeEnum.text;
      }
    });
  }

  /**
   * 获取处理方案统计
   */
  private getStatisticsByProcessingScheme(): void {
    this.$clearBarrierWorkOrderService.getStatisticsByProcessingScheme({}).subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      const data = [], names = [];
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.processingSchemeStatisticsChartType = ChartTypeEnum.text;
        } else {
          this.processingSchemeStatisticsChartType = ChartTypeEnum.chart;
          result.data.forEach(item => {
            const name = WorkOrderBusinessCommonUtil.getSchemeName(this.$nzI18n, WorkOrderBusinessCommonUtil.getSchemeCode(item.processingScheme));
            names.push(name);
            data.push({
              value: item.count,
              name: name
            });
          });
        }
      } else {
        this.processingSchemeStatisticsChartType = ChartTypeEnum.chart;
        const list = [];
        for (let i = 0; i < 3; i++) {
          list.push({'processingScheme': `${i}`, 'count': 0});
        }
        list.forEach(res => {
          const name = WorkOrderBusinessCommonUtil.getSchemeName(this.$nzI18n, WorkOrderBusinessCommonUtil.getSchemeCode(res.processingScheme));
          names.push(name);
          data.push({
            value: res.count,
            name: name
          });
        });
      }
      this.pieChartOption = ChartUtil.setPieChartOption(data, names);
    });
  }

  /**
   * 获取工单状态统计
   */
  private getStatisticsByStatus(): void {
    this.$clearBarrierWorkOrderService.getStatisticsByStatus({}).subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      let completedCount: number;
      let singleBackCount: number;
      let totalCount = 0;
      let statusList = [];
      if (result.code === ResultCodeEnum.success) {
        if (!result.data || result.data.length === 0) {
          this.statusStatisticsChartType = ChartTypeEnum.text;
        } else {
          this.statusStatisticsChartType = ChartTypeEnum.chart;
          result.data.forEach(res => {
            if (res.orderStatus === WorkOrderStatusEnum.completed) {
              completedCount = res.percentage;
            } else if (res.orderStatus === WorkOrderStatusEnum.singleBack) {
              singleBackCount = res.percentage;
            }
          });

          if (result.data.length) {
            statusList = result.data;
            totalCount = statusList.reduce((a, b) => a.percentage + b.percentage);
          }
        }
      } else {
        const list = [ { 'orderStatus': WorkOrderStatusEnum.completed, 'percentage': 0 }, { 'orderStatus': WorkOrderStatusEnum.singleBack, 'percentage': 0 } ];
        this.statusStatisticsChartType = ChartTypeEnum.chart;
        list.forEach(listItem => {
          if (listItem.orderStatus === WorkOrderStatusEnum.completed) {
            completedCount = listItem.percentage;
          } else if (listItem.orderStatus === WorkOrderStatusEnum.singleBack) {
            singleBackCount = listItem.percentage;
          }
        });
      }
      setTimeout(() => {
        this.getPercent('canvas_completed', '#3279f0', completedCount, totalCount);
        this.getPercent('canvas_singleBack', '#f39705', singleBackCount, totalCount);
        this.completedPercent = `${completedCount}.00%`;
        this.singleBackPercent = `${singleBackCount}.00%`;
      }, 10);
    });
  }

  /**
   * 计算环的角度
   */
  private getPercent(id: string, color: string, num: number, total: number): void {
    const endingAngle = (-0.5 + (num / total) * 2) * Math.PI;
    const startingAngle = -0.5 * Math.PI;
    try {
      const canvas = document.getElementById(id);
      const context = canvas['getContext']('2d');
      const centerX = this.canvasRadius;
      const centerY = this.canvasRadius;
      context.beginPath();
      context.lineWidth = 8;
      context.strokeStyle = '#eff0f4';
      // 创建变量,保存圆弧的各方面信息
      const radius = this.canvasRadius - context.lineWidth / 2;
      // 画完整的环
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.stroke();
      context.beginPath();
      // 画部分的环
      context.strokeStyle = color;
      context.arc(centerX, centerY, radius, startingAngle, endingAngle);
      context.stroke();
    } catch (e) {}
  }
}
