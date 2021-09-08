import {Component, OnInit, ViewChild, OnDestroy, TemplateRef} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {InspectionDetailUtil} from './inspection-work-order-detail.util';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {ActivatedRoute, Router} from '@angular/router';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {MapSelectorConfigModel} from '../../../../shared-module/model/map-selector-config.model';
import {MapSelectorInspectionComponent} from '../../../../shared-module/component/map-selector/map-selector-inspection/map-selector-inspection.component';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {IsSelectAllEnum, IsSelectAllItemEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TemplateModalModel} from '../../share/model/template/template-modal.model';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {SelectTemplateModel} from '../../share/model/template/select-template.model';
import {DeviceFormModel} from '../../../../core-module/model/work-order/device-form.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionWorkOrderDetailModel} from '../../share/model/inspection-model/inspection-work-order-detail.model';
import {EquipmentFormModel} from '../../../../core-module/model/work-order/equipment-form.model';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {WorkOrderMapTypeEnum} from '../../share/enum/work-order-map-type.enum';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {AreaModel} from '../../../../core-module/model/facility/area.model';

/**
 * 未完工巡检工单新增修改页面
 */
@Component({
  selector: 'app-inspection-work-order-detail',
  templateUrl: './inspection-work-order-detail.component.html',
  styleUrls: ['./inspection-work-order-detail.component.scss']
})
export class InspectionWorkOrderDetailComponent implements OnInit, OnDestroy {
  // 巡检开始时间模板
  @ViewChild('inspectionStartDate') public inspectionStartDate: TemplateRef<any>;
  // 巡检结束时间模板
  @ViewChild('inspectionEndDate') public inspectionEndDate: TemplateRef<any>;
  // 区域选择模板
  @ViewChild('areaSelector') public areaSelector: TemplateRef<any>;
  // 单位选择模板
  @ViewChild('departmentSelector') public departmentSelector: TemplateRef<any>;
  // 巡检设施
  @ViewChild('inspectionFacilitiesSelector') public inspectionFacilitiesSelector: TemplateRef<any>;
  // 巡检设施地图
  @ViewChild('mapSelectorInspection') public mapSelectorInspection: MapSelectorInspectionComponent;
  // 巡检模板
  @ViewChild('inspectionTemplate') public inspectionTemplate: TemplateRef<any>;
  // 选择巡检模板
  @ViewChild('selectInspectionTemp') public selectInspectionTemp: TemplateRef<any>;
  // 巡检设备地图
  @ViewChild('inspectionEquipmentSelector') public inspectionEquipmentSelector: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentListTemp') public equipmentListTemp: TemplateRef<any>;
  // 自动派单
  @ViewChild('autoDispatch') public autoDispatch: TemplateRef<any>;
  // 备注是否可修改
  public remarkDisabled: boolean;
  // form表单配置
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 单位选择器
  public areaSelectorConfig: any = new TreeSelectorConfigModel();
  // 树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 责任单位弹框
  public isUnitVisible: boolean = false;
  // 责任人单位title值
  public departmentSelectorName: string = '';
  // 巡检设施title值
  public inspectionFacilitiesSelectorName: string = '';
  // 责任人单位模板button属性绑定
  public departmentSelectorDisabled: boolean = false;
  // 巡检设施模板button属性绑定
  public inspectionFacilitiesSelectorDisabled = true;
  // 页面标题
  public pageTitle: string;
  // 设施类型
  public deviceType: string = '';
  // 列表初始加载图标
  public isLoading: boolean = false;
  // 区域名称
  public areaName: string = '';
  // 区域ID
  public areaId: string = null;
  // 区域id备份
  public inspectAreaId: string;
  // 区域id备份供巡检设施使用
  public inspectAreaIdDevice: string;
  // 责任单位
  public deptList: DepartmentUnitModel[] = [];
  // 巡检设施
  public deviceList: DeviceFormModel[] = [];
  // 巡检设备
  public equipList: EquipmentFormModel[] = [];
  // 巡检设施列表
  public mapSelectorConfig: MapSelectorConfigModel;
  // 设备map配置
  public equipmentMapSelectorConfig: MapSelectorConfigModel;
  // 巡检设施弹框
  public mapVisible: boolean = false;
  // 设备弹窗
  public mapEquipmentVisible: boolean = false;
  // 区域选择器弹框
  public areaSelectVisible: boolean = false;
  // 判断页面是否可修改
  public disabledIf: boolean;
  // 设备类型是否可选
  public equipDisabled: boolean = true;
  // 是否巡检全集
  public isSelectAll: string;
  // 表单校验
  public isFormDisabled: boolean;
  // 存储双重过滤后的设施数据
  public facilityData;
  // 区域信息
  public areaInfo: AreaModel;
  // 区域可操作
  public areaDisabled: boolean;
  // 设施列表数据
  public deviceSet: string[] = [];
  // 巡检设施类型
  public inspectDeviceType: string[] = [];
  // 模板名称
  public tempName: string = '';
  // 按钮显示
  public tempNameDisabled: boolean;
  // 选择设备名称
  public inspectEquipmentName: string = '';
  // 按钮隐藏
  public inspectEquipmentDisabled: boolean = false;
  // 参数
  public modalData: TemplateModalModel;
  // 弹窗显示
  public tempSelectVisible: boolean = false;
  // 设备类型集合
  public equipmentSelectList: {label: string; code: any }[] = [];
  public equipmentListValue: string[] = [];
  // 打开的设施或设备地图类型
  public selectMapType: string = '';
  // 巡检或销障地图类型
  public selectorType: string;
  // 设施id集合
  public deviceIdList: string[] = [];
  // 设备类型
  public equipmentTypes: string[] = [];
  // 已选择数据
  public hasSelectData: string[] = [];
  // 区域code
  public deviceAreaCode: string;
  // 自动派单
  public dispatchEnum = IsSelectAllEnum;
  public dispatchValue: string = IsSelectAllEnum.deny;
  public isDispatch: boolean = false;
  // 是否有选择巡检全集 (配置文件引用，勿删！！)
  private isChooseAll: boolean = false;
  // 是否选择设施
  private isChooseDevice: boolean = false;
  // 页面来源
  private pageRoute: string = '';
  // 修改时存放责任单位
  private updateDeptList: DepartmentUnitModel[] = [];
  // 修改时存放巡检设施
  private updateDeviceList: DeviceFormModel[] = [];
  // 获取当前日期
  private today = new Date();
  // 单位id
  private deptId: string;
  // 选择设备类型名称
  private selectEquipmentName: string = '';
  // 页面类型
  private pageType: string;
  // 单位树
  private unitTreeNodes: NzTreeNode[] = [];
  // 设施类型 (配置文件引用，勿删！！)
  private InquireDeviceTypes = [];
  // 工单ID
  private procId: string = '';
  // 工单状态
  private status: string;
  // 接收起始时间Value值
  private dateStart: number;
  // 接受结束时间Value值 (配置文件引用，勿删！！)
  private dateEnd: number;
  // 巡检区域ID
  private inspectionAreaId: string;
  // 设施类型是否可选
  private deviceDisabled: boolean = false;
  // 巡检全集是否可编辑
  private disabledSelect: boolean = true;
  // 责任单位名称集合
  private selectArr: string[] = [];
  // 区域节点数据
  private areaNodes: AreaModel[] = [];
  // 单位名称
  private selectUnitName: string = '';
  // 拷贝巡检设施
  private inspectDeviceName: string;
  // 剩余天数 (配置文件引用，勿删！！)
  private lastDays: number;
  // 工单名称 (配置文件引用，勿删！！)
  private inspectionName: string;
  // 当前选择的模板
  private selectTemplateData: SelectTemplateModel;
  // 选择设施类型
  private changeDevice: string;
  // 设备名称 (配置文件引用，勿删！！)
  private equipmentName: string = '';
  // 已选设备
  private selectEquipList: EquipmentFormModel[] = [];

