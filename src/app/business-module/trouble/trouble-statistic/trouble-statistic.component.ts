import { Component, OnInit } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../shared-module/enum/language.enum';
import { FiLinkModalService } from '../../../shared-module/service/filink-modal/filink-modal.service';
import { FaultLanguageInterface } from '../../../../assets/i18n/fault/fault-language.interface';
import { CommonUtil } from '../../../shared-module/util/common-util';

import {
  TroubleStatisticTypeEnum,
  TranKeyEnum,
  RequestURLTypeEnum,
  TroubleExportKeyEnum,
  TableExportUrlEnum,
} from '../share/enum/trouble.enum';
import { TroubleUtil } from '../../../core-module/business-util/trouble/trouble-util';
import { SelectModel } from '../../../shared-module/model/select.model';
import { FacilityForCommonUtil } from '../../../core-module/business-util/facility/facility-for-common.util';
import { TableConfigModel } from '../../../shared-module/model/table-config.model';
import { PageModel } from '../../../shared-module/model/page.model';
import { QueryConditionModel } from '../../../shared-module/model/query-condition.model';
import { TroubleService } from '../share/service';
import { Result } from '../../../shared-module/entity/result';
import { ResultCodeEnum } from '../../../shared-module/enum/result-code.enum';
import { ChartUtil } from '../../../shared-module/util/chart-util';
import { TroubleToolService } from '../../../core-module/api-service/trouble/trouble-tool.service';

import { AlarmForCommonUtil } from '../../../core-module/business-util/alarm/alarm-for-common.util';
import { TimeFormatEnum } from '../../../shared-module/enum/time-format.enum';
@Component({
  selector: 'app-trouble-statistic',
  templateUrl: './trouble-statistic.component.html',
  styleUrls: ['./trouble-statistic.component.scss'],
})
export class TroubleStatisticComponent implements OnInit {
  /** 故障统计类型 绑定的数据 */
  statisticsTypeValue: TroubleStatisticTypeEnum = TroubleStatisticTypeEnum.faultSource;
  /** 统计请求的 URL 地址 */
  requestURLTypeString: RequestURLTypeEnum = RequestURLTypeEnum.faultSource;
  /** 故障统计类型 下拉数据 */
  statisticsTypeList;
  /** 用来传递给后端的 字段 */
  tranStringKey: TranKeyEnum;
  /** 根据故障类型下拉框 显示的可选数据 */
  checkSelectList: any = [];
  /** 故障类型选择的数据 model */
  checkSelectModel: any = [];
  /** 故障类型 */
  troubleTypeList: SelectModel[] = [];
  /** 时间选择器的 model */
  rangePickerModel: Date[] = [];
  /** 点击按钮的加载 */
  btnLoading: boolean = false;
  /** 按模板统计 弹出框 */
  templateTableVisible: boolean = false;
  _currentPage = 'alarmType';

  /** 柱状图实例 */
  barChartInstance;
  /** 显示隐藏 */
  barEchartsFlag: boolean = false;
  /** 饼图实例 */
  ringChartInstance;
  /** 表格数据 */
  __dataset = [];
  /** 第一次请求列表数据过来后 保存起来 */
  _datasetMain = [];
  /** 请求数据 */
  allData;
  pageBean: PageModel = new PageModel(10, 1, 1);
  /** 表格配置 */
  tableConfig: TableConfigModel;

  /** 获取 导出数据 的枚举 */
  troubleExportKey = TroubleExportKeyEnum;

