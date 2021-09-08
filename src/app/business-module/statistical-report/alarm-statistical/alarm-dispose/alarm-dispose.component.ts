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
import {ScreenConditionModel} from '../../share/model/alarm/screen-condition.model';
import {AreaDataModel} from '../../share/model/alarm/area-data.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';

@Component({
  selector: 'app-alarm-dispose',
  templateUrl: './alarm-dispose.component.html',
  styleUrls: ['./alarm-dispose.component.scss']
})

export class AlarmDisposeComponent extends AlarmStatisticalCommon implements OnInit {
  // 拿到选择器所有属性
  @ViewChild('appScreenCondition') appScreenCondition: ScreeningConditionComponent;
  // 国际化
  public language: AlarmLanguageInterface;
  // 表格数据
  public dataSet: AreaDataModel[] = [];
  // 表格翻页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 进度条
  public progressShow: boolean = false;
  // 控制eChart的显示隐藏
  public result: boolean = true;
  // 柱状图实例
  public barChartInstance: any;
  // 饼图实例
  public ringChartInstance: any;
  // 初次请求的统计数据
  public allData;
  // 第一次请求列表数据过来后 保存起来
  private dataSetMain = [];
  // 区域集合
  private areaList: string[];

  constructor(
    public $NZi18: NzI18nService,
    public $alarmStatisticalService: AlarmStatisticalService,
    public $message: FiLinkModalService,
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
        title: this.language.areaName, key: 'areaId', width: 200,
        searchable: true,
        searchConfig: {type: ''}
      },
      {
        title: this.language.cleared, key: 'cleared', width: 100, searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.language.noClean, key: 'nucleared', width: 100, searchable: true,
        searchConfig: {type: 'input'}
      },
    ];
    this.initTableConfig(tableColumn);
  }

  /**
   * 统计事件
   */
  public search(event: ScreenConditionModel): void {
    this.progressShow = true;
    // 将区域的值 先保存起来
    this.areaList = event.bizCondition.areaList;
    event.bizCondition.statisticsType = StatisticsTypeEnum.facility;
    // 接口还未链条
    this.$alarmStatisticalService.queryAlarmHandle(event).subscribe((res: ResultModel<{ [key: string]: AreaDataModel }>) => {
      if (res.code === 0) {
        const data = res.data;
        this.dataSet = [];
        this.result = false;
        const datas = {};
        Object.keys(data).forEach(key => {
          datas[key] = {
            'cleared': data[key]['cleared'] + data[key]['deviceCleared'],
            'nucleared': data[key]['nucleared'],
          };
        });
        this.allData = datas;
        this.setChartData();
        // 列表
        this.table();
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
        cleared: 0,
        nucleared: 0
      };
      this.dataSet.push(list);
    });
    this.tableConfig.isLoading = false;
  }

  /**
   * 数据转化 传入英文 返回中文
   */
  public analysisData(data: string): string {
    let name = '';
    switch (data) {
      case 'cleared':
        // 已清除
        name = this.language.cleared;
        break;
      case 'nucleared':
        // 未清除
        name = this.language.noClean;
        break;
    }
    return name;
  }


  /**
   * 初始化表格配置
   * param data
   */
  private initTableConfig(data: ColumnConfig[]): void {
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
        const queryCondition = new QueryConditionModel();
        queryCondition.bizCondition = CurrentPageTypeEnum.alarmHandle;
        // 处理参数
        const body = {
          queryCondition: queryCondition,
          columnInfoList: event.columnInfoList,
          excelType: event.excelType,
          objectList: this.dataSet
        };
        this.$alarmStatisticalService.exportAlarmStatistical(body, 2).subscribe((res: ResultModel<any>) => {
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
