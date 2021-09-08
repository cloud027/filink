import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmService} from '../../../../share/service/alarm.service';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {TreeSelectorComponent} from '../../../../../../shared-module/component/tree-selector/tree-selector.component';
import {TreeSelectorConfigModel} from '../../../../../../shared-module/model/tree-selector-config.model';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {SessionUtil} from '../../../../../../shared-module/util/session-util';
import {FacilityForCommonUtil} from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderForCommonService} from '../../../../../../core-module/api-service/work-order/work-order-for-common.service';
import {FacilityForCommonService} from '../../../../../../core-module/api-service/facility/facility-for-common.service';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {SelectModel} from '../../../../../../shared-module/model/select.model';
import {AlarmOrderModel} from '../../../../share/model/alarm-order.model';
import {AlarmEnableStatusEnum, AlarmIsConfirmEnum, AlarmTriggerTypeEnum, AlarmWorkOrderTypeEnum} from '../../../../share/enum/alarm.enum';
import {DepartmentUnitModel} from '../../../../../../core-module/model/work-order/department-unit.model';
import {AreaModel} from '../../../../../../core-module/model/facility/area.model';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {CommonUtil} from "../../../../../../shared-module/util/common-util";

/**
 * 告警设置-告警转工单 新增和编辑页面
 */
@Component({
  selector: 'app-work-order-add',
  templateUrl: './work-order-add.component.html',
  styleUrls: ['./work-order-add.component.scss'],
})

