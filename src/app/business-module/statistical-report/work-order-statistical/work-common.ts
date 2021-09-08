import {TemplateWorkOrder} from './template-work-order';
import {OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {WorkOrderService} from '../share/service/work-order.service';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {ActivatedRoute} from '@angular/router';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {IndexWorkOrderStateEnum} from '../../../core-module/enum/work-order/work-order.enum';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {ExportWorkOrderStatusEnum} from '../share/enum/export-work-order.enum';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
export class WorkCommon extends TemplateWorkOrder implements OnInit {
  public selectAreaShow = true;
  public hide;
  public lineChart;

  constructor(public $nzI18n: NzI18nService,
              public $facilityCommonService: FacilityForCommonService,
              public $workOrder_Service: WorkOrderService,
              public $message: FiLinkModalService,
              public $activatedRoute: ActivatedRoute,
  ) {
    super($nzI18n, $message, $facilityCommonService);
  }

  public ngOnInit(): void {
    this.isNeedEquipment = this.$activatedRoute.snapshot.data.isNeedEquipment;
    this.isNeedRadioEquip = this.$activatedRoute.snapshot.data.isNeedRadioEquip;
    this.chartTitle = this.$activatedRoute.snapshot.data.titleName;
    this.initPublicConfig();
    this.getUserCanLookDeviceType();
    this.resizeChar();
  }

  public refreshData(e?): void {
  }

  /**
   *  刷新图形
   */
  public resizeChar(): void {
    const that = this;
    window.onresize = function () {
      if (that.lineChartInstance) {
        that.lineChartInstance.resize();
      }
      if (that.barChartInstance) {
        that.barChartInstance.resize();
      }
      if (that.ringChartInstance) {
        that.ringChartInstance.resize();
      }
    };
  }

  public initPublicTableConfig(areaWidth, columnConfigs, reqUrl, scrollX = '900px', codeEnum?): void {
    columnConfigs.unshift({title: this.language.area, key: 'areaName', width: areaWidth, searchable: false, searchConfig: {type: 'input'}});
    columnConfigs.push({
      title: this.language.operate, searchable: true,
      searchConfig: {type: 'operate'}, key: '', width: 120
    });
    this.tableConfig = {
      noIndex: true,
      noExportHtml: true,
      showSearchSwitch: true,
      showSearch: false,
      notShowPrint: true,
      showSearchExport: true,
      scroll: {x: scrollX, y: '325px'},
      columnConfig: columnConfigs,
      handleSearch: (event) => {
        this._dataSet = this._dataSetMain;  // 重置到原始数据
        if (event.length > 0) {    // 数据过滤
          event.forEach(item => {
            this._dataSet = this._dataSet.filter(_item => {
              return _item[item.filterField] + '' === item.filterValue;
            });
          });
        } else {    // 重置
          this._dataSet = this._dataSetMain;
        }
      },
      handleExport: (event) => {
        this.serExport(this, event, reqUrl, codeEnum);
      }
    };
  }

  public setChartPercentData(data): void {
    const ringName = [];
    const ringData = [];
    const barName = [];
    const barData = [];
    data.forEach(item => {
      ringName.push(item.areaName);
      barName.push(item.areaName);
      ringData.push({
        value: item.count,
        name: item.areaName
      });
      barData.push(item.count);
    });
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(ringData, ringName,
      `${this.statisticalLanguage[this.chartTitle]}-${this.statisticalLanguage.pieChart}`)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(barData, barName,
      `${this.statisticalLanguage[this.chartTitle]}-${this.statisticalLanguage.barChart}`)));
  }

  public refreshIncrementData(e): void {
    this.ProgressShow = true;
    this.checkBoxDeviceTypeData = [];
    this.deviceTypeList.forEach(item => {
      this.checkBoxDeviceTypeData.push(item.value);
    });
    // 设备
    this.checkBoxEquipmentTypeData = [];
    this.equipmentTypeList.forEach(item => {
      this.checkBoxEquipmentTypeData.push(item.value);
    });
    // 创建查询条件
    this.queryCondition.bizCondition = {
      timeList: [this.startTime, this.endTime],
    };
    let key = 'deviceType';
    let value = this.checkBoxDeviceTypeData;
    if (!this.isShowDevice) {
      value = this.checkBoxEquipmentTypeData;
      if (this.chartTitle === 'inspectAddStatistic' || this.chartTitle === 'clearAddStatistic'|| this.chartTitle === 'dismantleAddStatistic') {
        key = 'equipmentTypeList';
      }
    }
    this.queryCondition.filterConditions = [{
      'filterValue': value,
      'filterField': key,
      'operator': 'in'
    }, {
      'filterValue': this.areaData,
      'filterField': 'areaId',
      'operator': 'in'
    }, {filterValue: this.startTime, filterField: 'nowDate', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'nowDate', operator: 'lte', extra: 'LT_AND_GT'}
    ];
    const req = Object.assign({}, this.queryCondition, e);
    this.$workOrder_Service.queryProcCount(req).subscribe((res: ResultModel<any>) => {
      this.hide = false;
      this.setLineChartData(res.data);
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }

  public refreshPercentData(e): void {
    this.tableConfig.isLoading = true;
    // 创建查询条件
    this.queryCondition.bizCondition = {
      areaIdList: this.areaData,
      // timeList: [this.startTime / 1000, this.endTime / 1000],
    };
    let key = 'deviceType';
    let value = this.deviceTypeData;
    let operator = 'eq';
    if (!this.isShowDevice) {
      key = 'equipmentType';
      value = this.equipTypeData;
      operator = 'like';
    }
    this.queryCondition.filterConditions = [{
      'filterValue': value,
      'filterField': key,
      'operator': operator
    }, {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}
    ];
    let total = 0;
    const req = Object.assign({}, this.queryCondition, e);
    this.$workOrder_Service.queryProcCount(req).subscribe((res: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      this._dataSet = res.data;
      this._dataSet.forEach(item => {
        item.count = item[item.areaId];  // 工单数量
        total = total + item[item.areaId];  // 工单总量
        this.selectAreaData.forEach(_item => {
          if (item.areaId === _item.areaId) {
            item.areaName = _item.areaName;
          }
        });
      }, () => {
        this.tableConfig.isLoading = false;
      });
      setTimeout(() => {
        this._dataSet.forEach(item => {
          if (!total) {
            item.percent = 0;
          } else {
            item.percent = ((item[item.areaId] / total) * 100).toFixed(2) + '%';
          }
        }, 0);
      });
      this.hide = false;
      this._dataSetMain = this._dataSet;
      this.exportData = this._dataSet;
      this.setChartPercentData(this._dataSet);
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }

  /**
   * 设置线图表数据
   */
  public setLineChartData(data): void {
    const lineName = [];
    const lineData = [];
    data.forEach(item => {
      lineName.push(item.date);
      lineData.push(item.count);
    });
    setTimeout(() => this.lineChartInstance.setOption(ChartUtil.setLineChartOption(lineData, lineName,
      `${this.statisticalLanguage[this.chartTitle]}-${this.statisticalLanguage.lineChart}`)));
  }

  public getDateStr(AddDayCount): any {
    const time = new Date();
    const times = time.setDate(time.getDate() + AddDayCount); // 获取AddDayCount天后的日期
    return new Date(times);
  }

  public initStatusTableConfig(reqUrl): void {
    const columnConfigs = [
      {
        title: <string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, 'assigned', LanguageEnum.workOrder), key: 'assigned', width: 160,
        searchConfig: {type: 'input'}, searchable: true
      },
      {
        title: <string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, 'completed', LanguageEnum.workOrder), width: 160, key: 'completed',
        searchable: true, searchConfig: {type: 'input'}
      },
      {
        title: <string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, 'pending', LanguageEnum.workOrder), key: 'pending', searchConfig: {type: 'input'},
        width: 160, searchable: true
      },
      {
        searchable: true, title: <string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, 'processing', LanguageEnum.workOrder), key: 'processing', width: 160,
        searchConfig: {type: 'input'}
      },
      {
        searchConfig: {type: 'input'}, title: <string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, 'singleBack', LanguageEnum.workOrder), key: 'singleBack', width: 160,
        searchable: true
      },
      {
        title: <string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, 'turnProcess', LanguageEnum.workOrder), searchConfig: {type: 'input'}, key: 'turnProcess', width: 160,
        searchable: true
      }
    ];
    this.initPublicTableConfig(160, columnConfigs, reqUrl, null, ExportWorkOrderStatusEnum);
  }

  public refreshStatusData(e, setObj?): void {
    this.ProgressShow = true;
    if (!setObj) {
      this.setReqObj();
    }
    const req = Object.assign({}, this.queryCondition, e);
    this.$workOrder_Service.queryRepairOrderCauseReasonCount(req).subscribe((res: ResultModel<any>) => {
      this.workOrderStatus(res);
    }, () => this.ProgressShow = false);
  }

  public setReqObj(flag?: boolean): void {
    this.tableConfig.isLoading = true;
    this.selectDeviceTypeList = [];
    this.checkBoxDeviceTypeData = [];
    this.deviceTypeList.forEach(item => {
      this.selectDeviceTypeList.push(item);
      this.checkBoxDeviceTypeData.push(item.value);
    });
    this.deviceActive = this.selectDeviceTypeList[0];
    // 设备
    this.selectEquipmentTypeList = [];
    this.checkBoxEquipmentTypeData = [];
    this.equipmentTypeList.forEach(item => {
      this.selectEquipmentTypeList.push(item);
      this.checkBoxEquipmentTypeData.push(item.value);
    });
    this.equipmentActive = this.selectEquipmentTypeList[0];
    // 创建查询条件
    this.queryCondition.bizCondition = {
      areaIdList: this.areaData,
      // timeList: [this.startTime / 1000, this.endTime / 1000],
    };
    if (flag) {
      this.queryCondition.bizCondition.deviceTypeList = this.checkBoxDeviceTypeData;
    }
    let key = 'deviceType';
    let value = this.checkBoxDeviceTypeData[0];
    let type = 'eq';
    if (!this.isShowDevice) {
      key = 'equipmentType';
      value = this.checkBoxEquipmentTypeData[0];
      type = 'like';
    }
    this.queryCondition.filterConditions = [{
      'filterValue': value,
      'filterField': key,
      'operator': type
    }, {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}
    ];
  }


  public setTypeReqObj(): void {
    this.checkBoxDeviceTypeData = [];
    this.deviceTypeList.forEach(item => {
      this.checkBoxDeviceTypeData.push(item.value);
    });
    // 设备
    this.checkBoxEquipmentTypeData = [];
    this.equipmentTypeList.forEach(item => {
      this.checkBoxEquipmentTypeData.push(item.value);
    });
    // 创建查询条件
    if (this.isShowDevice) {
      this.queryCondition.bizCondition = {
        areaIdList: this.areaData,
        deviceTypeList: this.checkBoxDeviceTypeData
      };
    } else {
      this.queryCondition.bizCondition = {
        areaIdList: this.areaData,
        deviceTypeList: this.checkBoxEquipmentTypeData
      };
    }
  }

  public getSelectTypeColumn(): any {
    const data = CommonUtil.deepClone(this.deviceTypeList);
    const columnConfigs = [];
    data.forEach(item => {
      columnConfigs.push(
        {title: item.label, key: item.value, width: 180, searchable: true, searchConfig: {type: 'input'}}
      );
    });
    return columnConfigs;
  }

  /**
   * 请求数据
   */
 public refreshTypeData(e): void {
    this.setTypeReqObj();
    const req = Object.assign({}, this.queryCondition, e);
    this.queryData(req, this.setTypeChartData);
  }

  public queryData(req, fn): void {
    this.tableConfig.isLoading = true;
    this.$workOrder_Service.queryRepairOrderCauseReasonCount(req).subscribe((res: ResultModel<any>) => {
      this.tableConfig.isLoading = false;
      this._dataSetMain = res.data;
      this._dataSet = res.data;
      this._dataSet.forEach(item => {
        this.selectAreaData.forEach(_item => {
          if (item.deviceAreaId === _item.areaId) {
            item.areaName = _item.areaName;
          }
        });
      }, () => {
        this.tableConfig.isLoading = false;
      });
      this.hide = false;
      fn(res.data, this);
      this.exportData = CommonUtil.deepClone(this._dataSet);
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }

  /**
   * 设置图表数据
   */
  public setTypeChartData(data, that): void {
    const dataMap = that.setFirstChartData(data);
    Object.keys(dataMap).forEach(key => {
      if (key !== 'areaName') {
        dataMap[key] = dataMap[key].reduce((a, b) => Number(a) + Number(b));
        that.ringData.push({
          value: dataMap[key],
          name: CommonUtil.codeTranslate(DeviceTypeEnum, that.$nzI18n, key)
        });
        that.ringName.push(CommonUtil.codeTranslate(DeviceTypeEnum, that.$nzI18n, key));
        that.barData.push(dataMap[key]);
        that.barName.push(CommonUtil.codeTranslate(DeviceTypeEnum, that.$nzI18n, key));
      }
    });
    setTimeout(() => that.ringChartInstance.setOption(ChartUtil.setRingChartOption(that.ringData, that.ringName,
      `${that.statisticalLanguage[that.chartTitle]}-${that.statisticalLanguage.pieChart}`)));
    setTimeout(() => that.barChartInstance.setOption(ChartUtil.setBarChartOption(that.barData, that.barName,
      `${that.statisticalLanguage[that.chartTitle]}-${that.statisticalLanguage.barChart}`)));
  }

  public serExport(that, event, reqUrl, codeEnum): void {
    const columnInfoList = event.columnInfoList;
    const data = JSON.parse(JSON.stringify(that.exportData));
    if (codeEnum) {
      columnInfoList.forEach(item => {
        Object.keys(codeEnum).forEach(_item => {
          if (item.propertyName === codeEnum[_item]) {
            item.propertyName = _item;
          }
        });
      });
      data.forEach(item => {
        Object.keys(item).forEach(key => {
          Object.keys(codeEnum).forEach(_item => {
            if (key === codeEnum[_item]) {
              item[_item] = item[key];
              delete item[codeEnum[_item]];
            }
          });
        });
      });
    }
    // 导出参数
    const body = {
      queryCondition: new QueryConditionModel(),
      columnInfoList: columnInfoList,
      excelType: event.excelType,
      objectList: data
    };
    that.$workOrder_Service[reqUrl](body).subscribe((res: ResultModel<any>) => {
      if (res.code === 0 || res.code === ResultCodeEnum.success) {
        that.$message.success(res.data);
      } else {
        that.$message.error(res.msg);
      }
    });
  }
}
