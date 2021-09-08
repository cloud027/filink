import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {InstallDetailFormUtil} from './install-detail-form.util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {AlarmSelectorConfigModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {EquipmentModel} from '../../../../core-module/model/equipment.model';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {InspectionReportParamModel} from '../../share/model/inspection-report-param.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ClearBarrierOrInspectEnum, IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {InstallWorkOrderService} from '../../share/service/installation';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {InstallWorkOrderModel} from '../../../../core-module/model/work-order/install-work-order.model';
import {WorkOrderMapTypeEnum} from '../../share/enum/work-order-map-type.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {OrderEquipmentModel} from '../../share/model/install-work-order/order-equipment.model';
import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';

/**
 * 新增/编辑安装工单
 */
@Component({
  selector: 'app-install-detail',
  templateUrl: './install-detail.component.html',
  styleUrls: ['./install-detail.component.scss']
})
export class InstallDetailComponent implements OnInit {

  // 完成时间选择模板
  @ViewChild('ecTimeTemp') public ecTimeTemp: TemplateRef<any>;
  // 单位选择模板
  @ViewChild('departmentSelector') public departmentSelector: TemplateRef<any>;
  // 设施名称
  @ViewChild('selectDeviceTemp') private selectDeviceTemp: TemplateRef<any>;
  // 设备名称
  @ViewChild('equipmentTemp') private equipmentTemp: TemplateRef<any>;
  // 挂载位置
  @ViewChild('positionDevTemplate') private positionDevTemplate: TemplateRef<HTMLDocument>;
  // 设备类型多选
  @ViewChild('equipmentListTemp') public equipmentListTemp: TemplateRef<any>;
  // 自动派单
  @ViewChild('autoDispatch') public autoDispatch: TemplateRef<any>;
  // 设备型号
  @ViewChild('equipModelTemp') private equipModelTemp: TemplateRef<HTMLDocument>;
  // 页面标题
  public pageTitle: string;
  // 国际化
  public inspectionLanguage: InspectionLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  public formLanguage: FormLanguageInterface;
  // form表单配置
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;
  // 表单校验
  public isFormDisabled: boolean = false;
  // 按钮加载图标
  public isLoading: boolean = false;
  // 树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 责任单位弹框
  public isUnitVisible: boolean = false;
  // 责任人单位title值
  public departmentName: string = '';
  // 单位禁用
  public isSelectDept: boolean = true;
  // 区域禁用
  public isSelectArea: boolean = false;
  // 区域ID
  public areaId: string = null;
  // 区域选择器弹框
  public areaSelectVisible: boolean = false;
  // 区域选择器
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 设施名称
  public orderFacilityConfig: AlarmSelectorConfigModel;
  // 是否禁用设施名称选择
  public isFacilityName: boolean = false;
  // 显示设施名称弹窗
  public isShowDeviceModel: boolean = false;
  // 设施名称
  public deviceName: string;
  // 设备名称禁止修改
  public isEquipName: boolean = true;
  public isNameInput: boolean = false;
  // 是否生成设备
  public isAddEquip: boolean = false;
  // 显示校验
  public showCheckName: boolean = false;
  // 显示查询
  public showSpin: boolean = false;
  // 设备弹框展示
  public equipmentVisible: boolean = false;
  // 所选设备
  public equipmentName: string;
  // 故障设备查询条件
  public equipmentFilter: FilterCondition[] = [];
  // 选择的设备
  public selectEquipmentList: EquipmentModel[] = [];
  // 设备id
  public equipmentIds: string;
  // 所选槽位信息回填
  public wisdomMountPosition;
  // 显示型号选择
  public isShowModel: boolean = false;
  // 型号类型
  public modelsType: string;
  // 设施/设备类型
  public deviceOrEquipType: string;
  public selectModelData;
  // 设备型号
  public equipModel: string = '';
  public equipModelData;
  // 设备型号进制选择
  public isEquipModel: boolean = true;
  // 禁用选择点位
  public isPoint: boolean = true;
  // 显示选择点位
  public showPointSelect: boolean = false;
  // 点位值
  public pointValue: number | string;
  // 自动派单
  public dispatchEnum = IsSelectAllEnum;
  public dispatchValue: string = IsSelectAllEnum.deny;
  public isDispatch: boolean = false;
  // 已选择设施
  public selectDeviceList = [];
  // 校验
  public nameStr: string = '';
  // 禁止输入
  private isCanSelect: boolean = false;
  // 工单id
  private procId: string;
  // 页面类型
  private pageType: string;
  // 单位树
  private unitTreeNodes: NzTreeNode[] = [];
  // 区域节点数据
  private areaNodes: AreaModel[] = [];
  // 点位
  private pointList: any[] = [];
  // 工单状态
  private procStatus: string;
  // 工单来源，历史或者未完工
  private operateFrom: string;
  // 编辑时是否修改过设施
  private isChangeDevice: boolean = false;
  // 名称校验通过
  private checkName: boolean = false;
  // 查询参数模型
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 编辑时数据
  private editData: InstallWorkOrderModel;

