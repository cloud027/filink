import {Component, Injectable, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DateHelperService, NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {CurrentAlarmMissionService} from '../../../../core-module/mission/current-alarm.mission.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {TableService} from '../../../../shared-module/component/table/table.service';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {FilterCondition, PageCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';
import {PicResourceEnum} from '../../../../core-module/enum/picture/pic-resource.enum';
import {DiagnosticModel} from '../../share/model/diagnostic.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {QueryRecentlyPicModel} from '../../../../core-module/model/picture/query-recently-pic.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {TroubleUtil} from '../../../../core-module/business-util/trouble/trouble-util';
import {SliderPanelModel} from '../../../../shared-module/model/slider-panel.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {getLevelValueEnum} from '../../../../core-module/enum/trouble/trouble-common.enum';
import {QueryCardParamsModel} from '../../share/model/query-card-params.model';
import {ShowTypeEnum} from '../../share/enum/alarm.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {DisplayModel} from '../../share/model/display.model';
import {DeviceTypeCountModel} from '../../../../core-module/model/facility/device-type-count.model';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {CurrentAlarmUtil} from '../../share/util/current-alarm.util';
import {AlarmService} from '../../share/service/alarm.service';
import {AlarmForCommonService} from '../../../../core-module/api-service';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {FacilityForCommonUtil} from 'src/app/core-module/business-util/facility/facility-for-common.util';
import {PageTypeEnum} from '../../../../core-module/enum/alarm/alarm-page-type.enum';
import {AlarmCardLevelEnum} from '../../../../core-module/enum/alarm/alarm-card-level.enum';
import {AlarmShowCardNumberEnum} from '../../../../core-module/enum/alarm/alarm-show-card-number.enum';
import {AlarmRemarkModel} from '../../../../core-module/model/alarm/alarm-remark.model';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {HIDDEN_SLIDER_HIGH_CONST, SHOW_SLIDER_HIGH_CONST} from '../../../../core-module/const/common.const';
import {QUERY_KEY_DEVICE_ID, QUERY_KEY_ID, QUERY_KEY_SOURCE_ID, QUERY_KEY_SOURCE_TYPE_ID} from '../../share/const/alarm-common.const';
import {AlarmLevelEnum} from '../../../../core-module/enum/alarm/alarm-level.enum';
import {AlarmCleanStatusEnum} from '../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmConfirmStatusEnum} from '../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {AlarmFiltrationModel} from '../../share/model/alarm-filtration.model';
import {AlarmTemplateDataModel} from '../../share/model/alarm-template-data.model';
import {AlarmQueryTypeEnum} from '../../../../core-module/enum/alarm/alarm-query-type.enum';
import {IsRootAlarmEnum} from '../../../../core-module/enum/alarm/is-root-alarm.enum';
import {AlarmAffirmClearModel} from '../../../../core-module/model/alarm/alarm-affirm-clear.model';
import {AlarmClearAffirmModel} from '../../../../core-module/model/alarm/alarm-clear-affirm.model';
import {LanguageTypeEnum} from '../../../../core-module/enum/language-type.enum';

/**
 * 当前告警页面
 * 注意: 在这个TS中没有使用到的东西 在current-alarm-util文件中可能用到了 不要轻易删除
 */
@Component({
  selector: 'app-current-alarm',
  templateUrl: './current-alarm.component.html',
  styleUrls: ['./current-alarm.component.scss'],
  providers: [TableService]
})

@Injectable()

export class CurrentAlarmComponent implements OnInit {
  // 告警级别过滤模板
  @ViewChild('alarmFixedLevelTemp') alarmFixedLevelTemp: TemplateRef<any>;
  // 表格组件引用
  @ViewChild('table') table: TableComponent;
  // 清除状态过滤模板
  @ViewChild('isCleanTemp') isCleanTemp: TemplateRef<any>;
  // 频次
  @ViewChild('frequencyTemp') frequencyTemp: TemplateRef<any>;
  // 设施类型过滤模板
  @ViewChild('alarmSourceTypeTemp') alarmSourceTypeTemp: TemplateRef<any>;
  // 确认状态过滤模板
  @ViewChild('isConfirmTemp') isConfirmTemp: TemplateRef<any>;
  // 告警名称
  @ViewChild('alarmName') alarmName: TemplateRef<any>;
  // 区域选择
  @ViewChild('areaSelector') areaSelectorTemp: TemplateRef<any>;
  // 设施名称
  @ViewChild('deviceNameTemp') deviceNameTemp: TemplateRef<any>;
  // 诊断设置
  @ViewChild('diagnosis') diagnosis: TemplateRef<any>;
  // 设备名称(告警对象)
  @ViewChild('alarmEquipmentTemp') alarmEquipmentTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // 当前页面
  public pageType: PageTypeEnum = PageTypeEnum.alarm;
  // 表格数据
  public dataSet: AlarmListModel[] = [];
  // 表格翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 树节点
  public treeNodes: NzTreeNode[] = [];
  // 单位列表
  public accountabilityUnitList: DepartmentUnitModel[] = [];
  // 弹框属否可见
  public isVisible: boolean = false;
  // 选中单位名称
  public selectUnitName: string;
  // 遮罩加载
  public ifSpin: boolean = false;
  // 备注，工单，模板查询是否可见
  public display: DisplayModel = new DisplayModel();
  // 加载标志位
  public isLoading: boolean = false;
  // 修改备注弹框
  public formColumnRemark: FormItem[] = [];
  // 诊断设置页面表单项
  public tableColumnSet: FormItem[] = [];
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 勾选的告警名称
  public checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 区域配置
  public areaConfig: AlarmSelectorConfigModel = new AlarmSelectorConfigModel();
  // 区域
  public areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设施名称配置
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // 设备名称配置
  public alarmEquipmentConfig: AlarmSelectorConfigModel;
  // 设备名称(告警对象)
  public checkAlarmEquipment: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设施名称
  public checkAlarmObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 卡片数据
  public sliderConfig: SliderPanelModel[] = [];
  // 告警提示选择
  public alarmHintList: SelectModel[] = [];
  // 默认选中告警级别
  public alarmHintValue: ShowTypeEnum = ShowTypeEnum.showLevel;
  // 诊断ID
  public diagnoseId: string = '';
  // 告警类别数组
  public alarmTypeList: SelectModel[] = [];
  // 设施名称title
  public deviceTitle: string;
  // 卡片数量
  public cardNum: AlarmShowCardNumberEnum = AlarmShowCardNumberEnum.fiveCount;
  // 备注标志符
  public remarkDis: boolean;
  // 诊断标志符
  public diagnoseSetDis: boolean;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 设备选择器显示
  public equipmentFilterValue: FilterCondition;
  // 勾选的设备
  public checkEquipmentObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 区域ID
  public areaId: string;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 告警级别枚举
  public alarmLevelEnum = AlarmLevelEnum;
  // 清除状态枚举
  public alarmCleanStatusEnum = AlarmCleanStatusEnum;
  // 确认状态枚举
  public alarmConfirmStatusEnum = AlarmConfirmStatusEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 导出
  public exportParams: ExportRequestModel = new ExportRequestModel();
  // 中英文时展示类型的左边距
  public leftDistance: number = 395;
  // 已选择数据
  public selectAlarmData: AlarmListModel[] = [];
  // 模板ID
  private templateId: string;
  // filterValue模型
  private filterValue: FilterValueModel;
  // 从别的页面跳告警的时候 无数据给提示只给一次
  private hasPrompt: boolean = false;
  // 登录有权限设施类型
  private deviceRoleTypes: SelectModel[];
  // 是否从slide进入标志
  private isClickSlider: boolean = false;
  // 图片查看加载
  private viewLoading: boolean = false;
  // 表单状态设置
  private formStatusSet: FormOperate;
  // 点击告警确认
  private alarmIds: AlarmAffirmClearModel[] = [];
  // 相关告警
  private correlationIds: AlarmAffirmClearModel[] = [];
  // 备注表单
  private formStatusRemark: FormOperate;
  // 告警id
  private alarmId: string = null;
  // 设施id
  private deviceId: string = null;
  // 设备id
  private equipmentId: string = null;
  // 设备类型
  private equipmentType: string = null;
  // token
  private token: string = '';
  // 用户信息
  private userInfo: OrderUserModel;
  // 用户id
  private userId: string = '';
  // 告警确认标志
  private confirmFlag: boolean = true;
  // 告警清除标志
  private cleanFlag: boolean = true;
  // 修改备注
  private checkRemark: AlarmRemarkModel[] = [];
  // 刷新卡片
  private isCardRefresh: boolean = false;

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $alarmForCommonService: AlarmForCommonService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              public $currService: CurrentAlarmMissionService,
              private $ruleUtil: RuleUtil,
              private $dateHelper: DateHelperService,
              private modalService: NzModalService,
              private $imageViewService: ImageViewService) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    const lang =  window.localStorage.getItem('localId');
    if (lang === LanguageTypeEnum.en) {
      this.leftDistance = 525;
    }
    this.deviceTitle = this.language.deviceName;
    // 告警提示选择
    this.alarmHintList = [
      {label: this.language.displayAlarmLevel, code: ShowTypeEnum.showLevel},
      {label: this.language.displayAlarmDeviceType, code: ShowTypeEnum.showType}
    ];
    // 设施权限
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 表格配置初始化
    CurrentAlarmUtil.initTableConfig(this);
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.token = SessionUtil.getToken();
      this.userInfo = SessionUtil.getUserInfo();
      this.userId = this.userInfo['id'];
    }
    // 从其他页面跳转过来
    CurrentAlarmUtil.queryFromPage(this);
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
    });
    this.queryCondition.pageCondition = new PageCondition(this.pageBean.pageIndex, this.pageBean.pageSize);
    // 刷新数据
    this.refreshData();
    // 修改备注弹窗
    CurrentAlarmUtil.initFormRemark(this);
    // 区域
    this.initAreaConfig();
    // 告警名称
    this.initAlarmName();
    // 设施名称
    this.initAlarmObjectConfig();
    // 设备名称
    this.initAlarmEquipment();
    // 查询告警提示 设施类型总数
    this.queryDeviceTypeCount(ShowTypeEnum.showLevel);
    // 诊断设置
    CurrentAlarmUtil.initSetForm(this);
    //  监听页面变化
    this.$active.queryParams.subscribe(param => {
      if (param.id) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === 'id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: 'id',
            filterValue: param.id,
            operator: OperatorEnum.eq
          });
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      }
    });
  }

  /**
   * 表格翻页
   */
  public pageChange(event: PageModel): void {
    if (!this.templateId) {
      this.queryCondition.pageCondition.pageNum = event.pageIndex;
      this.queryCondition.pageCondition.pageSize = event.pageSize;
      this.refreshData();
    } else {
      const data = new AlarmTemplateDataModel(new PageCondition(event.pageIndex, this.pageBean.pageSize));
      this.templateList(data);
    }
  }

  /**
   * 修改备注表单实例
   */
  public formInstanceRemark(event: { instance: FormOperate }): void {
    this.formStatusRemark = event.instance;
    this.formStatusRemark.group.statusChanges.subscribe(() => {
      this.remarkDis = this.formStatusRemark.getValid();
    });
  }

  /**
   * 诊断弹窗表单实例
   */
  public formInstanceSet(event: { instance: FormOperate }): void {
    this.formStatusSet = event.instance;
    this.formStatusSet.group.statusChanges.subscribe(() => {
      this.diagnoseSetDis = this.formStatusSet.getValid();
    });
  }

  /**
   * 获取当前告警列表信息
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$alarmService.queryCurrentAlarmList(this.queryCondition).subscribe((res) => {
      this.tableConfig.isLoading = false;
      if (res.code === 0) {
        this.giveList(res);
      } else {
        this.$message.error(res.msg);
      }
    }, (err) => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 请求过来的数据 赋值到列表
   */
  public giveList(res: ResultModel<AlarmListModel[]>): void {
    // this.pageBean.Total = res.totalCount;
    this.tableConfig.isLoading = false;
    this.pageBean.Total = res.totalPage * res.size;
    this.pageBean.pageIndex = res.pageNum;
    this.pageBean.pageSize = res.size;
    this.dataSet = res.data || [];
    this.tableConfig.showEsPagination = this.dataSet.length > 0;
    // 从其他页面跳转到告警第一次没数据给出提示s
    const hasId = this.$active.snapshot.queryParams.id || this.$active.snapshot.queryParams.deviceId ||
      this.$active.snapshot.queryParams.equipmentId || this.$active.snapshot.queryParams.alarmSourceTypeId;
    if ((!this.hasPrompt) && this.dataSet.length === 0 && hasId) {
      this.hasPrompt = true;
      this.$message.info(this.language.noCurrentAlarmData);
    }
    this.dataSet.forEach(item => {
      // 通过首次发生时间计算出告警持续时间
      item.alarmContinousTime = CommonUtil.setAlarmContinousTime(item.alarmBeginTime, item.alarmCleanTime,
        {year: this.language.year, month: this.language.month, day: this.language.day, hour: this.language.hour});
      // 判断诊断 / 定位 禁启用
      item.isShowBuildOrder = item.alarmCode === 'orderOutOfTime' ? 'disabled' : 'enable';
      // 判断查看图片 禁启用
      item.isShowViewIcon = item.alarmDeviceId ? 'enable' : 'disabled';
      // 修改备注
      item.isShowRemark = true;
    });
    this.dataSet = res.data.map(item => {
      this.translateField(item);
      // 展开的数据
      if (item.alarmCorrelationList && item.alarmCorrelationList.length > 0) {
        item.alarmCorrelationList.forEach(el => {
          // 判断诊断 / 定位 禁启用
          el.isShowBuildOrder = false;
          // 判断查看图片 禁启用
          el.isShowViewIcon = false;
          // 诊断详情
          el.isShowViewIcon = false;
          // 修改备注
          el.isShowRemark = false;
        });
        item.alarmCorrelationList = item.alarmCorrelationList.map(el => {
          this.translateField(el);
          return el;
        });
      }
      return item;
    });
  }

  /**
   * 列表翻译
   */
  public translateField(item: AlarmListModel): void {
    const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.alarmCode);
    if (name) {
      item.alarmName = name;
    }
    item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
    // 设备类型
    if (item.alarmSourceTypeId) {
      item.alarmSourceType = FacilityForCommonUtil.translateEquipmentType(this.$nzI18n, item.alarmSourceTypeId) as string;
      // 获取设备类型图标样式
      item.equipmentIcon = CommonUtil.getEquipmentIconClassName(item.alarmSourceTypeId);
    } else {
      item.alarmSourceType = item.alarmSourceType ? item.alarmSourceType : '— —';
    }
    // 设施名称
    item.alarmDeviceName = item.alarmDeviceName ? item.alarmDeviceName : '— —';
    // 设施图标样式
    item.deviceTypeIcon = CommonUtil.getFacilityIconClassName(item.alarmDeviceTypeId);
    // 告警类别
    item.alarmClassification = AlarmForCommonUtil.showAlarmTypeInfo(this.alarmTypeList, item.alarmClassification);
    if (item.alarmCode === 'orderOutOfTime' && item.extraMsg) {
      item.alarmObject = `${item.alarmObject}${item.extraMsg.slice(4)}`;
    }
  }
  /**
   *  导出发送请求
   */
  public exportAlarm(body: ExportRequestModel): void {
    this.$alarmService.exportAlarmList(body).subscribe((res) => {
      if (res.code === 0) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 查看图片
   */
  public examinePicture(data: AlarmListModel): void {
    // 查看图片节流阀
    if (this.viewLoading) {
      return;
    }
    this.viewLoading = true;
    // 对象id：设施或设备id 来源类型：1、工单 2、告警 3、实景图  对象类型：1、设施 2、设备
    const picData: QueryRecentlyPicModel[] = [
      new QueryRecentlyPicModel(data.alarmDeviceId, null, PicResourceEnum.alarm, data.id, ObjectTypeEnum.facility)
    ];
    this.$alarmService.examinePicture(picData).subscribe((res) => {
      this.viewLoading = false;
      if (res.code === ResultCodeEnum.success) {
        if (res.data.length === 0) {
          this.$message.warning(this.language.noPicturesYet);
        } else {
          this.$imageViewService.showPictureView(res.data);
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.viewLoading = false;
    });
  }

  /**
   * 模板查询
   */
  public templateTable(event: AlarmFiltrationModel): void {
    this.display.templateTable = false;
    if (!event) {
      return;
    }
    // 先清空表格里面的查询条件
    this.table.searchDate = {};
    this.table.rangDateValue = {};
    this.table.tableService.resetFilterConditions(this.table.queryTerm);
    const data = new AlarmTemplateDataModel(new PageCondition(1, this.pageBean.pageSize));
    if (event) {
      this.tableConfig.isLoading = true;
      this.templateId = event.id;
      this.templateList(data);
    }
  }

  /**
   * 模板查询 请求
   */
  public templateList(data: AlarmTemplateDataModel): void {
    this.tableConfig.isLoading = true;
    this.$alarmService.alarmQueryTemplateById(this.templateId, data).subscribe((res) => {
      if (res.code === 0) {
        this.giveList(res);
      } else if (res.code === ResultCodeEnum.noSuchData) {
        this.dataSet = [];
        this.tableConfig.isLoading = false;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 告警确认
   */
  public alarmConfirm(data: AlarmListModel[]): void {
    if (data.length > 0) {
      const noConfirmIds = data.filter(item => item.alarmConfirmStatus === AlarmConfirmStatusEnum.noConfirm);
      if (!noConfirmIds.length) {
        this.$message.info(this.language.confirmAgain);
        return;
      }
      this.alarmIds = [];
      this.correlationIds = [];
      noConfirmIds.forEach(item => {
        if (item.isRootAlarm === IsRootAlarmEnum.isRoot || item.isRootAlarm === IsRootAlarmEnum.noRoot) {
          this.alarmIds.push({id: item.id});
        } else {
          this.correlationIds.push({id: item.id});
        }
      });
      this.popUpConfirm();
    } else {
      this.$message.info(this.language.pleaseCheckThe);
    }
  }

  /**
   *  告警确认 弹框
   */
  public popUpConfirm(): void {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.alarmAffirm,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        this.confirmationBoxConfirm();
      },
    });
  }

  /**
   * 告警清除确认
   */
  public clearAlarmSure(): void {
    this.tableConfig.isLoading = true;
    const alarmClearParams = new AlarmClearAffirmModel(this.alarmIds, this.correlationIds);
    this.$alarmForCommonService.updateAlarmCleanStatus(alarmClearParams).subscribe((res) => {
      if (res.code === 0) {
        this.tableConfig.isLoading = false;
        this.$message.success(res.msg);
        this.refreshData();
        // 重新请求卡片统计
        this.queryDeviceTypeCount(this.alarmHintValue);
        this.$currService.sendMessage(AlarmQueryTypeEnum.level);
      } else {
        this.tableConfig.isLoading = false;
        this.refreshData();
        this.$message.info(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 告警确认点击 确认
   */
  public confirmationBoxConfirm(): void {
    this.tableConfig.isLoading = true;
    const alarmClearParams = new AlarmClearAffirmModel(this.alarmIds, this.correlationIds);
    // 告警确认
    this.$alarmService.updateAlarmConfirmStatus(alarmClearParams).subscribe((res) => {
      if (res.code === 0) {
        this.tableConfig.isLoading = false;
        this.$message.success(res.msg);
        this.refreshData();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 告警清除
   */
  public alarmClean(data: AlarmListModel[]) {
    if (data.length > 0) {
      const noCleanIds = data.filter(item => item.alarmCleanStatus === AlarmCleanStatusEnum.noClean);
      if (!noCleanIds.length) {
        this.$message.info(this.language.cleanAgain);
        return;
      }
      this.alarmIds = [];
      this.correlationIds = [];
       noCleanIds.forEach(item => {
        if (item.isRootAlarm === IsRootAlarmEnum.isRoot || item.isRootAlarm === IsRootAlarmEnum.noRoot) {
          // 根告警
          this.alarmIds.push({id: item.id, alarmSource: item.alarmSource});
        } else {
          // 相关告警
          this.correlationIds.push({id: item.id, alarmSource: item.alarmSource});
        }
      });
      CurrentAlarmUtil.popUpClean(this);
    } else {
      this.$message.info(this.language.pleaseCheckThe);
      return;
    }
  }

  /**
   * 修改备注
   */
  public updateAlarmRemark(): void {
    const remarkData = this.formStatusRemark.getData().remark;
    const remark = remarkData ? remarkData : null;
    const data: AlarmRemarkModel[] = this.checkRemark.map(item => {
      return {id: item.id, remark: remark};
    });
    this.tableConfig.isLoading = true;
    this.$alarmForCommonService.updateAlarmRemark(data).subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        this.refreshData();
        const arr = this.selectAlarmData.filter(v => v.father);
        if (arr && arr.length) {
          this.$message.success(this.language.refAlarmMsg);
        } else {
          this.$message.success(res.msg);
        }
      } else {
        this.$message.info(res.msg);
        this.tableConfig.isLoading = false;
      }
      this.display.remarkTable = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 点击卡片，数据刷新
   */
  public sliderChange(event: SliderPanelModel): void {
    // 清空筛选条件
    CurrentAlarmUtil.clearData(this);
    // 判断点击的是不是告警总数,
    this.table.tableService.resetFilterConditions(this.table.queryTerm);
    // 设置从slide进入的标志
    this.isClickSlider = true;
    if (this.deviceId) {
      const filter = new FilterCondition('alarmDeviceId', OperatorEnum.eq, this.deviceId);
      this.table.queryTerm.set('deviceId', filter);
    }
    if (this.alarmId) {
      const filter = new FilterCondition('id', OperatorEnum.eq, this.alarmId);
      this.table.queryTerm.set('alarmId', filter);
    }
    // 获取设备
    if (this.equipmentId) {
      this.equipmentId = this.$active.snapshot.queryParams.equipmentId;
      const filter = new FilterCondition('alarmSource', OperatorEnum.eq, this.equipmentId);
      this.table.queryTerm.set('equipmentId', filter);
    }
    // 获取设备类型
    if (this.equipmentType) {
      this.equipmentType = this.$active.snapshot.queryParams.alarmSourceTypeId;
      const filter = new FilterCondition('alarmSourceTypeId', OperatorEnum.eq, this.equipmentType);
      this.table.queryTerm.set('equipmentType', filter);
    }
    if (event.label === this.language.alarmSum) {
      this.table.handleSearch();
    } else {
      // 不是总数是，分为告警级别和设施类型,先清空表格里面的查询条件
      this.table.searchDate = {};
      this.table.rangDateValue = {};
      if (event.statisticType === 'level') {
        this.table.handleSetControlData('alarmFixedLevel', [event.levelCode]);
      } else {
        this.table.handleSetControlData('alarmDeviceTypeId', [event.code]);
      }
      this.table.handleSearch();
    }
    // 刷新卡片num
    this.isCardRefresh = true;
    this.queryDeviceTypeCount(this.alarmHintValue);
  }

  /**
   * 滑块变化
   * param event
   */
  public slideShowChange(event: boolean): void {
    if (event) {
      this.tableConfig.outHeight = SHOW_SLIDER_HIGH_CONST;
    } else {
      this.tableConfig.outHeight = HIDDEN_SLIDER_HIGH_CONST;
    }
    this.table.calcTableHeight();
  }

  /**
   * 告警级别，告警对象类型切换
   */
  public alarmHintValueModelChange(): void {
    this.isCardRefresh = false;
    if (this.alarmHintValue === ShowTypeEnum.showLevel) {
      this.queryDeviceTypeCount(ShowTypeEnum.showLevel);
    } else {
      this.queryDeviceTypeCount(ShowTypeEnum.showType);
    }
  }

  /**
   * 查询告警提示 设施类型总数  1. 为告警级别 2. 设施类型
   */
  private queryDeviceTypeCount(selectType: ShowTypeEnum): void {
    // isCardRefresh 为true是点击卡片刷新num的
    this.sliderConfig = this.isCardRefresh ? this.sliderConfig : [];
    if (selectType === ShowTypeEnum.showLevel) {
      this.cardNum = AlarmShowCardNumberEnum.fiveCount;
      // 选择告警级别显示
      if (this.alarmId) {
        // 告警ID
        this.queryCard(ShowTypeEnum.showLevel, this.alarmId, QUERY_KEY_ID);
      } else if (this.deviceId) {
        // 设施id
        this.queryCard(ShowTypeEnum.showLevel, this.deviceId, QUERY_KEY_DEVICE_ID);
      } else if (this.equipmentId) {
        // 设备id
        this.queryCard(ShowTypeEnum.showLevel, this.equipmentId, QUERY_KEY_SOURCE_ID);
      } else if (this.equipmentType) {
        // 设备类型
        this.queryCard(ShowTypeEnum.showLevel, this.equipmentType, QUERY_KEY_SOURCE_TYPE_ID);
      } else {
        // 告警卡片
        this.queryCard(ShowTypeEnum.showLevel);
      }
    } else {
      this.cardNum = AlarmShowCardNumberEnum.sixCount;
      if (this.alarmId) {
        // 告警ID
        this.queryCard(ShowTypeEnum.showType, this.alarmId, QUERY_KEY_ID);
      } else if (this.deviceId) {
        // 设施id
        this.queryCard(ShowTypeEnum.showType, this.deviceId, QUERY_KEY_DEVICE_ID);
      } else if (this.equipmentId) {
        // 设施id
        this.queryCard(ShowTypeEnum.showType, this.equipmentId, QUERY_KEY_SOURCE_ID);
      } else if (this.equipmentType) {
        // 设备类型
        this.queryCard(ShowTypeEnum.showType, this.equipmentType, QUERY_KEY_SOURCE_TYPE_ID);
      } else {
        // 设施类型卡片
        this.queryCard(ShowTypeEnum.showType);
      }
    }
  }

  /**
   * 告警等级卡片
   */
  public getCardLevel(data: DeviceTypeCountModel[]): void {
    const resultData = ['urgency', 'serious', 'secondary', 'prompt'];
    const panelData: SliderPanelModel[] = [];
    let count = 0;
    resultData.forEach(item => {
      const type = data.find(el => el.statisticObj === item);
      const color = this.$alarmStoreService.getAlarmColorByLevel(AlarmCardLevelEnum[item]);
      panelData.push({
        label: this.language.config[item], sum: type ? type.statisticNum : 0, code: item,
        iconClass: TroubleUtil.getLevelClass(item), levelCode: getLevelValueEnum[item],
        statisticType: 'level', color: color ? color.backgroundColor : null,
      });
      count += type ? type.statisticNum : 0;
    });
    panelData.unshift({
      sum: count, label: this.language.alarmSum, code: 'all',
      iconClass: 'iconfont fiLink-alarm-all statistics-all-color', textClass: 'statistics-all-color'
    });
    this.sliderConfig = panelData;
  }

  /**
   * 刷新卡片数量
   */
  public refreshCard(curData: SliderPanelModel[], backData: DeviceTypeCountModel[]): SliderPanelModel[] {
    let count = 0;
    curData.forEach(item => {
      item.sum = 0;
      backData.forEach(el => {
        if (item.code === el.statisticObj) {
          item.sum = el.statisticNum;
          count += item.sum;
        }
      });
    });
    curData.forEach(item => {
      if (item.code === 'all') {
        item.sum = count;
      }
    });
    return curData;
  }

  /**
   * 设施类型展示
   */
  public getCardDeviceType(data: DeviceTypeCountModel[]): void {
    const deviceTypes: SliderPanelModel[] = [];
    if (!_.isEmpty(this.deviceRoleTypes)) {
      this.deviceRoleTypes
        .map(item => item.code)
        .forEach(code => {
          const type = data.find(item => item.statisticObj === code);
          deviceTypes.push({
            code: code as string, label: FacilityForCommonUtil.translateDeviceType(this.$nzI18n, code as string),
            sum: type ? type.statisticNum : 0, textClass: CommonUtil.getFacilityTextColor(code as string),
            iconClass: CommonUtil.getFacilityIConClass(code as string),
          });
        });
    }
    // 计算总数量
    const sum = _.sumBy(deviceTypes, 'sum') || 0;
    deviceTypes.unshift({
      label: this.language.alarmSum, iconClass: CommonUtil.getFacilityIconClassName(null),
      textClass: CommonUtil.getFacilityTextColor(null), code: 'all', sum: sum
    });
    this.sliderConfig = deviceTypes;
  }

  /**
   * 条件查询统计卡片  @param type展示类型 id查询条件 key查询字段
   */
  public queryCard(type: string, value?: string | string[], key?: string): void {
    const filterData = value ? [new FilterCondition(key, OperatorEnum.eq, value)] : [];
    const data: QueryCardParamsModel = {
      statisticsType: type,
      filterConditions: filterData
    };
    this.$alarmService.getAlarmCount(data).subscribe((res) => {
      if (res.code === 0) {
        const resultData = res.data || [];
        if (type === ShowTypeEnum.showLevel) {
          if (this.isCardRefresh) {
            // 更新等级卡片num
            this.sliderConfig = this.refreshCard(this.sliderConfig, resultData);
          } else {
            this.getCardLevel(resultData); // 等级
          }
        } else {
          if (this.isCardRefresh) {
            // 更新设施卡片num
            this.sliderConfig = this.refreshCard(this.sliderConfig, resultData);
          } else {
            this.getCardDeviceType(resultData); // 设施类型
          }
        }
      }
    });
  }

  /**
   * 诊断确认
   */
  public setHandle(): void {
    const setData: DiagnosticModel = this.formStatusSet.getData();
    setData.id = this.diagnoseId;
    this.$alarmService.diagnosticUpdate(setData).subscribe((result) => {
      if (result.code === 0) {
        this.display.diagnoseSet = false;
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 诊断取消
   */
  public setHandleCancel(): void {
    this.display.diagnoseSet = false;
    this.tableColumnSet = [];
    CurrentAlarmUtil.initSetForm(this);
  }

  /**
   * 获取诊断数据 在current-alarm-util文件中使用到
   */
  public getDiagnosticData(): void {
    this.ifSpin = true;
    this.$alarmService.getDiagnosticData().subscribe((result: ResultModel<DiagnosticModel>) => {
      if (result.code === 0) {
        // 接口返回一个数组,默认取第一条
        const data = result.data;
        if (data) {
          this.diagnoseId = data.id;
          this.formStatusSet.resetData(data);
        }
        this.ifSpin = false;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.ifSpin = false;
    });
  }
  /**
   * 告警对象过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkAlarmEquipment = new AlarmSelectorInitialValueModel(
      event.map(v => v.equipmentName).join(',') || '', event.map(v => v.equipmentId) || []
    );
    this.equipmentFilterValue.filterValue = this.checkAlarmEquipment.ids;
    this.equipmentFilterValue.filterName = this.checkAlarmEquipment.name;
  }

  /**
   * 告警对象弹框
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * 设施名称配置初始化
   */
  private initAlarmObjectConfig(): void {
    this.alarmObjectConfig = {
      clear: !this.checkAlarmObject.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmObject = event;
      }
    };
  }

  /**
   * 设备名称（告警对象）初始化
   */
  private initAlarmEquipment(): void {
    this.alarmEquipmentConfig = {
      clear: !this.checkAlarmEquipment.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmEquipment = event;
      }
    };
  }

  /**
   * 区域配置初始化
   */
  private initAreaConfig(): void {
    this.areaConfig = {
      clear: !this.areaList.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.areaList = event;
      }
    };
  }

  /**
   *  告警名称配置初始化
   */
  private initAlarmName(): void {
    this.alarmNameConfig = {
      clear: !this.checkAlarmName.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
      }
    };
  }

  /**
   * 路由跳转
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

}
