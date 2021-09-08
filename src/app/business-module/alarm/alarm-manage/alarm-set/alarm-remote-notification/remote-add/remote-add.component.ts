import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FilterCondition, QueryConditionModel} from '../../../../../../shared-module/model/query-condition.model';
import {AlarmService} from '../../../../share/service/alarm.service';
import {TableComponent} from '../../../../../../shared-module/component/table/table.component';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {EquipmentListModel} from '../../../../../../core-module/model/equipment/equipment-list.model';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {AlarmEnableStatusEnum, LinkageEnum} from '../../../../share/enum/alarm.enum';
import * as RemoteAddUtil from '../../../../share/util/remote-add-util';
import {
  BusinessStatusEnum,
  EquipmentStatusEnum,
  EquipmentTypeEnum,
} from '../../../../../../core-module/enum/equipment/equipment.enum';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {FacilityForCommonUtil} from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmForCommonUtil} from '../../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {FacilityListModel} from '../../../../../../core-module/model/facility/facility-list.model';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../../../core-module/enum/facility/facility.enum';
import {OperatorEnum} from '../../../../../../shared-module/enum/operator.enum';
import {SelectModel} from '../../../../../../shared-module/model/select.model';
import {AlarmRemoteModel} from '../../../../share/model/alarm-remote.model';
import {AlarmRemoteAreaModel} from '../../../../share/model/alarm-remote-area.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {AlarmNotifierRequestModel} from '../../../../../../core-module/model/alarm/alarm-notifier-request.model';
import {AlarmEquipmentTypeModel} from '../../../../share/model/alarm-equipment-type.model';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {AreaModel} from '../../../../../../core-module/model/facility/area.model';

/**
 * 告警设置-告警远程通知 新增和编辑页面
 */
