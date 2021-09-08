import { Component, OnInit } from '@angular/core';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { ClearBarrierWorkOrderService } from '../../share/service/clear-barrier';
import { Result } from '../../../../shared-module/entity/result';
import { NzI18nService } from 'ng-zorro-antd';
import { ChartUtil } from '../../../../shared-module/util/chart-util';
import { WorkOrderLanguageInterface } from '../../../../../assets/i18n/work-order/work-order.language.interface';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { FacilityForCommonUtil } from '../../../../core-module/business-util/facility/facility-for-common.util';
import { InspectionLanguageInterface } from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import { ChartTypeEnum } from '../../share/enum/clear-barrier-work-order.enum';
import { WorkOrderStatusEnum } from '../../../../core-module/enum/work-order/work-order-status.enum';
import { WorkOrderChartColor, WorkOrderEquipmentChartColor } from '../../share/const/work-order-chart-color';
import { ChartTypeModel } from '../../share/model/clear-barrier-model/chart-type.model';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { DeviceTypeEnum } from '../../../../core-module/enum/facility/facility.enum';
import { EquipmentTypeEnum } from '../../../../core-module/enum/equipment/equipment.enum';

import { WorkOrderBusinessCommonUtil } from '../../share/util/work-order-business-common.util';
import { DismantleBarrierWorkOrderService } from '../../share/service/dismantle-barrier';
/**
 * 历史销账工单卡片
 */
@Component({
  selector: 'app-history-dismantle-barrier-work-order',
  templateUrl: './history-dismantle-barrier-work-order.component.html',
  styleUrls: ['./history-dismantle-barrier-work-order.component.scss'],
})
export class HistoryDismantleBarrierWorkOrderComponent implements OnInit {
  // 故障总数
  public faultTotal: number = 0;
  // 图形大小
  public canvasLength: number;
  // 环形图配置
  public ringChartOption;
  // 饼图配置
  public pieChartOption;
  // 柱状图配置
  public barChartOption;
  // 柱状图配置
  public equipmentBarChartOption;
  // 设施类型统计报表显示的类型  chart 图表   text 文字
  public deviceTypeStatisticsChartType: string = '';

  // 已完工工单百分比
  public inspectCompletedPercent: string;
  // 已退单工单百分比
  public inspectSingleBackPercent: string;
  // 国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  InspectionLanguage: InspectionLanguageInterface;
  // 环形圆角数值
  private canvasRadius: number;
  // 环形图数据
  private ringChartData = [];

  // 统计图类型
  public chartType: ChartTypeModel = ChartTypeEnum;
  // 工单状态统计报表显示的类型  chart 图表   text 文字
  public statusChartType: string;

  constructor(
    public $nzI18n: NzI18nService,
    private $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
    private $message: FiLinkModalService,
  ) {}

  ngOnInit() {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.canvasRadius = 60;
    this.canvasLength = this.canvasRadius * 2;

    this.getDeviceTypeStatistics();
    this.getEquipmentTypeStatistics();
    this.getStatusStatistics();
  }
  /**
   * 选择图例
   */
  public selectLegend(event): void {
    let total = 0;
    for (const k in event.selected) {
      if (event.selected[k]) {
        const obj = this.ringChartData.find((v) => {
          return v.name === k;
        });
        total += obj.value;
      }
    }
    this.faultTotal = total;
  }

