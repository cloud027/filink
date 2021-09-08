import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {AlarmService} from '../../share/service/alarm.service';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {ImageViewService} from '../../../../shared-module/service/picture-view/image-view.service';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {AlarmLevelEnum} from '../../../../core-module/enum/alarm/alarm-level.enum';
import {PicResourceEnum} from '../../../../core-module/enum/picture/pic-resource.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {SelectDeviceModel} from '../../../../core-module/model/facility/select-device.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AlarmCleanStatusEnum} from '../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmConfirmStatusEnum} from '../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {QueryRecentlyPicModel} from '../../../../core-module/model/picture/query-recently-pic.model';
import {AlarmFiltrationModel} from '../../share/model/alarm-filtration.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {AlarmTemplateDataModel} from '../../share/model/alarm-template-data.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';


/**
 * 历史告警页面
 */
@Component({
  selector: 'app-history-alarm',
  templateUrl: './history-alarm.component.html',
  styleUrls: ['./history-alarm.component.scss']
})
export class HistoryAlarmComponent implements OnInit {
  // 表格告警级别过滤模板
  @ViewChild('alarmFixedLevelTemp') alarmFixedLevelTemp: TemplateRef<any>;
  // 频次
  @ViewChild('frequencyTemp') frequencyTemp: TemplateRef<any>;
  // 表格清除状态过滤模板
  @ViewChild('alarmCleanStatusTemp') alarmCleanStatusTemp: TemplateRef<any>;
  // 表格确认状态过滤模板
  @ViewChild('alarmConfirmStatusTemp') alarmConfirmStatusTemp: TemplateRef<any>;
  // 表格设施类型过滤模板
  @ViewChild('alarmSourceTypeTemp') alarmSourceTypeTemp: TemplateRef<any>;
  // 表格告警名称过滤模板
  @ViewChild('alarmName') alarmName: TemplateRef<any>;
  // 表格区域过滤模板
  @ViewChild('areaSelector') areaSelectorTemp: TemplateRef<any>;
  // 表格告警对象过滤模板
  @ViewChild('departmentTemp') departmentTemp: TemplateRef<any>;
  // 告警持续时间
  @ViewChild('alarmContinueTimeTemp') alarmContinueTimeTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // 设施名称
  @ViewChild('deviceNameTemp') deviceNameTemp: TemplateRef<any>;
  // 表格数据源
  public dataSet: AlarmListModel[] = [];
  // 翻页对象
  public pageBean: PageModel = new PageModel();
  // 表格配置项
  public tableConfig: TableConfigModel;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 设施名称配置
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // 设施名称
  public checkAlarmObject: SelectDeviceModel = new SelectDeviceModel();
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 历史告警模板查询是否可见
  public historyAlarmTemplateTable: boolean = false;
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 区域配置
  public areaConfig: AlarmSelectorConfigModel;
  // 设备名称(告警对象)
  public checkAlarmEquipment: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 告警类别数组
  public alarmTypeList: SelectModel[] = [];
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 设备选择器显示
  public equipmentFilterValue: FilterCondition;
  // 勾选的设备
  public checkEquipmentObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 树节点
  public treeNodes: NzTreeNode[] = [];
  // 是否可见
  public isVisible: boolean = false;
  // 设备id
  public equipmentId: string;
  // 选中单位名称
  public selectUnitName: string;
  // 设施名称
  public deviceTitle: string;
  // 设备类型
  public equipmentType: string;
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
  // 查看图片加载
  private viewLoading: boolean = false;
  // 告警id
  private alarmId: string = null;
  // 设施id
  private deviceId: string = null;
  // 模板ID
  private templateId: string;
  // 登录有权限设施类型
  private deviceRoleTypes: SelectModel[];
  // 区域
  private areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 勾选的告警名称
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 告警对象配置
  private alarmEquipmentConfig: AlarmSelectorConfigModel;
  constructor(private $router: Router,
              private $nzI18n: NzI18nService,
              private $alarmForCommonService: AlarmForCommonService,
              private $alarmService: AlarmService,
              private $message: FiLinkModalService,
              private $active: ActivatedRoute,
              private $alarmStoreService: AlarmStoreService,
              private $imageViewService: ImageViewService) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // 设备名称
    this.deviceTitle = this.language.deviceName;
    // 设施权限
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 初始化表格配置
    this.initTableConfig();
    // 从其他页面跳过来过滤条件
    this.queryFromPage();
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
    });
    this.queryCondition.pageCondition = new PageCondition(this.pageBean.pageIndex, this.pageBean.pageSize);
    // 数据刷新
    this.refreshData();
    // 区域
    this.initAreaConfig();
    // 告警名称
    this.initAlarmName();
    // 告警对象
    this.initAlarmEquipmentConfig();
    // 设施名称
    this.initAlarmObjectConfig();
    //  监听页面变化
    this.$active.queryParams.subscribe(param => {
      if (param.id) {
        const filterArr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === 'id';
        });
        if (!filterArr) {
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
   * 从其他页面跳过来过滤条件
   */
  public queryFromPage(): void {
    // 获取告警id
    if (this.$active.snapshot.queryParams.id) {
      this.alarmId = this.$active.snapshot.queryParams.id;
      const filter = new FilterCondition('id', OperatorEnum.eq, this.alarmId);
      this.queryCondition.filterConditions = [filter];
    }
    // 获取设备deviceId
    if (this.$active.snapshot.queryParams.deviceId) {
      this.deviceId = this.$active.snapshot.queryParams.deviceId;
      const filter = new FilterCondition('alarmDeviceId', OperatorEnum.eq, this.deviceId);
      this.queryCondition.filterConditions = [filter];
    }
    // 获取设备equipmentId
    if (this.$active.snapshot.queryParams.equipmentId) {
      this.equipmentId = this.$active.snapshot.queryParams.equipmentId;
      const filter = new FilterCondition('alarmSource', OperatorEnum.eq, this.equipmentId);
      this.queryCondition.filterConditions = [filter];
    }
    // 获取设备类型
    if (this.$active.snapshot.queryParams.alarmSourceTypeId) {
      this.equipmentType = this.$active.snapshot.queryParams.alarmSourceTypeId;
      const filter = new FilterCondition('alarmSourceTypeId', OperatorEnum.eq, this.equipmentType);
      this.queryCondition.filterConditions = [filter];
    }
  }
  /**
   * 设备名称（告警对象）初始化
   */
  public initAlarmEquipmentConfig(): void {
    this.alarmEquipmentConfig = {
      clear: !this.checkAlarmEquipment.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmEquipment = event;
      }
    };
  }

  /**
   * 设施名称配置初始化
   */
  public initAlarmObjectConfig(): void {
    this.alarmObjectConfig = {
      clear: !this.checkAlarmObject.deviceId.length,
      handledCheckedFun: (event: SelectDeviceModel) => {
        this.checkAlarmObject = event;
      }
    };
  }
  /**
   * 表格翻页刷新数据
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
   * 告警对象过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkEquipmentObject = new AlarmSelectorInitialValueModel(
      event.map(v => v.equipmentName).join(',') || '', event.map(v => v.equipmentId) || []
    );
    this.equipmentFilterValue.filterValue = this.checkEquipmentObject.ids;
    this.equipmentFilterValue.filterName = this.checkEquipmentObject.name;
  }

  /**
   * 告警对象弹框
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * 查看图片
   * param data
   */
  public examinePicture(data: AlarmListModel): void {
    // 查看图片节流阀
    if (this.viewLoading) {
      return;
    }
    this.viewLoading = true;
    // 对象id：设施或设备id 来源类型：1、工单 2、告警 3、实景图  对象类型：1、设施 2、设备
    const body: QueryRecentlyPicModel[] = [
      new QueryRecentlyPicModel(data.alarmDeviceId, null, PicResourceEnum.alarm, data.id, ObjectTypeEnum.facility)
    ];
    this.$alarmService.examinePicture(body).subscribe((res) => {
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
    this.historyAlarmTemplateTable = false;
    if (!event) {
      return;
    }
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
    // 点击确认进入
    this.tableConfig.isLoading = true;
    this.$alarmService.alarmHistoryQueryTemplateById(this.templateId, data).subscribe((res) => {
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
   * 告警名称配置初始化
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
   * 获取历史告警列表信息
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.forEach(item => {
      if (item.filterField === 'alarmName') {
        item.filterValue = this.checkAlarmName.alarmNames;
        item.operator = OperatorEnum.in;
      }
    });
    this.$alarmService.queryAlarmHistoryList(this.queryCondition).subscribe((res) => {
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
  private giveList(res: ResultModel<AlarmListModel[]>): void {
    // 表格是否显示加载状态
    this.tableConfig.isLoading = false;
    // 分页总页数
    this.pageBean.Total = res.totalCount;
    // 当前页
    this.pageBean.Total = res.totalPage * res.size;
    this.pageBean.pageIndex = res.pageNum;
    // 分页每页条数
    this.pageBean.pageSize = res.size;
    this.dataSet = res.data || [];
    this.dataSet = res.data.map(item => {
      this.translateType(item);
      // 展开的数据
      if (item.alarmCorrelationList && item.alarmCorrelationList.length > 0) {
        item.alarmCorrelationList = item.alarmCorrelationList.map(el => {
          this.translateType(el);
          return el;
        });
      }
      return item;
    });
    this.tableConfig.showEsPagination = this.dataSet.length > 0;
  }

  /**
   * 图标状态等处理
   */
  private translateType(item: AlarmListModel): void {
    item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
    const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.alarmCode);
    if (name) {
      item.alarmName = name;
    }
    // 设备类型
    if (item.alarmSourceTypeId) {
      item.alarmSourceType = FacilityForCommonUtil.translateEquipmentType(this.$nzI18n, item.alarmSourceTypeId) as string;
      item.equipmentIcon = CommonUtil.getEquipmentIconClassName(item.alarmSourceTypeId);
    } else {
      item.alarmSourceType = item.alarmSourceType ? item.alarmSourceType : '— —';
    }
    // 获取设施图标样式
    if (item.alarmDeviceTypeId) {
      item.deviceTypeIcon = CommonUtil.getFacilityIconClassName(item.alarmDeviceTypeId);
    }
    item.alarmDeviceName = item.alarmDeviceName ? item.alarmDeviceName : '— —';
    if (item.alarmCode === 'orderOutOfTime' && item.extraMsg) {
      item.alarmObject = `${item.alarmObject}${item.extraMsg.slice(4)}`;
    }
    // 告警类别
    item.alarmClassification = AlarmForCommonUtil.showAlarmTypeInfo(this.alarmTypeList, item.alarmClassification);
    // 告警持续时间
    item.alarmContinousTime = CommonUtil.setAlarmContinousTime(item.alarmBeginTime, item.alarmCleanTime,
      {year: this.language.year, month: this.language.month, day: this.language.day, hour: this.language.hour});
    // 判断诊断、定位禁启用
    item.isShowBuildOrder = item.alarmCode === 'orderOutOfTime' ? 'disabled' : 'enable';
  }

  /**
   * 表格配置项初始化
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-2',
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      showSearchExport: true,
      searchTemplate: false,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {
          type: 'expend', width: 30, expendDataKey: 'alarmCorrelationList',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '30px'}}, width: 60},
        {
          key: 'serialNumber', width: 62, title: this.language.serialNumber, fixedStyle: {fixedLeft: true, style: {left: '90px'}}
        },
        { // 告警名称
          title: this.language.alarmName, key: 'alarmName', width: 180, isShowSort: true,
          searchable: true, searchKey: 'alarmName',
          searchConfig: {
            type: 'render',
            renderTemplate: this.alarmName
          },
          fixedStyle: {fixedLeft: true, style: {left: '152px'}}
        },
        { // 告警级别
          title: this.language.alarmFixedLevel, key: 'alarmFixedLevel', width: 120, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null), label: 'label', value: 'code'
          },
          renderTemplate: this.alarmFixedLevelTemp
        },
        { // 告警对象
          title: this.language.alarmobject, key: 'alarmObject', width: 180, isShowSort: true,
          searchKey: 'alarmSource',
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.departmentTemp
          },
        },
        {
          // 设备类型
          title: this.language.equipmentType, key: 'alarmSourceTypeId', width: 150, isShowSort: true,
          type: 'render',
          configurable: true,
          searchKey: 'alarm_source_type_id',
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        {
          // 设施名称
          title: this.language.deviceName, key: 'alarmDeviceName', width: 150, isShowSort: true,
          searchKey: 'alarmDeviceId',
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceNameTemp
          },
        },
        {
          // 设施类型
          title: this.language.alarmSourceType, key: 'alarmDeviceTypeId', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'alarm_device_type_id',
          type: 'render',
          renderTemplate: this.alarmSourceTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.deviceRoleTypes, label: 'label', value: 'code'
          }
        },
        {
          // 区域
          title: this.language.area, key: 'areaName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'area_id',
          searchConfig: {
            type: 'render',
            renderTemplate: this.areaSelectorTemp
          },
        },
        {
          // 告警类别
          title: this.language.AlarmType, key: 'alarmClassification', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'alarmClassification',
          searchConfig: {
            type: 'select', selectType: 'multiple',
          },
        },
        {
          // 责任单位
          title: this.language.responsibleDepartment, key: 'responsibleDepartment', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 频次
          title: this.language.alarmHappenCount, key: 'alarmHappenCount', width: 80, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.frequencyTemp
          }
        },
        {
          // 清除状态
          title: this.language.alarmCleanStatus, key: 'alarmCleanStatus', width: 125, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.isClean, value: AlarmCleanStatusEnum.isClean},
              {label: this.language.deviceClean, value: AlarmCleanStatusEnum.deviceClean}
            ]
          },
          renderTemplate: this.alarmCleanStatusTemp
        },
        {
          // 确认状态
          title: this.language.alarmConfirmStatus, key: 'alarmConfirmStatus', width: 120, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.language.isConfirm, value: AlarmConfirmStatusEnum.isConfirm},
              {label: this.language.noConfirm, value: AlarmConfirmStatusEnum.noConfirm}
            ]
          },
          renderTemplate: this.alarmConfirmStatusTemp
        },
        {
          // 首次发生时间
          title: this.language.alarmBeginTime, key: 'alarmBeginTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 备注
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.language.operate, searchable: true,
          searchConfig: {
            type: 'operate',
            /********暂时屏蔽掉**********/
            // customSearchHandle: () => {
            //   this.display.historyAlarmTemplateTable = true;
            // }
          },
          key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      // 是否显示分页
      showPagination: false,
      // 配合后台es查询分页
      showEsPagination: false,
      // 是否带边框
      bordered: false,
      // 是否显示搜索栏
      showSearch: false,
      // 搜索返回值类型
      searchReturnType: 'Array',
      // 顶部按钮
      topButtons: [
        {
          // 历史告警设置
          text: this.language.historyAlarmSet,
          permissionCode: '02-2-5',
          iconClassName: 'fiLink-setup',
          handle: () => {
            // 判断操作是否有权限
            const flag = SessionUtil.checkHasRole('02-3-2');
            if (!flag) {
              this.$message.error(this.language.noPageRole);
              return;
            }
            this.$router.navigate(['business/alarm/history-alarm-set']).then();
          }
        }
      ],
      operation: [
        {
          // 定位
          text: this.language.location,
          key: 'isShowBuildOrder',
          className: 'fiLink-location',
          permissionCode: '02-2-2',
          disabledClassName: 'fiLink-location alarm-disabled-icon',
          handle: (e: AlarmListModel) => {
            this.navigateToDetail('business/index', {queryParams: {equipmentId: e.alarmSource}});
          }
        },
        {
          // 查看图片
          text: this.language.viewPicture,
          className: 'fiLink-view-photo',
          permissionCode: '02-2-3',
          handle: (e: AlarmListModel) => {
            // 查看图片
            this.examinePicture(e);
          }
        }, {
          // 告警诊断
          text: this.language.alarmDiagnose,
          key: 'isShowBuildOrder',
          permissionCode: '02-2-4',
          className: 'fiLink-diagnose-details',
          disabledClassName: 'fiLink-diagnose-details alarm-disabled-icon',
          handle: (e: AlarmListModel) => {
            this.$router.navigate(['business/alarm/history-diagnose-details'],
              {
                queryParams: {
                  id: e.alarmSource,
                  areaId: e.areaId,
                  alarmId: e.id,
                  alarmCode: e.alarmCode,
                  type: 'history'
                }
              }).then();
          }
        }
      ],
      leftBottomButtons: [
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'alarmContinousTime') {
          // 当进行告警持续时间排序时 传给后台的是 alarmContinousTime 这个参数
          this.queryCondition.sortCondition.sortField = 'alarmContinousTime';
        } else {
          this.queryCondition.sortCondition.sortField = event.sortField;
        }
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        // 点击表格里的重置或查询，清掉存在的deviceId或alarmId等条件
        this.queryCondition.filterConditions = [];
        if (!event.length) {
          //  告警名称 区域  告警对象 清空
          this.areaList = new AlarmSelectorInitialValueModel();
          this.checkAlarmName = new AlarmSelectorInitialValueModel();
          this.checkEquipmentObject = new AlarmSelectorInitialValueModel();
          // 选中单位名称
          this.selectUnitName = '';
          this.checkAlarmEquipment = new AlarmSelectorInitialValueModel();
          this.checkAlarmObject = new SelectDeviceModel();
          FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, []);
          // 区域
          this.initAreaConfig();
          // 告警名称
          this.initAlarmName();
          this.selectEquipments = [];
          // 告警对象
          this.initAlarmEquipmentConfig();
          // 设施名称
          this.initAlarmObjectConfig();
          this.queryCondition.pageCondition = new PageCondition(1, this.pageBean.pageSize);
          this.refreshData();
        } else {
          event.forEach(item => {
            const filterFieldArr = ['alarmNameId', 'alarmSource', 'alarmDeviceId', 'area_id'];
            if (filterFieldArr.includes(item.filterField)) {
              item.operator = OperatorEnum.in;
            }
            // 频次
            if (item.filterField === 'alarmHappenCount') {
              item.operator =  OperatorEnum.lte;
              item.filterValue = Number(item.filterValue) ? Number(item.filterValue) : 0;
            }
            // 责任单位
            if (item.filterField === 'responsibleDepartment') {
              item.operator =  OperatorEnum.like;
            }
          });
          this.pageBean = new PageModel(this.queryCondition.pageCondition.pageSize);
          this.queryCondition.pageCondition = new PageCondition(this.pageBean.pageIndex, this.pageBean.pageSize);
          this.queryCondition.filterConditions = event;
          this.refreshData();
        }
      },
      // 导出
      handleExport: (event: ListExportModel<AlarmListModel[]>) => {
        // 处理参数
        this.exportParams = new ExportRequestModel(event.columnInfoList, event.excelType, this.queryCondition);
        const propertyName = ['alarmFixedLevel', 'alarmSourceTypeId', 'alarmCleanStatus',
          'alarmBeginTime', 'alarmNearTime', 'alarmConfirmTime', 'alarmCleanTime',
          'alarmContinousTime', 'alarmClassification', 'alarmDeviceTypeId', 'alarmConfirmStatus'];
        this.exportParams.columnInfoList.forEach(item => {
          if (propertyName.indexOf(item.propertyName) !== -1) {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          event.queryTerm['alarmIds'] = event.selectItem.map(item => item.id);
          this.exportParams.queryCondition.filterConditions.push(
            new FilterCondition('id', OperatorEnum.in, event.queryTerm['alarmIds'])
          );
        }
        this.$alarmService.exportHistoryAlarmList(this.exportParams).subscribe((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      // 打开表格搜索事件
      openTableSearch: () => {
        this.tableConfig.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item.searchConfig.selectInfo = this.alarmTypeList;
          }
        });
      },
    };
  }

  /**
   * 路由跳转
   * param url
   * param {{}} extras
   */
  private navigateToDetail(url: string, extras = {}) {
    this.$router.navigate([url], extras).then();
  }

}
