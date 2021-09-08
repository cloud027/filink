import {Component, OnInit, ViewChild} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ColumnConfig, TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ScreeningConditionComponent} from '../screening-condition/screening-condition.component';
import {AlarmStatisticalService} from '../../share/service/alarm-statistical.service';
import {StatisticsTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {AlarmStatisticalUtil} from '../../share/util/alarm-statistical.util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {CurrentPageTypeEnum} from '../../share/enum/current-page-type.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {AreaAlarmModel} from '../../share/model/alarm/area-alarm.model';
import {ScreenConditionModel} from '../../share/model/alarm/screen-condition.model';

@Component({
  selector: 'app-area-alarm',
  templateUrl: './area-alarm.component.html',
  styleUrls: ['./area-alarm.component.scss']
})
export class AreaAlarmComponent implements OnInit {

  // 拿到选择器所有属性
  @ViewChild('appScreenCondition') appScreenCondition: ScreeningConditionComponent;
  // 国际化
  public language: AlarmLanguageInterface;
  // 控制图表是否显示
  public result: boolean = true;
  // 表格数据
  public dataSet = [];
  // 表格翻页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 进度条
  public progressShow: boolean = false;
  // 柱状图实例
  private barChartInstance;
  // 饼图实例
  private ringChartInstance;
  // 第一次请求列表数据过来后 保存起来
  private dataSetMain = [];
  // 接口数据
  private allData;

  constructor(
    private $NZi18: NzI18nService,
    public $message: FiLinkModalService,
    public $alarmStatisticalService: AlarmStatisticalService,
  ) {
    this.language = this.$NZi18.getLocaleData(LanguageEnum.alarm);
  }


  /**
   * 初始化
   */
  public ngOnInit(): void {
    const tableColumn: ColumnConfig[] = [
      {title: this.language.areaName, key: 'areaId', width: 200, searchable: true, searchConfig: {type: ''}},
      {
        title: this.language.areaAlarmNumber, key: 'areaAlarmCount', width: 100, searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.areaAlarmRatio, key: 'areaAlarmRate', width: 100, searchable: true,
        searchConfig: {type: 'input'}
      },
    ];
    this.initTableConfig(tableColumn);
  }

  /**
   * 统计
   * param event
   */
  public search(event: ScreenConditionModel): void {
    // 进度条
    this.progressShow = true;
    event.bizCondition.statisticsType = StatisticsTypeEnum.facility;
    this.$alarmStatisticalService.areaAlarmStatistics(event).subscribe((res: ResultModel<{ [key: string]: AreaAlarmModel }>) => {
      if (res.code === ResultCodeEnum.success) {
        this.result = false;
        this.dataSet = [];
        this.allData = res.data;
        this.setChartData();
        // 列表
        this.table();
        // 进度条
        this.progressShow = false;
      }
    });
  }

  /**
   * 获取饼图实例
   * param event
   */
  public getRingChartInstance(event: any): void {
    this.ringChartInstance = event;
  }

  /**
   * 获取柱状图实例
   * param event
   */
  public getBarChartInstance(event: any): void {
    this.barChartInstance = event;
  }

  /**
   * 表格数据配置
   */
  private table(): void {
    Object.keys(this.allData).forEach(key => {
      if (key !== 'total') {
        const data = {
          ...this.allData[key],
          areaId: AlarmStatisticalUtil.byKeyGetValue(this.appScreenCondition.treeNodes, key)
        };
        this.dataSet.push(data);
      }
    });
    this.tableConfig.isLoading = false;
  }

  /**
   * 设置列表数据
   */
  private setChartData(): void {
    const ringData = [];
    const ringName = [];
    const barData = [];
    const barName = [];
    Object.keys(this.allData).forEach(key => {
      ringData.push({
        value: this.allData[key].areaAlarmCount,
        name: AlarmStatisticalUtil.byKeyGetValue(this.appScreenCondition.treeNodes, key)
      });
      ringName.push(AlarmStatisticalUtil.byKeyGetValue(this.appScreenCondition.treeNodes, key));
      barData.push(this.allData[key].areaAlarmCount);
      barName.push(AlarmStatisticalUtil.byKeyGetValue(this.appScreenCondition.treeNodes, key));
    });
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }

  /**
   * 初始化表格配置
   * param data
   */
  private initTableConfig(data: ColumnConfig[]) {
    this.tableConfig = {
      noIndex: true,
      showSearchSwitch: false,
      showSearch: false,
      notShowPrint: true,
      noExportHtml: true,
      showSearchExport: true,
      columnConfig: data,
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          this.dataSet = this.dataSetMain.filter(items => {
            return event.every(item => items[item.filterField] + '' === item.filterValue.trim()) && items;
          });
        }
      },
      handleExport: (event) => {
        // 处理参数
        const body = {
          queryCondition: new QueryConditionModel(),
          columnInfoList: event.columnInfoList,
          excelType: event.excelType,
          objectList: this.dataSet,
        };
        body.queryCondition.bizCondition = CurrentPageTypeEnum.areaRatio;
        this.$alarmStatisticalService.exportAlarmStatistical(body, 4).subscribe((res: ResultModel<any>) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }
}