  /**
   * 设施统计
   */
  private getDeviceTypeStatistics(): void {
    this.$dismantleBarrierWorkOrderService
      .queryRemoveOrderDeviceCount_API()
      .subscribe((result: ResultModel<any[]>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data.length === 0) {
            this.deviceTypeStatisticsChartType = ChartTypeEnum.text;
          } else {
            this.deviceTypeStatisticsChartType = ChartTypeEnum.chart;
            const name = [],
              data = [];
            const list = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
            // 遍历数据并判断是否有设施权限
            result.data.forEach((item) => {
              for (let i = 0; i < list.length; i++) {
                if (list[i].code === item.deviceType) {
                  data.push({
                    value: item.count,
                    itemStyle: {
                      color:
                        WorkOrderChartColor[
                          WorkOrderBusinessCommonUtil.getEnumKey(item.deviceType, DeviceTypeEnum)
                        ],
                    },
                  });
                  name.push(list[i].label);
                  break;
                }
              }
            });
            this.barChartOption = ChartUtil.setWorkBarChartOption(data, name);
          }
        } else {
          this.$message.error(result.msg);
          this.deviceTypeStatisticsChartType = ChartTypeEnum.text;
        }
      });
  }

  /**
   * 设备统计
   */
  private getEquipmentTypeStatistics(): void {
    this.$dismantleBarrierWorkOrderService
      .queryRemoveOrderEquipmentCount_API()
      .subscribe((result: ResultModel<any[]>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data.length === 0) {
            this.deviceTypeStatisticsChartType = ChartTypeEnum.text;
          } else {
            this.deviceTypeStatisticsChartType = ChartTypeEnum.chart;
            const name = [],
              data = [];
            const list = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
            // 遍历数据并判断是否有设备权限
            result.data.forEach((item) => {
              for (let i = 0; i < list.length; i++) {
                if (list[i].code === item.equipmentType) {
                  data.push({
                    value: item.count,
                    itemStyle: {
                      color:
                        WorkOrderEquipmentChartColor[
                          WorkOrderBusinessCommonUtil.getEnumKey(item.equipmentType, EquipmentTypeEnum)
                          ],
                    },
                  });
                  name.push(list[i].label);
                  break;
                }
              }
            });
            this.equipmentBarChartOption = ChartUtil.setWorkBarChartOption(data, name);
          }
        } else {
          this.$message.error(result.msg);
          this.deviceTypeStatisticsChartType = ChartTypeEnum.text;
        }
      });
  }

  /**
   * 获取工单状态统计
   */
  private getStatusStatistics(): void {
    this.$dismantleBarrierWorkOrderService
      .queryRemoveOrderStatusPercentage_API()
      .subscribe((result: ResultModel<any[]>) => {
        let completedCount: number;
        let singleBackCount: number;
        let totalCount = 0;
        let statusList = [];
        if (result.code === ResultCodeEnum.success) {
          if (!result.data || result.data.length === 0) {
            this.statusChartType = ChartTypeEnum.text;
          } else {
            this.statusChartType = ChartTypeEnum.chart;
            // 遍历数据
            result.data.forEach((item) => {
              if (item.orderStatus === WorkOrderStatusEnum.completed) {
                completedCount = item.percentage;
              } else if (item.orderStatus === WorkOrderStatusEnum.singleBack) {
                singleBackCount = item.percentage;
              }
            });
            if (result.data.length) {
              statusList = result.data;
              totalCount = statusList.reduce((a, b) => a.percentage + b.percentage);
            }
          }
        } else {
          const list = [
            { orderStatus: WorkOrderStatusEnum.completed, percentage: 0 },
            { orderStatus: WorkOrderStatusEnum.singleBack, percentage: 0 },
          ];
          this.statusChartType = ChartTypeEnum.chart;
          list.forEach((res) => {
            if (res.orderStatus === WorkOrderStatusEnum.completed) {
              completedCount = res.percentage;
            } else if (res.orderStatus === WorkOrderStatusEnum.singleBack) {
              singleBackCount = res.percentage;
            }
          });
        }
        setTimeout(() => {
          this.getPercent('canvas_completed', '#ffa145', completedCount, totalCount);
          this.getPercent('canvas_singleBack', '#ff7474', singleBackCount, totalCount);
          this.inspectCompletedPercent = `${completedCount}%`;
          this.inspectSingleBackPercent = `${singleBackCount}%`;
        }, 10);
      });
  }
  /**
   * 计算环的角度
   */
  getPercent(id, color, num = 0, total) {
    const endingAngle = (-0.5 + (num / total) * 2) * Math.PI;
    this.drawCircle(id, color, endingAngle);
  }

  // 画环
  drawCircle(id, color, endingAngle = 1.5 * Math.PI, startingAngle = -0.5 * Math.PI) {
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
      // context.lineWidth = 3;completedPercent
      context.strokeStyle = color;
      context.arc(centerX, centerY, radius, startingAngle, endingAngle);
      context.stroke();
    } catch (e) {}
  }
}