  /** 表格 导出的 URL */
  tableExportURL: TableExportUrlEnum = TableExportUrlEnum.faultSource;
  language: FaultLanguageInterface;
  constructor(
    private $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $troubleUtil: TroubleUtil,
    public $troubleService: TroubleService,
    private $troubleToolService: TroubleToolService,
  ) {
    this.statisticsTypeList = CommonUtil.codeTranslate(
      TroubleStatisticTypeEnum,
      $nzI18n,
      null,
      'fault.faultStatisticsTypeOption',
    );
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
    // 初始化页面 设置默认值
    this.init();
    // 故障类型
    this.getTroubleType();
  }
  /** 初始化页面 */
  init(): void {
    const startTime = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const endTime = new Date();
    this.rangePickerModel = [startTime, endTime];
    const getSelectList = TroubleUtil.translateTroubleSource(this.$nzI18n) as any[];
    getSelectList.forEach((v) => {
      v.value = v.code;
    });
    this.checkSelectModel = this.checkSelectList = getSelectList;
    this.tranStringKey = TranKeyEnum.faultSource;
    const tableColumn = [];
    this.checkSelectModel.forEach((item) => {
      tableColumn.push({
        title: item.label,
        key: item.code,
        width: 200,
        searchable: true,
        searchConfig: { type: 'input' },
      });
    });
    this.initTableConfig(tableColumn);
    this.statisticBtn();
  }
  /** 故障类型 */
  public getTroubleType(): void {
    this.$troubleToolService.getTroubleTypeList().then((data: SelectModel[]) => {
      this.troubleTypeList = data;
    });
  }
  /** 故障统计类型 下拉框改变事件 */
  selectChange(value: TroubleStatisticTypeEnum) {
    this.statisticsTypeValue = value;
    this.checkSelectModel = [];
    // 故障来源
    if (value === TroubleStatisticTypeEnum.faultSource) {
      this.checkSelectList = TroubleUtil.translateTroubleSource(this.$nzI18n);
      this.tranStringKey = TranKeyEnum.faultSource;
      this.requestURLTypeString = RequestURLTypeEnum.faultSource;
      this.tableExportURL = TableExportUrlEnum.faultSource;
    } else if (value === TroubleStatisticTypeEnum.faultType) {
      this.checkSelectList = this.troubleTypeList;
      this.tranStringKey = TranKeyEnum.faultType;
      this.requestURLTypeString = RequestURLTypeEnum.faultType;
      this.tableExportURL = TableExportUrlEnum.faultType;
    } else if (value === TroubleStatisticTypeEnum.faultLevel) {
      (this.checkSelectList = AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n));
        (this.tranStringKey = TranKeyEnum.faultLevel);
      this.requestURLTypeString = RequestURLTypeEnum.faultLevel;
      this.tableExportURL = TableExportUrlEnum.faultLevel;
    } else if (value === TroubleStatisticTypeEnum.facilityType) {
      this.checkSelectList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
      this.tranStringKey = TranKeyEnum.facilityType;
      this.requestURLTypeString = RequestURLTypeEnum.facilityType;
      this.tableExportURL = TableExportUrlEnum.facilityType;
    } else if (value === TroubleStatisticTypeEnum.equipmentType) {
      this.checkSelectList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
      this.tranStringKey = TranKeyEnum.equipmentType;
      this.requestURLTypeString = RequestURLTypeEnum.equipmentType;
      this.tableExportURL = TableExportUrlEnum.equipmentType;
    }
    this.checkSelectList.forEach((v) => {
      v.value = v.code;
    });
  }
  /** 统计按钮点击确认 */
  statisticBtn() {
    if (this.checkSelectModel.length === 0 || this.rangePickerModel.length === 0) {
      return this.$message.warning(this.language.pleaseChooseStatistic);
    }

    const startTime = CommonUtil.dateFmt(
      TimeFormatEnum.startTime,
      new Date(this.rangePickerModel[0]),
    );
    const endTime = CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.rangePickerModel[1]));
    const params = {
      [this.tranStringKey]: this.checkSelectModel.map((item) => item.code),
      startTime: +new Date(startTime),
      endTime: +new Date(endTime),
    };
    this.barEchartsFlag = false;
    this.$troubleService
      .troubleStatistic_API(`/statistics/${this.requestURLTypeString}`, params)
      .subscribe((res) => {
        if (res.code === ResultCodeEnum.success) {
          const { data } = res;
          this.__dataset = [];
          this.allData = res['data'];
          if (data.length > 0) {
            this.barEchartsFlag = true;
            // 补充没有数据的 字段
            const getAllData = this.checkSelectModel.map((item) => {
              const getDataFind = data.find(
                (dataItem) => dataItem[this.statisticsTypeValue] === item.code,
              );
              if (getDataFind) {
                return {
                  label: item.label,
                  [item.code]: getDataFind.count,
                  key: item.code,
                  value: getDataFind.count,
                };
              } else {
                return {
                  label: item.label,
                  [item.code]: 0,
                  key: item.code,
                  value: 0,
                };
              }
            });
            this.setChartData(getAllData);
            const tableColumn = [];
            const setTableData = [{}];
            getAllData.forEach((item) => {
              tableColumn.push({
                title: item.label,
                key: item.key,
                width: 200,
                searchable: true,
                searchConfig: { type: 'input' },
              });
              setTableData[0][item.key] = item.value;
            });
            this.initTableConfig(tableColumn);
            this.__dataset = setTableData;
          } else {
            this.barEchartsFlag = false;
          }
        } else { this.$message.error(res.msg); }
      });
  }

  /** 模板查询 */
  templateTable(event) {
    this.templateTableVisible = false;
    if (!event) {
      return;
    } else {
      sessionStorage.removeItem('areaId');
    }
    console.log(event, 'event');
    // this.areaName = event.areaNames;
    // this.firstTimeModel = [new Date(event.condition.beginTime),
    //   new Date(event.condition.endTime)];
    // if (this._sineDeviceType === 'areaAlarm') {
    //   this.deviceTypeListValue = event.condition.deviceIds[0];
    // } else {
    //   this.deviceTypeListValue = event.condition.deviceIds.map(item => {
    //     return {checked: true, label: getDeviceType(this.$nzI18n, item), value: item};
    //   });
    // }
    // this.isCheckData(this.treeNodes, event.condition.areaList.ids);
    // this.areaIds = event.condition.areaList.ids;
    // sessionStorage.setItem('areaId', JSON.stringify(this.areaIds));
    // this.resources();
  }

  /** 设置 Echarts 数据 */
  setChartData(params) {
    const ringData = [];
    const ringName = [];
    const barData = [];
    const barName = [];
    params.forEach((item) => {
      ringData.push({
        value: item.value,
        name: item.label,
      });
      ringName.push(item.label);
      barData.push({
        value: item.value,
        name: item.label,
      });
      barName.push(item.label);
    });
    // 左侧的饼图
    setTimeout(() =>
      this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName)),
    );
    // 右侧的折线图
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName)));
  }
  /** 获取饼图实例 */
  getRingChartInstance(event) {
    this.ringChartInstance = event;
  }

  /** 获取柱状图实例 */
  getBarChartInstance(event) {
    this.barChartInstance = event;
  }

  /** 初始化表格数据 */
  initTableConfig(data) {
    this.tableConfig = {
      noIndex: true,
      showSearchSwitch: false,
      showSearch: false,
      showSearchExport: true,
      notShowPrint: true,
      noExportHtml: true,
      columnConfig: data,
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          this.__dataset = this._datasetMain.filter((items) => {
            return (
              event.every((item) => items[item.filterField] + '' === item.filterValue.trim()) &&
              items
            );
          });
        }
      },
      handleExport: (event) => {
        const queryCondition = new QueryConditionModel();
        const { columnInfoList, excelType } = event;

        const { setColumnInfoList, objectList } = this.changeExportData(columnInfoList);
        const params = {
          columnInfoList: setColumnInfoList,
          excelType,
          queryCondition,
          objectList,
        };
        this.$troubleService
          .troubleStatisticExport_API(this.tableExportURL, params)
          .subscribe((res: Result) => {
            if (res.code === ResultCodeEnum.success) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
      },
    };
  }

  /** 导出的数据转换 */
  changeExportData(params): any {
    const deepCloneTableData = [];
    params.forEach((item) => {
      for (const key in this.troubleExportKey) {
        if (
          this.statisticsTypeValue === TroubleStatisticTypeEnum.faultType ||
          this.statisticsTypeValue === TroubleStatisticTypeEnum.faultLevel
        ) {
          const getSplitArr: string[] = key.split('-');
          const geteEnumPrefix = getSplitArr[0];
          const getEnumKey = getSplitArr[1];
          if (getEnumKey === item.propertyName && geteEnumPrefix === this.statisticsTypeValue) {
            item.propertyName = this.troubleExportKey[key];
          }
        } else {
          if (key === item.propertyName) {
            item.propertyName = this.troubleExportKey[key];
          }
        }
      }
    });
    this.__dataset.forEach((tableItem, index) => {
      deepCloneTableData.push({});
      // tslint:disable-next-line: forin
      for (const tableKey in tableItem) {
        for (const enumKey in this.troubleExportKey) {
          if (
            this.statisticsTypeValue === TroubleStatisticTypeEnum.faultType ||
            this.statisticsTypeValue === TroubleStatisticTypeEnum.faultLevel
          ) {
            const getSplitArr: string[] = enumKey.split('-');
            const geteEnumPrefix = getSplitArr[0];
            const getEnumKey = getSplitArr[1];
            if (tableKey === getEnumKey && geteEnumPrefix === this.statisticsTypeValue) {
              deepCloneTableData[index][this.troubleExportKey[enumKey]] = tableItem[tableKey];
            }
          } else {
            if (tableKey === enumKey) {
              deepCloneTableData[index][this.troubleExportKey[enumKey]] = tableItem[tableKey];
            }
          }
        }
      }
    });
    return {
      setColumnInfoList: params,
      objectList: deepCloneTableData,
    };
  }
}
