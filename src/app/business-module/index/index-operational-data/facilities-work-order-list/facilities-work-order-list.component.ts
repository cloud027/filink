import {Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {MapControl} from '../../util/map-control';
import {IndexWorkOrderService} from '../../../../core-module/api-service/index/index-work-order';
import {
  WorkOrderConditionModel,
  WorkOrderStateResultModel,
  WorkOrderTypeModel
} from '../../shared/model/work-order-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FacilityEquipmentConfigModel} from '../../shared/model/facility-equipment-config.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {IndexWorkOrderStateEnum, IndexWorkOrderTypeEnum} from '../../../../core-module/enum/work-order/work-order.enum';
import {IndexApiService} from '../../service/index/index-api.service';
import {orderTabList} from '../../shared/const/index-const';
import {DeviceTabListEnum} from '../../shared/enum/index-enum';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {SessionUtil} from '../../../../shared-module/util/session-util';


/**
 * 工单详情卡（区域、工单状态、工单类型、工单列表）
 */
@Component({
  selector: 'app-facilities-work-order-list',
  templateUrl: './facilities-work-order-list.component.html',
  styleUrls: ['./facilities-work-order-list.component.scss']
})
export class FacilitiesWorkOrderListComponent extends MapControl implements OnInit {
  // 默认选中的工单类型
  public orderTypeRadioValue;
  // 选中的工单状态
  public orderStateCheckValue: string[];
  // 工单类型列表
  public workOrderTypeList: WorkOrderTypeModel[] = [];
  // 工单状态列表
  public workOrderStateList: WorkOrderStateResultModel[];
  // 可选择的表格下拉框
  public selectOption: Array<{ value: string, label: string }> = [];
  // 工单名称
  public titleName: string;
  // 区域数据
  public areaData: string[];
  // 显示的表格
  public isShowTable: boolean;
  // 工单类型组件配置
  public orderTypeComponent: FacilityEquipmentConfigModel;
  // 工单状态组件配置
  public orderStateComponent: FacilityEquipmentConfigModel;
  // 工单列表左侧tabList数据
  public orderTabList = orderTabList;
  // 工单列表左侧tabList选中数据
  public orderActive: string = DeviceTabListEnum.tabArea;
  // 左侧tabList数据枚举
  public deviceTabListEnum = DeviceTabListEnum;
  // 是否第一次点击
  public firstClick = true;
  // 工单类型选中结果
  public selectedWorkOrderType: string;
  // 无数据时显示暂无数据
  public noData: boolean = false;
  // 显示列表
  public showTable: boolean = false;
  // 工单类型查询模型
  private workOrderTypeModel: WorkOrderConditionModel = new WorkOrderConditionModel();
  // 工单状态查询模型
  private workOrderStateModel: WorkOrderConditionModel = new WorkOrderConditionModel();
  // 工单状态枚举
  private workOrderStatusEnum = IndexWorkOrderStateEnum;
  // 全量区域数据，包括子集区域数据
  private areaAllData: string[] = [];
  // 返回为空数据
  private isDataNull: string = 'noData';
  // 工单权限
  private procRoles: any[] = [];

  public constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $indexWorkOlder: IndexWorkOrderService,
    private $indexApiService: IndexApiService
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    // 表格默认巡检工单
    this.titleName = this.indexLanguage.inspectionWorkOrder;
    // 加载工单类型组件配置
    this.orderTypeComponentConfig();
    // 加载工单状态组件配置
    this.orderStateComponentConfig();
    this.procRoles = WorkOrderStatusUtil.checkProcAuthority(this.$nzI18n);
  }

  /**
   * 区域选择结果
   */
  public areaDataChange(chooseAreaData: string[]): void {
    // 初始化区域数据
    this.areaData = chooseAreaData;
    this.getAllAreaList(this.areaData).then((data: string[]) => {
      if (!data.length) {
        data.push(this.isDataNull);
      }
      // 加载工单类型
      this.queryWorkOrderTypeAndOrderNum(data);
      // 加载工单状态
      /*this.queryWorkOrderStateAndOrderNum(data).then((value: WorkOrderStateResultModel[]) => {
        this.workOrderStateList = value;
      });*/
    });
  }

  /**
   * 工单类型选中的结果
   */
  public workOrderTypeChange(chooseOrderTypeData: IndexWorkOrderTypeEnum): void {
    // 选择巡检工单
    this.selectedWorkOrderType = chooseOrderTypeData;
    if (chooseOrderTypeData === IndexWorkOrderTypeEnum.inspection) {
      this.isShowTable = false;
      this.titleName = this.indexLanguage.inspectionWorkOrder;
    }
    // 选择销障工单
    if (chooseOrderTypeData === IndexWorkOrderTypeEnum.clearFailure) {
      this.isShowTable = true;
      this.titleName = this.indexLanguage.clearBarrierWorkOrder;
    }
    // 选择拆除工单
    if (chooseOrderTypeData === IndexWorkOrderTypeEnum.remove) {
      this.isShowTable = true;
      this.titleName = this.indexLanguage.removeWorkOrder;
    }
    // 改变工单类型
    this.orderTypeRadioValue = chooseOrderTypeData;
    // 改变工单状态
    this.queryWorkOrderStateAndOrderNum(this.areaAllData).then((value: WorkOrderStateResultModel[]) => {
      this.workOrderStateList = value;
    });
  }

  public selectWorkOrderTypeChange(event): void {
    if (!this.workOrderTypeList || this.workOrderTypeList.length === 0) {
      return;
    }
    this.selectedWorkOrderType = event;
  }

  /**
   * 工单状态选中的结果
   */
  public workOrderStatusChange(chooseOrderStateData: string[]): void {
    // 选中的工单状态
    this.orderStateCheckValue = chooseOrderStateData || [];
    // 清除选择项
    this.selectOption = [];
    // 表格下拉框可选项
    if (chooseOrderStateData.length) {
      // 勾选工单状态时匹配工单表格下拉选项
      chooseOrderStateData.forEach(item => {
        (this.workOrderStateList || []).forEach(workOrderItem => {
          if (item === workOrderItem.status && workOrderItem.count) {
            this.selectOption.push({
              value: workOrderItem.status,
              label: this.indexLanguage[this.workOrderStatusEnum[workOrderItem.statusName]]
            });
          }
        });
      });
    } else {
      // 工单状态全部选中时匹配表格下拉选项
      (this.workOrderStateList || []).forEach(workOrderItem => {
        if (workOrderItem.count) {
          this.selectOption.push({
            value: workOrderItem.status,
            label: this.indexLanguage[this.workOrderStatusEnum[workOrderItem.statusName]]
          });
        }
      });
    }
  }

  public tabChange(activeKey: string): void {
    this.orderActive = activeKey;
    if (activeKey === this.deviceTabListEnum.workOrderStatus) {
      this.orderTypeComponent = {
        showFacilitiesComponent: false,
        showEquipmentComponent: false,
        showWorkOrderStatusComponent: false,
        showWorkOrderTypeComponent: true,
        facilityTitleName: this.indexLanguage.facilityTypeTitle,
        equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
      };
    } else if (activeKey === this.deviceTabListEnum.workOrderType) {
      this.orderTypeComponent = {
        showFacilitiesComponent: false,
        showEquipmentComponent: false,
        showWorkOrderStatusComponent: true,
        showWorkOrderTypeComponent: false,
        facilityTitleName: this.indexLanguage.facilityTypeTitle,
        equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
      };
    }
    this.firstClick = false;
  }

  /**
   * 工单类型组件配置
   */
  public orderTypeComponentConfig(): void {
    this.orderTypeComponent = {
      // 是否显示设施类型
      showFacilitiesComponent: false,
      // 是否显示设施设备类型
      showEquipmentComponent: false,
      // 是否显示工单状态类型
      showWorkOrderStatusComponent: false,
      // 是否显示工单类型类型
      showWorkOrderTypeComponent: true,
      // 工单类型title
      workOrderTypeTitleName: this.indexLanguage.workOrderType
    };
  }

  /**
   * 工单状态组件配置
   */
  public orderStateComponentConfig(): void {
    this.orderStateComponent = {
      // 是否显示设施类型
      showFacilitiesComponent: false,
      // 是否显示设施设备类型
      showEquipmentComponent: false,
      // 是否显示工单状态类型
      showWorkOrderStatusComponent: true,
      // 是否显示工单类型类型
      showWorkOrderTypeComponent: false,
      // 工单状态title
      workOrderStatusTitleName: this.indexLanguage.workOrderStatus
    };
  }

  /**
   * 首页查询工单类型统计
   */
  private queryWorkOrderTypeAndOrderNum(areaData: string[]): void {
    if (!this.procRoles || this.procRoles.length === 0) {
      this.workOrderTypeList = [];
      return;
    }
    // 查询模型赋值
    this.workOrderTypeModel.areaIdList = areaData;
    // 调用查询接口
    this.$indexWorkOlder.queryProcCountOverviewForHome(this.workOrderTypeModel).subscribe((result: ResultModel<WorkOrderTypeModel[]>) => {
      // 返回成功
      if (result.code === ResultCodeEnum.success) {
        this.workOrderTypeList = [];
        (result.data || []).forEach((workOrderTypeItem, i) => {
          this.workOrderTypeList.push({
            procType: workOrderTypeItem.procType,
            count: workOrderTypeItem.count,
            orderName: this.indexLanguage[workOrderTypeItem.procType === IndexWorkOrderTypeEnum.confirm ? 'alarmConfirm' : workOrderTypeItem.procType],
          });
        });
        // 判断用户是否有工单菜单权限,对应巡检、销障、拆除，取交集
        const newResult = [];
        this.workOrderTypeList.forEach(item => {
          const res = this.procRoles.find(v => v.value === item.procType);
          if (res && SessionUtil.checkHasTenantRole(res.tenant)) {
            newResult.push(item);
          }
        });
        this.workOrderTypeList = newResult;
        if (this.workOrderTypeList.length) {
          this.orderTypeRadioValue = this.workOrderTypeList[0].procType;
          this.selectedWorkOrderType = this.workOrderTypeList[0].procType;
          // 加载工单状态
          this.queryWorkOrderStateAndOrderNum(areaData).then((value: WorkOrderStateResultModel[]) => {
            this.workOrderStateList = value;
          });
        }
        this.showTable = true;
      } else {
        // 返回失败
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 首页查询工单状态统计
   */
  private queryWorkOrderStateAndOrderNum(areaData: string[]) {
    return new Promise((resolve, reject) => {
      // 查询模型赋值
      this.workOrderStateModel.deviceAreaIdList = areaData;
      this.workOrderStateModel.procType = this.orderTypeRadioValue;
      // 获取接口数据
      this.$indexWorkOlder.queryListOverviewGroupByProcStatusForHome(this.workOrderStateModel)
        .subscribe((result: ResultModel<WorkOrderStateResultModel[]>) => {
          // 返回成功
          if (result.code === ResultCodeEnum.success) {
            const list = [];
            // 遍历改造数据
            result.data.forEach(i => {
              list.push({status: i.status, statusName: i.statusName, count: i.count});
            });
            resolve(list);
          } else {
            // 返回失败
            reject();
            this.$message.error(result.msg);
          }
        });
    });
  }

  /**
   * 获取全量的区域数据，包括子集区域
   * param areaData
   */
  private getAllAreaList(areaData: string[]) {
    return new Promise((resolve, reject) => {
      this.$indexApiService.listAreaByAreaCodeList(areaData).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          result.data.forEach(item => {
            this.areaAllData.push(item.areaCode);
          });
          resolve(result.data.map(item => {
            return item.areaCode;
          }));
        } else {
          reject();
        }
      });
    });
  }
}
