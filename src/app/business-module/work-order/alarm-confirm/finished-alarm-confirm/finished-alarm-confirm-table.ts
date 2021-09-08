import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {FilterCondition, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {AlarmConfirmWorkOrderModel} from '../../../../core-module/model/work-order/alarm-confirm.model';
import {SelectOrderEquipmentModel} from '../../share/model/select-order-equipment.model';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {ChartTypeEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DefaultAlarmType} from '../../share/const/work-order.const';

/**
 * 历史告警确认工单列表配置
 */
export class FinishedAlarmConfirmTable {
  // 已选择工单id
  private static selectDataId: string[] = [];

  /**
   *  初始化列表配置
   */
  public static initHistoryAlarmConfig(that) {
    that.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-5-2',
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      searchReturnType: 'array',
      noIndex: false,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          // 工单名称
          title: that.workOrderLanguage.name, key: 'title', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          configurable: false, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          // 工单状态
          title: that.workOrderLanguage.status,  key: 'status', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchKey: 'status',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: [
              {label: that.workOrderLanguage.completed, value: WorkOrderStatusEnum.completed},
              {label: that.workOrderLanguage.singleBack, value: WorkOrderStatusEnum.singleBack},
            ]
          },
          type: 'render',
          renderTemplate: that.statusTemp,
        },
        {
          // 设施类型
          title: that.workOrderLanguage.deviceType,  key: 'deviceType', width: 130,
          isShowSort: true, configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.deviceTemp,
        },
        {
          // 设施名称
          title: that.workOrderLanguage.deviceName, key: 'deviceName', width: 160,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'deviceId',
          searchConfig: {type: 'render', renderTemplate: that.deviceNameSearch},
        },
        {
          // 设备类型
          title: that.workOrderLanguage.equipmentType, key: 'equipmentType', width: 190,
          configurable: true,
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.equipTemp,
        },
        {
          // 设备名称
          title: that.workOrderLanguage.equipmentName, key: 'equipmentName', width: 150,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'equipment.equipmentId',
          searchConfig: {type: 'render', renderTemplate: that.equipmentSearch},
        },
        {
          // 设施区域
          title: that.workOrderLanguage.deviceArea, key: 'deviceAreaName', width: 150,
          configurable: true, isShowSort: true, searchable: true,
          searchKey: 'deviceAreaCode',
          searchConfig: {type: 'render', renderTemplate: that.areaSearch},
        },
        {
          // 期望完工时间
          title: that.workOrderLanguage.completeTime, key: 'realityCompletedTime',
          configurable: true, isShowSort: true,
          searchable: true, width: 170,
          pipe: 'date', searchConfig: {type: 'dateRang'}
        },
        {
          // 关联告警
          title: that.workOrderLanguage.relevancyAlarm, key: 'refAlarmName',
          configurable: true, isShowSort: true, searchKey: 'refAlarmName',
          searchable: true, width: 150,
          searchConfig: {type: 'input'},
          type: 'render',
          renderTemplate: that.refAlarmTemp,
        },
        {
          // 待确定原因
          title: that.inspectionLanguage.confirmReason, key: 'uncertainReason',
          configurable: true, width: 150, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          // 实际告警原因
          title: that.inspectionLanguage.realAlarmReason, key: 'realityAlarmReason',
          configurable: true, width: 150, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          // 责任单位
          title: that.inspectionLanguage.responsibleUnit, key: 'accountabilityDeptName',
          configurable: true, isShowSort: true, searchKey: 'accountabilityDept',
          searchable: true,  width: 150,
          searchConfig: {
            type: 'render',
            renderTemplate: that.unitNameSearch
          }
        },
        {
          // 责任人
          title: that.inspectionLanguage.responsible, key: 'assignName', width: 140,
          configurable: true, searchKey: 'assign',
          searchable: true, isShowSort: true,
          searchConfig: {type: 'render', renderTemplate: that.userSearchTemp},
        },
        {
          title: that.inspectionLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        { // 重新生成
          text: that.inspectionLanguage.regenerate,
          permissionCode: '06-5-2-1',
          key: 'isShowTurnBackConfirmIcon',
          className: 'fiLink-rebuild-order',
          needConfirm: true,
          confirmContent: that.workOrderLanguage.turnBackConfirmContent,
          handle: (data: AlarmConfirmWorkOrderModel) => {
            that.$router.navigate(['business/work-order/alarm-confirm/finished-list/rebuild'],
              {queryParams: {procId: data.procId, type: WorkOrderPageTypeEnum.rebuild, operateFrom: WorkOrderPageTypeEnum.finished}}).then();
          }
        },
        {  // 图片
          text: that.inspectionLanguage.relatedPictures,
          permissionCode: '06-5-2-2',
          className: 'fiLink-view-photo',
          handle: (data: AlarmConfirmWorkOrderModel) => {
            if (data.equipment && data.equipment.length) {
              that.$workOrderCommonUtil.queryImageForView(data.equipment[0].equipmentId, data.procId, '2', '2');
            } else {
              that.$workOrderCommonUtil.queryImageForView(data.deviceId, data.procId);
            }
          }
        },
        {
          // 详情
          text: that.workOrderLanguage.orderDetail,
          permissionCode: '06-5-2-3',
          className: 'fiLink-view-detail',
          handle: (currentIndex: AlarmConfirmWorkOrderModel) => {
            that.$router.navigate(['business/work-order/alarm-confirm/history-alarm-confirm-detail'],
              {queryParams: {id: currentIndex.procId, type: WorkOrderPageTypeEnum.finished}}).then();
          }
        },
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        that.queryCondition.sortCondition = event;
        that.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        if (event.length === 0) {
          that.isReset = true;
          // 设施
          that.filterObj.deviceName = '';
          that.filterObj.deviceIds = [];
          that.initDeviceObjectConfig();
          // 设备
          that.selectEquipments = [];
          that.checkEquipmentObject = new SelectOrderEquipmentModel();
          // 区域
          that.filterObj.areaName = '';
          FacilityForCommonUtil.setAreaNodesStatus(that.areaNodes || [], null);
          // 责任人
          that.selectUserList = [];
        }
        that.queryCondition.pageCondition.pageNum = 1;
        that.queryCondition.filterConditions = event;
        that.refreshData();
      },
      handleSelect: (event) => {
        FinishedAlarmConfirmTable.selectDataId = event.map(v => v.procId);
      },
      handleExport: (event: ListExportModel<any[]>) => {
        that.exportParams.columnInfoList = event.columnInfoList;
        const params = ['status', 'realityCompletedTime', 'equipmentType', 'deviceType'];
        that.exportParams.columnInfoList.forEach(item => {
          if (params.indexOf(item.propertyName) > -1) {
            item.isTranslation = 1;
          }
        });
        that.exportParams.queryCondition = that.queryCondition;
        const index = that.exportParams.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
        if (FinishedAlarmConfirmTable.selectDataId.length) {
          if (index > -1) {
            that.exportParams.queryCondition.filterConditions[index].filterValue = FinishedAlarmConfirmTable.selectDataId;
            that.exportParams.queryCondition.filterConditions[index].operator = OperatorEnum.in;
          } else {
            that.exportParams.queryCondition.filterConditions.push({filterField: '_id', filterValue: FinishedAlarmConfirmTable.selectDataId, operator: OperatorEnum.in});
          }
        } else {
          const i = that.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
          if (i > -1) {
            that.queryCondition.filterConditions.splice(i, 1);
            that.exportParams.queryCondition = that.queryCondition;
          }
        }
        that.exportParams.excelType = event.excelType;
        that.$alarmWorkOrderService.alarmHistoryOrderExport(that.exportParams).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            that.$message.success(that.inspectionLanguage.operateMsg.exportSuccess);
          } else {
            that.$message.error(result.msg);
          }
        });
      }
    };
  }

  /**
   * 获取告警类型统计
   */
  public static getStatisticsByAlarmType(that, levelList): void {
    const chartData = [];
    const legend = [];
    const colors = ['#f5a04e', '#00adcf', '#9186e0', '#efc136', '#f65f31', '#34eec2', '#d84c29'];
    let total = 0;
    if (!levelList || levelList.length === 0) {
      levelList = DefaultAlarmType;
    }
    levelList.forEach(item => {
      total += item.count;
      legend.push(item.label);
      chartData.push({
        value: item.count,
        name: item.label
      });
    });
    that.alarmChartType = ChartTypeEnum.chart;
    that.ringChartOption = ChartUtil.historyAlarmOrderChart(legend, chartData, colors, that.workOrderLanguage.alarmType);
  }
}
