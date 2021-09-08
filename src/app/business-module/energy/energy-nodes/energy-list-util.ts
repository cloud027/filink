import { FilterCondition, SortCondition } from '../../../shared-module/model/query-condition.model';
import { OperateTypeEnum } from '../../../shared-module/enum/page-operate-type.enum';
import { OperatorEnum } from '../../../shared-module/enum/operator.enum';
import { CommonUtil } from '../../../shared-module/util/common-util';
import {DeviceStatusEnum } from '../../../core-module/enum/facility/facility.enum';
import { EnergyServiceUrlConst } from '../share/const/energy-service-url.const';
import { ListExportModel } from '../../../core-module/model/list-export.model';
import { EquipmentStatusEnum,CommunicationEquipmentStatusEnum } from '../../../core-module/enum/equipment/equipment.enum';
import {ProjectSelectorConfigModel} from '../../../shared-module/model/project-selector-config.model';
/**
 * 表格配置
 */
export function initTableConfig(that) {
  that.tableConfig = {
    outHeight: 108,
    isDraggable: true,
    isLoading: true,
    primaryKey: '26-1',
    showSearchSwitch: true,
    showSizeChanger: true,
    showSearchExport: true,
    noIndex: true,
    showPagination: true,
    scroll: { x: '1800px', y: '600px' },
    columnConfig: [
      { type: 'select', fixedStyle: { fixedLeft: true, style: { left: '0px' } }, width: 62 },
      {
        // 序号
        type: 'serial-number',
        width: 62,
        title: that.language.serialNumber,
        fixedStyle: { fixedLeft: true, style: { left: '62px' } },
      },
      {
        // 名称
        title: that.language.energyConsumptionName,
        key: 'equipmentName',
        width: 180,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: { type: 'input' },
      },
      {
        // 类型
        title: that.language.productTypeId,
        key: 'equipmentType',
        width: 180,
        configurable: true,
        type: 'render',
        renderTemplate: that.equipmentTypeTemp,
        searchable: true,
        isShowSort: true,
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: that.deviceRoleTypes,
          label: 'label',
          value: 'code',
        },
      },
      {
        // 型号
        title: that.language.productModel,
        key: 'equipmentModel',
        width: 120,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'input',
        },
      },
      // 供应商
      {
        title: that.language.supplier,
        key: 'supplier',
        width: 120,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'input',
        },
      },
      // 软件版本
      {
        title: that.language.softwareVersionNumber,
        key: 'softwareVersion',
        width: 120,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'input',
        },
      },
      // 硬件版本
      {
        title: that.language.hardwareVersionNumber,
        key: 'hardwareVersion',
        width: 120,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'input',
        },
      },
      {
        // 设备ID
        title: that.language.equipmentId,
        key: 'sequenceId',
        width: 140,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'input',
        },
      },
      {
        // 项目
        title: that.language.projectId,
        key: 'projectName',
        searchKey: 'project',
        width: 180,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
            type: 'render', renderTemplate: that.projectFilterTemp
        },
      },
      {
        // 区域
        title: that.language.areaId,
        key: 'areaName',
        width: 120,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'input',
        },
      },
      {
        // 采集设施
        title: that.language.collectDeviceId,
        key: 'devicesName',
        type: 'render',
        renderTemplate: that.collentionDeviceRenderTemplate,
        width: 120,
        isShowSort: true,
        configurable: true,
        searchable: false,
        searchConfig: {
          type: 'render',
          renderTemplate: that.deviceFilterTemplate,
        },
      },
      {
        // 采集设备
        title: that.language.collectEquipmentId,
        key: 'equipmentsName',
        type: 'render',
        renderTemplate: that.collentionEquipmentRenderTemplate,
        width: 120,
        configurable: true,
        searchable: false,
        isShowSort: true,
        searchConfig: {
          type: 'render',
          renderTemplate: that.equipmentTemplate,
        },
      },
      {
        // 采集回路
        title: that.language.collectLoopId,
        key: 'loopsName',
        type: 'render',
        renderTemplate: that.collentionLoopRenderTemplate,
        width: 120,
        isShowSort: true,
        searchable: false,
        configurable: true,
        searchConfig: {
          type: 'render',
          renderTemplate: that.loopTemplate,
        },
      },
      {
        // 通信设备
        title: that.language.communicationEquipment,
        key: 'gatewayName',
        width: 120,
        configurable: true,
        isShowSort: true,
        searchable: true,
        searchConfig: { type: 'input' },
      },
      {
        // 通信设备状态
        title: that.language.communicationStatus,
        key: 'gatewayStatus',
        width: 140,
        configurable: true,
        isShowSort: true,
        searchable: true,
        type: 'render',
        renderTemplate: that.deviceStatusTemp,
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: getDeviceStatus(that.$nzI18n, null, that.languageEnum.facility),
          label: 'label',
          value: 'code',
        },
      },
      {
        // 能耗目标值(日)
        title: that.language.energyConsumptionTarget,
        key: 'energyConsumptionTarget',
        width: 140,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: { type: 'input' },
      },
      {
        // 详细地址
        title: that.language.detailedAddress,
        key: 'address',
        width: 125,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: { type: 'input' },
      },
      {
        // 备注
        title: that.language.remarks,
        key: 'remarks',
        width: 125,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'input',
        },
      },
      {
        title: that.language.operate,
        searchable: true,
        searchConfig: { type: 'operate' },
        key: '',
        width: 150,
        fixedStyle: { fixedRight: true, style: { right: '0px' } },
      },
    ],
    // 头部按钮
    topButtons: [
      {
        // 新增
        text: that.language.add,
        iconClassName: 'fiLink-add-no-circle',
        permissionCode: '26-1-2',
        handle: () => {
          that.navigateToDetail('business/energy/energy-nodes/insert', {
            queryParams: { type: OperateTypeEnum.add },
          });
        },
      },
      {
        // 删除
        text: that.commonLanguage.deleteBtn,
        btnType: 'danger',
        permissionCode: '26-1-7',
        needConfirm: true,
        canDisabled: true,
        className: 'table-top-delete-btn',
        iconClassName: 'fiLink-delete',
        confirmContent: that.language.deleteFacilityMsg,
        handle: (currentIndex) => {
          that.deleteDeviceByIds(currentIndex);
        },
      },
    ],
    // 表格的操作按钮
    operation: [
      // 详情
      {
        text: that.language.detailHandle,
        className: 'fiLink-view-detail',
        permissionCode: '26-1-3',
        handle: (currentIndex) => {
          that.navigateToDetail('business/energy/energy-nodes/nodes-details', {
            queryParams: { id: currentIndex.energyConsumptionNodeId },
          });
        },
      },
      // {
      //     // 设备配置
      //     permissionCode: '03-8-4',
      //     text: that.language.deviceConfiguration,
      //     className: 'fiLink-business-info',
      //     handle: (data: EquipmentListModel) => {
      //         // 设备配置弹框开启
      //         const equipmentModel = { equipmentModel: data.equipmentModel }
      //         that.getPramsConfig(equipmentModel)
      //         that.equipmentConfigId = data.equipmentId
      //         that.equipmentConfigType = data.equipmentType
      //     }
      // },
      // 编辑
      {
        text: that.language.updateHandle,
        permissionCode: '26-1-4',
        className: 'fiLink-edit',
        handle: (currentIndex) => {
          that.navigateToDetail('business/energy/energy-nodes/update', {
            queryParams: { id: currentIndex.energyConsumptionNodeId },
          });
        },
      },
      {
        // 删除
        text: that.language.deleteHandle,
        className: 'fiLink-delete red-icon',
        permissionCode: '26-1-7',
        btnType: 'danger',
        iconClassName: 'fiLink-delete',
        needConfirm: true,
        canDisabled: false,
        confirmContent: that.language.deleteEnergyNodesMsg,
        handle: (currentIndex) => {
          that.deleteDeviceByIds([currentIndex]);
        },
      },
    ],
    // 过滤
    sort: (event: SortCondition) => {
      that.queryCondition.sortCondition.sortField = event.sortField;
      that.queryCondition.sortCondition.sortRule = event.sortRule;
      that.refreshData();
    },
    //   搜索/重置按钮
    handleSearch: (event: FilterCondition[]) => {
      if (!event.length) {
        that.selectList = [];
        that.selectProjectName = {};
        that.checkProject = new ProjectSelectorConfigModel();
      }
        that.queryCondition.pageCondition.pageNum = 1;
        that.queryCondition.filterConditions = event;
      that.refreshData();
    },
    //  导出数据
    handleExport: (event: ListExportModel<any[]>) => {
      that.handelExportEquipment(event);
    },
  };
}

function handleFilter(filters: FilterCondition[], that) {
  const filterEvent = [];
  filters.forEach((item) => {
    switch (item.filterField) {
      case 'deviceName':
        // 设施名称
        if (that.checkTroubleData.deviceName) {
          filterEvent.push({
            filterField: 'deviceId',
            filterValue: that.checkTroubleData.deviceId,
            operator: OperatorEnum.eq,
          });
        }
        break;
      case 'equipment':
        // 设备名称
        if (that.checkTroubleObject.ids) {
          filterEvent.push({
            filterField: 'equipment.equipmentId',
            filterValue: that.checkTroubleObject.ids,
            operator: OperatorEnum.in,
          });
        }
        break;
      case 'assignDeptName':
        // 责任单位
        filterEvent.push({
          filterField: 'deptId',
          filterValue: item.filterValue,
          operator: OperatorEnum.in,
        });
        break;
      default:
        filterEvent.push(item);
    }
  });
  return filterEvent;
}
// 状态
function getDeviceStatus(i18n, code = null, language) {
  return CommonUtil.codeTranslate(CommunicationEquipmentStatusEnum, i18n, code, language);
}
/**
 * 区域告警等模板数据清除
 */
export function clearData(that) {}
