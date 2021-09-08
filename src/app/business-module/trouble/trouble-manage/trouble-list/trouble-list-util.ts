import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TROUBLE_FLOW} from '../../share/const/trouble-process.const';
import {SelectDeviceModel} from '../../../../core-module/model/facility/select-device.model';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {SelectEquipmentModel} from '../../../../core-module/model/equipment/select-equipment.model';
import {TroubleModel} from '../../../../core-module/model/trouble/trouble.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {HandleStatusEnum, TroubleSourceEnum} from '../../../../core-module/enum/trouble/trouble-common.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {TroubleUtil} from '../../../../core-module/business-util/trouble/trouble-util';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {IsShowUintEnum} from '../../share/enum/trouble.enum';
import {ListExportModel} from '../../../../core-module/model/list-export.model';


/**
 * 表格配置
 */
export function initTableConfig(that) {
  that.tableConfig = {
    outHeight: 108,
    isDraggable: true,
    isLoading: false,
    primaryKey: '14-1',
    showSearchSwitch: true,
    showSizeChanger: true,
    showSearchExport: true,
    searchReturnType: 'array',
    noIndex: false,
    scroll: {x: '1200px', y: '600px'},
    columnConfig: [
      {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
      {
        // 故障编号
        title: that.language.troubleCode, key: 'troubleCode', width: 140, isShowSort: true,
        configurable: true,
        searchable: true,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}},
        searchConfig: {type: 'input'}
      },
      {
        // 处理状态
        title: that.language.handleStatus, key: 'handleStatus', width: 120,
        type: 'render', isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: TroubleUtil.translateHandleStatus(that.$nzI18n), label: 'label', value: 'code'
        },
        renderTemplate: that.handleStatusTemp
      },
      {
        // 故障级别
        title: that.language.troubleLevel, key: 'troubleLevel', width: 150,
        type: 'render', isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: AlarmForCommonUtil.translateAlarmLevel(that.$nzI18n), label: 'label', value: 'code',
        },
        renderTemplate: that.troubleLevelTemp
      },
      {
        // 故障类型
        title: that.language.troubleType, key: 'troubleType', width: 160,
        configurable: true, isShowSort: true,
        searchable: true,
        searchKey: 'troubleType',
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: that.troubleTypeList,
        },
      },
      {
        // 故障来源
        title: that.language.troubleSource, key: 'troubleSource', width: 150,
        configurable: true, isShowSort: true,
        searchable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: TroubleUtil.translateTroubleSource(that.$nzI18n), label: 'label', value: 'code',
        },
      },
      {
        // 设施类型
        title: that.language.alarmSourceType, key: 'deviceType', width: 120,
        configurable: true, isShowSort: true,
        searchable: true,
        type: 'render',
        renderTemplate: that.troubleDeviceType,
        searchConfig: {
          type: 'select', selectType: 'multiple', selectInfo: that.deviceRoleTypes, label: 'label', value: 'code'
        }
      },
      {
        // 故障设施
        title: that.language.troubleFacility, key: 'deviceName', width: 120,
        searchKey: 'deviceId', isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'render',
          renderTemplate: that.facilityTemp
        },
      },
      {
        // 故障设备
        title: that.language.troubleEquipment, key: 'equipment', width: 120,
        searchKey: 'equipment.equipmentId',
        configurable: true, isShowSort: true,
        searchable: true,
        type: 'render',
        searchConfig: {
          type: 'render',
          renderTemplate: that.equipmentTemp
        },
        renderTemplate: that.troubleEquipment
      },
      {
        // 故障描述
        title: that.language.troubleDescribe, key: 'troubleDescribe', width: 120,
        searchable: true, isShowSort: true,
        configurable: true,
        type: 'render',
        renderTemplate: that.refAlarmTemp,
        searchConfig: {type: 'input'}
      },
      {
        // 创建时间
        title: that.language.createTime, key: 'createTime', width: 180,
        pipe: 'date',
        configurable: true,
        isShowSort: true,
        searchable: true,
        searchKey: 'createTime',
        searchConfig: {type: 'dateRang'}
      },
      {
        // 处置时间
        title: that.language.handleTime, key: 'handleTime', width: 180,
        pipe: 'date',
        configurable: true,
        isShowSort: true,
        searchable: true,
        searchKey: 'handleTime',
        searchConfig: {type: 'dateRang'}
      },
      {
        // 填报人
        title: that.language.reportUserName, key: 'reportUserName', width: 125, isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 处理责任人
        title: that.language.person, key: 'assignUserName', width: 125, isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 处理进度
        title: that.language.handleProgress, key: 'currentHandleProgress', width: 125,
        configurable: true,
        searchable: false,
        searchConfig: {}
      },
      {
        // 发生时间
        title: that.language.happenTime, key: 'happenTime', width: 180,
        pipe: 'date',
        configurable: true,
        isShowSort: true,
        searchable: true,
        searchKey: 'happenTime',
        searchConfig: {type: 'dateRang'}
      },
      {
        // 责任单位
        title: that.language.deptName, key: 'assignDeptName', width: 180, isShowSort: true,
        searchKey: 'deptId',
        configurable: true,
        searchable: true,
        searchConfig: {type: 'render', renderTemplate: that.UnitNameSearch}
      },
      {
        // 备注
        title: that.language.troubleRemark, key: 'troubleRemark', width: 200,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: that.language.operate, searchable: true,
        searchConfig: {type: 'operate'},
        key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ],
    showPagination: false,
    showEsPagination: false,
    bordered: false,
    showSearch: false,
    topButtons: [
      {
        // 新增
        text: that.language.add,
        iconClassName: 'fiLink-add-no-circle',
        permissionCode: '14-1-1',
        handle: () => {
          that.navigateToDetail('business/trouble/trouble-list/add',
            {queryParams: {type: OperateTypeEnum.add}});
        }
      },
      {
        // 删除
        text: that.commonLanguage.deleteBtn,
        btnType: 'danger',
        canDisabled: true,
        permissionCode: '14-1-3',
        className: 'table-top-delete-btn',
        iconClassName: 'fiLink-delete',
        handle: (data: TroubleModel[]) => {
          let flag = true;
          for (let i = 0; i < data.length; i++) {
            if (data[i].handleStatus !== HandleStatusEnum.uncommit && data[i].handleStatus !== HandleStatusEnum.done &&
              data[i].handleStatus !== HandleStatusEnum.undone) {
              flag = false;
              break;
            }
          }
          if (flag) {
            // 组件中的确定取消按钮是反的所以反正用
            that.modalService.confirm({
              nzTitle: that.language.prompt,
              nzContent: that.language.troubleAffirmDelete,
              nzOkText: that.language.cancelText,
              nzCancelText: that.language.okText,
              nzOkType: 'danger',
              nzOnOk: () => {
              },
              nzOnCancel: () => {
                that.tableConfig.isLoading = true;
                const ids = data.filter(item => item.checked).map(item => item.id);
                that.deleteTrouble(ids);
              }
            });
          } else {
            that.$message.info(that.language.deleteTroubleMsg);
          }
        }
      },
    ],
    moreButtons: [
      {
        // 指派
        text: that.language.designate,
        iconClassName: 'fiLink-filink-zhipai-icon',
        permissionCode: '14-1-4',
        btnType: 'danger',
        handle: (data: TroubleModel[]) => {
          // 选择一条数据指派根据流程来判断
          if (data && data.length === 1) {
            if (data[0].handleStatus === HandleStatusEnum.uncommit) {
              toAssign(data, that);
            } else if (data[0].handleStatus === HandleStatusEnum.processing &&
              (data[0].progessNodeId === TROUBLE_FLOW.five || data[0].progessNodeId === TROUBLE_FLOW.seven ||
                data[0].progessNodeId === TROUBLE_FLOW.eight || data[0].progessNodeId === TROUBLE_FLOW.ten)) {
              toAssign(data, that);
            } else {
              that.$message.error(that.language.noAssign);
            }
          } else if (data && data.length > 1) {
            // 选择多条数据指派根据处理状态判断
            const isAssignData = that.isDesignate(data);
            data.forEach(item => {
              if (item.troubleSourceCode === TroubleSourceEnum.alarm) {
                return that.isAssignShowUnit = IsShowUintEnum.no;
              }
            });
            if (isAssignData.flag) {
              const ids = data.map(item => item.id);
              that.navigateToDetail('business/trouble/trouble-list/assign',
                {queryParams: {
                  handleStatus: HandleStatusEnum.uncommit,
                    flowId: null,
                    areaCode: isAssignData.areaCodes.join(','),
                    id: ids.join(','),
                    isAssignShowUnit: that.isAssignShowUnit,
                }
                });
            }
          } else {
            that.$message.info(that.language.pleaseCheckThe);
          }
        }
      },
      {
        // 勾选备注
        text: that.language.troubleRemark,
        iconClassName: 'fiLink-filink-beizhu-icon',
        permissionCode: '14-1-5',
        btnType: 'danger',
        handle: (data: TroubleModel[]) => {
          if (data && data.length) {
            that.remarkTable = true;
            if (data.length === 1) {
              that.formStatusRemark.resetControlData('remark', data[0].troubleRemark);
            } else {
              that.formStatusRemark.resetControlData('remark', '');
            }
            that.checkRemark = data;
          } else {
            that.$message.info(that.language.pleaseCheckThe);
          }
        }
      }
    ],
    operation: [
      {
        // 编辑
        text: that.language.update,
        permissionCode: '14-1-2',
        className: 'fiLink-edit',
        key: 'isShowEdit',
        handle: (currentIndex: TroubleModel) => {
          that.navigateToDetail('business/trouble/trouble-list/update',
            {queryParams: {type: OperateTypeEnum.update, id: currentIndex.id, sourceType: currentIndex.troubleSourceCode}});
        }
      },
      {
        // 定位
        text: that.language.location,
        key: 'isShowBuildOrder',
        permissionCode: '14-1-7',
        className: 'fiLink-location',
        disabledClassName: 'fiLink-location disabled-icon',
        handle: (e: TroubleModel) => {
          if (e.troubleSourceCode === TroubleSourceEnum.alarm) {
            that.navigateToDetail('business/index', {queryParams: {equipmentId: e.equipment[0].equipmentId}});
          } else {
            that.navigateToDetail('business/index', {queryParams: {deviceId: e.deviceId}});
          }
        }
      },
      {
        // 详情
        text: that.language.viewDetail,
        permissionCode: '14-1-6',
        className: 'fiLink-view-detail',
        handle: (currentIndex: TroubleModel) => {
          that.navigateToDetail('business/trouble/trouble-list/trouble-detail',
            {queryParams: {id: currentIndex.id}});
        }
      },
      {
        // 流程查看
        text: that.language.viewProcess,
        permissionCode: '14-1-8',
        className: 'fiLink-trouble-flow',
        key: 'isShowFlow',
        disabledClassName: 'fiLink-trouble-flow disabled-icon',
        handle: (currentIndex: TroubleModel) => {
          that.navigateToDetail('business/trouble/trouble-list/flow',
            {queryParams: {instanceId: currentIndex.instanceId, id: currentIndex.id}});
        }
      },
      {
        // 删除
        text: that.commonLanguage.deleteBtn,
        key: 'isDelete',
        permissionCode: '14-1-3',
        className: 'fiLink-delete red-icon',
        disabledClassName: 'fiLink-delete disabled-red-icon',
        needConfirm: true,
        handle: (currentIndex: TroubleModel) => {
          that.tableConfig.isLoading = false;
          that.deleteTrouble([currentIndex.id]);
        }
      },
    ],
    leftBottomButtons: [],
    sort: (event: SortCondition) => {
      that.queryCondition.sortCondition.sortField = event.sortField;
      that.queryCondition.sortCondition.sortRule = event.sortRule;
      that.refreshData();
    },
    handleSearch: (event: FilterCondition[]) => {
      that.queryCondition.filterConditions = [];
      if (!event.length) {
        clearData(that);
        that.isClickSlider = false;
        that.queryCondition.pageCondition = {pageSize: that.pageBean.pageSize, pageNum: 1};
        that.refreshData();
      } else {
        const filterEvent = handleFilter(event);
        that.pageBean = new PageModel();
        that.queryCondition.filterConditions = filterEvent;
        that.queryCondition.pageCondition = {pageSize: that.pageBean.pageSize, pageNum: that.pageBean.pageIndex};
        that.refreshData();
      }
    },
    handleExport: (event: ListExportModel<TroubleModel[]>) => {
      const propertyName = ['equipment', 'happenTime', 'createTime', 'handleTime'];
      event.columnInfoList.forEach(item => {
        if (propertyName.indexOf(item.propertyName) !== -1) {
          item.isTranslation = 1;
          }
        }
      );
      // 处理参数
      const body = {
        queryCondition: new QueryConditionModel(),
        columnInfoList: event.columnInfoList,
        excelType: event.excelType,
      };
      // 处理选择的项目
      if (event.selectItem.length > 0) {
        body.queryCondition.filterConditions = [];
        body.queryCondition.filterConditions.push({
          filterField: 'id',
          operator: OperatorEnum.in,
          filterValue: event.selectItem.map(item => item.id)
        });
      } else {
        body.queryCondition.filterConditions = handleFilter(event.queryTerm);
      }
      that.exportTrouble(body);
    }
  };
}

