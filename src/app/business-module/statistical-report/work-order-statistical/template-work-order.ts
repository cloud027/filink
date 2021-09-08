import {ViewChild, OnDestroy} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {WorkOrderLanguageInterface} from '../../../../assets/i18n/work-order/work-order.language.interface';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {TimeFormatEnum} from '../../../shared-module/enum/time-format.enum';
import {UserForCommonService} from '../../../core-module/api-service/user';
import {IndexWorkOrderStateEnum} from '../../../core-module/enum/work-order/work-order.enum';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {CheckSelectInputComponent} from '../../../shared-module/component/check-select-input/check-select-input.component';
import {StatisticalLanguageInterface} from '../../../../assets/i18n/statistical/statistical-language.interface';

export class TemplateWorkOrder implements OnDestroy {
  // 设施类型模板
  @ViewChild('deviceTemp') deviceTemp: CheckSelectInputComponent;
  // 设施类型模板
  @ViewChild('equipTemp') equipTemp: CheckSelectInputComponent;
  public ringName = [];
  public ringData = [];
  public barName = [];
  public barData = [];
  // 表格分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 筛选条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 页面是否显示时间选择器
  public dateRangeShow = false;
  // 页面是否选择单选框
  public radioSelectShow = false;
  // 页面是否选择单位选择器
  public selectUnitShow = false;
  // 页面是否选择区域选择器
  public selectAreaShow = false;
  // 页面是否选择多选框
  public checkBoxSelectShow = false;
  // 单位选择器显示
  public isUnitVisible = false;
  // 区域选择器显示
  public isAreaVisible = false;
  // 多选选择的设施集合
  public selectDeviceTypeList = [];
  // 设备tab
  public selectEquipmentTypeList = [];
  // 多选框选择的设施列表
  public deviceTypeList = [];
  // 是否显示tab栏
  public showTab = false;
  // 是否第一次统计
  public hide = true;
  public lineChart;
  // 选择的单位名称
  public selectUnitName = '';
  // 选择的区域名称
  public areaName = '';
  // 设施国际化
  public language: FacilityLanguageInterface;
  // 工单国际化
  public wLanguage: WorkOrderLanguageInterface;
  public statisticalLanguage: StatisticalLanguageInterface;
  // 单选框选择的值
  public deviceTypeData: string = null;
  // 多选框选择的idList
  public checkBoxDeviceTypeData = [];
  // 设备值
  public checkBoxEquipmentTypeData = [];
  // 多选框的List
  public selectInfo = [];
  // 单选框的值集合
  public selectAudioInfo = [];
  // 时间选择器的值
  public dateRange = [];
  // 表格数据
  public _dataSet = [];
  // 处理表格过滤的数据
  public _dataSetMain = [];
  // tabs当前选择的tab
  public deviceActive;
  // 设备页签
  public equipmentActive;
  // 树节点
  public treeNodes;
  public selectAreaData = [];
  public areaData = [];
  // 开始时间
  public startTime;
  // 结束时间
  public endTime;
  // 选择的单选idList
  public selectUnitIdData = [];
  public exportData = [];
  // 饼图实例
  barChartInstance;
  // 柱状图实例
  public ringChartInstance;
  // 柱状图实例
  public lineChartInstance;
  // 是否显示进度条
  public ProgressShow = false;
  // 多选设备类型
  public equipmentTypeList =  [];
  public selectEquipment: any[] = [];
  // 按钮禁用
  public isCanQuery: boolean = true;
  // 是否需要显示设备多选
  public isNeedEquipment: boolean = false;
  // 设备类型单选
  public isNeedRadioEquip: boolean = false;
  // 单选框设备类型选择的值
  public equipTypeData: string = null;
  // 显示设施切换还是设备切换
  public isShowDevice: boolean = true;
  // 图形标题
  public chartTitle: string = '';

  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              public $facilityCommonService?: FacilityForCommonService,
              public $userService?: UserForCommonService
  ) {
    this.statisticalLanguage = this.$nzI18n.getLocaleData(LanguageEnum.statistical);
  }

  /**
   * 销毁时清空组件
   */
  public ngOnDestroy(): void {
    this.deviceTemp = null;
    this.equipTemp = null;
    window.onresize = null;
  }

  /**
   * 按钮校验
   */
  public checkQueryBtn(): void {
    // 日过已经选择区域数据或者单位数据
    if (this.areaData.length || this.selectUnitIdData.length) {
      // 判断设备类型或者设施类型是否是单选
      if (this.isNeedRadioEquip) {
        // 判断设施类型或者设备类型是否选择
        this.isCanQuery = !((this.deviceTypeData || this.equipTypeData) && this.dateRangeShow && this.dateRange.length);
      } else {
        // 判断是否有设备多选
        if (this.isNeedEquipment || this.checkBoxSelectShow) {
          // 判断设施类型或者设备类型是否选择
          if (this.deviceTypeList.length || this.equipmentTypeList.length) {
            // 是否存在日期
            if (this.dateRangeShow) {
              // 是否选择日期
              this.isCanQuery = !this.dateRange.length;
            } else {
              this.isCanQuery = false;
            }
          } else {
            this.isCanQuery = true;
          }
        } else {
          // 是否存在日期
          if (this.dateRangeShow) {
            // 是否已选择日期
            this.isCanQuery = !this.dateRange.length;
          } else {
            this.isCanQuery = false;
          }
        }
      }
    } else {
      this.isCanQuery = true;
    }
  }

  /**
   * 勾选设施类型或者设备类型
   * @param event boolean 是否清除
   * @param flag boolean true表示设施，false表示设备
   */
  public selectDeviceOrEquip(event: boolean, flag: boolean): void {
    if (flag) {
      if (this.isNeedEquipment) {
        this.equipmentTypeList = [];
        this.equipTemp.checkList.forEach(v => v.checked = false);
        this.equipTemp.checkAllStatus = false;
        this.equipTemp.checkedList = [];
        this.equipTemp.checkedStr = '';
      }
    } else {
      if (this.checkBoxSelectShow) {
        this.deviceTypeList = [];
        this.deviceTemp.checkList.forEach(v => v.checked = false);
        this.deviceTemp.checkedList = [];
        this.deviceTemp.checkedStr = '';
        this.deviceTemp.checkAllStatus = false;
      }
    }
    if (event) {
      this.equipmentTypeList = [];
      this.deviceTypeList = [];
    }
    this.checkQueryBtn();
  }

  /**
   * 单选设施或者设备
   * @param event string 所选的值
   * @param flag boolean true表示设施，false表示设备
   */
  public selectRadio(event: string, flag: boolean): void {
    if (flag) {
      this.deviceTypeData = event;
      this.equipTypeData = null;
    } else {
      this.equipTypeData = event;
      this.deviceTypeData = null;
    }
    this.checkQueryBtn();
  }

  /**
   * 初始化区域选择器
   */
  public initPublicConfig(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.wLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<any>) => {
      const data = result.data || [];
      // 递归设置区域的选择情况
      FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
      this.isCheckData(this.treeNodes);
    });
    this.initTreeSelectorConfig();
  }

  /**
   * 给选择设施的列表附加id属性，防止在表格中勾选时树表不作出相应的变化
   * param data
   */
  public isCheckData(data): void {
    data.forEach(item => {
      item.id = item.areaId;
      item.areaLevel = item.level;
      if (item.children) {
        this.isCheckData(item.children);
      }
    });
  }

  /**
   * 显示区域选择器
   */
  public showAreaSelector(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isAreaVisible = true;
  }

  /**
   * 显示单位选择器
   */
  public showUnitSelector(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isUnitVisible = true;
  }

  /**
   * 时间选择变化
   * param timeResults 时间区间
   */
  public onChange(timeResults): void {
    if (timeResults.length > 0) {
      this.startTime = new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, timeResults[0])).getTime();
      this.endTime = new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, timeResults[1])).getTime();
    } else {
      this.startTime = null;
      this.endTime = null;
      this.dateRange = [];
    }
    this.checkQueryBtn();
  }

  /**
   * 请求接口
   */
  public refreshData(e?): void {
  }

  /**
   * 处理tab切换
   * param data
   */
  public getDeviceType(data): void {
    this.queryCondition.filterConditions = [
      {
        'filterValue': data.code,
        'filterField': 'deviceType',
        'operator': 'eq'
      },
      {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}
    ];
    this.refreshData(true);
  }
  public getEquipmentType(data): void {
    this.queryCondition.filterConditions = [
      {
        'filterValue': data.code,
        'filterField': 'equipmentType',
        'operator': 'eq'
      },
      {filterValue: this.startTime, filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {filterValue: this.endTime, filterField: 'createTime', operator: 'lte', extra: 'LT_AND_GT'}
    ];
    this.refreshData(true);
  }

  /**
   * 初始化区域选择属配置
   */
  public initTreeSelectorConfig(): void {
    const treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: false,
          idKey: 'areaId',
        },
        key: {
          name: 'areaName',
          children: 'children'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.select}${this.language.area}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.language.level, key: 'areaLevel', width: 100,
        }
      ]
    };
  }

  /**
   * 处理表格分页
   * param event
   */
  public pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 区域选择变化
   * param event 选择的数据
   */
  public selectDataChange(event): void {
    this.selectAreaData = event;
    let selectArr = [];
    const areaNameList = [];
    if (event.length > 0) {
      selectArr = event.map(item => {
        areaNameList.push(item.areaName);
        return item.areaId;
      });
      this.areaName = areaNameList.join();
    } else {
      this.areaName = '';
    }
    this.areaData = selectArr;
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, selectArr);
    this.checkQueryBtn();
  }

  /**
   * 单位选择变化
   * param event 选择的数据
   */
  public selectUnitDataChange(event): void {
    this.selectUnitName = '';
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.deptCode;
    });
    const ids = event.map(item => item.id);
    this.selectUnitIdData = selectArr;
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, ids);
    this.checkQueryBtn();
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  public disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) > 0;
  }

  /**
   * 处理单位选择树配置
   */
  public initTreeUnitSelectorConfig(): void {
    const treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'deptFatherId',
          rootPid: null
        },
        key: {
          name: 'deptName',
          children: 'childDepartmentList'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.language.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.language.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.language.parentDept}`, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 初始化单位选择的通用配置
   */
  public initUnitPublicConfig(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.wLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.$userService.queryAllDepartment().subscribe((result: ResultModel<any>) => {
      this.treeNodes = result.data || [];
    });
    this.initTreeUnitSelectorConfig();
  }

  /**
   * 处理工单状态统计接口返回数据
   * param res
   */
  public workOrderStatus(res): void {
    this.tableConfig.isLoading = false;
    this._dataSet = CommonUtil.deepClone(res.data);
    this._dataSet.forEach(item => {
      this.selectAreaData.forEach(_item => {
        if (item.deviceAreaId === _item.areaId) {
          item.areaName = _item.areaName;
        }
      });
      this._dataSetMain = this._dataSet;
    }, () => {
      this.tableConfig.isLoading = false;
    });
    this.hide = false;
    this.setWorkStatusChartData(res.data);
    this.exportData = CommonUtil.deepClone(this._dataSet);
    this.ProgressShow = false;
  }

  /**
   * 获取饼图实例
   */
  public getRingChartInstance(event): void {
    this.ringChartInstance = event;
  }

  /**
   * 获取柱状图实例
   */
  public getBarChartInstance(event): void {
    this.barChartInstance = event;
  }

  /**
   * 获取折线图实例
   */
  public getLineChartInstance(event): void {
    this.lineChartInstance = event;
  }

  /**
   * 设置工单状态统计图表数据
   */
  public setWorkStatusChartData(data): void {
    const dataMap = this.setFirstChartData(data);
    Object.keys(dataMap).forEach(key => {
      if (key !== 'deviceAreaId') {
        dataMap[key] = dataMap[key].reduce((a, b) => Number(a) + Number(b));
        this.ringData.push({
          value: dataMap[key],
          name: <string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, key, LanguageEnum.workOrder)
        });
        this.ringName.push(<string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, key, LanguageEnum.workOrder));
        this.barData.push(dataMap[key]);
        this.barName.push(<string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, key, LanguageEnum.workOrder));
      }
    });
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(this.ringData, this.ringName,
      `${this.statisticalLanguage[this.chartTitle]}-${this.statisticalLanguage.pieChart}`)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(this.barData, this.barName,
      `${this.statisticalLanguage[this.chartTitle]}-${this.statisticalLanguage.barChart}`)));
  }

  /**
   * 获取用户能看到的单选设施列表
   */
  public getUserCanLookDeviceType(): void {
    // 设施类型
    this.selectInfo = [];
    this.selectInfo = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    this.selectInfo.forEach(item => {
      item.value = item.code;
    });
    // 设备类型
    this.selectEquipment = [];
    this.selectEquipment = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    this.selectEquipment.forEach(item => {
      item.value = item.code;
    });
  }

  public setFirstChartData(data): any {
    const dataMap = {};
    data.forEach(item => {
      Object.keys(item).forEach(_item => {
        if (_item !== 'deviceAreaId') {
          if (!dataMap[_item]) {
            dataMap[_item] = [];
          }
          dataMap[_item].push(item[_item]);
        }
      });
    });
    this.ringName = [];
    this.ringData = [];
    this.barName = [];
    this.barData = [];
    return dataMap;
  }
}
