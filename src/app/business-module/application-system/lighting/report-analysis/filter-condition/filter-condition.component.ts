import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {
  DateTypeEnum,
  EquipmentTypeEnum,
  ReportAnalysisTabEnum,
  ReportAnalysisTypeEnum,
  StatisticalDimensionEnum
} from '../../../share/enum/report-analysis.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {AreaModel} from '../../../../../core-module/model/facility/area.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../../core-module/api-service';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {GroupListModel} from '../../../../../core-module/model/group/group-list.model';
import * as _ from 'lodash';
// @ts-ignore
import fnsFormat from 'date-fns/format';
import { getISOWeek } from 'date-fns';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
/**
 * 报表分析-筛选条件
 */
@Component({
  selector: 'app-filter-condition',
  templateUrl: './filter-condition.component.html',
  styleUrls: ['./filter-condition.component.scss']
})
export class FilterConditionComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // 当前所在tab页索引
  @Input() index;
  // 激活的tab索引
  @Input() activeIndex;
  // 缓存的统计数据
  @Input() storeReportData;
  @Output() emitConditionData = new EventEmitter<any>();
  @Output() emitCacheDataChange = new EventEmitter<any>();
  @ViewChild('weekPicker') weekPicker: any;
  // 应用系统语言包
  public applicationLanguage: ApplicationInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 报表分析标签类型枚举
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 统计维度枚举
  public statisticalDimensionEnum = StatisticalDimensionEnum;
  // 时间类型枚举
  public dateTypeEnum = DateTypeEnum;
  // 下拉设备类型
  public equipmentType;
  // 有权限查看的设备类型
  public equipmentTypeHasAuth: string[];
  // 统计维度
  public statisticalDimensionList;
  // 时间类型
  public timeTypeList;
  // 统计类型
  public statisticsType: string;
  // 选中的设备类型
  public selectEquipmentType;
  // 选中的统计维度
  public selectStatisticalDimension: StatisticalDimensionEnum;
  // 选中的时间类型
  public selectTimeType;
  // 选中的时间
  public date = null;
  // 选中的设备id
  public selectEquipmentId: string;
  // 选中的分组id集合
  public selectGroupIds: string[];
  // 选中的区域id集合
  public selectAreaIds: string[] = [];
  // 选中的统计范围显示的名称，设备名称/分组名称/区域名称
  public selectStatisticsScopeName: string;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 是否显示设备分组信息列表
  public showGroupInfo: boolean = false;
  // 区域选择器弹窗显示
  public showAreaIsVisible: boolean = false;
  // 设备弹窗设备类型过滤条件
  public equipmentFilterCondition;
  // 是否隐藏表格操作列
  public isHideOperateItem = true;
  // 区域树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 区域树数据
  public treeNodes: AreaModel[];
  // 树配置
  public treeSetting = {};
  public selectAreaData = {
    selectAreaIds: [],
    areaName: []
  };

  constructor(
    // 设施功能服务
    public $facilityCommonService: FacilityForCommonService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService
  ) {
    this.applicationLanguage = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  public ngOnInit(): void {
    // 初始话区域树配置
    this.initTreeSelectorConfig();
    // 获取区域树数据
    this.getAreaTreeData();
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (this.weekPicker) {
      // 由于组件中的bug，格式化周的时候使用了angular默认的格式从周日开始，在这个页面中强行修改组件源码
      // 备份组件中原来的方法
      Promise.resolve().then(() => {
        this.weekPicker['dateHelper']['_formatBackUp'] = this.weekPicker['dateHelper'].format;
        this.weekPicker['dateHelper'].format = (date: Date, formatStr: string) => {
          // 当格式第几周的时候 使用iso week 格式
          if (formatStr === 'yyyy-ww') {
            return fnsFormat(date, 'GGGG-WW', {locale: this.$nzI18n.getDateLocale()});
          } else {
            // 否则还原为默认的格式方法
            return this.weekPicker['dateHelper']['_formatBackUp'](date, formatStr);
          }
        };
      });
    }
  }

  ngOnDestroy(): void {
    // 销毁时还原format方法 防止影响其他页面
    if (this.weekPicker) {
      this.weekPicker['dateHelper'].format = this.weekPicker['dateHelper']['_formatBackUp'];
      this.weekPicker = null;
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.index) {
      this.initCondition();
      // 切换tab时
      const i = changes.index.currentValue;
      this.statisticalDimensionList = CommonUtil.codeTranslate(StatisticalDimensionEnum, this.$nzI18n, null, 'application.reportAnalysis');
      this.selectStatisticalDimension = StatisticalDimensionEnum.area;
      if (i === Number(ReportAnalysisTabEnum.lightingRate)) {
        //  若为亮灯率报表,统计维度为区域、分组, 统计维度下拉框为区域
        this.statisticalDimensionList = this.statisticalDimensionList.filter(item => item.code === StatisticalDimensionEnum.area || item.code === StatisticalDimensionEnum.group);
        // 亮灯率报表只有单灯统计项
        this.equipmentType = this.equipmentType.filter(item => item.code === EquipmentTypeEnum.singleLightController);
        this.selectEquipmentType = EquipmentTypeEnum.singleLightController;
        // 时间只能按 月 周 年 查询
        this.timeTypeList = this.timeTypeList.filter(item => item.code !== DateTypeEnum.day);
      } else if (i !== Number(ReportAnalysisTabEnum.electricityConsumptionReport) && (i !== Number(ReportAnalysisTabEnum.workingTimeReport)) && (i !==
        Number(ReportAnalysisTabEnum.energySavingRateReport))) {
        //  若为电流报表、电压报表、功率报表、电能报表、功率因数报表，统计维度下拉框为设备
        this.statisticalDimensionList = this.statisticalDimensionList.filter(item => item.code === StatisticalDimensionEnum.equipment);
        this.selectStatisticalDimension = StatisticalDimensionEnum.equipment;
        if (i === Number(ReportAnalysisTabEnum.powerFactorReport)) {
          //  当前为功率因数报表时设备类型只有集控
          this.equipmentType = this.equipmentType.filter(item => item.code === EquipmentTypeEnum.centralController);
        }
      } else if (i === Number(ReportAnalysisTabEnum.workingTimeReport) || i === Number(ReportAnalysisTabEnum.energySavingRateReport)) {
        //  节能率和工作时长只有单灯
        this.equipmentType = this.equipmentType.filter(item => item.code === EquipmentTypeEnum.singleLightController);
        this.selectEquipmentType = EquipmentTypeEnum.singleLightController;
        // 时间只能按 月 周 年 查询
        this.timeTypeList = this.timeTypeList.filter(item => item.code !== DateTypeEnum.day);
      }
      // 报表分析类型
      this.statisticsType = Object.values(ReportAnalysisTypeEnum)[this.index];
      if (_.isEmpty(this.storeReportData[this.statisticsType])) {
        //  没有缓存数据 获取默认设备数据或默认区域数据查询
        this.getDefaultCondition();
      }
    }
    if (changes && changes.activeIndex && !changes.activeIndex.firstChange) {
      if (!_.isEmpty(this.storeReportData[this.statisticsType])) {
        this.echoFilterCondition();
      }
    }
  }

  /**
   * 初始化默认查询条件
   */
  public initCondition() {
    // 设备类型下拉框
    this.equipmentType = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n);
    // 获取用户有权限查看的设备类型
    this.equipmentTypeHasAuth = SessionUtil.getUserInfo().role.roleDeviceTypeDto.equipmentTypes;
    this.equipmentType = this.equipmentType.filter(item => this.equipmentTypeHasAuth.includes(item.code));
    // 时间类型下拉框
    this.timeTypeList = CommonUtil.codeTranslate(DateTypeEnum, this.$nzI18n, null, 'application.reportAnalysis');
    // 统计维度下拉框
    this.statisticalDimensionList = CommonUtil.codeTranslate(StatisticalDimensionEnum, this.$nzI18n, null, 'application.reportAnalysis');
    if (this.equipmentTypeHasAuth.includes(EquipmentTypeEnum.centralController)) {
      // 有集控权限 筛选条件设备类型默认集控
      this.selectEquipmentType = EquipmentTypeEnum.centralController;
    } else {
      if (this.index !== Number(ReportAnalysisTabEnum.powerFactorReport)) {
        // 功率因数报表无单灯统计项
        this.selectEquipmentType = EquipmentTypeEnum.singleLightController;
      }
    }
    // 筛选条件时间类型默认按本月
    this.selectTimeType = this.dateTypeEnum.month;
    // 电流报表筛选条件统计维度默认设备
    this.selectStatisticalDimension = this.statisticalDimensionEnum.equipment;
    // 电流报表统计维度下拉框
    this.statisticalDimensionList = this.statisticalDimensionList.filter(item => item.code === this.statisticalDimensionEnum.equipment);
  }

  /**
   * 获取区域数数据源
   */
  public getAreaTreeData() {
    this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.treeNodes = result.data || [];
        // 递归设置区域的选择情况
        FacilityForCommonUtil.setAreaNodesStatus(this.treeNodes, null, null);
        this.addName(this.treeNodes);
        this.treeSelectorConfig.treeNodes = this.treeNodes;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 获取默认设备数据或默认区域数据
   */
  public getDefaultCondition() {
    if (!this.equipmentTypeHasAuth.includes(this.selectEquipmentType)) {
      // 无权限访问所选设备类型时
      return;
    }
    if (this.selectStatisticalDimension === StatisticalDimensionEnum.area) {
      // 取区域全部数据
      this.$facilityCommonService.queryAreaList().subscribe((res) => {
        if (res.code === ResultCodeEnum.success) {
          const data = res.data || [];
          if (data.length) {
            // 默认选中所有区域
            this.selectAllArea(data);
            this.selectAreaIds = this.selectAreaData.selectAreaIds;
            this.selectStatisticsScopeName = this.selectAreaData.areaName.toString();
          }
          this.generateResults();
        }
      });
    } else {
      // 取设备第一条数据
      this.getFirstEquipmentAnalysis();
    }
  }

  /**
   * 获取设备列表第一条数据作为筛选条件
   */
  public getFirstEquipmentAnalysis(): void {
    // 默认报表分析选择设备第一条数据筛选
    const queryCondition = new QueryConditionModel();
    queryCondition.filterConditions = [new FilterCondition('equipmentType', OperatorEnum.in, [this.selectEquipmentType])];
    this.$facilityCommonService.equipmentListByPage(queryCondition).subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        // 选择第一条数据
        this.selectEquipmentId = !_.isEmpty(res.data) ? res.data[0].equipmentId : null;
        this.selectStatisticsScopeName = !_.isEmpty(res.data) ? res.data[0].equipmentName : null;
        this.generateResults();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 从缓存回显筛选条件
   */
  public echoFilterCondition() {
    const condition = this.storeReportData[this.statisticsType].condition;
    this.selectEquipmentType = condition.params.equipmentType;
    this.selectStatisticalDimension = condition.params.statisticsScope;
    this.selectStatisticsScopeName = condition.selectStatisticsScopeName;
    this.selectTimeType = condition.params.timeType;
    this.date = condition.date;
    switch (condition.params.statisticsScope) {
      case StatisticalDimensionEnum.area :
        this.selectAreaIds = condition.params.filterConditions[0].filterValue;
        break;
      case StatisticalDimensionEnum.group:
        this.selectGroupIds = condition.params.filterConditions[0].filterValue;
        break;
      case StatisticalDimensionEnum.equipment:
        this.selectEquipmentId = condition.params.filterConditions[0].filterValue;
        break;
      default:
        break;
    }
    this.emitCacheDataChange.emit(this.statisticsType);
  }

  /**
   * 统计，发射筛选条件数据
   */
  public generateResults(): void {
    // 报表分析类型
    this.statisticsType = Object.values(ReportAnalysisTypeEnum)[this.index];
    const filterCondition = new FilterCondition();
    if (this.selectStatisticalDimension === this.statisticalDimensionEnum.equipment) {
      // 按设备统计
      filterCondition.operator = OperatorEnum.eq;
      filterCondition.filterField = 'equipmentId';
      filterCondition.filterValue = this.selectEquipmentId;
    } else {
      // 按分组、区域
      filterCondition.operator = OperatorEnum.in;
      filterCondition.filterField = this.selectStatisticalDimension === StatisticalDimensionEnum.area ? 'areaId' : 'groupId';
      filterCondition.filterValue = this.selectStatisticalDimension === StatisticalDimensionEnum.area ? this.selectAreaIds : this.selectGroupIds;
    }
    const params = {
      statisticsType: this.statisticsType,
      equipmentType: this.selectEquipmentType,
      statisticsScope: this.selectStatisticalDimension,
      filterConditions: [filterCondition],
      timeType: this.selectTimeType,
      time: this.formatTime(this.date)
    };
    const obj = {
      // 筛选条件参数
      params: params,
      selectStatisticsScopeName: this.selectStatisticsScopeName,
      date: this.date,
    };
    // 传递筛选条件数据
    this.emitConditionData.emit(obj);
  }

  /**
   * 时间格式化
   * @param date 日期
   */
  public formatTime(date) {
    const time = {
      day: null,
      week: null,
      month: null,
      year: date.getFullYear()
    };
    switch (this.selectTimeType) {
      case this.dateTypeEnum.day:
        time.day = date.getDate();
        time.month = date.getMonth() + 1;
        break;
      case this.dateTypeEnum.week:
        time.week = getISOWeek(date);
        break;
      case this.dateTypeEnum.month:
        time.month = date.getMonth() + 1;
        break;
      case this.dateTypeEnum.year:
        break;
      default:
        break;
    }
    return time;
  }

  /**
   * 生成按钮禁用判断
   */
  public disabledGenerateResults(): boolean {
    return !(this.selectEquipmentType && this.selectStatisticalDimension && this.date && this.selectStatisticsScopeName);
  }

  /**
   * 初始化筛选条件
   */
  public initForm(): void {
    this.date = new Date();
  }

  /**
   * 统计范围点击事件
   */
  public openStatisticalScopeWindow(): void {
    if (this.selectStatisticalDimension === this.statisticalDimensionEnum.equipment) {
      // 按设备统计 打开设备选择器
      this.equipmentVisible = true;
      // 过滤出选择的设备类型
      this.equipmentFilterCondition = [new FilterCondition(
        'equipmentType', OperatorEnum.in, [this.selectEquipmentType])];
    } else if (this.selectStatisticalDimension === StatisticalDimensionEnum.area) {
      // 按区域统计 打开区域选择器
      this.showAreaIsVisible = true;
      // 获取区域树数据源
      this.getAreaTreeData();
      // 区域选择器选择区域回显
      FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, this.selectAreaIds);
    } else if (this.selectStatisticalDimension === StatisticalDimensionEnum.group) {
      // 按分组统计 打开分组选择器
      this.showGroupInfo = true;
    }
  }

  /**
   * 统计维度改变
   */
  public changeStatisticalDimension() {
    this.resetStatisticalDimension();
  }

  /**
   * 设备类型改变
   */
  public changeEquipmentType() {
    this.resetStatisticalDimension();
  }

  /**
   * 清空所选统计范围
   */
  public resetStatisticalDimension() {
    // 清空所选统计范围
    this.selectStatisticsScopeName = '';
    this.selectEquipmentId = '';
    this.selectAreaIds = [];
    this.selectGroupIds = [];
    // 区域选择器选择区域回显
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, this.selectAreaIds);
  }

  /**
   * 选中设备事件
   */
  public onSelectEquipment(event): void {
    if (event.length > 0) {
      this.selectEquipmentId = event[0].equipmentId;
      this.selectStatisticsScopeName = event[0].equipmentName;
    }
  }

  /**
   * 区域选择器选择结果
   */
  public selectAreaDataChange(event: AreaModel[]) {
    const arr = [];
    this.selectAreaIds = [];
    if (event.length > 0) {
      event.forEach(item => {
        this.selectAreaIds.push(item.areaId);
        arr.push(item.areaName);
      });
    }
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, this.selectAreaIds);
    this.selectStatisticsScopeName = arr.toString();
  }

  /**
   * 选择分组事件
   */
  public onSelectGroup(event: GroupListModel[]) {
    const groupIds: string[] = [];
    const groupName: string[] = [];
    if (event.length > 0) {
      event.forEach(item => {
        groupIds.push(item.groupId);
        groupName.push(item.groupName);
      });
    }
    this.selectGroupIds = groupIds;
    this.selectStatisticsScopeName = groupName.toString();
  }

  /**
   * 添加区域树数据
   */
  private addName(data: AreaModel[]): void {
    data.forEach(item => {
      item.id = item.areaId;
      item.value = item.areaId;
      item.areaLevel = item.level;
      if (item.children) {
        this.addName(item.children);
      }
    });
  }

  /**
   * 初始化区域选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': 'ps', 'N': 'ps'},
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
      title: this.applicationLanguage.reportAnalysis.selectArea,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: this.treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.applicationLanguage.reportAnalysis.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.applicationLanguage.reportAnalysis.areaLevel, key: 'areaLevel', width: 100,
        }
      ]
    };
  }

  /**
   * 递归获取区域的areaId和areaName
   * @param data 区域树数据
   */
  private selectAllArea(data) {
    data.forEach(item => {
      this.selectAreaData.selectAreaIds.push(item.areaId);
      this.selectAreaData.areaName.push(item.areaName);
      if (item.children && item.children.length) {
        this.selectAllArea(item.children);
      }
    });
  }
}