  constructor(private $activatedRoute: ActivatedRoute,
              private $nzI18n: NzI18nService,
              private $modelService: NzModalService,
              private $modalService: FiLinkModalService,
              private $ruleUtil: RuleUtil,
              private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
              private $router: Router,
              private $inspectionWorkOrderService: InspectionWorkOrderService,
              private $facilityForCommonService: FacilityForCommonService,
              ) {
  }

  public ngOnInit(): void {
    this.selectorType = WorkOrderMapTypeEnum.inspection;
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    // this.equipmentSelectList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    this.judgePageJump();
    // 初始化单位树
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // 初始化设施地图选择
    WorkOrderInitTreeUtil.initMapSelectorConfig(this);
    // 初始化设备地图选择
    WorkOrderInitTreeUtil.initEquipmentMapSelectorConfig(this);
  }

  public ngOnDestroy(): void {
    this.mapSelectorInspection = null;
  }

  // 设备多选
  public onChangeLevel(): void {
    setTimeout( () => {
      if (this.equipmentListValue.length > 0) {
        this.queryEquipmentList();
      } else {
        this.equipList = [];
        this.inspectEquipmentName = '';
        this.formStatus.resetControlData('equipmentType', []);
      }
    }, 10);
  }
  public changeEquips(): void {
    this.formStatus.resetControlData('equipmentType', this.equipmentListValue.map(item => {
      return {'value': item };
    }));
  }
  /**
   * 选择自动派单
   */
  public selectDispatch(event): void {
    this.formStatus.resetControlData('autoDispatch', event);
  }
  /**
   * 页面切换  修改/重新生成
   */
  private pageSwitching(): void {
    // 显示修改列表页数据
    this.$inspectionWorkOrderService.getUpdateWorkUnfinished(this.procId).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        result.data.procResourceType = this.InspectionLanguage.workOrderTypeIsNotAvailableByDefault;
        // 是否巡检全集
        this.isSelectAll = result.data.selectAll;
        result.data.isSelectAll = this.isSelectAll;
        this.departmentSelectorName = result.data.accountabilityDeptName;
        // 设施数据
        const deviceListData = result.data.procRelatedDevices;
        const devNames = [];
        this.deviceSet = [];
        for (let i = 0; i < deviceListData.length; i++) {
          devNames.push(deviceListData[i].deviceName);
          if (this.isSelectAll === IsSelectAllEnum.deny) {
            this.deviceSet.push(deviceListData[i].deviceId);
          }
          this.deviceIdList.push(deviceListData[i].deviceId);
        }
        this.updateDeviceList = deviceListData;
        this.deviceList = deviceListData;
        result.data.deviceList = deviceListData;
        // 获取单位信息
        if (result.data.procRelatedDepartments) {
          this.updateDeptList = [{
            accountabilityDept: result.data.procRelatedDepartments[0].accountabilityDept,
            deptCode: result.data.accountabilityDept,
            accountabilityDeptName: result.data.accountabilityDeptName
          }];
        }
        this.deptList = [{
          accountabilityDept: result.data.accountabilityDept,
          deptCode: result.data.accountabilityDept,
          accountabilityDeptName: result.data.accountabilityDeptName
        }];
        // 自动派单
        result.data.autoDispatch = result.data.autoDispatch ? result.data.autoDispatch : '0';
        this.dispatchValue = result.data.autoDispatch;
        // 区域
        this.areaName = result.data.deviceAreaName;
        this.formStatus.resetControlData('inspectionAreaName', this.areaName);
        this.inspectionAreaId = result.data.deviceAreaId;
        this.deviceAreaCode = result.data.deviceAreaCode;
        this.inspectAreaId = result.data.deviceAreaId;
        this.inspectAreaIdDevice = result.data.deviceAreaId;
        // 判断并解除设施类型禁用
        if (!this.deviceDisabled) {
          if (this.areaName && this.deviceAreaCode) {
            this.formStatus.group.controls['deviceType'].enable();
          }
        }
        this.queryDeptList(this.deviceAreaCode).then();
        this.deviceType = result.data.deviceType;
        // 开始结束时间
        result.data.inspectionStartTime = new Date(CommonUtil.convertTime(new Date(result.data.inspectionStartTime).getTime()));
        result.data.inspectionEndTime = new Date(CommonUtil.convertTime(new Date(result.data.expectedCompletedTime).getTime()));
        this.formStatus.resetData(result.data);
        // 如果重新生成工单，巡检起始时间和期望完工时间置空
        this.formStatus.resetControlData('inspectionStartTime', this.pageType === WorkOrderPageTypeEnum.restUpdate ? '' : new Date(CommonUtil.convertTime(result.data.inspectionStartTime)));
        this.formStatus.resetControlData('inspectionEndTime', this.pageType === WorkOrderPageTypeEnum.restUpdate ? '' : new Date(CommonUtil.convertTime(result.data.inspectionEndTime)));
        /*// 物料
        if (result.data.materiel && result.data.materiel.length > 0) {
          this.formStatus.resetControlData('materiel', result.data.materiel[0].materielName);
        } else {
          this.formStatus.resetControlData('materiel', '');
        }*/
        // 设备类型
        if (result.data.equipmentType) {
          this.equipmentListValue = result.data.equipmentType.split(',');
        } else {
          this.equipmentListValue = [];
        }
        this.formStatus.resetControlData('equipmentType', this.equipmentListValue);
        // 设备
        this.hasSelectData = [];
        if (result.data.procRelatedEquipment && result.data.procRelatedEquipment.length > 0) {
          const names = [];
          result.data.procRelatedEquipment.forEach(v => {
            names.push(v.equipmentName);
            if (this.isSelectAll === IsSelectAllEnum.deny) {
              this.hasSelectData.push(v.equipmentId);
            }
          });
          this.inspectEquipmentName = names.join(',');
          this.selectEquipmentName = this.inspectEquipmentName;
          this.formStatus.resetControlData('inspectionEquipment', this.inspectEquipmentName);
        }
        this.equipList = result.data.procRelatedEquipment;
        // 巡检模板
        if (result.data.template && result.data.template.inspectionItemList.length > 0) {
          this.selectTemplateData = result.data.template;
          this.tempName = result.data.template.templateName;
          this.formStatus.resetControlData('inspectionTemplate', this.tempName);
        }
        // 递归设置责任单位的选择情况
        this.deptId = result.data.accountabilityDept;
        this.$workOrderCommonUtil.getRoleAreaList().then((areaData: AreaModel[]) => {
          this.areaNodes = areaData;
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, result.data.deviceAreaId);
          WorkOrderInitTreeUtil.initAreaSelectorConfig(this, areaData);
        });
        this.inspectDeviceName = devNames.join(',');
        this.inspectionFacilitiesSelectorName = this.inspectDeviceName;
        this.formStatus.resetControlData('deviceList', this.inspectDeviceName);
      }
    });
  }

  /**
   * 页面title切换
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case WorkOrderPageTypeEnum.add:
        title = `${this.InspectionLanguage.addArea}${this.InspectionLanguage.patrolInspectionSheet}`;
        break;
      case WorkOrderPageTypeEnum.update:
        title = `${this.InspectionLanguage.edit}${this.InspectionLanguage.patrolInspectionSheet}`;
        break;
      case WorkOrderPageTypeEnum.restUpdate:
        title = `${this.InspectionLanguage.regenerate}${this.InspectionLanguage.patrolInspectionSheet}`;
        break;
    }
    return title;
  }

  /**
   * 接受表单传进来的参数并赋值
   * param event
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe((param) => {
      this.isFormDisabled = this.confirmButtonIsGray(param);
    });
  }

  /**
   * 表单提交按钮检查
   */
  public confirmButtonIsGray(param: InspectionWorkOrderDetailModel): boolean {
    const remark = CommonUtil.trim(param.remark);
    // 页面为编辑的时候，且工单状态不是待指派只校验备注
    if (this.pageType === WorkOrderPageTypeEnum.update && this.status !== WorkOrderStatusEnum.assigned) {
      if (remark && remark.length > 255) {
        return false;
      } else {
        return true;
      }
    } else {
      // 除编辑状态外，校验其它所有必填项
      if (param.inspectionEndTime && param.inspectionStartTime && param.title && this.areaName && param.deviceType && (!remark || remark.length < 256) &&
        new Date(param.inspectionStartTime) < new Date(param.inspectionEndTime) && this.inspectionFacilitiesSelectorName && this.tempName) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * 返回
   */
  public goBack(): void {
    window.history.back();
  }

  /**
   * 添加/修改/重新生成操作
   */
  public saveInspectionData(): void {
    const data = this.formStatus.group.getRawValue();
    // 重新生成/编辑
    if (this.pageType === WorkOrderPageTypeEnum.restUpdate || this.status === WorkOrderStatusEnum.assigned) {
      const now = (new Date()).getTime();
      const end = (new Date(data.inspectionEndTime)).getTime();
      if (now > end) {
        this.$modalService.error(this.InspectionLanguage.endTimeIsGreaterThanCurrentTime);
        return;
      }
    }
    if (CommonUtil.trim(data.remark) && CommonUtil.trim(data.remark).length > 255) {
      return;
    }
    InspectionDetailUtil.saveInspectionData(this, data);
  }
  /**
   * 获取区域下设施
   */
  private queryInspectionDeviceByArea(areaCode: string): void {
    const isAll = this.formStatus.getData().isSelectAll;
    const param = new  AreaDeviceParamModel();
    param.areaCode = areaCode;
    param.deviceTypes = [this.changeDevice];
    this.deviceList = [];
    this.inspectionFacilitiesSelectorName = '';
    this.equipList = [];
    this.inspectEquipmentName = '';
    // 清空已选择的设施设备
    this.hasSelectData = [];
    this.deviceSet = [];
    // 是否巡检全集
    if (isAll === '0') {
      return;
    }
    this.$facilityForCommonService.queryDeviceDataList(param).subscribe((result: ResultModel<DeviceFormModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const facilityData = result.data || [];
        this.facilityData = facilityData;
        // 设施名称集合
        const deviceId = [];
        const name = [];
        this.deviceList = facilityData;
        for (let i = 0; i < facilityData.length; i++) {
          name.push(facilityData[i].deviceName);
          deviceId.push(facilityData[i].deviceId);
        }
        this.inspectionFacilitiesSelectorName = name.join(',');
        if (deviceId.length > 0) {
          this.deviceIdList = deviceId;
          this.queryEquipmentList();
        }
        this.formStatus.resetControlData('deviceList', this.inspectionFacilitiesSelectorName);
      }
    });
  }
  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(): void {
    if (!this.disabledIf) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    }
  }

  /**
   * 区域选中结果
   * param event
   */
  public areaSelectChange(event: AreaModel[]): void {
    this.inspectionFacilitiesSelectorName = '';
    this.deviceList = [];
    if (event && event[0]) {
      this.areaName = event[0].areaName;
      this.inspectionAreaId = event[0].areaId;
      this.areaId = event[0].areaId;
      this.disabledSelect = false;
      this.deviceAreaCode = event[0].areaCode;
      this.queryDeptList(event[0].areaCode).then();
      this.inspectEquipmentDisabled = true;
      this.formStatus.group.controls['deviceType'].enable();
      if (this.changeDevice) {
        this.queryInspectionDeviceByArea(event[0].areaCode);
      }
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId, event[0].areaId);
      this.formStatus.resetControlData('inspectionAreaName', this.areaName);
    } else {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
      this.areaName = '';
    }
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    const names = [];
    this.selectArr = [];
    // 是否选中数据
    if (event.length > 0) {
      event.forEach(item => {
        names.push(item.deptName);
      });
      for (let i = 0; i < event.length; i++) {
        this.deptList = [{
          accountabilityDept: event[i].id,
          accountabilityDeptName: event[i].deptName,
          deptCode: event[i].deptCode,
        }];
        this.updateDeptList.push({
          accountabilityDept: event[i].id,
          accountabilityDeptName: event[i].deptName,
          deptCode: event[i].deptCode,
        });
        this.selectArr.push(event[i].id);
      }
      this.deptId = event[0].id;
      // 设置回显值
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    } else {
      this.updateDeptList = [];
      this.deptList = [];
      this.deptId = null;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, []);
    }
    // 赋值给表单
    this.selectUnitName = names.join(',');
    this.departmentSelectorName = this.selectUnitName;
    this.formStatus.resetControlData('deptList', this.selectArr);
  }

  /**
   * 打开责任单位选择器
   */
   public showDepartmentSelectorModal(): void {
    if (this.areaName === '') {
      this.$modalService.error(this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip);
      return;
    }
    if (!this.disabledIf) {
      this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [this.deptId]);
    }
    this.isUnitVisible = true;
  }

  /**
   * 查询责任单位
   */
  private queryDeptList(code: string): Promise<NzTreeNode[]> {
    return new Promise((resolve, reject) => {
      const param = new AreaDeviceParamModel();
      param.areaCodes = [code];
      param.userId = WorkOrderBusinessCommonUtil.getUserId();
      this.$facilityForCommonService.listDepartmentByAreaAndUserId(param).subscribe((result: ResultModel<NzTreeNode[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const deptData = result.data || [];
          this.unitTreeNodes = deptData;
          resolve(deptData);
        }
      });
    });
  }

  /**
   * 打开巡检设施选择器
   */
  public showInspectionFacilitiesSelectorModal(): void {
    this.isSelectAll = this.formStatus.getData().isSelectAll;
    this.selectMapType = WorkOrderMapTypeEnum.device;
    if (this.areaName === '') {
      this.$modalService.info(this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip);
    } else {
      const type = this.formStatus.getData('deviceType');
      if (type) {
        if (!this.disabledIf) {
          this.isChooseDevice = true;
          this.inspectDeviceType = [type];
          this.mapVisible = true;
        } else {
          this.$modalService.info(this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip);
        }
      } else {
        this.$modalService.info(this.InspectionLanguage.pleaseSelectTheTypeOfInspectionFacilityFirst);
      }
    }
  }

  /**
   * 巡检设施所选结果
   * param event
   */
  public mapSelectDataChange(event: DeviceFormModel[]): void {
    this.inspectionFacilitiesSelectorName = '';
    this.deviceList = [];
    const deviceId = [];
    if (event.length > 0) {
      const name = [];
      for (let i = 0; i < event.length; i++) {
        name.push(event[i].deviceName);
        // 保存已选择设施数据
        this.deviceList.push({
          deviceId: event[i].deviceId,
          deviceName: event[i].deviceName,
          deviceType: event[i].deviceType,
          deviceAreaId: this.inspectionAreaId,
          deviceAreaName: this.areaName
        });
        deviceId.push(event[i].deviceId);
      }
      this.inspectionFacilitiesSelectorName = name.join(',');
      if (deviceId.length > 0) {
        this.deviceIdList = deviceId;
        this.queryEquipmentList();
      }
    } else {
      this.$modalService.info(this.InspectionLanguage.selectDeviceTip);
      this.deviceSet = [];
      this.inspectionFacilitiesSelectorName = '';
    }
    this.deviceSet = deviceId;
    this.formStatus.resetControlData('deviceList', this.inspectionFacilitiesSelectorName);
  }

  /**
   * 巡检设施默认所选结果
   */
  private mapSelectDataChanges(event: DeviceFormModel[]): void {
    if (!event) {
      return;
    }
    this.deviceList = [];
    const data = event;
    if (this.isSelectAll === IsSelectAllItemEnum.isSelectAll) {
      this.inspectionFacilitiesSelectorName = '';
      this.inspectDeviceName = '';
      const names = [];
      for (let i = 0; i < data.length; i++) {
        names.push(data[i].deviceName);
      }
      this.inspectionFacilitiesSelectorName = names.join(',');
      this.deviceList = event;
    } else {
      this.inspectionFacilitiesSelectorName = '';
      this.inspectEquipmentName = '';
    }
  }

  /**
   * 打开巡检设备弹窗
   */
  public showInspectEquipmentSelectorModal(): void {
    this.isSelectAll = this.formStatus.getData().isSelectAll;
    this.selectMapType = WorkOrderMapTypeEnum.equipment;
    if (this.areaName === '') {
      this.$modalService.info(this.InspectionLanguage.pleaseSelectTheAreaInformationFirstTip);
      return;
    }
    /*if (this.deviceSet.length === 0) {
      this.$modalService.info(this.InspectionLanguage.pleaseSelectTheInspectionFacilityFirst);
      return;
    }*/
    if (!this.disabledIf) {
      this.equipmentTypes = this.equipmentListValue;
      this.mapEquipmentVisible = true;
    }
  }

  /**
   * 巡检设备选择结果
   */
  public mapEquipmentSelectDataChange(event: EquipmentFormModel[]): void {
    this.equipList = [];
    const names = [];
    this.hasSelectData = [];
    if (event && event.length > 0) {
      // 遍历已选择设备，并保存
      event.forEach(v => {
        this.equipList.push({
          equipmentId: v.equipmentId,
          deviceId: v.deviceId,
          equipmentType: v.equipmentType,
          equipmentName: v.equipmentName
        });
        names.push(v.equipmentName);
        this.hasSelectData.push(v.equipmentId);
      });
      this.selectEquipList = this.equipList;
    }
    // 回显表单
    this.inspectEquipmentName = names.join(',');
    this.selectEquipmentName = this.inspectEquipmentName;
    this.mapEquipmentVisible = false;
    this.formStatus.resetControlData('inspectionEquipment', this.equipList);
  }

  /**
   * 查询设施下的设备列表
   */
  private queryEquipmentList(code?: string): void {
    const isAll = this.formStatus.getData().isSelectAll;
    const data = new AreaDeviceParamModel();
    /*data.areaCode = this.deviceAreaCode;*/
    data.deviceIds = this.deviceIdList;
    data.equipmentTypes = [];
    this.equipmentListValue.forEach(v => {
      data.equipmentTypes.push(v);
    });
    // 清空已选择的设备
    this.hasSelectData = [];
    this.inspectEquipmentName = '';
    // 是否已选择设备类型
    if (code === '1') {
      const names = [];
      this.selectEquipList.forEach(item => {
        if (data.equipmentTypes.includes(item.equipmentType)) {
          names.push(item.equipmentName);
          // this.hasSelectData.push(item.equipmentId);
        }
      });
      this.inspectEquipmentName = names.join(',');
      this.selectEquipmentName = this.inspectEquipmentName;
      this.formStatus.resetControlData('inspectionEquipment', this.inspectEquipmentName);
    }
    // 清空设备
    this.equipList = [];
    // 设备类型为空，不查询设备信息
    if (this.equipmentListValue.length === 0) {
      return;
    }
    // 判断是否巡检全集
    if (isAll === '0') {
      return;
    }
    this.$facilityForCommonService.listEquipmentBaseInfoByAreaCode(data).subscribe((result: ResultModel<EquipmentFormModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const equipData = result.data || [];
        const name = [];
        // 保存查询的设备数据
        equipData.forEach(v => {
          this.equipList.push({
            equipmentId: v.equipmentId,
            deviceId: v.deviceId,
            equipmentType: v.equipmentType,
            equipmentName: v.equipmentName
          });
          name.push(v.equipmentName);
          // this.hasSelectData.push(v.equipmentId);
        });
        this.inspectEquipmentName = name.join(',');
        this.selectEquipmentName = this.inspectEquipmentName;
        this.formStatus.resetControlData('inspectionEquipment', this.inspectEquipmentName);
      }
    });
  }

  /**
   * 根据是否巡检全集改变巡检设施
   * 表单配置文件调用，（灰显勿删！！）
   */
  private changeInspectionFacilities(event: string): void {
    if (event === IsSelectAllEnum.deny && (this.disabledIf === false || this.disabledIf === undefined)) {
      this.inspectionFacilitiesSelectorDisabled = false;
    } else if (event === IsSelectAllEnum.right) {
      this.inspectionFacilitiesSelectorDisabled = true;
    }
    // 根据区域ID查询设施
    this.mapSelectDataChanges(this.facilityData);
  }

  /**
   * 判断页面跳转
   */
  private judgePageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.type;
      this.pageRoute = params.route;
      this.pageTitle = this.getPageTitle(this.pageType);
      // 页面为新增
      if (this.pageType === WorkOrderPageTypeEnum.add) {
        this.isChooseDevice = true;
        this.isSelectAll = IsSelectAllItemEnum.isSelectAll;
        /*this.equipmentListValue = this.equipmentSelectList.map(v => {
          return v.code;
        });*/
        this.$workOrderCommonUtil.getRoleAreaList().then((areaData: AreaModel[]) => {
          this.areaNodes = areaData;
          WorkOrderInitTreeUtil.initAreaSelectorConfig(this, this.areaNodes);
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        });
      } else {
        // 编辑或者是重新生成
        this.procId = params.procId;
        this.status = params.status;
        if ((this.status === WorkOrderStatusEnum.pending || this.status === WorkOrderStatusEnum.singleBack || this.status === WorkOrderStatusEnum.turnProcess ||
          this.status === WorkOrderStatusEnum.processing) && this.pageType === WorkOrderPageTypeEnum.update) {
          this.disabledIf = true;
          this.equipDisabled = true;
          this.deviceDisabled = true;
          this.remarkDisabled = false;
          this.areaDisabled = true;
          this.tempNameDisabled = true;
          this.isDispatch = true;
          this.departmentSelectorDisabled = true;
        } else {
          this.disabledIf = false;
        }
        this.pageSwitching();
      }
      InspectionDetailUtil.initInspectionForm(this);
    });
  }

  /**
   *  起始日期不可选择小于当前日期
   */
  public disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0 || CommonUtil.checkTimeOver(current);
  }
  /**
   *  期望完工日期不可选择小于起始日期
   */
  public disabledEndDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.dateStart) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * 显示巡检模板弹窗
   */
  public showTemplate(): void {
    if (this.tempNameDisabled) {
      return;
    }
    this.modalData = {
      pageType: this.pageType,
      selectTemplateData: this.selectTemplateData
    };
    this.tempSelectVisible = true;
  }

  /**
   * 选择模板
   */
  public selectTemplate(event: SelectTemplateModel): void {
    this.tempName = event.templateName;
    this.formStatus.resetControlData('inspectionTemplate', this.tempName);
    this.selectTemplateData = event;
    this.tempSelectVisible = false;
  }
}
