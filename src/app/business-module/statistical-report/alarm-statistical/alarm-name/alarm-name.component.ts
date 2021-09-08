import {Component, OnInit, ViewChild} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ColumnConfig, TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ScreeningConditionComponent} from '../screening-condition/screening-condition.component';
import {AlarmStatisticalService} from '../../share/service/alarm-statistical.service';
import {StatisticsTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {AlarmStatisticalUtil} from '../../share/util/alarm-statistical.util';
import {AlarmStatisticalCommon} from '../alarm-statistical-common';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {CurrentPageTypeEnum} from '../../share/enum/current-page-type.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ScreenConditionModel} from '../../share/model/alarm/screen-condition.model';

@Component({
  selector: 'app-alarm-name',
  templateUrl: './alarm-name.component.html',
  styleUrls: ['./alarm-name.component.scss']
})
export class AlarmNameComponent extends AlarmStatisticalCommon implements OnInit {

  // 拿到选择器所有属性
  @ViewChild('appScreenCondition') appScreenCondition: ScreeningConditionComponent;
  // 国际化
  public language: AlarmLanguageInterface;
  // 表格数据
  public dataSet = [];
  // 表格翻页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 进度条
  public progressShow: boolean = false;
  // 控制图表是否显示
  public result: boolean = true;
  // 柱状图实例
  public barChartInstance: any;
  // 饼图实例
  public ringChartInstance: any;
  // 请求的数据
  public allData;
  // 第一次请求列表数据过来后 保存起来 前端筛选用
  private dataSetMain = [];
  // 区域信息
  private areaList: string[];
  private selectAlarm: any;

  constructor(
    public $NZi18: NzI18nService,
    public $message: FiLinkModalService,
    public $alarmStatisticalService: AlarmStatisticalService,
  ) {
    super($NZi18);
    this.language = this.$NZi18.getLocaleData(LanguageEnum.alarm);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    const tableColumn: ColumnConfig[] = [
      {
        title: this.language.areaName, key: 'areaId', width: 200, searchable: true,
        searchConfig: {type: ''}
      },
    ];
    this.initTableConfig(tableColumn);
  }

  /**
   * 获取统计数据
   * param event
   */
  public search(event: ScreenConditionModel): void {
    this.progressShow = true;
    // 将区域的值 先保存起来
    this.areaList = event.bizCondition.areaList;
    event.bizCondition.statisticsType = StatisticsTypeEnum.facility;
    this.$alarmStatisticalService.queryAlarmNameStatistics(event).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.result = false;
        this.dataSet = [];
        this.allData = res.data;
        this.setChartData();
        Object.keys(this.allData).forEach(key => {
          if (key !== 'total') {
            const data = {
              ...this.allData[key],
              areaId: AlarmStatisticalUtil.byKeyGetValue(this.appScreenCondition.treeNodes, key)
            };
            this.dataSet.push(data);
          }
        });
        // 列表
        this.table();
        this.progressShow = false;
      }
    });
  }

  public selectAlarmChange(event: any): void {
    this.selectAlarm = event;
    const tableColumn: ColumnConfig[] = [
      {
        title: this.language.areaName, key: 'areaId', width: 200, searchable: true,
        searchConfig: {type: ''}
      },
    ];
    if (event.alarmNames.length > 0) {
      event.alarmNames.forEach((item, index) => {
        tableColumn.push({
          title: event.alarmNames[index], key: event.selectAlarmCodes[index], width: 100, searchable: true,
          searchConfig: {type: 'input'}
        });
      });
    }

    this.initTableConfig(tableColumn);
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
    /**
     * 先找出 已经存在的 将其在区域数组中移除
     * 重新在重组 数组
     */
    this.dataSet.forEach(listData => {
      const index = this.areaList.findIndex(area => area === listData.areaId);
      this.areaList.splice(index, 1);
    });
    this.areaList.forEach(areaName => {
      const list = {
        areaId: areaName,
        pryDoor: 0,
        pryLock: 0,
        humidity: 0,
        highTemperature: 0,
        lowTemperature: 0,
        communicationInterrupt: 0,
        leach: 0,
        notClosed: 0,
        unLock: 0,
        lean: 0,
        shake: 0,
        electricity: 0,
        violenceClose: 0,
        voltage: 0,
        orderOutOfTime: 0,
        emergencyLock: 0
      };
      this.dataSet.push(list);
    });
    this.tableConfig.isLoading = false;
  }

  /**
   * 初始化表格配置
   * param data
   */
  private initTableConfig(data?: ColumnConfig[]): void {
    this.tableConfig = {
      noIndex: true,
      showSearchSwitch: false,
      showSearch: false,
      notShowPrint: true,
      noExportHtml: true,
      showSearchExport: true,
      columnConfig: data || [],
      scroll: {x: '900px', y: '325px'},
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          this.dataSet = this.dataSetMain.filter(items => {
            return event.every(item => items[item.filterField] + '' === item.filterValue.trim()) && items;
          });
        }
      },
      handleExport: (event) => {
        const queryCondition = new QueryConditionModel();
        queryCondition.bizCondition = CurrentPageTypeEnum.alarmName;
        // 处理参数
        const body = {
          queryCondition: queryCondition,
          columnInfoList: event.columnInfoList,
          excelType: event.excelType,
          objectList: this.dataSet
        };
        this.$alarmStatisticalService.exportAlarmStatistical(body, 3).subscribe((res: ResultModel<any>) => {
          if (res.code === ResultCodeEnum.success || res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  public analysisData(key): any {
    const arr: [] = this.selectAlarm.selectAlarmCodes;
    const index = arr.findIndex(item => item === key);
    return this.selectAlarm.alarmNames[index];
  }
}