export class WorkOrderAddComponent implements OnInit {
  // 是否启用
  @ViewChild('isNoStartUsing') private isNoStartUsing;
  // 告警名称
  @ViewChild('alarmName') private alarmName;
  // 区域
  @ViewChild('areaSelector') private areaSelector;
  // 设施类型
  @ViewChild('deviceTypeTemp') private deviceTypeTemp;
  // 责任单位
  @ViewChild('accountabilityUnit') private accountabilityUnitTep;
  // 责任单位选择器
  @ViewChild('unitTreeSelector') private unitTreeSelector: TreeSelectorComponent;
  // 设备类型
  @ViewChild('equipmentTypeTemp') private equipmentTypeTemp: TemplateRef<any>;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 历史告警设置表单项
  public formColumn: FormItem[] = [];
  // 历史告警表单项实例
  public formStatus: FormOperate;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 设施语言包
  public facilityLanguage: FacilityLanguageInterface;
  // 启用状态 默认 启用
  public isNoStartData: boolean = true;
  // 保存按钮加载中
  public isLoading: boolean = false;
  // 标题
  public title: string = '';
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 权域设施类型
  public deviceTypeList: SelectModel[] = [];
  // 选中的设施类型
  public deviceTypeListValue: SelectModel[] = [];
  // 权域下的设备类型
  public equipmentTypeList: SelectModel[] = [];
  // 选中设备类型
  public equipmentTypeListValue: string[] = [];
  // 责任单位禁用
  public unitDisabled: boolean = false;
  // 责任单位显示隐藏
  public isVisible: boolean = false;
  // 责任单位树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 已选择责任单位名称
  public selectUnitName: string = '';
  // 区域名称
  public areaName: string = '';
  // 单位弹窗展示
  public areaSelectVisible: boolean = false;
  // 区域选择器配置信息
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 控制提交按钮
  public isSubmit: boolean;
  // 页面类型
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 区域Id
  private areaId: string[] = [];
  // 区域code
  private areaCode: string[] = [];
  // 区域选择节点
  private areaNodes: AreaModel[] = [];
  // 勾选的告警名称
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 编辑id
  private updateParamsId: string;
  // 责任单位数据
  private treeNodes: DepartmentUnitModel[] = [];
  // 责任单位回显
  private echoDepartment: string;
  // 责任单位回显控制
  private department: string[] = [];
  // 单位code
  private departmentCode: string;
  // 用户id
  private userId: string;
  // 告警转工单数据
  private alarmOrderData: AlarmOrderModel;

  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $alarmService: AlarmService,
    private $ruleUtil: RuleUtil,
    private $facilityForCommonService: FacilityForCommonService,
    private $inspectionService: WorkOrderForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  public ngOnInit(): void {
    // 初始化责任单位下拉树
    this.initTreeSelectorConfig();
    // 初始化表单
    this.initForm();
    // 通过路由获取页面类型
    this.pageType = this.$active.snapshot.params.type;
    // 获取用户信息
    if (SessionUtil.getToken()) {
      this.userId = SessionUtil.getUserInfo().id;
    }
    // 权域下的设施类型
    this.deviceTypeList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 权域下的设备类型
    this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    if (this.pageType === OperateTypeEnum.add) {
      // 新增
      this.title = this.language.workOrderAdd;
      // 告警名称
      this.initAlarmName();
      // 获取区域列表
      this.$facilityForCommonService.queryAreaList().subscribe((res: ResultModel<AreaModel[]>) => {
        this.areaNodes = res.data || [];
        this.initAreaSelectorConfig();
      });
    } else {
      // 编辑
      this.title = this.language.workOrderUpdate;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        this.getAlarmData(params.id);
      });
    }
  }

  /**
   * 提交按钮控制
   */
  public formInstance(event: { instance: FormOperate }) {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isSubmit = this.formStatus.getValid();
    });
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(): void {
    this.queryDeptList().then(deptData => {
      if (deptData) {
        this.treeSelectorConfig.treeNodes = this.treeNodes;
        this.isVisible = true;
      }
    });
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]) {
    this.selectUnitName = '';
    // 责任单位回显
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.id;
    });
    // 获取责任单位code
    if (event[0]) {
      this.departmentCode = event[0].deptCode;
    } else {
      this.departmentCode = '';
    }
    // 责任单位名称展示
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    // 勾选责任单位
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, selectArr);
    if (selectArr.length === 0) {
      this.echoDepartment = '';
    } else {
      this.echoDepartment = selectArr[0];
    }
    this.formStatus.resetControlData('departmentId', selectArr[0]);
  }

  /**
   * 取消
   */
  public cancel(): void {
    this.$router.navigate(['business/alarm/alarm-work-order']).then();
  }

  /**
   *设施类型改变时
   */
  public deviceTypeChange(event: string[]) {
    this.formStatus.resetControlData('deviceType', event);
  }

  /**
   * 设施类型改变时
   */
  public onSearchEquipmentType(event: string[]) {
    this.formStatus.resetControlData('alarmOrderRuleEquipmentTypeList', event);
  }

  /**
   *新增告警
   */
  public submit(): void {
    this.isLoading = true;
    const alarmObj: AlarmOrderModel = this.formStatus.getData();
    alarmObj.orderName = alarmObj.orderName.trim();
    alarmObj.remark = alarmObj.remark && alarmObj.remark.trim();
    // 禁启用状态 需要通过转化
    alarmObj.status = this.isNoStartData ? AlarmEnableStatusEnum.enable : AlarmEnableStatusEnum.disable;
    alarmObj.departmentCode = this.departmentCode;
    alarmObj.departmentName = this.selectUnitName;
    // 设施类型
    alarmObj.alarmOrderRuleDeviceTypeList = this.deviceTypeListValue.map(deviceTypeId => {
      return {'deviceTypeId': deviceTypeId};
    });
    alarmObj.alarmOrderRuleEquipmentTypeList = this.equipmentTypeListValue.map(equipmentTypeId => {
      return {'equipmentTypeId': equipmentTypeId};
    });
    let requestPath: string = '';
    if (this.pageType === OperateTypeEnum.add) {
      // 新增
      requestPath = 'addAlarmWork';
    } else {
      // 修改
      alarmObj.id = this.updateParamsId;
      requestPath = 'updateAlarmWork';
    }
    this.$alarmService[requestPath](alarmObj).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res && res.code === 0) {
        this.$message.success(res.msg);
        this.$router.navigate(['business/alarm/alarm-work-order']).then();
      }
    }, error => {
      this.isLoading = false;
    });
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(): void {
    FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaId.toString(), null);
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 区域选中结果
   * param event
   */
  public areaSelectChange(event: AreaModel): void {
    if (event[0]) {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId, null);
      this.areaName = event[0].areaName;
      this.areaId = [event[0].areaId];
      this.areaCode = [event[0].areaCode];
      this.formStatus.resetControlData('alarmOrderRuleArea', [event[0].areaId]);
      // 清空责任单位
      this.selectUnitName = '';
      this.echoDepartment = '';
      this.formStatus.resetControlData('departmentId', null);
    } else {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
      this.areaName = '';
      this.areaId = [];
      this.formStatus.resetControlData('alarmOrderRuleArea', null);
    }
  }
  /**
   * 初始化区域选择器配置
   * param nodes
   */
  private initAreaSelectorConfig(): void {
    this.areaSelectorConfig = {
      title: this.language.area,
      width: '500px',
      height: '300px',
      treeNodes: this.areaSelectorConfig.treeNodes,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all',
        },
        data: {
          simpleData: {
            enable: false,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName',
          },
        },
        view: {
          showIcon: false,
          showLine: false,
        },
      },
      onlyLeaves: false,
      selectedColumn: [],
    };
  }

  /**
   * 初始化责任单位树选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSelectorConfig = {
      title: this.language.selectUnit,
      width: '500px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all',
        },
        data: {
          simpleData: {
            enable: false,
            idKey: 'id',
          },
          key: {
            name: 'deptName',
            children: 'childDepartmentList',
          },
        },
        view: {
          showIcon: false,
          showLine: false,
        },
      },
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.facilityLanguage.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.facilityLanguage.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.facilityLanguage.parentDept}`, key: 'parentDepartmentName', width: 100,
        },
      ],
    };
  }

  /**
   * 根据区域ID查询责任单位
   */
  private queryDeptList(): Promise<DepartmentUnitModel[]> {
    return new Promise((resolve, reject) => {
      if (this.areaId && this.areaId.length > 0) {
        this.$inspectionService.alarmQueryResponsibilityUnit(this.areaId).subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
          if (result.code === ResultCodeEnum.success) {
            const arrDept = result.data || [];
            this.department = [];
            this.department.push(this.echoDepartment);
            FacilityForCommonUtil.setTreeNodesStatus(arrDept, this.department);
            this.department = [];
            this.treeNodes = arrDept;
            resolve(arrDept);
          }
        });
      } else {
        this.isVisible = false;
        this.$message.info(`${this.commonLanguage.pleaseSelectTheAreaInformationFirstTip}`);
      }
    });
  }

  /**
   * 告警名称配置
   */
  private initAlarmName(): void {
    this.alarmNameConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.checkAlarmName,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
        this.formStatus.resetControlData('alarmOrderRuleNameList', event.ids);
      },
    };
  }

  /**
   * 编辑时回显数据
   */
  private getAlarmData(id: string): void {
    this.$alarmService.queryAlarmWorkById(id).subscribe((res: ResultModel<AlarmOrderModel>) => {
      if (res.code === 0) {
        const alarmData = res.data[0];
        const areaIds = [];
        // 设置告警名称
        if (alarmData.alarmOrderRuleNameList && alarmData.alarmOrderRuleNameList.length) {
          const alarmName = alarmData.alarmOrderRuleNames.join(',');
          this.checkAlarmName = new AlarmSelectorInitialValueModel(alarmName, alarmData.alarmOrderRuleNameList);
          this.formStatus.resetControlData('alarmOrderRuleNameList', alarmData.alarmOrderRuleNameList);
        }
        // 过滤重复的区域id
        alarmData.alarmOrderRuleArea.forEach(areaId => {
          if (areaIds.indexOf(areaId) === -1) {
            areaIds.push(areaId);
          }
        });
        alarmData.alarmOrderRuleAreaName = [];
        // 通过AreaID获取AreaName
        AlarmUtil.getAreaName(this.$alarmService, areaIds).then((result: AreaModel[]) => {
          AlarmUtil.joinAlarmWorkOrderForwardRuleAreaName([this.alarmOrderData], result);
          this.checkAlarmName.name = this.alarmOrderData.areaName;
          // 展示的区域名称
          this.areaName = this.alarmOrderData.areaName;
          this.areaCode = result.map(item => item.areaCode);
        });
        // 告警名称
        this.initAlarmName();
        // 设施类型
        if (alarmData.alarmOrderRuleDeviceTypeList && alarmData.alarmOrderRuleDeviceTypeList.length) {
          this.deviceTypeListValue = alarmData.alarmOrderRuleDeviceTypeList.map(deviceType => deviceType.deviceTypeId);
          alarmData.deviceType = this.deviceTypeListValue;
        }
        // 设备类型
        if (alarmData.alarmOrderRuleEquipmentTypeList && alarmData.alarmOrderRuleEquipmentTypeList.length) {
          this.equipmentTypeListValue = alarmData.alarmOrderRuleEquipmentTypeList.map(equipmentType => equipmentType.equipmentTypeId);
          alarmData.deviceType = this.deviceTypeListValue;
        }
        // 启用 禁用状态
        if (alarmData.status) {
          this.isNoStartData = alarmData.status === AlarmEnableStatusEnum.enable;
        }
        // 区域
        if (alarmData.alarmOrderRuleArea && alarmData.alarmOrderRuleArea.length) {
          this.$facilityForCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
            this.areaNodes = result.data || [];
            // 勾选数据
            FacilityForCommonUtil.setTreeNodesStatus(this.areaNodes, alarmData.alarmOrderRuleArea);
            this.initAreaSelectorConfig();
          });
        }
        // 是否自动派单
        alarmData.autoDispatch = (alarmData.autoDispatch === AlarmIsConfirmEnum.yes) ? alarmData.autoDispatch : AlarmIsConfirmEnum.no;
        this.alarmOrderData = alarmData;
        this.formStatus.resetData(alarmData);
        // 展示责任单位名称
        this.selectUnitName = res.data[0].departmentName;
        // 传递给后台的责任单位code
        this.departmentCode = res.data[0].departmentCode;
        // 选择区域
        this.areaId = res.data[0].alarmOrderRuleArea;
        // 选择责任单位
        this.echoDepartment = res.data[0].departmentId;
      }
    });
  }

  /**
   * 表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 名称
        label: this.language.name,
        key: 'orderName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getNamePatternRule(this.commonLanguage.namePattenMsg),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule((value) => {
            return this.$inspectionService.queryAlarmNameExist(CommonUtil.trim(value));
          }, (res) => res.data)
        ],
      },
      {
        // 告警名称
        label: this.language.alarmName,
        key: 'alarmOrderRuleNameList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.alarmName,
      },
      {
        // 工单类型
        label: this.language.workOrderType,
        key: 'orderType',
        type: 'select',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        selectInfo: {
          data: [
            {label: this.language.eliminateWork, value: AlarmWorkOrderTypeEnum.eliminateWork},
          ],
          label: 'label',
          value: 'value',
        },
      },
      {
        // 区域
        label: this.language.area,
        key: 'alarmOrderRuleArea', type: 'custom',
        template: this.areaSelector,
        require: true,
        rule: [{required: true}], asyncRules: [],
      },
      {
        // 设施类型
        label: this.language.alarmSourceType, key: 'deviceType',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.deviceTypeTemp,
      },
      {
        // 设备类型
        label: this.language.equipmentType, key: 'alarmOrderRuleEquipmentTypeList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.equipmentTypeTemp,
      },
      {
        // 触发条件
        label: this.language.triggerCondition,
        key: 'triggerType',
        type: 'select',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        selectInfo: {
          data: [
            {label: this.language.alarmHappenedTrigger, value: AlarmTriggerTypeEnum.alarmHappenedTrigger},
          ],
          label: 'label',
          value: 'value',
        },
      },
      {
        // 期待完工时长(天)
        label: this.language.expectAccomplishTime,
        key: 'completionTime',
        type: 'input',
        require: true,
        initialValue: 3,
        rule: [
          {required: true},
          {min: 1},
          {max: 365},
          {
            pattern: /^\+?[1-9][0-9]*$/,
            msg: this.language.positiveInteger,
          },
        ],
      },
      {
        // 是否启用
        label: this.language.openStatus,
        key: 'status',
        type: 'custom',
        template: this.isNoStartUsing,
        initialValue: this.isNoStartData,
        require: true,
        rule: [],
        asyncRules: [],
        radioInfo: {
          type: 'select', selectInfo: [
            {label: this.language.disable, value: AlarmEnableStatusEnum.disable},
            {label: this.language.enable, value: AlarmEnableStatusEnum.enable},
          ],
        },
      },
      { // 是否自动派单
        label: this.language.isAutoDispatch,
        key: 'autoDispatch', type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: AlarmIsConfirmEnum.no,
        radioInfo: {
          data: [
            {label: this.language.yes, value: AlarmIsConfirmEnum.yes}, // 是
            {label: this.language.no, value: AlarmIsConfirmEnum.no}, // 否
          ],
          label: 'label', value: 'value'
        },
      },
      {
        // 责任单位
        label: this.language.responsibleUnit,
        key: 'departmentId',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.accountabilityUnitTep,
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
}
