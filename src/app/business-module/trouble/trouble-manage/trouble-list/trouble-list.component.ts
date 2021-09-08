import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {TroubleService} from '../../share/service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FaultLanguageInterface} from '../../../../../assets/i18n/fault/fault-language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import * as TroubleListUtil from './trouble-list-util';
import * as _ from 'lodash';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {TroubleModel} from '../../../../core-module/model/trouble/trouble.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TroubleHintModel} from '../../share/model/trouble-hint.model';
import {SelectDeviceModel} from '../../../../core-module/model/facility/select-device.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import { SelectEquipmentModel } from '../../../../core-module/model/equipment/select-equipment.model';
import {TroubleUtil} from '../../../../core-module/business-util/trouble/trouble-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {SelectModel} from '../../../../shared-module/model/select.model';
import { TroubleDisplayTypeModel } from '../../share/model/trouble-display-type.model';
import {SliderPanelModel} from '../../../../shared-module/model/slider-panel.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {HIDDEN_SLIDER_HIGH_CONST, SHOW_SLIDER_HIGH_CONST} from '../../../../core-module/const/common.const';
import {RemarkFormModel} from '../../share/model/remark-form.model';
import {getLevelValueEnum, HandleStatusClassEnum} from '../../../../core-module/enum/trouble/trouble-common.enum';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {PageTypeEnum} from '../../../../core-module/enum/alarm/alarm-page-type.enum';
import {AlarmSelectorConfigModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {HandleStatusEnum} from '../../../../core-module/enum/trouble/trouble-common.enum';
import {TroubleHintListEnum, IsShowUintEnum} from '../../share/enum/trouble.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {TroubleSourceEnum} from '../../../../core-module/enum/trouble/trouble-common.enum';
import {SliderCommon} from '../../../../core-module/model/slider-common';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {TroubleToolService} from '../../../../core-module/api-service/trouble/trouble-tool.service';
import {AlarmCardLevelEnum} from '../../../../core-module/enum/alarm/alarm-card-level.enum';
import {AlarmShowCardNumberEnum} from '../../../../core-module/enum/alarm/alarm-show-card-number.enum';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {TroubleAreaCodesModel} from '../../share/model/trouble-areaCodes.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {LanguageTypeEnum} from '../../../../core-module/enum/language-type.enum';

/**
 * 故障列表
 */
@Component({
  selector: 'app-trouble-list',
  templateUrl: './trouble-list.component.html',
  styleUrls: ['./trouble-list.component.scss']
})
export class TroubleListComponent implements OnInit, OnDestroy {
  // 故障处理状态
  @ViewChild('handleStatusTemp') handleStatusTemp: TemplateRef<any>;
  // 故障级别模板
  @ViewChild('troubleLevelTemp') troubleLevelTemp: TemplateRef<any>;
  // 表格组件引用
  @ViewChild('table') table: TableComponent;
  // 责任单位
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 故障设施
  @ViewChild('facilityTemp') facilityTemp: TemplateRef<any>;
  // 故障设备
  @ViewChild('equipmentTemp') equipmentTemp: TemplateRef<any>;
  // 设备名称
  @ViewChild('troubleEquipment') troubleEquipment: TemplateRef<any>;
  // 设施类型名称
  @ViewChild('troubleDeviceType') troubleDeviceType: TemplateRef<any>;
  // 关联告警
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  public inspectionLanguageInterface: InspectionLanguageInterface;
  public alarmLanguage: AlarmLanguageInterface;
  // 表格数据
  public dataSet: TroubleModel[] = [];
  // 表格翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 备注是否可见
  public remarkTable: boolean = false;
  // 修改备注
  public checkRemark: TroubleModel[] = [];
  // 显示关联告警
  public isShowRefAlarm: boolean = false;
  public isLoading: boolean = false;
  // 修改备注弹框
  public formColumnRemark: FormItem[] = [];
  // 表单状态备注
  public formStatusRemark: FormOperate;
  // 卡片数据
  public sliderConfig: Array<SliderCommon> = [];
  // 告警提示选择
  public troubleHintList: TroubleHintModel[] = [];
  // 默认选中告警级别
  public troubleHintValue = TroubleHintListEnum.troubleLevelCode;
  // 是否从slide进入标志
  public isClickSlider = false;
  // 选择的单位名称
  public selectUnitName: string;
  // 责任单位展示
  public isVisible: boolean = false;
  // 责任单位下拉树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 故障设施
  public troubleFacilityConfig: AlarmSelectorConfigModel;
  // 勾选的设施
  public checkTroubleData: SelectDeviceModel = new SelectDeviceModel();
  // 勾选的设备
  public checkTroubleObject: SelectEquipmentModel = new SelectEquipmentModel();
  // 卡片个数
  public cardNum: number = AlarmShowCardNumberEnum.fiveCount;
  // modal框节流阀
  public modalOpen: boolean = false;
  // 告警数据
  public alarmData: AlarmListModel;
  // 是否为故障
  public isTrouble: boolean = true;
  // 设施是否单选
  public isRadio: boolean = true;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 设备选择器显示
  public equipmentFilterValue: FilterCondition;
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  public troubleId: string;
  // 故障来源枚举
  public troubleSourceEnum = TroubleSourceEnum;
  // 备注标示
  public isRemarkDisabled: boolean;
  // 指派页面是否展示责任单位判断条件
  public isAssignShowUnit: string = IsShowUintEnum.yes;
  // 责任单位下拉树
  public treeNodes: DepartmentUnitModel[] = [];
  // 展示方式样式
  public labelLeft: number = 360;
  // 单位过滤
  private filterValue: FilterValueModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // token
  public token: string = '';
  // 用户信息
  public userInfo: OrderUserModel;
  // 用户id
  public userId: string = '';
  // 故障类型
  public troubleTypeList: SelectModel[] = [];
  // 过滤电子锁相关设施类型
  public deviceRoleTypes: SelectModel[];
  // 登录有权限设施类型
  private resultDeviceType: SelectModel[];
  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $troubleService: TroubleService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              public $troubleToolService: TroubleToolService,
              public $dateHelper: DateHelperService,
              public $ruleUtil: RuleUtil,
              public modalService: NzModalService,
              public $userService: UserForCommonService,
              public $alarmService: AlarmForCommonService,
              ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
    this.inspectionLanguageInterface = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    if (window.localStorage.getItem('localId') === LanguageTypeEnum.en) {
      this.labelLeft = 395;
    }
    // 故障类型
    this.getTroubleType();
    // 告警选择显示初始化
    this.troubleHintList = [
      {label: this.language.displayTroubleLevel, code: TroubleHintListEnum.troubleLevelCode},
      {label: this.language.displayTroubleFacilityType, code: TroubleHintListEnum.troubleFacilityTypeCode}
    ];
     // 从其他页面跳转过来
    this.queryFromPage();
    // 登录有权限设施类型
    this.resultDeviceType = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 所有电子锁相关的设施类型
    const filterDeviceType = TroubleUtil.filterDeviceType();
    // 设施权限过滤电子锁的相关类型
    this.deviceRoleTypes = this.resultDeviceType.filter( item => {
      return filterDeviceType.includes(item.code as string);
    });
    // 表格配置初始化
    TroubleListUtil.initTableConfig(this);
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.token = SessionUtil.getToken();
      this.userInfo = SessionUtil.getUserInfo();
      this.userId = this.userInfo.id;
    }
    this.queryCondition.pageCondition.pageSize = this.pageBean.pageSize;
    this.queryCondition.pageCondition.pageNum = this.pageBean.pageIndex;
    this.refreshData();
    // 修改备注弹框
    this.initFormRemark();
    // 卡片请求, 默认请求故障级别
    this.queryDeviceTypeCount(TroubleHintListEnum.troubleLevelCode);
    // 初始化单位下拉树
    this.initTreeSelectorConfig();
    // 初始化故障设施
    this.initTroubleObjectConfig();
  }

  /**
   * 将实例化模版进行销毁
   */
  public ngOnDestroy(): void {
    this.tableConfig = null;
    this.table = null;
    this.UnitNameSearch = null;
    this.facilityTemp = null;
    this.equipmentTemp = null;
    this.UnitNameSearch = null;
  }

  /**
   * 从其他页面跳转过来
   */
  public queryFromPage(): void {
    // 故障id
    if (this.$active.snapshot.queryParams.id) {
      this.troubleId = this.$active.snapshot.queryParams.id;
      const filter = new FilterCondition('id');
      filter.operator = OperatorEnum.eq;
      filter.filterValue = this.troubleId;
      this.queryCondition.filterConditions = [filter];
    }
  }

  /**
  * 故障类型
  */
  public getTroubleType(): void {
    this.$troubleToolService.getTroubleTypeList().then((data: SelectModel[]) => {
      this.troubleTypeList = data;
      // 表格配置初始化
      TroubleListUtil.initTableConfig(this);
    });
  }

  /**
   * 表格翻页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 备注配置
   */
  public initFormRemark(): void {
    this.formColumnRemark = [
      {
        // 备注
        label: this.language.remark,
        key: 'remark',
        type: 'textarea',
        width: 1000,
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 修改备注表单实例
   */
  public formInstanceRemark(event: { instance: FormOperate }): void {
    this.formStatusRemark = event.instance;
    this.formStatusRemark.group.statusChanges.subscribe(() => {
      this.isRemarkDisabled = this.formStatusRemark.getValid();
    });
  }

  /**
   * 获取当前告警列表信息
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$troubleService.queryTroubleList(this.queryCondition).subscribe((res: ResultModel<TroubleModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = true;
        this.giveList(res);
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 请求过来的数据 赋值到列表
   */
  public giveList(res: ResultModel<TroubleModel[]>): void {
    // this.pageBean = TroubleCommonUtil.getTroublePageInfo(res);
    this.pageBean.Total = res.totalPage * res.size;
    this.pageBean.pageSize = res.size;
    this.pageBean.pageIndex = res.pageNum;
    this.tableConfig.isLoading = false;
    this.dataSet = res.data || [];
    this.tableConfig.showEsPagination = this.dataSet.length > 0;
    const lang = localStorage.getItem('localId');
    this.dataSet.forEach(item => {
      // 控制删除按钮禁启用
      item.isDelete = (!(item.handleStatus !== HandleStatusEnum.uncommit && item.handleStatus !== HandleStatusEnum.done &&
        item.handleStatus !== HandleStatusEnum.undone));
      // 判断故障列表操作按钮 禁启用
      item.isShowBuildOrder = item.alarmCode === 'orderOutOfTime' ? 'disabled' : true;
      // item.isShowFlow = item.handleStatus === HandleStatusEnum.uncommit ? 'disabled' : true;
      // 系统语言为英文，且状态为未提交
      if (lang === LanguageTypeEnum.en) {
        item.isShowFlow = 'disabled';
      } else {
        item.isShowFlow = item.handleStatus === HandleStatusEnum.uncommit ? 'disabled' : true;
      }
      item.isShowEdit = item.handleStatus === HandleStatusEnum.uncommit;
    });
    this.dataSet = res.data.map(item => {
      item.style = this.$alarmStoreService.getAlarmColorByLevel(item.troubleLevel);
      item.handleStatusName = TroubleUtil.translateHandleStatus(this.$nzI18n, item.handleStatus);
      item.handleStatusClass = HandleStatusClassEnum[item.handleStatus];
      item.troubleLevelName = AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, item.troubleLevel);
      item.troubleSourceCode = item.troubleSource;
      item.troubleSource = TroubleUtil.translateTroubleSource(this.$nzI18n, item.troubleSource);
      // 设备展示
      if (item.equipment && item.equipment.length > 0) {
        const resultEquipmentData = TroubleUtil.getEquipmentArr(this.language.config, item.equipment);
        item.equipmentName = resultEquipmentData.resultNames.join(',');
        item.equipmentTypeArr = resultEquipmentData.resultInfo;
      }
      // 设施类型
      item.deviceTypeName = FacilityForCommonUtil.translateDeviceType(this.$nzI18n, item.deviceType);
      item.deviceTypeClass = CommonUtil.getFacilityIconClassName(item.deviceType);
      item.troubleType = TroubleUtil.showTroubleTypeInfo(this.troubleTypeList, item.troubleType);
      if (item.currentHandleProgress) {
        item.currentHandleProgress = item.currentHandleProgress.replace(/\s/g, '');
      }
      return item;
    });
  }

  /**
   * 路由跳转
   */
  public navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 点击卡片，数据刷新
   * TroubleLevel 为告警级别
   * deviceType 为设施类型
   */
  public sliderChange(event: SliderPanelModel): void {
    // 清空筛选条件
    TroubleListUtil.clearData(this);
    this.table.tableService.resetFilterConditions(this.table.queryTerm);
    // 设置从slide进入的标志
    this.isClickSlider = true;
    // 判断点击的是不是故障总数
    if (event.label === this.language.troubleSum) {
      this.table.handleSearch();
    } else {
      // 不是总数时，分为故障级别和设施类型
      // 先清空表格里面的查询条件
      this.table.searchDate = {};
      this.table.rangDateValue = {};
      if (event.statisticType === 'level') {
        this.table.handleSetControlData('troubleLevel', [(event.levelCode)]);
      } else {
        this.table.handleSetControlData('deviceType', [event.code]);
      }
      this.table.handleSearch();
    }
  }

  /**
   * 滑块变化
   * param event
   */
  public slideShowChange(event: SliderPanelModel): void {
    if (event) {
      this.tableConfig.outHeight = SHOW_SLIDER_HIGH_CONST;
    } else {
      this.tableConfig.outHeight = HIDDEN_SLIDER_HIGH_CONST;
    }
    this.table.calcTableHeight();
  }

  /**
   * 故障级别，故障对象类型切换
   */
  public troubleHintValueModelChange(): void {
    if (this.troubleHintValue === TroubleHintListEnum.troubleLevelCode) {
      this.cardNum = AlarmShowCardNumberEnum.fiveCount;
      this.queryDeviceTypeCount(TroubleHintListEnum.troubleLevelCode);
    } else {
      this.cardNum = AlarmShowCardNumberEnum.sixCount;
      this.queryDeviceTypeCount(TroubleHintListEnum.troubleFacilityTypeCode);
    }
  }

  /**
   * 卡片等级数据
   */
  public getTroubleLevel(data: TroubleDisplayTypeModel[]): void {
    const resultData = ['urgency', 'serious', 'secondary', 'prompt'];
    const panelData = [];
    let count = 0;
    resultData.forEach(item => {
      const type = data.find(el => el.statisticObj === item);
      const color = this.$alarmStoreService.getAlarmColorByLevel(AlarmCardLevelEnum[item]);
      panelData.push({
        label: this.language.config[item],
        sum: type ? type.statisticNum : 0,
        iconClass: TroubleUtil.getLevelClass(item),
        levelCode: getLevelValueEnum[item],
        statisticType: 'level',
        color: color ? color.backgroundColor : null,
      });
      count += type ? type.statisticNum : 0;
    });
    panelData.unshift({
      sum: count,
      label: this.language.troubleSum,
      iconClass: 'iconfont fiLink-alarm-all statistics-all-color',
      textClass: 'statistics-all-color'
    });
    this.sliderConfig = panelData;
  }

  /**
   * 获取设施类型卡片数据
   */
  public getTroubleDeviceType(data: TroubleDisplayTypeModel[]): void {
    // 获取权限设施类型
    const deviceTypes: Array<SliderCommon> = [];
    if (!_.isEmpty(this.deviceRoleTypes)) {
      this.deviceRoleTypes
        .map(item => item.code)
        .forEach(code => {
          const type = data.find(item => item.statisticObj === code);
          deviceTypes.push({
            code: code as string,
            label: FacilityForCommonUtil.translateDeviceType(this.$nzI18n, code as string),
            sum: type ? type.statisticNum : 0,
            textClass: CommonUtil.getFacilityTextColor(code as string),
            iconClass: CommonUtil.getFacilityIConClass(code as string),
          });
        });
    }
    // 计算总数量
    const sum = _.sumBy(deviceTypes, 'sum') || 0;
    deviceTypes.unshift({
      label: this.language.troubleSum,
      iconClass: CommonUtil.getFacilityIconClassName(null),
      textClass: CommonUtil.getFacilityTextColor(null),
      code: null, sum: sum
    });
    this.sliderConfig = deviceTypes;
  }
  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterValueModel): void {
    if (this.treeSelectorConfig.treeNodes.length === 0) {
      this.queryDeptList().then((bool) => {
        if (bool === true) {
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.isVisible = true;
        }
      });
    } else {
      this.isVisible = true;
    }
  }

  /**
   * 判断是否可指派
   * 批量指派首先状态必须是未提且责任单位必须是一样的
   */
   public isDesignate(selectData: TroubleModel[]): TroubleAreaCodesModel {
     const onlyUnit = selectData[0].deptId;
     const isAssign = new TroubleAreaCodesModel();
    if (selectData && selectData.length > 0) {
      // 只能指派未提交
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].handleStatus !== HandleStatusEnum.uncommit) {
          isAssign.flag = false;
          this.$message.info(this.language.designateMsg);
          break;
        }
        // 责任单位必须一样
        if (selectData[i].deptId === onlyUnit) {
            if (isAssign.areaCodes.indexOf(selectData[i].areaCode) < 0) {
              isAssign.areaCodes.push(selectData[i].areaCode);
            }
        } else {
          isAssign.flag = false;
          this.$message.info(this.language.designateUnitMsg);
          break;
        }
      }
    }
    return isAssign;
  }

  /**
   * 打开关联告警modal
   */
  public showRefAlarmModal(data: TroubleModel): void {
    if (data.troubleSourceCode !== PageTypeEnum.alarm) {
      return;
    }
    if (this.modalOpen) {
      return;
    }
    this.modalOpen = true;
    this.$alarmService.queryCurrentAlarmInfoById(data.alarmId).subscribe((result: ResultModel<AlarmListModel>) => {
      this.modalOpen = false;
      if (result.code === 0 && result.data) {
        this.setAlarmData(result);

      } else {
        this.$alarmService.queryAlarmHistoryInfo(data.alarmId).subscribe((res: ResultModel<AlarmListModel>) => {
          if (res.code === 0 && res.data) {
            this.setAlarmData(res);
          } else {
            this.$message.info(this.language.noData);
            return;
          }
        });
      }
    }, () => {
      this.modalOpen = false;
    });
  }

  /**
   * 重组告警数据
   */
  private setAlarmData(result: ResultModel<AlarmListModel>) {
    this.alarmData = result.data;
    // 告警持续时间
    this.alarmData.alarmContinousTime = CommonUtil.setAlarmContinousTime(
      this.alarmData.alarmBeginTime ? this.alarmData.alarmBeginTime : '' , this.alarmData.alarmCleanTime,
      {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
    this.isShowRefAlarm = true;
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    let selectArr: string[] = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue.filterValue = null;
    } else {
      this.filterValue.filterValue = selectArr;
      this.filterValue.filterName = this.selectUnitName;
    }
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, selectArr);
  }

  /**
   * 删除故障
   *
   */
  public deleteTrouble(ids: string[]): void {
    this.$troubleService.deleteTrouble(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        this.$message.success(this.commonLanguage.deleteSuccess);
        // 删除跳第一页
        this.queryCondition.pageCondition.pageNum = 1;
        this.troubleHintValueModelChange();
        this.refreshData();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 备注
   */
  public troubleRemark(): void {
    const remarkData = this.formStatusRemark.getData().remark;
    const remark = remarkData ? remarkData : null;
    const ids = this.checkRemark.map(item => item.id);
    const data: RemarkFormModel = new RemarkFormModel();
    data.troubleId = ids.join();
    data.troubleRemark = remark;
    this.tableConfig.isLoading = true;
    this.$troubleService.troubleRemark(data).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.refreshData();
        this.$message.success(this.commonLanguage.remarkSuccess);
      } else {
        this.$message.error(res.msg);
        this.tableConfig.isLoading = false;
      }
      this.remarkTable = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 关联告警
   */
  public closeRefAlarm(event: boolean): void {
    this.isShowRefAlarm = false;
    this.alarmData = null;
  }

  /**
   * 故障设施
   */
  public initTroubleObjectConfig(): void {
    this.troubleFacilityConfig = {
      clear: !this.checkTroubleData.deviceId,
      handledCheckedFun: (event: SelectDeviceModel) => {
        this.checkTroubleData = event;
      }
    };
  }
  /**
   * 选择设备过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkTroubleObject = {
      ids: event.map(v => v.equipmentId) || [],
      name: event.map(v => v.equipmentName).join(',') || '',
    };
    this.equipmentFilterValue.filterValue = this.checkTroubleObject.ids;
    this.equipmentFilterValue.filterName = this.checkTroubleObject.name;
  }

  /**
   * 显示设备过滤
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }
  /**
   *  导出发送请求
   */
  public exportTrouble(body: ExportRequestModel): void {
    this.$troubleService.exportTroubleList(body).subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.language.exportSuccess);
      } else {
        this.$message.error(res.msg);
      }
    });
  }
  /**
   * 查询所有的区域
   */
  private queryDeptList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.treeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
   * 查询告警提示 设施类型总数
   * 1. 为告警级别
   * 2. 设施类型
   */
  private queryDeviceTypeCount(selectType: number): void {
    this.sliderConfig = [];
    if (selectType === TroubleHintListEnum.troubleLevelCode) {
      this.$troubleService.queryTroubleLevel(selectType).subscribe((res: ResultModel<TroubleDisplayTypeModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          const data = res.data || [];
          // 故障等级
          this.getTroubleLevel(data);
        }
      });
    } else {
      this.$troubleService.queryTroubleLevel(selectType).subscribe((res: ResultModel<TroubleDisplayTypeModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          const data = res.data || [];
          // 故障设施
          this.getTroubleDeviceType(data);
        }
      });
    }
  }
  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSelectorConfig = {
      title: this.language.pleaseSelectUnit,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting:  {
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
      },
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.unitName, key: 'deptName', width: 100,
        },
        {
          title: this.language.unitLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.language.placeUnit, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }
}