  constructor(
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $inspectService: InspectionWorkOrderService,
    private $facilityForCommonService: FacilityForCommonService,
    private $installService: InstallWorkOrderService
  ) { }

  public ngOnInit(): void {
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    this.initPageJump();
    // 初始化单位树
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
  }

  /**
   * 表单实例，校验
   * param event
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    const that = this;
    this.formStatus.group.statusChanges.subscribe((param) => {
      setTimeout(() => {
        that.isFormDisabled = that.formStatus.getRealValid();
      }, 300);
    });
  }
  /**
   * 返回
   */
  public goBack(): void {
    window.history.go(-1);
  }
  /**
   * 添加/修改/重新生成操作
   */
  public saveInstallData(): void {
    const data = this.formStatus.group.getRawValue();
    if (data.planCompletedTime && (new Date(data.planCompletedTime)).getTime() < (new Date()).getTime() && this.procStatus === WorkOrderStatusEnum.assigned) {
      this.$message.error(this.inspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime);
      return;
    }
    const device = data.devicesName[0];
    const param = {
      title: data.title,
      procType: ClearBarrierOrInspectEnum.installation,
      describe: data.taskDesc,
      isGenerateEquipment: data.isGenerateEquipment,
      deviceName: device.deviceName,
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      deviceModel: device.deviceModel,
      deviceAreaId: device.areaId,
      deviceAreaCode: device.areaCode,
      deviceAreaName: device.areaName,
      accountabilityDeptCode: '',
      accountabilityDeptName: '',
      equipmentType: data.equipmentType,
      equipment: [{
        assetCode: '',
        deviceId: device.deviceId,
        equipmentType: data.equipmentType,
        equipmentName: this.equipmentName,
        equipmentId: '',
        equipmentModel: data.equipmentModel,
      }],
      autoDispatch: data.autoDispatch,
      planCompletedTime: (new Date(data.planCompletedTime)).getTime(),
      remark: data.remark,
      pointPosition: data.pointPosition,
      id: '',
    };
    // 是否新增设备
    if (data.isGenerateEquipment === IsSelectAllEnum.right) {
      param.equipment[0].assetCode = data.assetCode;
    } else {
      delete param.equipment[0].assetCode;
      param.equipment[0].equipmentId = data.equipmentName[0].equipmentId;
    }
    if (data.accountabilityDept) {
      param.accountabilityDeptCode = data.accountabilityDept.accountabilityDeptCode;
      param.accountabilityDeptName = data.accountabilityDept.accountabilityDeptName;
    }
    this.isLoading = true;
    let request;
    // console.info('参数', param);
    if (this.pageType === WorkOrderPageTypeEnum.add) {
      delete param.id;
      request = this.$installService.addInstallWorkOrder(param);
    } else if (this.pageType === WorkOrderPageTypeEnum.update) {
      // 编辑
      param.id = this.procId;
      request = this.$installService.editInstallWorkOrder(param);
    } else {
      // 重新生成
      param.id = this.procId;
      request = this.$installService.regenerateOrder(param);
    }
    // 判断是否新增设备
    if (data.isGenerateEquipment === IsSelectAllEnum.right) {
      if (this.pageType === WorkOrderPageTypeEnum.add) {
        this.addEquipmentInfo(param).then((result: any) => {
          if (result) {
            // 设备新增成功后，做工单相关操作
            param.equipment[0].equipmentId = result.equipmentId;
            param.equipment[0].assetCode = result.equipmentCode;
            this.operateOrder(request);
          }
        });
      } else {
        // 编辑或者重新生成
        if (this.editData.equipmentName !== param.equipment[0].equipmentName || this.editData.assetCode !== param.equipment[0].assetCode) {
          this.addEquipmentInfo(param).then((result: any) => {
            if (result) {
              // 设备新增成功后，做工单相关操作
              param.equipment[0].equipmentId = result.equipmentId;
              param.equipment[0].assetCode = result.equipmentCode;
              this.operateOrder(request);
            }
          });
        } else {
          param.equipment[0].equipmentId = this.equipmentIds;
          this.operateOrder(request);
        }
      }
    } else {
      this.operateOrder(request);
    }
  }

