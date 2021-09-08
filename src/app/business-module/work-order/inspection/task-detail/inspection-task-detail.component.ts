import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {NzI18nService, NzTreeNode } from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {InspectionTaskDetailUtil} from './inspection-task-detail.util';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {MapSelectorConfigModel} from '../../../../shared-module/model/map-selector-config.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {SelectTemplateModel} from '../../share/model/template/select-template.model';
import {TemplateModalModel} from '../../share/model/template/template-modal.model';
import {DeviceFormModel} from '../../../../core-module/model/work-order/device-form.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {EquipmentFormModel} from '../../../../core-module/model/work-order/equipment-form.model';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {EnableStatusEnum, IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderMapTypeEnum} from '../../share/enum/work-order-map-type.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

/**
 * 巡检任务新增/编辑组件
 */
@Component({
  selector: 'app-inspection-task-detail',
  templateUrl: './inspection-task-detail.component.html',
  styleUrls: ['./inspection-task-detail.component.scss'],
})
export class InspectionTaskDetailComponent implements OnInit {
  // 巡检起始时间
  @ViewChild('taskStartTime') taskStartTimeTemp: TemplateRef<any>;
  // 巡检结束时间
  @ViewChild('taskEndTime') taskEndTimeTemp: TemplateRef<any>;
  // 区域
  @ViewChild('areaSelector') areaSelectorTemp: TemplateRef<any>;
  // 责任单位
  @ViewChild('departmentSelector') departmentSelectorTemp: TemplateRef<any>;
  // 巡检设施
  @ViewChild('inspectionFacilitiesSelector') inspectionFacilitiesSelectorTemp: TemplateRef<any>;
  // 巡检模板
  @ViewChild('inspectionTemplate') inspectionTemplate: TemplateRef<any>;
  // 选择巡检模板
  @ViewChild('selectInspectionTemp') selectInspectionTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentListTemp') equipmentListTemp: TemplateRef<any>;
  // 自动派单
  @ViewChild('autoDispatch') public autoDispatch: TemplateRef<any>;
  // 引用巡检国际化
  public language: InspectionLanguageInterface;
  // 巡检工单国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 区域配置
  public areaSelectorConfig: any = new TreeSelectorConfigModel();
  // 设施map配置
  public mapSelectorConfig: MapSelectorConfigModel;
  // 责任单位初始化
  public treeSelectorConfig: any = new TreeSelectorConfigModel();
  // 表单列
  public formColumn: FormItem[] = [];
  // 是否加载
  public isLoading: boolean = false;
  // 是否开启巡检任务
  public opened: string;
  // 责任单位名称
  public selectUnitName: string = '';
  // 设施名称
  public selectDeviceName: string = '';
  // 新增或编辑页面
  public pageType: string;
  // 页面标题
  public pageTitle: string;
  // 设施id
  public deviceId: string;
  // 责任单位id
  public deptId: string;
  // 巡检全集默认是状态
  public defaultStatus: string = '1';
  // 区域名称
  public areaName: string = '';
  // 区域弹框
  public areaSelectVisible: boolean = false;
  // 巡检模板
  public tempSelectVisible: boolean = false;
  // 责任人单位模板button属性绑定
  public departmentSelectorDisabled: boolean;
  // 巡检设施弹框的显示隐藏
  public mapVisible: boolean = false;
  // 选中设施数量
  public selectDeviceNumber: string = null;
  // 责任单位名称
  public departmentSelectorName: string = '';
  // 巡检设施 设施名称
  public inspectionFacilitiesSelectorName: string = '';
  // 区域id
  public areaId: string = null;
  // 设施区域id
  public deviceAreaId: string = null;
  // 接收起始时间Value值
  public dateStart: Date;
  // 接收结束时间Value值
  public dateEnd: Date;
  // 巡检设施模板button属性绑定
  public inspectionFacilitiesSelectorDisabled = true;
  // 区域是否可以操作
  public areaDisabled: boolean = true;
  // 巡检全集
  public isSelectAll: string = null;
  // 设施列表数据
  public deviceSet: string[] = [];
  // 选择区域下设施数据存放
  public deviceData: DeviceFormModel[] = [];
  // 是否显示确定按钮
  public isShowConfirmBtn: boolean = true;
  // 是否可编辑
  public isView: boolean = false;
  // 模板名称
  public tempName: string = '';
  public deviceType: string[] = [];
  // 参数
  public modalData: TemplateModalModel;
  // 巡检设备名称
  public equipmentName: string;
  // 设备数据
  public equipList: EquipmentFormModel[] = [];
  // 责任单位弹框
  public isUnitVisible: boolean = false;
  // 设备类型集合
  public equipmentSelectList: {label: string, code: any}[] = [];
  // 选择设备类型
  public equipmentListValue: string[] = [];
  // 设备类型是否可选
  public equipDisabled: boolean = true;
  // 打开的设施或设备地图类型
  public selectMapType: string = '';
  // 设施id集合
  public deviceIdList: string[];
  // 设备类型
  public equipmentTypes: string[];
  // 表单校验
  public isFormDisabled: boolean;
  // 自动派单
  public dispatchEnum = IsSelectAllEnum;
  public dispatchValue: string = IsSelectAllEnum.deny;
  public isDispatch: boolean = false;
  // 时间校验
  public checkTime: boolean = false;
  // 责任单位选中id集合
  private deptList: DepartmentUnitModel[] = [];
  // 设施类型集合
  private deviceTypesList: string[] = [];
  // 是否选择巡检全集
  private isChooseAll: boolean = false;
  // 新增/编辑成功
  private addOrEdit: string;
  // 表单操作
  private formStatus: FormOperate;
  // 获取当前的时间
  private today = new Date();
  // 巡检起始时间
  private taskStartTime: string;
  // 巡检结束时间
  private taskEndTime: string;
  // 巡检任务ID
  private inspectionTaskId: string;
  // 设施id和对应的区域id集合
  private deviceList: DeviceFormModel[] = [];
  // 责任单位id
  private accountabilityDept: string = '';
  // 巡检区域Id
  private inspectionAreaId: string;
  // 区域code
  private inspectionAreaCode: string;
  // 编辑初始化区域名称
  private initAreaName: string = '';
  // 区域数据存放
  private areaNodes: NzTreeNode[] = [];
  // 责任单位数据存放
  private deptNodes: DepartmentUnitModel[] = [];
  // 是否为编辑
  private updateStatus: boolean;
  // 巡检任务名称Value值
  private inspectionTaskName: string;
  // 生成多工单
  private isMultipleOrder: string = null;
  // 当前选择的模板
  private selectTemplateData: SelectTemplateModel;
  // 选择设备名称
  private selectEquipmentName: string;
  constructor(public $activatedRoute: ActivatedRoute,
              public $nzI18n: NzI18nService,
              public $active: ActivatedRoute,
              public $modalService: FiLinkModalService,
              public $ruleUtil: RuleUtil,
              public $router: Router,
              private $userService: UserForCommonService,
              private $inspectionWorkOrderService: InspectionWorkOrderService,
              private $facilityForCommonService: FacilityForCommonService,
              ) {}
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.equipmentSelectList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    // 表单初始化
    InspectionTaskDetailUtil.initTaskFormColumn(this);
    this.judgePageJump();
    // 设施地图选择初始化
    WorkOrderInitTreeUtil.initMapSelectorConfig(this);
  }
  /**
   * 设备多选
   */
  public onChangeEquip(): void {
    const timer = setTimeout( () => {
      if (this.equipmentListValue.length > 0) {
        this.queryEquipmentList();
      } else {
        this.equipList = [];
        this.formStatus.resetControlData('equipmentType', []);
      }
      clearTimeout(timer);
    }, 10);
  }
  /**
   * 选择设备类型
   */
  public changeEquip(): void {
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
   * 页面切换 新增/修改
   */
  private judgePageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.status;
      if (params.inspectionTaskId && this.pageType === WorkOrderPageTypeEnum.update) {
        this.inspectionTaskId = params.inspectionTaskId;
        this.opened = params.opened;
        this.queryDeptList().then((deptData: DepartmentUnitModel[]) => {
          this.deptNodes = deptData;
          WorkOrderInitTreeUtil.initTreeSelectorConfig(this, deptData);
        });
        this.getUpdateInspectionTask(this.inspectionTaskId);
      } else {
        this.isSelectAll = IsSelectAllEnum.right;
        // 获取单位
        this.queryDeptList().then((deptData: DepartmentUnitModel[]) => {
          this.deptNodes = deptData;
          WorkOrderInitTreeUtil.initTreeSelectorConfig(this, deptData);
        });
        /*this.equipmentListValue = this.equipmentSelectList.map(v => {
          return v.code;
        });*/
      }
      this.pageTitle = this.getPageTitle(this.pageType);
    });
  }
  /**
   * 获取页面标题类型
   * @param type 页面标题类型
   * returns {string}
   */
  public getPageTitle(type: string): string {
    let title;
    switch (type) {
      case WorkOrderPageTypeEnum.add:
        title = `${this.language.addArea} ${this.language.inspectionTask}`;
        break;
      case WorkOrderPageTypeEnum.update:
        title = `${this.language.edit} ${this.language.inspectionTask}`;
        break;
      case WorkOrderPageTypeEnum.view:
        this.isShowConfirmBtn = false;
        this.isView = true;
        this.areaDisabled = false;
        this.departmentSelectorDisabled = false;
        this.inspectionFacilitiesSelectorDisabled = false;
        title = `${this.language.viewDetail} ${this.language.inspectionTask}`;
        break;
    }
    return title;
  }
  /**
   * 巡检设施弹框的显示隐藏
   */
  public showInspectionFacilitiesSelectorModal(): void {
    this.isSelectAll = this.formStatus.getData().isSelectAll;
    this.selectMapType = WorkOrderMapTypeEnum.device;
    this.deviceType = [...new Set(this.deviceTypesList)];
    if (this.areaName === '') {
      this.$modalService.error(this.language.pleaseSelectTheAreaInformationFirstTip);
    }
    if (this.areaName !== '' && this.isSelectAll === IsSelectAllEnum.deny) {
      this.mapVisible = true;
    } else {
      this.mapVisible = false;
    }
  }
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe((param) => {
      const that = this;
      setTimeout(() => {
        that.isFormDisabled = that.formStatus.getRealValid();
      }, 200);
    });
  }
  /**
   * mapSelect所选结果
   * param event
   */
  public mapSelectDataChange(event: DeviceFormModel[]): void {
    if (this.isSelectAll === IsSelectAllEnum.deny) {
      this.deviceIdList = [];
      this.deviceSet = [];
      this.selectDeviceName = '';
      const name = [];
      event.forEach(item => {
        name.push(item.deviceName);
      });
      this.selectDeviceName = name.join(',');
      this.inspectionFacilitiesSelectorName = this.selectDeviceName;
      this.formStatus.resetControlData('deviceName', this.selectDeviceName);
      this.deviceList = event;
      const types = [];
      const deviceId = [];
      for (let i = 0; i < event.length; i++) {
        deviceId.push(event[i].deviceId);
        types.push(event[i].deviceType);
        this.deviceId = event[i].deviceId;
        this.deviceAreaId = event[i].areaId;
      }
      if (deviceId.length > 0) {
        this.selectDeviceNumber = deviceId.length + '';
        this.formStatus.resetControlData('inspectionDeviceCount', deviceId.length + '');
        this.deviceIdList = deviceId;
        this.deviceSet = deviceId;
        this.queryEquipmentList();
        this.filterDeviceAndEquipment([...new Set(types)]);
      } else {
        this.$modalService.info(this.language.selectDeviceTip);
        this.selectDeviceName = '';
        this.inspectionFacilitiesSelectorName = this.selectDeviceName;
        this.formStatus.resetControlData('deviceName', this.selectDeviceName);
        this.deviceList = [];
        this.equipmentListValue = [];
        this.selectDeviceNumber = '';
        this.formStatus.resetControlData('equipmentType', []);
        this.formStatus.resetControlData('inspectionDeviceCount', '');
      }
    }
  }
  /**
   * 取消后退
   */
  public goBack(): void {
    window.history.go(-1);
  }

  /**
   * 新增和编辑巡检任务
   */
  public inspectionTaskDetail(): void {
    const newDate = new Date();
    if (this.dateStart < newDate) {
      this.$modalService.info(this.language.checkStartDate);
      return;
    }
    if (this.dateEnd !== null && this.dateEnd < newDate) {
      this.$modalService.info(`${this.language.endTimeIsGreaterThanCurrentTime}`);
    } else {
      this.isLoading = true;
      const data = this.formStatus.group.getRawValue();
      data.inspectionTaskName = CommonUtil.trim(data.inspectionTaskName);
      data.inspectionAreaId = this.inspectionAreaId;
      data.inspectionAreaCode = this.inspectionAreaCode;
      data.deviceList = this.deviceList;
      // 模板
      data.template = {
        templateId: this.selectTemplateData.templateId,
        templateName: this.selectTemplateData.templateName,
        inspectionItemList: []
      };
      data.deviceName = this.inspectionFacilitiesSelectorName;
      data.inspectionDeviceCount = this.selectDeviceNumber;
      data.inspectionAreaName = this.areaName;
      data.selectAll = this.isSelectAll;
      data.departmentList = this.deptList;
      this.selectTemplateData.inspectionItemList.forEach((v, i) => {
        if (v.checked && CommonUtil.trim(v.templateItemName) !== '') {
          data.template.inspectionItemList.push({
            templateItemId: v.templateItemId,
            templateItemName: v.templateItemName,
            sort: i + 1,
            remark: v.remark
          });
        }
      });
      data.equipmentType = this.equipmentListValue.toString();
      // 设备
      if (data.equipmentType.length > 0) {
        data.equipmentList = this.equipList;
      } else {
        data.equipmentList = [];
      }
      // 判断页面类型 新增或者编辑
      if (this.pageType === WorkOrderPageTypeEnum.add) {
        // 新增
        data.opened = EnableStatusEnum.enable;
        data.taskStartDate = new Date(data.taskStartTime).getTime();
        if (data.taskEndTime) {
          data.taskEndDate = new Date(data.taskEndTime).getTime();
        } else {
          data.taskEndDate = null;
        }
        data.taskStartTime = CommonUtil.sendBackEndTime(data.taskStartDate);
        data.taskEndTime = CommonUtil.sendBackEndTime(data.taskEndDate);
        this.$inspectionWorkOrderService.insertWorkOrder(data).subscribe((result: ResultModel<string>) => {
          this.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.$router.navigate(['/business/work-order/inspection/task-list']).then();
            this.$modalService.success(this.InspectionLanguage.operateMsg.addSuccess);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
      } else if (this.pageType === WorkOrderPageTypeEnum.update) {
        // 编辑
        this.inspectionFacilitiesSelectorName = data.deviceName;
        data.inspectionTaskId = this.inspectionTaskId;
        // 结束时间
        if (data.taskEndTime === null) {
          data.taskEndDate = null;
        } else if (data.taskEndTime === this.taskEndTime) {
          data.taskEndDate = new Date(this.taskEndTime).getTime();
        } else {
          data.taskEndDate = new Date(data.taskEndTime).getTime();
        }
        // 开始时间
        if (data.taskStartTime === this.taskStartTime) {
          data.taskStartDate = new Date(this.taskStartTime).getTime();
        } else {
          data.taskStartDate = new Date(data.taskStartTime).getTime();
        }
        data.taskEndTime = CommonUtil.sendBackEndTime(data.taskEndDate);
        data.taskStartTime = CommonUtil.sendBackEndTime(data.taskStartDate);
        data.opened = this.opened;
        this.$inspectionWorkOrderService.updateInspectionTask(data).subscribe((result: ResultModel<string>) => {
          this.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.addOrEdit = WorkOrderPageTypeEnum.update;
            this.$router.navigate(['/business/work-order/inspection/task-list']).then();
            this.$modalService.success(this.InspectionLanguage.operateMsg.editSuccess);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
      }
    }
  }
  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(): void {
    if (this.departmentSelectorName === '') {
      this.areaSelectVisible = false;
      this.treeSelectorConfig.treeNodes = this.areaNodes;
      this.$modalService.info(`${this.language.pleaseSelectDepartInfo}`);
    } else {
      if (this.areaNodes && this.areaNodes.length > 0) {
        this.areaSelectorConfig.treeNodes = this.areaNodes;
        this.areaSelectVisible = true;
      }
    }
  }
  /**
   *责任单位显示隐藏
   */
  public showDepartmentSelectorModal(): void {
    this.treeSelectorConfig.treeNodes = this.deptNodes;
    this.isUnitVisible = true;
  }
  /**
   * 区域选中结果
   * param event
   */
  public areaSelectChange(event: AreaModel): void {
    this.inspectionFacilitiesSelectorName = '';
    this.equipList = [];
    this.deviceList = [];
    this.equipmentListValue = [];
    this.formStatus.resetControlData('inspectionDeviceCount', 0);
    this.formStatus.resetControlData('equipmentType', null);
    this.formStatus.resetControlData('deviceName', null);
    if (event[0]) {
      this.areaName = event[0].areaName;
      this.inspectionAreaId = event[0].areaId;
      this.areaId = event[0].areaId;
      this.inspectionAreaCode = event[0].areaCode;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId, null);
      this.formStatus.resetControlData('inspectionAreaName', this.areaName);
      //  获取区域id下的所有设施参数
      this.queryDeviceByArea(event[0].areaCode);
    } else {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
      this.areaName = '';
      this.formStatus.resetControlData('inspectionAreaName', this.areaName);
    }
  }

  /**
   * 责任单位选择结果
   * @param event 当前选中单位数据
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    if (event && event[0]) {
      FacilityForCommonUtil.setTreeNodesStatus(this.deptNodes, [event[0].id]);
      this.selectUnitName = event[0].deptName;
      this.deptList = [{
        accountabilityDept: event[0].deptCode,
        accountabilityDeptName: event[0].deptName,
        inspectionTaskDeptId: event[0].id
      }];
      this.departmentSelectorName = this.selectUnitName;
      this.deptId = event[0].id;
      // 表单回显
      this.formStatus.resetControlData('departmentList', this.deptList);
      // 查询区域
      this.queryAreasByCode(event[0].deptCode).then((areaData: NzTreeNode[]) => {
        this.areaNodes = areaData;
        WorkOrderInitTreeUtil.initAreaSelectorConfig(this, this.areaNodes);
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        this.areaName = '';
      });
      this.formStatus.resetControlData('inspectionAreaName', null);
      this.inspectionFacilitiesSelectorName = '';
      this.formStatus.resetControlData('deviceName', null);
      this.formStatus.resetControlData('inspectionDeviceCount', null);
      this.equipmentListValue = [];
    } else {
      FacilityForCommonUtil.setTreeNodesStatus(this.deptNodes, []);
      this.selectUnitName = '';
      this.departmentSelectorName = this.selectUnitName;
      this.formStatus.resetControlData('departmentList', null);
    }
  }
  /**
   * 根据责任单位code查询区域
   */
  private queryAreasByCode(code: string): Promise<NzTreeNode[]> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.queryAreaByDeptCode(code).subscribe((result: ResultModel<NzTreeNode[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const areaData = result.data || [];
          this.areaNodes = areaData;
          if (areaData.length > 0) {
            this.areaDisabled = false;
          }
          resolve(areaData);
        }
      });
    });
  }
  /**
   * 获取单位
   */
  private queryDeptList(): Promise<DepartmentUnitModel[]> {
    return new Promise((resolve, reject) => {
        this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
          if (result.code === ResultCodeEnum.success) {
            this.deptNodes = result.data || [];
            resolve(this.deptNodes);
          }
        });
    });
  }
  /**
   * 根据id查询巡检任务
   * @param id 任务id
   */
  private getUpdateInspectionTask(id: string): void {
    this.$inspectionWorkOrderService.inquireInspectionTask(id).subscribe((result: ResultModel<InspectionTaskModel>) => {
      let inspectionInfo: any;
      if (result.code === ResultCodeEnum.success) {
        this.updateStatus = true;
        inspectionInfo = result.data;
        // 区域名称/区域id
        this.areaName = result.data.inspectionAreaName;
        this.initAreaName = result.data.inspectionAreaName;
        this.inspectionAreaId = result.data.inspectionAreaId;
        this.inspectionAreaCode = result.data.inspectionAreaCode;
        this.areaDisabled = false;
        // 是否巡检全集
        this.isSelectAll = result.data.selectAll;
        result.data.isSelectAll = this.isSelectAll;
        this.departmentSelectorName = result.data.accountabilityDeptName;
        // 任务时间
        this.taskStartTime = result.data.taskStartTime;
        this.taskEndTime = result.data.taskEndTime;
        this.selectDeviceNumber = result.data.inspectionDeviceCount.toString();
        inspectionInfo.inspectionDeviceCount = this.selectDeviceNumber;
        inspectionInfo.inspectionAreaName = this.initAreaName;
        inspectionInfo.departmentList = result.data.deptList;
        inspectionInfo.isSelectAll = this.isSelectAll;
        inspectionInfo.taskPeriod = result.data.taskPeriod.toString();
        inspectionInfo.procPlanDate = result.data.procPlanDate.toString();
        inspectionInfo.autoDispatch = inspectionInfo.autoDispatch ? inspectionInfo.autoDispatch : '0';
        this.dispatchValue = inspectionInfo.autoDispatch;
        // 取设备类型
        if (result.data.equipmentType) {
          this.equipmentListValue = [];
          const arr = result.data.equipmentType.split(',');
          arr.forEach(v => {
            this.equipmentListValue.push(v);
          });
          inspectionInfo.equipmentType = this.equipmentListValue;
        }
        this.equipDisabled = false;
        if (inspectionInfo.taskStartTime) {
          inspectionInfo.taskStartTime = new Date(CommonUtil.convertTime(new Date(result.data.taskStartTime).getTime()));
        }
        if (inspectionInfo.taskEndTime) {
          inspectionInfo.taskEndTime = new Date(CommonUtil.convertTime(new Date(result.data.taskEndTime).getTime()));
        }
        // 取设施
        if (result.data.deviceList.length > 0 && this.isSelectAll === IsSelectAllEnum.deny) {
          this.areaId = result.data.inspectionAreaId;
        }
        // 取设备
        this.equipList = result.data.equipmentList || [];
        const equipName = [];
        this.equipList.forEach(v => {
          equipName.push(v.equipmentName);
        });
        this.equipmentName = equipName.join(',');
        this.selectEquipmentName = this.equipmentName;
      }
      const deptList = result.data.deptList;
      this.areaId = result.data.inspectionAreaId;
      this.deptId = result.data.deptList[0].inspectionTaskDeptId;
      if (deptList && deptList.length > 0) {
        this.deptList = deptList;
        FacilityForCommonUtil.setTreeNodesStatus(this.deptNodes, [this.deptId]);
      }
      // 查询区域
      this.queryAreasByCode(deptList[0].accountabilityDept).then((data: NzTreeNode[]) => {
        this.areaNodes = data;
        WorkOrderInitTreeUtil.initAreaSelectorConfig(this, this.areaNodes);
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, result.data.inspectionAreaId);
      });
      // 取巡检模板
      if (result.data.template) {
        this.selectTemplateData = result.data.template;
        const tempList = this.selectTemplateData.inspectionItemList ? this.selectTemplateData.inspectionItemList : [];
        if (tempList.length > 0) {
          tempList.forEach(v => {
            v.checked = true;
          });
          this.selectTemplateData.inspectionItemList = tempList;
          this.tempName = result.data.template.templateName;
          inspectionInfo.inspectionTemplate = this.tempName;
        }
      }
      // 取设施名称及设施id
      this.deviceSet = [];
      if (result.data.deviceList && result.data.deviceList.length > 0) {
        this.deviceList = result.data.deviceList;
        const deviceName = [];
        const types = [];
        result.data.deviceList.forEach(v => {
          deviceName.push(v.deviceName);
          if (types.indexOf(v.deviceType) < 0) {
            types.push(v.deviceType);
          }
          if (this.isSelectAll === IsSelectAllEnum.deny) {
            this.deviceSet.push(v.deviceId);
          }
        });
        this.inspectionFacilitiesSelectorName = deviceName.join(',');
        inspectionInfo.deviceName = this.inspectionFacilitiesSelectorName;
      }
      this.formStatus.resetData(inspectionInfo);
      setTimeout(() => {
        this.isFormDisabled = true;
      }, 2000);
    });
  }

  /**
   * 结束时间大于起始时间
   */
  public disabledEndDate = (current: Date): boolean => {
    if (this.dateStart !== null) {
      return differenceInCalendarDays(current, this.dateStart) < 0 || CommonUtil.checkTimeOver(current);
    } else {
      this.today = new Date();
      return differenceInCalendarDays(current, this.today) < 0 || CommonUtil.checkTimeOver(current);
    }
  }
  /**
   * 起始时间当天之前的时间不能选
   */
  public disabledStartDate = (current: Date): boolean => {
    this.today = new Date();
    return differenceInCalendarDays(current, this.today) < 0 || CommonUtil.checkTimeOver(current);
  }
  /**
   * 获取区域下设施
   */
  private queryDeviceByArea(areaCode: string): void {
    const isAll = this.formStatus.getData().isSelectAll;
    const data = new AreaDeviceParamModel();
    data.areaCode = areaCode;
    data.deviceTypes = [];
    // 置空设施信息
    this.deviceList = [];
    this.deviceSet = [];
    // 将设备相关信息置空
    this.equipList = [];
    // 设施名称集合
    this.selectDeviceName = '';
    if (isAll === '0') {
      return;
    }
    this.$facilityForCommonService.queryDeviceDataList(data).subscribe((result: ResultModel<DeviceFormModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const dataList = result.data || [];
        this.deviceData = dataList;
        const deviceId = [];
        const name = [];
        const types = [];
        if (this.isSelectAll === IsSelectAllEnum.right) {
          // 设施总数
          this.selectDeviceNumber = dataList.length + '';
          this.formStatus.resetControlData('inspectionDeviceCount', this.selectDeviceNumber);
          this.deviceList = dataList;
          for (let i = 0; i < dataList.length; i++) {
            deviceId.push(dataList[i].deviceId);
            name.push(dataList[i].deviceName);
            types.push(dataList[i].deviceType);
          }
          // 回显表单
          this.selectDeviceName = name.join(',');
          this.inspectionFacilitiesSelectorName = this.selectDeviceName;
          this.formStatus.resetControlData('deviceName', this.selectDeviceName);
        }
        this.deviceIdList = deviceId;
        if (types.length > 0) {
          this.equipDisabled = false;
        }
        this.filterDeviceAndEquipment([...new Set(types)]);
        if (this.deviceIdList.length > 0) {
          this.queryEquipmentList();
        }
      }
    });
  }

  /**
   * 过滤设施及设备
   */
  private filterDeviceAndEquipment(list: string[]) {
    this.equipmentSelectList = [];
    this.equipmentListValue = [];
    // 用户权限下的设施类型
    const typeList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    const equipList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    // 去重后新的权限下设施类型
    const newType = [];
    list.forEach(item => {
      const flag = typeList.find(v => {
        return item === v.code;
      });
      if (flag) {
        newType.push(item);
      }
    });
    // 根据设施类型加载设备类型
    const typeA = [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel];
    const typeB = [DeviceTypeEnum.opticalBox, DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet, DeviceTypeEnum.distributionFrame, DeviceTypeEnum.junctionBox];
    let flagA: boolean = false;
    let flagB: boolean = false;
    typeA.forEach(item => {
      if (newType.includes(item)) {
        flagA = true;
      }
    });
    typeB.forEach(item => {
      if (newType.includes(item)) {
        flagB = true;
      }
    });
    // 1、两种情况都存在
    if (flagA && flagB) {
      this.equipmentSelectList = equipList;
      equipList.forEach(item => {
        this.equipmentListValue.push(item.code.toString());
      });
    } else {
      // 2、设施类型为智慧杆或者配电箱时，设备类型不展示门禁锁
      if (flagA) {
        equipList.forEach(item => {
          if (item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock) {
            this.equipmentSelectList.push(item);
            this.equipmentListValue.push(item.code.toString());
          }
        });
      }
      // 3、反之设备类型值展示门禁锁
      if (flagB) {
        equipList.forEach(item => {
          if (item.code === EquipmentTypeEnum.intelligentEntranceGuardLock) {
            this.equipmentSelectList.push(item);
            this.equipmentListValue.push(item.code.toString());
          }
        });
      }
    }
    this.formStatus.resetControlData('equipmentType', this.equipmentListValue);
  }
  /**
   * 显示巡检模板弹窗
   */
  public showTemplate(): void {
    this.modalData = {
      pageType: this.pageType,
      selectTemplateData: this.selectTemplateData
    };
    this.tempSelectVisible = true;
  }
  /**
   * 选择模板回显
   * @param event 模板数据
   */
   public selectTemplate(event: SelectTemplateModel): void {
    this.tempName = event.templateName;
    this.formStatus.resetControlData('inspectionTemplate', event.templateName);
    this.selectTemplateData = event;
    this.tempSelectVisible = false;
  }
  /**
   * 查询设施下的设备列表
   */
  private queryEquipmentList(): void {
    const data = new AreaDeviceParamModel();
    data.areaCode = this.inspectionAreaCode;
    data.deviceIds = this.deviceIdList;
    data.equipmentTypes = [];
    this.equipmentListValue.forEach(v => {
      data.equipmentTypes.push(v);
    });
    this.equipList = [];
    this.equipmentName = '';
    this.$facilityForCommonService.listEquipmentBaseInfoByAreaCode(data).subscribe((result: ResultModel<EquipmentFormModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const equipData = result.data || [];
        const name = [];
        // 遍历返回数据，保存设备信息
        equipData.forEach(v => {
          this.equipList.push({
            equipmentCode: v.equipmentCode,
            equipmentId: v.equipmentId,
            deviceId: v.deviceId,
            deviceType: v.deviceInfo ? v.deviceInfo.deviceType : v.deviceType,
            equipmentIdType: v.equipmentType,
            equipmentType: v.equipmentType,
            equipmentName: v.equipmentName
          });
          name.push(v.equipmentName);
        });
        this.equipmentName = name.join(',');
        this.selectEquipmentName = this.equipmentName;
      }
    });
  }
}
