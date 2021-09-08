import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApplicationInterface } from '../../../../../../assets/i18n/application/application.interface';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { Router } from '@angular/router';
import { NzI18nService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { OperationButtonEnum } from '../../../share/enum/operation-button.enum';
import { SelectDataConfig } from '../../../share/config/select.data.config';
import { ApplicationService } from '../../../share/service/application.service';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { ChartsConfig } from '../../../share/config/charts-config';
import { StatisticalChartModel } from '../../../share/model/lighting.model';
import { MonitorPointTabKeyEnum } from '../../../share/enum/monitor-config.enum';

@Component({
  selector: 'app-monitor-point',
  templateUrl: './monitor-point.component.html',
  styleUrls: ['./monitor-point.component.scss'],
})
export class MonitorPointComponent implements OnInit, OnChanges {
  /** monitor-point 组件的 设备 id */
  @Input() equipmentId: string;
  monitorPointList;
  // 默认选中 监测点数据 的日期
  public monitorPointRange: number = 3;
  // 默认选择 监测点数据日期 的筛选条件
  public electricityNumber: number = 8;
  // 设备状态统计
  public monitorPointEchartsData: object;

  /** 当前的 tab 索引 */
  tabIndex: number = 0;
  /** 用来存储 返回的监测点 数据 */
  saveResultData: any[] = [];
  // 起始时间
  public dateRange: Date = new Date();
  // 操作按钮枚举
  public OperationButtonEnum = OperationButtonEnum;
  /** 用来显示隐藏 Echarts */
  isShowMonitorPointStatus: boolean = false;

  // 监测点数据 tab
  monitorPointTabList;
  // 国际化
  public language: ApplicationInterface;
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    // 接口服务
    private $applicationService: ApplicationService,
  ) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    // 监测点数据默认查询条件
    this.monitorPointList = SelectDataConfig.lightingRateData(this.language);
    this.init_tabList();
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'changes');
    if (changes.equipmentId.currentValue) {
      this.dateRange = new Date();
      this.getMonitorPointRangeData();
    } else { this.dateRange = new Date(); }
  }
  // 初始化 tab 的list 数据
  init_tabList() {
    this.monitorPointTabList = [
      {
        code: MonitorPointTabKeyEnum.temperature,
        company: MonitorPointTabKeyEnum.temperatureCompany,
        tabTitle: this.language.MonitorWorkbench.temperature,
      },
      {
        code: MonitorPointTabKeyEnum.humidity,
        company: MonitorPointTabKeyEnum.humidityCompany,
        tabTitle: this.language.MonitorWorkbench.humidity,
      },
      {
        code: MonitorPointTabKeyEnum.pressure,
        company: MonitorPointTabKeyEnum.pressureCompany,
        tabTitle: this.language.MonitorWorkbench.pressure,
      },
      {
        code: MonitorPointTabKeyEnum.winddirection,
        company: MonitorPointTabKeyEnum.winddirectionCompany,
        tabTitle: this.language.MonitorWorkbench.windDirection,
      },
      {
        code: MonitorPointTabKeyEnum.windspeed,
        company: MonitorPointTabKeyEnum.windspeedCompany,
        tabTitle: this.language.MonitorWorkbench.windSpeed,
      },

      {
        code: MonitorPointTabKeyEnum.rainfall,
        company: MonitorPointTabKeyEnum.rainfallCompany,
        tabTitle: this.language.MonitorWorkbench.rainfall,
      },
      {
        code: MonitorPointTabKeyEnum.radiation,
        company: MonitorPointTabKeyEnum.radiationCompany,
        tabTitle: this.language.MonitorWorkbench.radiation,
      },
      {
        code: MonitorPointTabKeyEnum.UVIndex,
        company: MonitorPointTabKeyEnum.UVIndexCompany,
        tabTitle: this.language.MonitorWorkbench.UVIndex,
      },
      {
        code: MonitorPointTabKeyEnum.PM25,
        company: MonitorPointTabKeyEnum.PM25Company,
        tabTitle: this.language.MonitorWorkbench.PM25,
      },
      {
        code: MonitorPointTabKeyEnum.PM10,
        company: MonitorPointTabKeyEnum.PM10Company,
        tabTitle: this.language.MonitorWorkbench.PM10,
      },
      {
        code: MonitorPointTabKeyEnum.noise,
        company: MonitorPointTabKeyEnum.noiseCompany,
        tabTitle: this.language.MonitorWorkbench.noise,
      },
    ];
  }
  nzSelectChange({ index }) {
    this.initEcharts(index);
  }
  // 选择年月日
  public handleChange(event): void {
    this.monitorPointRange = event;
    this.getMonitorPointRangeData();
  }
  /** 监测点数据统计 */
  public getMonitorPointRangeData(): void {
    this.isShowMonitorPointStatus = false;
    const getDateTime: Date = new Date();
    const params = {
      equipmentId: this.equipmentId,
      startTime: this.dateRange
        ? this.dateRange.setHours(0, 0, 0, 0)
        : getDateTime.setHours(0, 0, 0, 0),
    };
    this.$applicationService
      .monitorStatisticsDataByTime_API(params)
      .subscribe((result: ResultModel<any[]>) => {
        if (result.code === ResultCodeEnum.success) {
          console.log(result.data, 'result');
          this.saveResultData = result.data;
          if (result.data.length === 0) { return; } else if (result.data.length > 0) { this.isShowMonitorPointStatus = true; }
          this.initEcharts();
        } else {
          this.$message.error(result.msg);
        }
      });
  }
  // 选择时间查询
  public onDateChange(event: Date): void {
    this.tabIndex = 0;
    this.dateRange = event;
    if (this.equipmentId) { this.getMonitorPointRangeData(); }
  }
  /** 初始化 Echarts */
  initEcharts(index: number = 0) {
    const echartData: StatisticalChartModel = new StatisticalChartModel();
    echartData.company = this.monitorPointTabList[index].company;
    const getKey = this.monitorPointTabList[index].code;
    this.saveResultData.forEach((item) => {
      if (item.performance[getKey] || item.performance[getKey] === 0) {
        echartData.data.push(item.performance[getKey]);
        echartData.xData.push(`${new Date(item.reportTime).getHours()}: 00`);
        this.isShowMonitorPointStatus = true;
      } else {
        this.isShowMonitorPointStatus = false;
      }
    });

    this.monitorPointEchartsData = ChartsConfig.monitorPointLineEcharts(echartData);
  }
}