@Component({
  selector: 'app-remote-add',
  templateUrl: './remote-add.component.html',
  styleUrls: ['./remote-add.component.scss'],
})
export class RemoteAddComponent implements OnInit {
  // 表格启用禁用
  @ViewChild('isNoStartUsing') private isNoStartUsing;
  // 通知人
  @ViewChild('notifierTemp') notifierTemp: TemplateRef<any>;
  // 告警级别
  @ViewChild('alarmFixedLevelListTemp') alarmFixedLevelListTemp: TemplateRef<any>;
  // 区域
  @ViewChild('areaSelector') private areaSelector;
  // 表单设施类型
  @ViewChild('deviceTypeTemp') private deviceTypeTemp;
  // 设施设备
  @ViewChild('deviceEquipmentTemp') private deviceEquipmentTemp;
  // 设施组件
  @ViewChild('deviceComponent') private deviceComponent: TableComponent;
  // 设备组件
  @ViewChild('equipmentComponent') private equipmentComponent: TableComponent;
  // 表单设备类型
  @ViewChild('equipmentTypeTemp') private equipmentTypeTemp: TemplateRef<any>;
  // 设施列表设施类型
  @ViewChild('deviceType') private deviceType: TemplateRef<any>;
  // 设施状态
  @ViewChild('deviceStatus') private deviceStatus: TemplateRef<any>;
  // 设备列表设备类型
  @ViewChild('equipmentType') private equipmentType: TemplateRef<any>;
  // 设备状态
  @ViewChild('equipmentStatus') private equipmentStatus: TemplateRef<any>;
  // 业务状态
  @ViewChild('businessStatusTemplate') private businessStatusTemplate: TemplateRef<any>;
  // 历史告警设置表单项
  public formColumn: FormItem[] = [];
  // 历史告警表单项实例
  public formStatus: FormOperate;
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 设施语言包
  public facilityLanguage: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 启用状态 默认 启用
  public isNoStartData: boolean = true;
  // 保存按钮加载中
  public isLoading: boolean = false;
  // 区域配置
  public areaConfig: AlarmSelectorConfigModel;
  // 弹窗控制
  public display = {
    deviceTypeDisplay: true,
    notifierDis: true,
    equipmentTypeDisplay: true,
    deviceAndEquipmentDis: true,
  };
  // 标题
  public title: string = '';
  // 告警级别 多选值
  public alarmFixedLevelListValue: string[] = [];
  // 告警级别 1 紧急  2 主要 3 次要 4 提示
  public alarmFixedLevelList: SelectModel[] = [];
  // 设施类型 多选值
  public deviceTypeListValue: string[] = [];
  // 权域设施类型
  public deviceTypeList: SelectModel[] = [];
  // 后台返回设施类型
  public authorizeDeviceTypeList: SelectModel[] = [];
  // 所有设施类型
  public allDeviceTypeList: SelectModel[] = [];
  // 通知人信息
  public alarmUserConfig: AlarmSelectorConfigModel;
  // 所有设备类型
  public allEquipmentTypeList: SelectModel[] = [];
  // 设施类型下的设备类型
  public equipmentTypeList: SelectModel[] = [];
  // 授权设施类型下的设备类型
  public authorizeEquipmentTypeList: SelectModel[] = [];
  // 选中设备类型
  public equipmentTypeListValue: string[] = [];
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设施状态枚举
  public deviceStatusEnum = DeviceStatusEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 勾选设施
  public selectedDeviceData: FacilityListModel[] = [];
  // 勾选设备
  public selectedEquipmentData: EquipmentListModel[] = [];
  /**
   *  通知人默认值
   *  1 deptList 部门
   *  2 deviceTypes 为设施类型
   *  */
  public alarmNotifierInitialValue: AlarmNotifierRequestModel = new AlarmNotifierRequestModel();
  // 设施设备弹框
  public isVisible: boolean = false;
  // 设施设备名称
  public deviceEquipmentName: string = '';
  // 设施数据
  public deviceData: FacilityListModel[] = [];
  // 设施分页
  public devicePageBean: PageModel = new PageModel();
  // 设施表格配置
  public deviceTableConfig: TableConfigModel;
  // 分页配置
  public deviceQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 设备数据
  public equipmentData: EquipmentListModel[] = [];
  // 设备分页
  public equipmentPageBean: PageModel = new PageModel();
  // 设备表格配置
  public equipmentTableConfig: TableConfigModel;
  // 设备分页配置
  public equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 业务状态枚举
  public businessStatusEnum = BusinessStatusEnum;
  // 加载
  public ifSpin: boolean = false;
  // 控制提交按钮
  public isSubmit: boolean;
  // 显示列表
  public isShowTable: boolean = true;
  // 页面类型
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 勾选的通知人
  private checkAlarmNotifier: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 编辑id
  private updateParamsId: string;
  // 区域
  private areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 选中的设施数据
  private checkDeviceData: FacilityListModel[] = [];
  // 选中的设备数据
  private checkEquipmentData: EquipmentListModel[] = [];
  // 告警远程数据
  private alarmRemoteData: AlarmRemoteModel;

  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $alarmService: AlarmService,
    private $ruleUtil: RuleUtil,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 所有设施类型
    this.allDeviceTypeList = FacilityForCommonUtil.translateDeviceType(this.$nzI18n);
    // 所有设备类型
    this.allEquipmentTypeList = FacilityForCommonUtil.translateEquipmentType(this.$nzI18n);
    // 告警级别
    this.alarmFixedLevelList = AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null);
  }

  public ngOnInit(): void {
    this.initForm();
    this.pageType = this.$active.snapshot.params.type;
    if (this.pageType === OperateTypeEnum.add) {
      // 新建
      this.title = this.language.remoteNotificationAdd;
      // 区域
      this.initAreaConfig();
      // 通知人
      this.initAlarmUserConfig();
    } else {
      this.ifSpin = true;
      // 编辑
      this.title = this.language.remoteNotificationUpdate;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        this.getAlarmData(params.id);
      });
    }
    /*// 初始化设施表格
    RemoteAddUtil.deviceInitTableConfig(this);
    // 初始化设备表格
    RemoteAddUtil.equipmentInitTableConfig(this);*/
  }

  /**
   *  区域配置
   */
  public initAreaConfig(): void {
    const clear = !this.areaList.ids.length;
    this.areaConfig = {
      clear: clear,
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.areaList,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.areaList = event;
        this.areaGtUnit();
        const areaData = this.areaList.ids.map((item, i) => {
          return {'areaId': item, 'areaCode': this.areaList.areaCode[i]};
        });
        this.formStatus.resetControlData('alarmForwardRuleAreaList', areaData);
        if (this.areaList && this.areaList.ids && this.areaList.ids.length) {
          // 清除联动数据
          this.clearLinkage(LinkageEnum.area);
        } else {
          // 当区域为空时 设施类型 通知人禁 空
          this.empty();
        }
      },
    };
  }

  /**
   *  清空区域
   */
  public empty(): void {
    this.clearLinkage(LinkageEnum.area);
  }

  /**
   * 通过区域获取设施类型
   */
  public getDeviceType(): void {
    AlarmUtil.getAreaIdDeviceType(this.$alarmService, this.areaList.ids, this.allDeviceTypeList).then((result: SelectModel[]) => {
      this.authorizeDeviceTypeList = result;
      this.deviceTypeList = this.allDeviceTypeList;
    });
  }

  /**
   * 通过区域获取设备类型
   */
  public getEquipmentType(): void {
    const body: AlarmEquipmentTypeModel = new AlarmEquipmentTypeModel(this.areaList.areaCode, this.deviceTypeListValue);
    AlarmUtil.getAreaCodeEquipmentType(this.$alarmService, body, this.allEquipmentTypeList).then((result: SelectModel[]) => {
      this.authorizeEquipmentTypeList = result;
      this.equipmentTypeList = this.allEquipmentTypeList;
    });
  }

  /**
   * 提交按钮控制
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isSubmit = this.formStatus.getValid();
    });
  }

  /**
   * 告警级别
   */
  public onChangeLevel(): void {
    setTimeout(() => {
      if (this.alarmFixedLevelListValue && !this.alarmFixedLevelListValue.length) {
        this.formStatus.resetControlData('alarmForwardRuleLevels', []);
      }
    }, 0);
  }

  /**
   * 告警级别失去焦点触发事件
   */
  public changeLevel(): void {
    this.formStatus.resetControlData('alarmForwardRuleLevels', this.alarmFixedLevelListValue.map(item => {
      return {'alarmLevelId': item};
    }));
  }

  /**
   * 设施类型
   */
  public onSearchDeviceType(): void {
    setTimeout(() => {
      if (this.deviceTypeListValue && !this.deviceTypeListValue.length) {
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', null);
        this.display.notifierDis = true;
        // 当设施类型为空时
        this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
        this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
        this.initAlarmUserConfig();
      }
      this.display.equipmentTypeDisplay = !(this.deviceTypeListValue && this.deviceTypeListValue.length > 0);
      // 清除联动数据
      this.clearLinkage(LinkageEnum.deviceType);
    }, 0);
  }

  /**
   * 设施类型
   */
  public changeDeviceType(): void {
    // 将值传递给 通知人
    this.alarmNotifierInitialValue = new AlarmNotifierRequestModel(this.alarmNotifierInitialValue.deptList, this.deviceTypeListValue);
    setTimeout(() => {
      // 设施类型选择后 开启通知人
      if (this.deviceTypeListValue && this.deviceTypeListValue.length) {
        this.display.notifierDis = false;
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList',
          this.deviceTypeListValue.map(deviceTypeId => {
            return {'deviceTypeId': deviceTypeId};
          }));
      } else {
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', null);
        this.display.notifierDis = true;
        // 当设施类型为空时
        this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
      }
      this.initAlarmUserConfig();
    }, 0);
  }

  /**
   * 设备类型
   */
  public onSearchEquipmentType(): void {
    setTimeout(() => {
      if (this.equipmentTypeListValue && !this.equipmentTypeListValue.length) {
        this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList', null);
      }
      if (this.equipmentTypeListValue && this.equipmentTypeListValue.length > 0) {
        this.display.deviceAndEquipmentDis = false;
      } else {
        this.display.deviceAndEquipmentDis = true;
      }
      // 清除联动数据
      this.clearLinkage();
    }, 0);
  }

  /**
   * 设备类型
   */
  public changeEquipmentType(): void {
    setTimeout(() => {
      if (this.equipmentTypeListValue && this.equipmentTypeListValue.length) {
        this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList',
          this.equipmentTypeListValue.map(equipmentTypeId => {
            return {'equipmentType': equipmentTypeId};
          }));
      } else {
        this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList', null);
      }
    }, 0);
  }

  /**
   *新增告警
   */
  public submit(): void {
    this.isLoading = true;
    const alarmObj: AlarmRemoteModel = this.formStatus.getData();
    alarmObj.ruleName = alarmObj.ruleName.trim();
    alarmObj.remark = alarmObj.remark && alarmObj.remark.trim();
    // 禁启用状态 需要通过转化
    alarmObj.status = this.isNoStartData ? AlarmEnableStatusEnum.enable : AlarmEnableStatusEnum.disable;
    // 设施类型
    alarmObj.alarmForwardRuleDeviceTypeList = this.deviceTypeListValue.map(deviceTypeId => {
      return {'deviceTypeId': deviceTypeId};
    });
    // 告警级别
    alarmObj.alarmForwardRuleLevels = this.alarmFixedLevelListValue.map(item => {
      return {'alarmLevelId': item};
    });
    // 设施设备
    alarmObj.alarmForwardRuleDeviceList = this.checkDeviceData;
    alarmObj.alarmForwardRuleEquipmentList = this.checkEquipmentData;
    if (alarmObj.alarmForwardRuleDeviceList.length < 1) {
      this.$message.info(this.language.noDevice);
      this.isLoading = false;
      return;
    }
    if (alarmObj.alarmForwardRuleEquipmentList.length < 1) {
      this.$message.info(this.language.noEquipment);
      this.isLoading = false;
      return;
    }
    let requestPath: string = '';
    if (this.pageType === OperateTypeEnum.add) {
      // 新增
      requestPath = 'addAlarmRemote';
    } else {
      // 编辑
      alarmObj.id = this.updateParamsId;
      requestPath = 'updateAlarmRemarkList';
    }
    this.$alarmService[requestPath](alarmObj).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res && res.code === 0) {
        this.$message.success(res.msg);
        this.$router.navigate(['business/alarm/alarm-remote-notification']).then();
      }
    }, err => {
      this.isLoading = false;
    });
  }

  /**
   * 新增远程通知取消
   */
  public cancel(): void {
    this.$router.navigate(['business/alarm/alarm-remote-notification']).then();
  }

  /**
   * 设施设备
   */
  public showDeviceEquipmentTemp(): void {
    this.isVisible = true;
    this.deviceQueryCondition = new QueryConditionModel();
    this.equipmentQueryCondition = new QueryConditionModel();
    this.isShowTable = false;
    setTimeout(() => {
      this.isShowTable = true;
      // 初始化设施表格
      RemoteAddUtil.deviceInitTableConfig(this);
      // 初始化设备表格
      RemoteAddUtil.equipmentInitTableConfig(this);
      this.getDeviceData();
      this.getEquipmentData();
    }, 5);
  }

  /**
   * 关闭设施设备弹框
   */
  public close(): void {
    this.isVisible = false;
  }

  /**
   * 设施分页显示
   */
  public devicePageChange(event: PageModel): void {
    this.deviceQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getDeviceData();
  }

  /**
   * 设施分页显示
   */
  public equipmentPageChange(event: PageModel): void {
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getEquipmentData();
  }

  /**
   * 设施设备确认
   */
  public sureClick(): void {
    const deviceData = this.checkDeviceData;
    const equipmentData = this.checkEquipmentData;
    const resultData = [];
    if (deviceData && deviceData.length > 0) {
      deviceData.forEach(item => {
        resultData.push(item.deviceName);
      });
    }
    if (equipmentData && equipmentData.length > 0) {
      equipmentData.forEach(item => {
        resultData.push(item.equipmentName);
      });
    }
    // 展示的值
    this.deviceEquipmentName = resultData.join(',');
    this.isVisible = false;
    this.formStatus.resetControlData('deviceEquipment', this.deviceEquipmentName);
  }

  /**
   * 设施设备取消
   */
  public cancelModal(): void {
    this.deviceQueryCondition.filterConditions = [];
    this.isVisible = false;
  }

  /**
   * 清空设备设施
   */
  public clearSelectData(): void {
    this.checkDeviceData = [];
    this.checkEquipmentData = [];
    this.selectedDeviceData = [];
    this.selectedEquipmentData = [];
    this.deviceEquipmentName = '';
    this.formStatus.resetControlData('deviceEquipment', '');
    this.isShowTable = false;
    setTimeout(() => {
      this.isShowTable = true;
      // 初始化设施表格
      RemoteAddUtil.deviceInitTableConfig(this);
      // 初始化设备表格
      RemoteAddUtil.equipmentInitTableConfig(this);
      this.getDeviceData();
      this.getEquipmentData();
    }, 5);
  }

  /**
   * 设施下拉框事件
   */
  public showAuthorizeDevices(): void {
    this.deviceTypeList = this.authorizeDeviceTypeList;
  }

  /**
   * 设备下拉框事件
   */
  public showAuthorizeEquipment(): void {
    this.equipmentTypeList = this.authorizeEquipmentTypeList;
  }

  /**
   * 表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        label: this.language.name,
        key: 'ruleName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          {maxLength: 32},
          RuleUtil.getNamePatternRule(this.commonLanguage.namePattenMsg),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 区域
        label: this.language.area,
        key: 'alarmForwardRuleAreaList', type: 'custom',
        template: this.areaSelector,
        require: true,
        rule: [{required: true}], asyncRules: [],
      },
      {
        // 设施类型
        label: this.language.alarmSourceType, key: 'alarmForwardRuleDeviceTypeList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.deviceTypeTemp,
      },
      {
        // 设备类型
        label: this.language.equipmentType, key: 'alarmForwardRuleEquipmentTypeList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.equipmentTypeTemp,
      },
      {
        // 设施设备
        label: this.language.deviceEquipment,
        key: 'deviceEquipment',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.deviceEquipmentTemp,
      },
      {
        // 通知人
        label: this.language.notifier,
        key: 'alarmForwardRuleUserList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.notifierTemp,
      },
      {
        // 告警级别
        label: this.language.alarmFixedLevel,
        key: 'alarmForwardRuleLevels',
        type: 'custom',
        require: true,
        rule: [{required: true}], asyncRules: [],
        template: this.alarmFixedLevelListTemp,
      },
      {
        // 是否启用
        label: this.language.openStatus,
        key: 'status',
        type: 'custom',
        template: this.isNoStartUsing,
        initialValue: this.isNoStartData,
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        radioInfo: {
          type: 'select', selectInfo: [
            {label: this.language.disable, value: AlarmEnableStatusEnum.disable},
            {label: this.language.enable, value: AlarmEnableStatusEnum.enable},
          ],
        },
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 获取设施数据
   */
  private getDeviceData(): void {
    this.deviceTableConfig.isLoading = true;
    // 设备类型过滤条件
    const filterData = new FilterCondition('deviceType', OperatorEnum.in, this.deviceTypeListValue);
    // 区域过滤条件
    const areaFilterData = new FilterCondition('areaId', OperatorEnum.in, this.areaList.ids);
    // 查询时是否存在设施条件
    const obj = this.deviceQueryCondition.filterConditions.find(v => {
      return v.filterField === 'deviceType';
    });
    if (!obj) {
      this.deviceQueryCondition.filterConditions.push(filterData);
    }
    this.deviceQueryCondition.filterConditions.push(areaFilterData);
    // 获取设施数据
    this.$alarmService.queryDevice(this.deviceQueryCondition).subscribe((res: ResultModel<FacilityListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.devicePageBean.Total = res.totalCount;
        this.devicePageBean.pageIndex = res.pageNum;
        this.devicePageBean.pageSize = res.size;
        this.deviceData = res.data || [];
        this.deviceTableConfig.isLoading = false;
        this.deviceData.forEach(item => {
          item.iconClass = CommonUtil.getFacilityIconClassName(item.deviceType);
          item.deviceStatusIconClass = CommonUtil.getDeviceStatusIconClass(item.deviceStatus).iconClass;
          item.deviceStatusColorClass = CommonUtil.getDeviceStatusIconClass(item.deviceStatus).colorClass;
        });
      }
    }, () => {
      this.deviceTableConfig.isLoading = false;
    });
  }

  /**
   * 获取设备数据
   */
  private getEquipmentData(): void {
    this.equipmentTableConfig.isLoading = true;
    // 设备类型查询条件
    const filterData = new FilterCondition('equipmentType', OperatorEnum.in, this.equipmentTypeListValue);
    // 区域查询条件
    const areaFilterData = new FilterCondition('areaId', OperatorEnum.in, this.areaList.ids);
    // 过滤是否存在设备类型
    const obj = this.equipmentQueryCondition.filterConditions.find(v => {
      return v.filterField === 'equipmentType';
    });
    if (!obj) {
      this.equipmentQueryCondition.filterConditions.push(filterData);
    }
    this.equipmentQueryCondition.filterConditions.push(areaFilterData);
    this.$alarmService.queryEquipment(this.equipmentQueryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.equipmentPageBean.Total = res.totalCount;
        this.equipmentPageBean.pageIndex = res.pageNum;
        this.equipmentPageBean.pageSize = res.size;
        this.equipmentData = res.data || [];
        this.equipmentData.forEach(item => {
          item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
          item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
          // 设置状态样式
          const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
          item.statusIconClass = iconStyle.iconClass;
          item.statusColorClass = iconStyle.colorClass;
          item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
        });
        this.equipmentTableConfig.isLoading = false;
      }
    }, () => {
      this.equipmentTableConfig.isLoading = false;
    });
  }

  /**
   *  通知人配置
   */
  private initAlarmUserConfig(): void {
    const clear = !this.checkAlarmNotifier.ids.length;
    this.alarmUserConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      clear: clear,
      disabled: this.display.notifierDis,
      condition: this.alarmNotifierInitialValue,
      initialValue: this.checkAlarmNotifier,
      handledCheckedFun: (event) => {
        this.checkAlarmNotifier = event;
        this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
      },
    };
  }

  /**
   * 回显告警远程通知数据
   */
  private getAlarmData(id: string): void {
    this.ifSpin = true;
    this.$alarmService.queryAlarmRemoteById(id).subscribe((res: ResultModel<AlarmRemoteModel>) => {
      if (res.code === 0) {
        const resultData = [];
        const areaIds = [];
        const alarmData = res.data[0];
        this.selectedDeviceData = alarmData.alarmForwardRuleDeviceList;
        this.selectedEquipmentData = alarmData.alarmForwardRuleEquipmentList;
        this.display = {
          deviceTypeDisplay: false,
          notifierDis: false,
          equipmentTypeDisplay: false,
          deviceAndEquipmentDis: false,
        };
        // 区域
        if (alarmData.alarmForwardRuleAreaList && alarmData.alarmForwardRuleAreaList.length) {
          this.areaList = {
            ids: alarmData.alarmForwardRuleAreaList.map(area => area.areaId),
            name: '',
            areaCode: alarmData.alarmForwardRuleAreaList.map(area => area.areaCode),
          };
          // 通过区域获取单位
          this.areaGtUnit();
          // 通过区域获取设施类型
          this.getDeviceType();
        }
        // 过滤区域重复的id
        alarmData.alarmForwardRuleAreaList.forEach(item => {
          if (areaIds.indexOf(item.areaId) === -1) {
            areaIds.push(item.areaId);
          }
        });
        alarmData.alarmForwardRuleAreaName = [];
        // 通过AreaID获取AreaName
        AlarmUtil.getAreaName(this.$alarmService, areaIds).then((result: AreaModel[]) => {
          AlarmUtil.joinAlarmForwardRuleAreaName([this.alarmRemoteData], result);
          this.areaList.name = this.alarmRemoteData.areaName;
        });
        // 区域
        this.initAreaConfig();
        setTimeout(() => {
          // 设施类型
          if (alarmData.alarmForwardRuleDeviceTypeList && alarmData.alarmForwardRuleDeviceTypeList.length) {
            this.deviceTypeListValue = alarmData.alarmForwardRuleDeviceTypeList.map(deviceType => deviceType.deviceTypeId);
            this.changeDeviceType();
          }
        }, 0);
        setTimeout(() => {
          // 给通知人赋值
          if (alarmData.alarmForwardRuleUserList && alarmData.alarmForwardRuleUserList.length
            && alarmData.alarmForwardRuleUserName && alarmData.alarmForwardRuleUserName.length
            && this.alarmNotifierInitialValue.deptList.length && this.alarmNotifierInitialValue.deviceTypes.length) {
            this.checkAlarmNotifier = {
              name: alarmData.alarmForwardRuleUserName.join(','),
              ids: alarmData.alarmForwardRuleUserList,
            };
            // 通知人
            this.initAlarmUserConfig();
          }
        }, 1000);
        // 告警级别
        if (alarmData.alarmForwardRuleLevels && alarmData.alarmForwardRuleLevels.length) {
          this.alarmFixedLevelListValue = alarmData.alarmForwardRuleLevels.map(level => level.alarmLevelId);
          alarmData.alarmForwardRuleLevels = this.alarmFixedLevelListValue;
        }
        // 启用 禁用状态
        if (alarmData.status) {
          this.isNoStartData = alarmData.status === AlarmEnableStatusEnum.enable;
        }
        // 设施设备
        this.checkDeviceData = alarmData.alarmForwardRuleDeviceList;
        this.checkEquipmentData = alarmData.alarmForwardRuleEquipmentList;
        if (alarmData.alarmForwardRuleDeviceList && alarmData.alarmForwardRuleDeviceList.length > 0) {
          alarmData.alarmForwardRuleDeviceList.forEach(item => {
            resultData.push(item.deviceName);
          });
        }
        if (alarmData.alarmForwardRuleEquipmentList && alarmData.alarmForwardRuleEquipmentList.length > 0) {
          alarmData.alarmForwardRuleEquipmentList.forEach(item => {
            resultData.push(item.equipmentName);
          });
        }
        this.deviceEquipmentName = resultData.join(',');
        // 设备类型
        setTimeout(() => {
          if (alarmData.alarmForwardRuleEquipmentTypeList && alarmData.alarmForwardRuleEquipmentTypeList.length) {
            this.equipmentTypeListValue = alarmData.alarmForwardRuleEquipmentTypeList.map(equipmentType => equipmentType.equipmentType);
            this.changeEquipmentType();
            this.getEquipmentType();
          }
        }, 0);
        // 回显表单
        this.alarmRemoteData = alarmData;
        this.formStatus.resetData(alarmData);
        this.formStatus.resetControlData('deviceEquipment', this.deviceEquipmentName);
        /*// 初始化设施表格
        RemoteAddUtil.deviceInitTableConfig(this);
        // 初始化设备表格
        RemoteAddUtil.equipmentInitTableConfig(this);*/
        this.ifSpin = false;
      }
    }, () => {
      this.ifSpin = false;
    });
  }

  /**
   * 清除联动数据
   */
  private clearLinkage(type?: LinkageEnum): void {
    // 区域发生改变
    if (type === LinkageEnum.area) {
      this.display.deviceTypeDisplay = false;
      this.display.equipmentTypeDisplay = true;
      this.display.deviceAndEquipmentDis = true;
      // 通过区域获取设施类型
      this.getDeviceType();
      // 勾选的通知人
      this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
      this.display.notifierDis = true;
      this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
      this.initAlarmUserConfig();
      // 当区域的值改变时, 设施类型的值 重新选择
      this.deviceTypeListValue = [];
      this.equipmentTypeListValue = [];
      this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', this.deviceTypeListValue);
      this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList', this.equipmentTypeListValue);
    } else if (type === LinkageEnum.deviceType) {
      // 设施类型发生改变
      this.equipmentTypeListValue = [];
      this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList', '');
      this.getEquipmentType();
      // 设施设备展示的值
      this.display.deviceAndEquipmentDis = true;
    }
    // 设施设备选中数据清空
    this.checkDeviceData = [];
    this.checkEquipmentData = [];
    // 设施设备展示的值
    this.deviceEquipmentName = '';
    this.formStatus.resetControlData('deviceEquipment', '');
    /*// 初始化设施表格
    RemoteAddUtil.deviceInitTableConfig(this);
    // 初始化设备表格
    RemoteAddUtil.equipmentInitTableConfig(this); */
  }

  /**
   * 通过选择的区域 获取单位
   */
  private areaGtUnit(): void {
    this.$alarmService.areaGtUnit(this.areaList.ids).subscribe((data: ResultModel<AlarmRemoteAreaModel[]>) => {
      if (data.code === ResultCodeEnum.success) {
        if (data.data && data.data.length) {
          this.alarmNotifierInitialValue.deptList = data.data.map(item => item.deptId);
        } else {
          setTimeout(() => {
            this.areaList = new AlarmSelectorInitialValueModel();
            this.initAreaConfig();
            this.display.deviceTypeDisplay = true;
            this.display.equipmentTypeDisplay = true;
            this.deviceTypeListValue = [];
            this.equipmentTypeListValue = [];
            // 勾选的通知人
            this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
            this.display.notifierDis = true;
            this.initAlarmUserConfig();
          }, 0);
          this.$message.info(this.language.noResponsibleEntityIsAssociatedWithTheSelectedArea);
        }
      }
    });
  }
}
