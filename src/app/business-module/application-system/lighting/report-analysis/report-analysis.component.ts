import {Component, OnInit} from '@angular/core';
import {
  DateTypeEnum,
  ElectricCurrentItemEnum,
  ElectricEnergyItemEnum,
  ElectricityConsumptionItemEnum,
  EnergySavingRateItemEnum,
  EquipmentTypeEnum,
  LightingRateItemEnum,
  PowerFactorItemEnum,
  PowerItemEnum,
  ReportAnalysisTabEnum,
  ReportAnalysisTypeEnum,
  StatisticalDimensionEnum,
  StatisticalDimensionNameEnum,
  VoltageItemEnum,
  WorkingTimeItemEnum
} from '../../share/enum/report-analysis.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ColumnConfig, TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ApplicationService} from '../../share/service/application.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ChartsConfig} from '../../share/config/charts-config';
import {ReportAnalysisEchartsModel} from '../../share/model/report-analysis-echarts.model';

/**
 * 智慧照明-报表分析
 */
@Component({
  selector: 'app-report-analysis',
  templateUrl: './report-analysis.component.html',
  styleUrls: ['./report-analysis.component.scss']
})
export class ReportAnalysisComponent implements OnInit {
  public language: ApplicationInterface;
  public reportTabData = [];
  // 报表分析标签类型枚举
  public reportAnalysisTabEnum = ReportAnalysisTabEnum;
  // 表格数据源
  public dataSet = [];
  // 表格配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 翻页
  public pageBean: PageModel = new PageModel();
  // tab索引
  public tabIndex: number = Number(ReportAnalysisTabEnum.electricCurrent);
  // 表格
  public columnConfig: ColumnConfig[] = [];
  // 选择的统计维度
  public selectStatisticalDimension = StatisticalDimensionEnum.area;
  // 统计维度枚举
  public statisticalDimensionEnum = StatisticalDimensionEnum;
  // 区域名称/项目名称/设备名称/分组名称
  public statisticalDimensionName: string;
  // 是否显示统计图表名称
  public isShowReport: boolean = false;
  // 统计范围
  public selectStatisticsScopeName: string;
  // 缓存统计数据
  public storeReportData = {
    // 电流数据
    electric: null,
    // 电压
    voltage: null,
    // 功率
    power: null,
    // 电能
    electricEnergy : null,
    // 功率因数
    powerFactor: null,
    // 用电量
    electricityConsumption: null,
    // 工作时长
    workingTime: null,
    // 亮灯率
    lightingRate : null,
    // 节能率
    energySavingRate : null,
  };
  // 统计图dataSet
  public reportAnalysisData = new ReportAnalysisEchartsModel();
  // 统计图
  public reportAnalysisEchartsDataset = {};
  // 统计表格主键
  public primaryKey: string = '';
  // 是否隐藏统计图
  public isHideGraph: boolean = true;
  // 统计图是否有数据
  public isHaveGraphData: boolean = true;
  // 当前表头内容
  public currentTableTitle: string[] = [];
  // 是否显示统计表切换的title提示
  public showTip: boolean = false;
  /**
   * 构造器
   */
  constructor(
    // 多语言配置
    private $nzI18n: NzI18nService,
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit() {
    // 渲染报表分析tab标签
    this.handleReportTabData();
    // 初始化表格
    this.refreshData();
  }
  /**
   * 报表分析tab标签处理
   */
  public handleReportTabData(): void {
    this.reportTabData = Object.values(this.reportAnalysisTabEnum).map((item: string) => {
      return CommonUtil.codeTranslate(ReportAnalysisTabEnum, this.$nzI18n, item, 'application.reportAnalysis');
    });
  }

  /**
   * 生成统计结果
   */
  public generateResults(event): void {
    // 统计维度
    this.selectStatisticalDimension = event.params.statisticsScope;
    // 统计范围名称
    this.selectStatisticsScopeName = event.selectStatisticsScopeName;
    // 根据统计维度确定表头名称
    this.statisticalDimensionName = CommonUtil.codeTranslate(StatisticalDimensionNameEnum, this.$nzI18n, this.selectStatisticalDimension, 'application.reportAnalysis') as string;
    // 根据报文类型和筛选条件重新渲染表格
    this.initTableColumn();
    this.getColumnItem(event);
    // 生成主键primaryKey 后期可能会加权限码
    this.primaryKey = `analysis-${event.params.statisticsType}-${event.params.equipmentType}-${event.params.timeType}`;
    // 初始化表格
    this.initTable();
    // 是否是亮灯率统计 或 节能率统计
    const handleDecimals = (event.params.statisticsType === 'lightingRate' || event.params.statisticsType === 'energySavingRate');
    // 查询统计数据
    this.$applicationService.queryReportAnalysisData(event.params).subscribe((res: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      this.isShowReport = true;
      if (res.code === ResultCodeEnum.success) {
        // 处理返回数据
        const data = res.data || [];
        // 处理后台数据
        this.handleDataSet(data, handleDecimals);
        // 生成echarts图
        this.reportAnalysisEchartsDataset = ChartsConfig.reportAnalysis(this.reportAnalysisData);
        this.isHaveGraphData = data.length !== 0;
        // 缓存筛选条件和统计结果
        this.storeReportData[event.params.statisticsType] = {
          // 用户所选筛选条件
          condition: event,
          // 统计表数据
          tableResult: this.dataSet,
          // 统计图数据
          graphResult: this.reportAnalysisData,
          // 统计图是否显示
          isHideGraph: this.isHideGraph
        };
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 刷新表格
   */
  public refreshData(): void {
    this.dataSet = [];
    // 初始化表格项
    this.initTableColumn();
    // 初始化表格
    this.initTable();
  }


  /**
   * 导出报表
   * @param data 导出数据
   */
  public exportLightingStatisticsList(data): void {
    this.$applicationService.reportAnalysisExport(data).subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.language.reportAnalysis.exportSuccess);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 初始化统计表格columnConfig项
   */
  public initTableColumn(): void {
    this.columnConfig = [
      { // 序号
        type: 'serial-number',
        // width: 62,
        title: this.language.frequentlyUsed.serialNumber,
      },
      { // 统计维度
        title: this.statisticalDimensionName,
        key: 'selectStatisticsScopeName',
        width: 120
      }
    ];
  }

  /**
   * 改变报表分析类型
   */
  public changeReportType(event): void {
    this.tabIndex = event;
    this.dataSet = [];
    this.isShowReport = false;
    this.isHideGraph = true;
    this.isHaveGraphData = true;
    // 初始化表格项
    this.initTableColumn();
    // 初始化表格
    this.initTable();
    // 重置统计图数据
    this.reportAnalysisData = new ReportAnalysisEchartsModel();
  }
  /**
   * 处理不同报表分析类型的表格项
   */
  public getColumnItem(event): void {
    const arr = [
      //// 电流报表
      ElectricCurrentItemEnum,
      // 电压报表
      VoltageItemEnum,
      // 功率报表
      PowerItemEnum,
      // 电能报表
      ElectricEnergyItemEnum,
      // 功率因数报表
      PowerFactorItemEnum,
      // 用电量报表
      ElectricityConsumptionItemEnum,
      // 工作时长报表
      WorkingTimeItemEnum,
      // 亮灯率报表
      LightingRateItemEnum,
      // 节能率报表
      EnergySavingRateItemEnum
    ];
    // 过滤类型
    let filter = [];
    // 当前tab
    switch (this.tabIndex) {
      case 0 :
        // 电流统计
        if (event.params.equipmentType === EquipmentTypeEnum.singleLightController) {
          //   单灯
          // 是否按日
          filter = event.params.timeType === DateTypeEnum.day ? [ElectricCurrentItemEnum.inputCurrent] : [ElectricCurrentItemEnum.minInputCurrent, ElectricCurrentItemEnum.maxInputCurrent];
        } else {
          // 设备为集控
          if (event.params.timeType === DateTypeEnum.day) {
            // 按日
            filter = [ElectricCurrentItemEnum.aEffectiveValueOfCurrent, ElectricCurrentItemEnum.bEffectiveValueOfCurrent, ElectricCurrentItemEnum.cEffectiveValueOfCurrent];
          } else {
            // 按月或年
            filter = [ElectricCurrentItemEnum.minAEffectiveValueOfCurrent, ElectricCurrentItemEnum.maxAEffectiveValueOfCurrent, ElectricCurrentItemEnum.minBEffectiveValueOfCurrent,
              ElectricCurrentItemEnum.maxBEffectiveValueOfCurrent, ElectricCurrentItemEnum.minCEffectiveValueOfCurrent, ElectricCurrentItemEnum.maxCEffectiveValueOfCurrent];
          }
        }
        break;
      case 1:
        // 电压统计
        if (event.params.equipmentType === EquipmentTypeEnum.singleLightController) {
          // 单灯
          filter = event.params.timeType === DateTypeEnum.day ? [VoltageItemEnum.inputVoltage] : [VoltageItemEnum.minInputVoltage, VoltageItemEnum.maxInputVoltage];
        } else {
          if (event.params.timeType === DateTypeEnum.day) {
            // 按日
            filter = [VoltageItemEnum.aEffectiveValueOfVoltage, VoltageItemEnum.bEffectiveValueOfVoltage, VoltageItemEnum.cEffectiveValueOfVoltage, VoltageItemEnum.abEffectiveValueOfVoltage,
              VoltageItemEnum.bcEffectiveValueOfVoltage, VoltageItemEnum.caEffectiveValueOfVoltage];
          } else {
            // 按月和年
            filter = [VoltageItemEnum.minAEffectiveValueOfVoltage, VoltageItemEnum.maxAEffectiveValueOfVoltage, VoltageItemEnum.minBEffectiveValueOfVoltage,
              VoltageItemEnum.maxBEffectiveValueOfVoltage, VoltageItemEnum.minCEffectiveValueOfVoltage, VoltageItemEnum.maxCEffectiveValueOfVoltage, VoltageItemEnum.minABEffectiveValueOfVoltage,
              VoltageItemEnum.maxABEffectiveValueOfVoltage, VoltageItemEnum.minBCEffectiveValueOfVoltage,
              VoltageItemEnum.maxBCEffectiveValueOfVoltage, VoltageItemEnum.minCAEffectiveValueOfVoltage, VoltageItemEnum.maxCAEffectiveValueOfVoltage];
          }
        }
        break;
      case 2:
        // 功率统计
        if (event.params.equipmentType === EquipmentTypeEnum.singleLightController) {
          // 单灯
          // 是否按日
          filter = event.params.timeType === DateTypeEnum.day ? ['power'] : ['minPower', 'maxPower'];
        } else {
          //  集控
          if (event.params.timeType === DateTypeEnum.day) {
            // 按日
            filter = [PowerItemEnum.activePower, PowerItemEnum.aActivePower, PowerItemEnum.bActivePower, PowerItemEnum.cActivePower, PowerItemEnum.reactivePower, PowerItemEnum.aReactivePower,
              PowerItemEnum.bReactivePower, PowerItemEnum.cReactivePower];
          } else {
            // 按年或月
            filter = [PowerItemEnum.minActivePower, PowerItemEnum.maxActivePower, PowerItemEnum.minAActivePower, PowerItemEnum.maxAActivePower, PowerItemEnum.minBActivePower,
              PowerItemEnum.maxBActivePower, PowerItemEnum.minCActivePower, PowerItemEnum.maxCActivePower, PowerItemEnum.minReactivePower, PowerItemEnum.maxReactivePower,
              PowerItemEnum.minAReactivePower, PowerItemEnum.maxAReactivePower, PowerItemEnum.minBReactivePower, PowerItemEnum.maxBReactivePower, PowerItemEnum.minCReactivePower,
              PowerItemEnum.maxCReactivePower];
          }

        }
        break;
      case 3:
        // 电能统计
        if (event.params.equipmentType === EquipmentTypeEnum.singleLightController) {
          // 单灯
          filter = [ElectricEnergyItemEnum.energy];
        } else {
          // 集控
          filter = [ElectricEnergyItemEnum.activeElectricEnergy, ElectricEnergyItemEnum.aActiveElectricEnergy, ElectricEnergyItemEnum.bActiveElectricEnergy,
            ElectricEnergyItemEnum.CActiveElectricEnergy, ElectricEnergyItemEnum.reactiveEnergy, ElectricEnergyItemEnum.aReactiveEnergy, ElectricEnergyItemEnum.BReactiveEnergy,
            ElectricEnergyItemEnum.CReactiveEnergy];
        }
        break;
      case 4:
        // 功率因数统计 (无单灯)
        if (event.params.timeType === DateTypeEnum.day) {
          filter = [PowerFactorItemEnum.powerFactor, PowerFactorItemEnum.APowerFactor, PowerFactorItemEnum.BPowerFactor, PowerFactorItemEnum.CPowerFactor];
        } else {
          filter = [PowerFactorItemEnum.minPowerFactor, PowerFactorItemEnum.maxPowerFactor, PowerFactorItemEnum.minAPowerFactor, PowerFactorItemEnum.maxAPowerFactor,
            PowerFactorItemEnum.minBPowerFactor, PowerFactorItemEnum.maxBPowerFactor, PowerFactorItemEnum.minCPowerFactor, PowerFactorItemEnum.maxCPowerFactor];
        }
        break;
      case 5:
        // 用电量
        filter = [ElectricityConsumptionItemEnum.electricityConsumption];
        break;
      case 6:
        // 工作时长
        filter = [WorkingTimeItemEnum.workingTime];
        break;
      case 7:
        // 亮灯率
        filter = [LightingRateItemEnum.lightingRateUnit];
        break;
      case 8:
        // 节能率
        filter = [EnergySavingRateItemEnum.energySavingRate];
        break;
      default:
        break;
    }
    this.reportAnalysisData.legend = [];
    filter.forEach((item) => {
      const obj: ColumnConfig = {};
      // 表格列列头标题
      obj.title = CommonUtil.codeTranslate(arr[this.tabIndex], this.$nzI18n, item, 'application.reportAnalysis') as string;
      // 列key
      obj.key = item;
      // 列是否可配置
      obj.configurable = true;
      // 列宽度
      obj.width = 100;
      this.columnConfig.push(obj);
      // echarts 数据
      this.reportAnalysisData.legend.push(obj.title);
    });
    // 当前表格表头内容集合
    this.currentTableTitle = this.reportAnalysisData.legend;
    // 时间列配置
    const timeConfigObj = {
      title: this.language.reportAnalysis.time,
      key: 'time',
      width: 200,
    };
    // 表格增加时间列
    this.columnConfig.push(timeConfigObj);
  }

  /**
   * 处理后台返回数据组装成表格数据源dataSet和 echarts数据源
   * @param data 要处理的数据
   * @param handleDecimals 是否是亮灯率统计 或者节能率统计
   */
  public handleDataSet(data, handleDecimals): void {
    // 统计图数据重置为初始
    this.reportAnalysisData.yData = [];
    // 表格数据
    const arr = [];
    let graphType = 'line';
    if (this.tabIndex === 5 || this.tabIndex === 6) {
      // 用电量和工作时长为柱状图，其他为折线
      graphType = 'bar';
    }
    data.forEach((item) => {
      item.result.forEach((v, j) => {
        const obj = {};
        for (let k = 0; k < data.length; k++) {
          if (handleDecimals) {
            // 亮灯率和节能率的数据要处理 乘以100
            obj[`${data[k].item}`] = (data[k].result[j].value * 100).toFixed(2);
            // y轴数据
            this.reportAnalysisData.yData[k] = {
              type: graphType,
              name: this.currentTableTitle[k],
              data: data[k].result.map(z => (z.value * 100 ).toFixed(2))
            };
          } else {
            // y轴数据
            this.reportAnalysisData.yData[k] = {
              type: graphType,
              name: this.currentTableTitle[k],
              data: data[k].result.map(z => z.value)
            };
            obj[`${data[k].item}`] = data[k].result[j].value;
          }
        }
        obj['time'] = v.time;
        obj['selectStatisticsScopeName'] = this.selectStatisticsScopeName;
        arr[j] = obj;
      });
    });
    // echarts x轴数据
    this.reportAnalysisData.xData = data.length > 0 ? data[0].result.map(item => item.time) : [];
    this.dataSet = arr;
  }


  /**
   * 切换统计图表
   */
  public changeGraph() {
    this.isHideGraph = !this.isHideGraph;
    const currentTitle = Object.values(ReportAnalysisTypeEnum)[this.tabIndex];
    this.storeReportData[currentTitle].isHideGraph = this.isHideGraph;
  }

  /**
   * 从缓存拿统计数据
   */
  public getCacheResults(event: string): void {
    const condition = this.storeReportData[event].condition;
    this.initTableColumn();
    this.getColumnItem(condition);
    // 生成主键primaryKey 后期可能会加权限码
    this.primaryKey = `analysis-${condition.params.statisticsType}-${condition.params.equipmentType}-${condition.params.timeType}`;
    this.initTable();
    this.tableConfig.isLoading = false;
    this.isShowReport = true;
    this.isHideGraph = this.storeReportData[event].isHideGraph;
    // 重新渲染统计表
    this.dataSet = this.storeReportData[event].tableResult;
    // 重新渲染统计图
    this.reportAnalysisData = this.storeReportData[event].graphResult;
    this.isHaveGraphData = this.reportAnalysisData.yData.length !== 0;
    this.reportAnalysisEchartsDataset = ChartsConfig.reportAnalysis(this.reportAnalysisData);
  }
  /**
   * 初始化统计表格配置
   */
  private initTable(): void {
    this.tableConfig = {
      primaryKey: this.primaryKey,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '340px'},
      noIndex: true,
      notShowPrint: true,
      noExportHtml: true,
      columnConfig: this.columnConfig,
      showPagination: false,
      bordered: false,
      showSearch: false,
      showSearchExport: true,
      searchReturnType: 'Array',
      rightTopButtons: [
        {
          // 统计图切换
          text: this.language.reportAnalysis.summaryGraph,
          iconClassName: 'fiLink-analysis',
          handle: () => {
            this.changeGraph();
          }
        }
      ],
      // 导出
      handleExport: (event) => {
        // 处理参数
        const body = {
          queryCondition: new QueryConditionModel(),
          // 列信息
          columnInfoList: event.columnInfoList,
          // 导出文件类型
          excelType: event.excelType,
          // 表格数据内容
          objectList: this.dataSet
        };
        body.queryCondition.bizCondition = Object.values(ReportAnalysisTypeEnum)[this.tabIndex];
        this.exportLightingStatisticsList(body);
      }
    };
  }

}
