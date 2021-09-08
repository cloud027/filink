import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { NzI18nService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { EnergyLanguageInterface } from '../../../../../../assets/i18n/energy/energy.language.interface';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { QueryConditionModel } from '../../../../../shared-module/model/query-condition.model';
import { ExportRequestModel } from '../../../../../shared-module/model/export-request.model';
import { OperatorEnum } from '../../../../../shared-module/enum/operator.enum';

import { statictisRangeTypeEnum } from '../../../share/enum/energy-config.enum';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { EnergyApiService } from '../../../share/service/energy/energy-api.service';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { Result } from '../../../../../shared-module/entity/result';

@Component({
  selector: 'app-statistic-table',
  templateUrl: './statistic-table.component.html',
  styleUrls: ['./statistic-table.component.scss'],
})
export class StatisticTableComponent implements OnInit, OnChanges {
  @Input() statisticRankData;
  dataSet = [];
  // 表格配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 表格翻页对象
  public pageBean: PageModel = new PageModel();
  language: EnergyLanguageInterface;
  constructor(
    private $nzI18n: NzI18nService,
    private router: Router,
    private $energyApiService: EnergyApiService,
    public $message: FiLinkModalService,
  ) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.initTableConfig(statictisRangeTypeEnum.statisticsRegion);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.statisticRankData.currentValue) {
      this.initTableConfig(changes.statisticRankData.currentValue.type);
      this.dataSet = changes.statisticRankData.currentValue.data;
    }
  }

  // 初始化表格配置
  private initTableConfig(type: statictisRangeTypeEnum): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      showSizeChanger: false,
      showSearchSwitch: false,
      primaryKey: '03-1',
      scroll: { x: '1800px', y: '340px' },
      noIndex: true,
      showSearchExport: true,
      noAutoHeight: true,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
        },
        {
          // 项目
          title: this.language.energyStatisticsListTable.project,
          key: 'axis',
          width: 200,
          hidden: type === statictisRangeTypeEnum.statisticsRegion,
          searchConfig: { type: 'input' },
        },
        {
          // 区域
          title: this.language.areaId,
          key: 'axis',
          width: 200,
          hidden: type === statictisRangeTypeEnum.statisticsProject,
          searchConfig: { type: 'input' },
        },
        // {
        //     // 采集回路
        //     title: this.language.collectLoopId,
        //     key: 'collectLoopId',
        //     width: 170,
        //     configurable: true,
        //     searchable: true,
        //     isShowSort: true,
        //     searchConfig: { type: 'input' }
        // },
        // 能耗实际值(kW·h)
        {
          title: this.language.energyStatisticsListTable.actualEnergy,
          key: 'energyConsumption',
          width: 200,
          searchConfig: { type: 'input' },
        },
        // 能耗额定值(kW·h)
        {
          title: this.language.energyStatisticsListTable.energyRating,
          key: 'energyTarget',
          width: 200,
          searchConfig: { type: 'input' },
        },
        // 节能率(%)
        {
          title: this.language.energyStatisticsListTable.energySavingRate,
          key: 'saveEnergyPercent',
          width: 200,
          searchConfig: { type: 'input' },
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      rightTopButtons: [],
      handleExport: (event) => {
        const getColumnInfoList: any[] = event.columnInfoList;
        const objectList: any[] = CommonUtil.deepClone(this.dataSet);
        getColumnInfoList.forEach((item) => {
          if (item.propertyName === 'axis') {
            if (type === statictisRangeTypeEnum.statisticsProject) { item.propertyName = 'projectName'; } else if (type === statictisRangeTypeEnum.statisticsRegion) {
              item.propertyName = 'areaName';
                 }
          }
        });
        objectList.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if (key === 'axis') {
              if (type === statictisRangeTypeEnum.statisticsProject) { item['projectName'] = item[key]; } else if (type === statictisRangeTypeEnum.statisticsRegion) {
                item['areaName'] = item[key];
                   }
              delete item[key];
            }
          });
        });
        // 处理参数
        const body = new ExportRequestModel(
          getColumnInfoList,
          event.excelType,
          new QueryConditionModel(),
        );
        body['objectList'] = objectList;
        this.$energyApiService.exportEnergyStatistics_API(body).subscribe((res: Result) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.config.exportSuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      },
    };
  }
}