  /**
   * 工单操作
   */
  public operateOrder(request): void {
    request.subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        if (this.pageType === WorkOrderPageTypeEnum.add) {
          this.goBack();
          this.$message.success(this.inspectionLanguage.operateMsg.addSuccess);
        } else if (this.pageType === WorkOrderPageTypeEnum.update) {
          this.goBack();
          this.$message.success(this.inspectionLanguage.operateMsg.editSuccess);
        } else {
          this.$router.navigate([`/business/work-order/installation/unfinished-list`]).then();
          this.$message.success(this.inspectionLanguage.operateMsg.rebuildSuccess);
        }
      } else {
        this.$message.error(res.msg);
      }
      this.isLoading = false;
    }, () => this.isLoading = false);
  }
  /**
   * 日期禁用
   */
  public disabledEndDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0 || CommonUtil.checkTimeOver(current);
  }
  /**
   * 打开责任单位选择器
   */
  public showDepartmentModal(): void {
    this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
    this.isUnitVisible = true;
  }
  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    // 是否选中数据
    if (event && event.length > 0) {
      this.departmentName = event[0].deptName;
      this.formStatus.resetControlData('accountabilityDept', {
        accountabilityDeptCode: event[0].deptCode,
        accountabilityDeptName: event[0].deptName,
      });
      // 设置回显值
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    } else {
      this.departmentName = null;
      this.formStatus.resetControlData('accountabilityDept', null);
      // 设置回显值
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, []);
    }
  }
  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(): void {
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }
  /**
   * 选择型号
   */
  public showSelectModel(): void {
    const data = this.formStatus.getRealData();
    // 打开设备型号选择
    this.modelsType = WorkOrderMapTypeEnum.equipment;
    this.deviceOrEquipType = data.equipmentType;
    if (data.equipmentType) {
      this.selectModelData = this.equipModelData;
    }
    this.isShowModel = true;
  }
  /**
   * 回显型号
   */
  public selectDeviceModelData(data): void {
    // 回显设备型号
    this.equipModelData = data;
    this.equipModel = data.productModel;
    this.formStatus.resetControlData('equipmentModel', data.productModel);
  }

  /**
   * 选择设施数据
   * @param event 已选择的设施数据
   */
  public selectDeviceInfoData(event): void {
    if (event && event.length) {
      this.selectDeviceList = event;
      this.deviceName = event[0].deviceName;
      this.areaId = event[0].areaId;
      this.formStatus.resetControlData('devicesName', event);
      this.formStatus.resetControlData('deviceArea', event[0].areaName);
      this.formStatus.resetControlData('deviceType', WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, event[0].deviceType));
      this.formStatus.resetControlData('deviceModel', event[0].deviceModel);
      // 查询单位
      this.getUnitDataList(event[0].areaCode);
      this.isSelectDept = false;
      // 显示隐藏挂载点位
      const devType = event[0].deviceType;
      this.formColumn.forEach(item => {
        if (item.key === 'pointPosition') {
          item.hidden = devType !== DeviceTypeEnum.wisdom;
        }
      });
      this.isEquipName = false;
      // 查询点位
      const form = this.formStatus.getRealData();
      if (devType === DeviceTypeEnum.wisdom && form.equipmentType && form.isGenerateEquipment === IsSelectAllEnum.right) {
        this.getMountPoint();
        this.isPoint = false;
      }
      this.showPointSelect = form.isGenerateEquipment === IsSelectAllEnum.right;
      // 是否更改设施
      this.isChangeDevice = true;
      if (this.pageType !== WorkOrderPageTypeEnum.add) {
        this.isAddEquip = true;
        this.isEquipModel = false;
        this.isPoint = false;
        this.isNameInput = false;
        this.showPointSelect = false;
        if (this.editData.isGenerateEquipment === IsSelectAllEnum.right) {
          this.formStatus.group.controls['isGenerateEquipment'].reset(IsSelectAllEnum.right);
        } else {
          this.formStatus.group.controls['isGenerateEquipment'].reset(IsSelectAllEnum.deny);
        }
        this.formStatus.group.controls['isGenerateEquipment'].enable();
        this.formStatus.group.controls['assetCode'].enable();
        this.formStatus.group.controls['equipmentType'].enable();
      } else {
        this.showPointSelect = true;
        this.equipmentName = '';
        this.pointValue = '';
        this.wisdomMountPosition = '';
        this.selectEquipmentList = [];
        this.equipModel = '';
        this.formStatus.resetControlData('equipmentName', '');
        this.formStatus.resetControlData('assetCode', '');
        this.formStatus.resetControlData('equipmentType', '');
        this.formStatus.resetControlData('equipmentModel', '');
        this.formStatus.resetControlData('pointPosition', '');
      }
    }
  }

  /**
   * 挂载点位
   */
  public changePosition(event: string): void {
    this.wisdomMountPosition = event;
    this.formStatus.resetControlData('pointPosition', event);
  }
  /**
   * 选择设备
   */
  public onEquipmentDataChange(event: EquipmentModel[]): void {
    if (event && event.length === 1) {
      this.showPointSelect = false;
      this.selectEquipmentList = event;
      this.equipmentName = event[0].equipmentName;
      this.equipmentIds = event[0].equipmentId;
      this.formStatus.resetControlData('equipmentName', this.selectEquipmentList);
      this.formStatus.resetControlData('equipmentType', event[0].equipmentType);
      this.equipModel = event[0].equipmentModel;
      this.formStatus.resetControlData('equipmentModel', this.equipModel);
      this.formStatus.resetControlData('pointPosition', event[0].mountPosition);
      this.pointValue = event[0].mountPosition;
    }
  }

  /**
   * 输入设备
   */
  public inputEquipName(event): void {
    const that = this;
    const reg = /^(?!_)[a-zA-Z0-9-_\u4e00-\u9fa5\s]+$/;
    if (!CommonUtil.trim(event.target.value)) {
      this.nameStr = this.formLanguage.requiredMsg;
      this.showCheckName = true;
      this.isFormDisabled = false;
      this.formStatus.resetControlData('equipmentName', null);
      return;
    }
    // 只能输入中英文，数字，中横线和下划线
    if (reg.test(CommonUtil.trim(event.target.value))) {
      this.showCheckName = false;
      const data = {equipmentName: CommonUtil.trim(event.target.value), equipmentId: null };
      this.showSpin = true;
      const timer = setTimeout(() => {
        that.checkInputName(data);
        clearTimeout(timer);
      }, 1000);
    } else {
      // 只能输入中英文，数字，中横线和下划线
      this.showCheckName = true;
      this.nameStr = this.commonLanguage.nameCodeMsg;
      this.isFormDisabled = false;
    }
    this.formStatus.resetControlData('equipmentName', CommonUtil.trim(event.target.value));
  }
  public checkInputName(data): void {
    this.$installService.checkEquipmentNameIsExist(data).subscribe((res: ResultModel<boolean>) => {
      if (res.code === ResultCodeEnum.success) {
        if (!res.data) {
          this.nameStr = this.formLanguage.nameExistError;
          this.showCheckName = true;
          this.isFormDisabled = false;
        } else {
          this.showCheckName = false;
        }
      } else {
        this.nameStr = res.msg;
        this.showCheckName = true;
        this.isFormDisabled = false;
      }
      this.showSpin = false;
    });
  }

  /**
   * 打开设备列表弹窗
   */
  public showEquipmentTemp() {
    if (!this.selectDeviceList || this.selectDeviceList.length === 0) {
      this.$message.info(this.inspectionLanguage.selectFacilityFirst);
      return;
    }
    this.equipmentFilter = [
      { // 查询正常状态的设备
        filterField: 'equipmentStatus',
        filterValue: ['1'],
        operator: OperatorEnum.in
      },
      {
        filterField: 'areaId',
        filterValue: [this.areaId],
        operator: OperatorEnum.in
      },
      {
        filterField: 'deviceId',
        filterValue: [this.selectDeviceList[0].deviceId],
        operator: OperatorEnum.in
      }
    ];
    this.equipmentVisible = true;
  }
  /**
   * 选择自动派单
   */
  public selectDispatch(event): void {
    this.formStatus.resetControlData('autoDispatch', event);
  }

  /**
   * 页面title切换
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case WorkOrderPageTypeEnum.add:
        title = `${this.inspectionLanguage.addArea}${this.inspectionLanguage.installOrder}`;
        break;
      case WorkOrderPageTypeEnum.update:
        title = `${this.inspectionLanguage.edit}${this.inspectionLanguage.installOrder}`;
        break;
      case WorkOrderPageTypeEnum.rebuild:
        title = `${this.inspectionLanguage.regenerate}${this.inspectionLanguage.installOrder}`;
        break;
    }
    return title;
  }

  /**
   *  获取挂载点
   */
  private getMountPoint() {
    const data = new InspectionReportParamModel();
    const form = this.formStatus.getRealData();
    data.deviceId = this.selectDeviceList[0].deviceId;
    data.equipmentType = form.equipmentType;
    data.mountPosition = null;
    this.pointList = [];
    this.$installService.findMountPositionById(data).subscribe((result: ResultModel<string[]>) => {
      if (result.code === ResultCodeEnum.success && result.data) {
        this.pointList = result.data || [];
      }
    });
  }
  /**
   * 获取单位
   */
  private getUnitDataList(areaCode: string): void {
    const params = new AreaDeviceParamModel();
    params.areaCodes = [areaCode];
    params.userId = WorkOrderBusinessCommonUtil.getUserId();
    this.unitTreeNodes = [];
    this.$facilityForCommonService.listDepartmentByAreaAndUserId(params).subscribe((result: ResultModel<NzTreeNode[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.unitTreeNodes = result.data || [];
      }
    });
  }
  /**
   * 判断页面跳转
   */
  private initPageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.type;
      this.pageTitle = this.getPageTitle(this.pageType);
      this.operateFrom = params.operateFrom;
      // 页面为新增
      if (this.pageType !== WorkOrderPageTypeEnum.add) {
        // 编辑或者是重新生成
        this.procId = params.procId;
        this.procStatus = params.status;
        this.defaultFormData();
      }
      InstallDetailFormUtil.initInstallationForm(this);
    });
  }
  /**
   * 查询默认表单数据
   */
  private defaultFormData(): void {
    // 工单状态不是待指派时只能编辑备注
    if (this.procStatus !== WorkOrderStatusEnum.assigned && this.pageType === WorkOrderPageTypeEnum.update) {
      this.isDispatch = true;
      this.isSelectArea = true;
      this.isCanSelect = true;
      this.isEquipName = true;
      this.isFacilityName = true;
    } else {
      this.isSelectDept = false;
      this.isEquipModel = false;
    }
    /**
     * 判断来源 历史-未完工
     * 未完工存在 编辑 重新生成
     * 历史存在 重新生成
     */
    const that = this;
    if (this.operateFrom === WorkOrderPageTypeEnum.finished) {
      this.$installService.historyDetailById(this.procId).subscribe((res: ResultModel<InstallWorkOrderModel>) => {
        if (res.code === ResultCodeEnum.success && res.data) {
          this.echoForm(res.data, that);
        }
      });
    } else {
      this.$installService.getDetailById(this.procId).subscribe((res: ResultModel<InstallWorkOrderModel>) => {
        if (res.code === ResultCodeEnum.success && res.data) {
          this.echoForm(res.data, that);
        }
      });
    }
  }

  /**
   * 赋值-回显表单
   */
  private echoForm(data: InstallWorkOrderModel, that): void {
    this.editData = data;
    data.taskDesc = data.describe;
    // 设施
    this.selectDeviceList = [{
      deviceName: data.deviceName,
      deviceId: data.deviceId,
      areaId: data.deviceAreaId,
      areaCode: data.deviceAreaCode,
      areaName: data.deviceAreaName,
      deviceModel: data.deviceModel,
      deviceType: data.deviceType,
      // 从设备获取添加
      address: '',
      positionBase: ''
    }];
    this.deviceName = data.deviceName;
    this.areaId = data.deviceAreaId;
    this.formColumn.forEach(item => {
      if (item.key === 'pointPosition') {
        item.hidden = data.deviceType !== DeviceTypeEnum.wisdom;
      }
    });
    // 设备
    this.selectEquipmentList = [{
      equipmentId: data.equipment[0].equipmentId,
      equipmentModel: data.equipment[0].equipmentModel,
      equipmentName: data.equipment[0].equipmentName,
      equipmentType: data.equipmentType,
      mountPosition: data.pointPosition
    }];
    this.equipmentIds = data.equipment[0].equipmentId;
    this.editData.assetCode = data.equipment[0].assetCode;
    data.equipmentName = data.equipment[0].equipmentName;
    data.equipmentModel = data.equipment[0].equipmentModel;
    // 单位
    this.departmentName = data.accountabilityDeptName;
    data.accountabilityDept = {accountabilityDeptCode: data.accountabilityDeptCode, accountabilityDeptName: data.accountabilityDeptName};
    // 查询单位
    this.getUnitDataList(data.deviceAreaCode);
    // FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [this.deptId]);
    // 期望完工时间
    if (data.planCompletedTime && this.pageType === WorkOrderPageTypeEnum.update) {
      data.planCompletedTime = new Date(CommonUtil.convertTime(new Date(data.planCompletedTime).getTime()));
    } else {
      data.planCompletedTime = null;
    }
    this.dispatchValue = data.autoDispatch;
    // 是否新增设备
    data.isGenerateEquipment = data.isGenerateEquipment ? data.isGenerateEquipment : IsSelectAllEnum.deny;
    data.procType = this.inspectionLanguage.installOrder;
    this.formStatus.resetData(data);
    this.equipmentName = data.equipment[0].equipmentName;
    this.equipModel = data.equipment[0].equipmentModel;
    // 设施回显
    this.formStatus.resetControlData('devicesName', this.selectDeviceList);
    this.formStatus.resetControlData('deviceArea', data.deviceAreaName);
    this.formStatus.resetControlData('deviceType', WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, data.deviceType));
    // 设备回显
    this.formStatus.resetControlData('equipmentName', this.selectEquipmentList);
    this.formStatus.resetControlData('assetCode', data.equipment[0].assetCode);
    // 挂载点位
    this.formStatus.resetControlData('pointPosition', data.pointPosition);
    this.pointValue = data.pointPosition;
    // 是否新增设备
    if (data.isGenerateEquipment === IsSelectAllEnum.right) {
      this.showPointSelect = false;
      this.isAddEquip = true;
      this.isEquipModel = true;
      this.isPoint = true;
      this.isNameInput = true;
      this.formStatus.group.controls['isGenerateEquipment'].disable();
      this.formStatus.group.controls['assetCode'].disable();
      this.formStatus.group.controls['equipmentType'].disable();
      this.queryEquipment(this.equipmentIds);
    } else {
      // 为否时
      this.showPointSelect = false;
      if (this.procStatus !== WorkOrderStatusEnum.assigned) {
        this.isAddEquip = false;
        if (this.pageType === WorkOrderPageTypeEnum.update) {
          this.isEquipName = true;
          this.formStatus.group.controls['isGenerateEquipment'].disable();
          // 非待指派状态可以编辑备注
          that.isFormDisabled = true;
        } else {
          this.isEquipName = false;
        }
      } else {
        this.isAddEquip = false;
        this.isEquipName = false;
      }
    }
    if (this.pageType === WorkOrderPageTypeEnum.update) {
      setTimeout(() => {
        that.isFormDisabled = true;
      }, 1500);
    }
  }

  /**
   * 新增设备
   */
  private addEquipmentInfo(param): Promise<object> {
    const dataObj = new OrderEquipmentModel();
    dataObj.equipmentName = param.equipment[0].equipmentName;
    dataObj.equipmentType = param.equipmentType;
    dataObj.equipmentModel = param.equipment[0].equipmentModel;
    dataObj.equipmentCode = param.equipment[0].assetCode;
    dataObj.mountPosition = param.pointPosition;
    dataObj.deviceId = param.deviceId;
    dataObj.deviceType = param.deviceType;
    dataObj.deviceName = param.deviceName;
    dataObj.address = this.selectDeviceList[0].address;
    dataObj.positionBase = this.selectDeviceList[0].positionBase;
    dataObj.areaId = param.deviceAreaId;
    dataObj.areaName = param.deviceAreaName;
    dataObj.areaCode = param.deviceAreaCode;
    dataObj.supplierId = this.equipModelData.supplier;
    dataObj.supplier = this.equipModelData.supplierName;
    dataObj.softwareVersion = this.equipModelData.softwareVersion;
    dataObj.hardwareVersion = this.equipModelData.hardwareVersion;
    return new Promise((resolve, reject) => {
      this.$installService.creatEquipment(dataObj).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success && res.data) {
          resolve({equipmentId: res.data.equipmentId, equipmentCode: res.data.equipmentCode});
        } else {
          this.$message.error(res.msg);
          this.isLoading = false;
          resolve(null);
        }
      }, () => {
        this.isLoading = false;
        resolve(null);
      });
    });
  }

  /**
   * 查询设备信息
   */
  private queryEquipment(id): void {
    this.queryCondition.filterConditions.push({
      filterField: 'equipmentId',
      filterValue: [id],
      operator: OperatorEnum.in
    });
      this.$installService.queryEquipList(this.queryCondition).subscribe((res: ResultModel<any[]>) => {
        if (res.code === ResultCodeEnum.success && res.data && res.data.length) {
          const data = res.data[0];
          this.selectDeviceList[0].address = data.address;
          this.selectDeviceList[0].positionBase = data.positionBase;
          this.equipModelData = {
            // 从设备获取
            equipmentModel: data.equipmentModel,
            supplierId: data.supplierId,
            supplier: data.supplier,
            softwareVersion: data.softwareVersion,
            hardwareVersion: data.hardwareVersion
          };
        }
      });
  }
}