/**
 * 跳转指派页面
 */
function toAssign(data: TroubleModel[], that) {
  const paramsObj = {
    // 处理状态
    handleStatus: data[0].handleStatus,
    // 故障ID
    id: data[0].id,
    // 区域code
    areaCode: data[0].areaCode,
    // 指派页是否展示单位
    isAssignShowUnit: IsShowUintEnum.yes,
  };
  that.navigateToDetail('business/trouble/trouble-list/assign',
    {queryParams: paramsObj});
}

/**
 * 过滤条件处理
 */
function handleFilter(filters: FilterCondition[]) {
  filters.forEach(item => {
    const filterFieldArr = ['deviceId', 'equipment.equipmentId', 'deptId'];
    if (filterFieldArr.includes(item.filterField)) {
      item.operator = OperatorEnum.in;
    }
  });
  return filters;
}

/**
 * 区域告警等模板数据清除
 */
export function clearData(that) {
  // 单位清空
  that.selectUnitName = '';
  FacilityForCommonUtil.setTreeNodesStatus(that.treeNodes, []);
  // 故障设施
  that.checkTroubleData = new SelectDeviceModel();
  that.initTroubleObjectConfig();
  // 故障设备
  that.checkTroubleObject = new SelectEquipmentModel();
  that.selectEquipments = [];
}
