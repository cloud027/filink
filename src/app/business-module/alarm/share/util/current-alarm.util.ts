import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmSelectorInitialValueModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {AlarmCleanStatusEnum} from '../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmConfirmStatusEnum} from '../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {AlarmRemarkModel} from '../../../../core-module/model/alarm/alarm-remark.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {AlarmIsAutoCheckDisEnum, AlarmIsAutoDiagnoseEnum, AlarmIsAutoTurnMalEnum} from '../enum/alarm.enum';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {AlarmTemplateDataModel} from '../model/alarm-template-data.model';

export class CurrentAlarmUtil {
  /**
   * 表格配置
   */
  public static initTableConfig(that) {
    that.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-1',
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      noIndex: true,
      searchReturnType: 'array',
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {
          type: 'expend', width: 30, expendDataKey: 'alarmCorrelationList', fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '30px'}}, width: 92},
        {
          key: 'serialNumber', width: 62, title: that.language.serialNumber, fixedStyle: {fixedLeft: true, style: {left: '122px'}}
        },
        {
          // 告警名称
          title: that.language.alarmName, key: 'alarmName', width: 180, isShowSort: true,
          searchable: true, searchKey: 'alarmName',
          searchConfig: {
            type: 'render',
            renderTemplate: that.alarmName
          },
          fixedStyle: {fixedLeft: true, style: {left: '184px'}}
        },
        {
          // 告警级别
          title: that.language.alarmFixedLevel, key: 'alarmFixedLevel', width: 120, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(that.$nzI18n), label: 'label', value: 'code'
          },
          renderTemplate: that.alarmFixedLevelTemp
        },
        {
          // 告警对象
          title: that.language.alarmobject, key: 'alarmObject', width: 180, isShowSort: true,
          searchKey: 'alarmSource',
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: that.alarmEquipmentTemp
          },
        },
        {
          // 设备类型
          title: that.language.equipmentType, key: 'alarmSourceTypeId', width: 150, isShowSort: true,
          type: 'render',
          configurable: true,
          searchKey: 'alarm_source_type_id',
          searchable: true,
          renderTemplate: that.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n), label: 'label', value: 'code'
          },
        },
        {
          // 设施名称
          title: that.language.deviceName, key: 'alarmDeviceName', width: 150, isShowSort: true,
          searchKey: 'alarmDeviceId',
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: that.deviceNameTemp
          },
        },
        {
          // 设施类型
          title: that.language.alarmSourceType, key: 'alarmDeviceTypeId', width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchKey: 'alarm_device_type_id',
          type: 'render',
          renderTemplate: that.alarmSourceTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: that.deviceRoleTypes, label: 'label',
            value: 'code'
          }
        },
        {
          // 区域
          title: that.language.area, key: 'areaName', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'area_id',
          searchConfig: {
            type: 'render',
            renderTemplate: that.areaSelectorTemp
          },
        },
        {
          // 告警类别
          title: that.language.AlarmType, key: 'alarmClassification', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchKey: 'alarmClassification',
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: that.alarmTypeList
          },
        },
        {
          // 责任单位
          title: that.language.responsibleDepartment, key: 'responsibleDepartment', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input',
          }
        },
        {
          // 频次
          title: that.language.alarmHappenCount, key: 'alarmHappenCount', width: 80, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: that.frequencyTemp,
          }
        },
        {
          // 清除状态
          title: that.language.alarmCleanStatus, key: 'alarmCleanStatus', width: 125, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          renderTemplate: that.isCleanTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: that.language.noClean, value: AlarmCleanStatusEnum.noClean},
              {label: that.language.isClean, value: AlarmCleanStatusEnum.isClean},
              {label: that.language.deviceClean, value: AlarmCleanStatusEnum.deviceClean}
            ]
          }
        },
        {
          // 确认状态
          title: that.language.alarmConfirmStatus, key: 'alarmConfirmStatus', width: 120, isShowSort: true,
          type: 'render',
          configurable: true,
          searchable: true,
          renderTemplate: that.isConfirmTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: that.language.isConfirm, value: AlarmConfirmStatusEnum.isConfirm},
              {label: that.language.noConfirm, value: AlarmConfirmStatusEnum.noConfirm}
            ]
          }
        },
        {
          // 首次发生时间
          title: that.language.alarmBeginTime, key: 'alarmBeginTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 备注
          title: that.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: that.language.operate, searchable: true,
          searchConfig: {
            type: 'operate',
            /********暂时屏蔽掉**********/
            customSearchHandle: () => {
              that.display.templateTable = true;
            }
          },
          key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 告警确认
          text: that.language.alarmConfirm,
          btnType: 'danger',
          iconClassName: 'fiLink-turn-back-confirm',
          permissionCode: '02-1-1',
          handle: (data: AlarmListModel) => {
            that.alarmConfirm(data);
          }
        },
        {
          // 告警清除
          text: that.language.alarmClean,
          btnType: 'danger',
          iconClassName: 'fiLink-clear',
          permissionCode: '02-1-2',
          handle: (data: AlarmListModel) => {
            that.alarmClean(data);
          }
        },
      ],
      moreButtons: [
        {
          // 编辑备注
          text: that.language.updateRemark,
          permissionCode: '02-1-4',
          canDisabled: true,
          iconClassName: 'fiLink-edit-item',
          handle: (data: AlarmListModel[]) => {
            if (data && data.length) {
              that.display.remarkTable = true;
              that.formStatusRemark.resetControlData('remark', '');
              that.checkRemark = data;
            } else {
              that.$message.info(that.language.pleaseCheckThe);
            }
          }
        },
        {
          // 诊断设置
          text: that.language.diagnosticSet,
          iconClassName: 'fiLink-setup',
          permissionCode: '02-1-7',
          handle: () => {
            that.display.diagnoseSet = true;
            that.getDiagnosticData();
          }
        },
      ],
      operation: [
        // build2功能
        {
          // 定位
          text: that.language.location,
          key: 'isShowBuildOrder',
          permissionCode: '02-1-3',
          className: 'fiLink-location',
          disabledClassName: 'fiLink-location alarm-disabled-icon',
          handle: (e: AlarmListModel) => {
            that.navigateToDetail('business/index', {queryParams: {equipmentId: e.alarmSource}});
          }
        },
        {
          // 修改备注
          text: that.language.updateRemark,
          permissionCode: '02-1-4',
          key: 'isShowRemark',
          className: 'fiLink-edit',
          handle: (currentIndex: AlarmRemarkModel) => {
            that.display.remarkTable = true;
            that.formStatusRemark.resetControlData('remark', currentIndex.remark);
            that.checkRemark = [currentIndex];
          }
        },
        {
          // 查看图片
          text: that.language.viewPicture,
          className: 'fiLink-view-photo',
          permissionCode: '02-1-5',
          key: 'isShowViewIcon',
          disabledClassName: 'fiLink-view-photo alarm-disabled-icon',
          handle: (e: AlarmListModel) => {
            // 查看图片
            that.examinePicture(e);
          }
        },
        {
          // 诊断详情
          text: that.language.alarmDiagnose,
          key: 'isShowBuildOrder',
          permissionCode: '02-1-6',
          className: 'fiLink-diagnose-details',
          disabledClassName: 'fiLink-diagnose-details alarm-disabled-icon',
          handle: (e: AlarmListModel) => {
            that.navigateToDetail('/business/alarm/diagnose-details',
              {queryParams: {type: that.pageType, alarmId: e.id}});
          }
        }
      ],
      leftBottomButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        if (event.sortField === 'alarmContinousTimeName') {
          // 当进行告警持续时间排序时 传给后台的是 alarmContinousTime 这个参数
          that.queryCondition.sortCondition.sortField = 'alarmContinousTime';
        } else {
          that.queryCondition.sortCondition.sortField = event.sortField;
        }
        that.queryCondition.sortCondition.sortRule = event.sortRule;
        if (that.templateId) {
          const data = new AlarmTemplateDataModel(new PageCondition(that.pageBean.pageIndex, that.pageBean.pageSize), that.queryCondition.sortCondition);
          that.templateList(data);
        } else {
          that.refreshData();
        }
      },
      // 打开表格搜索事件
      openTableSearch: () => {
        that.tableConfig.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item.searchConfig.selectInfo = that.alarmTypeList;
          }
        });
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        that.queryCondition.filterConditions = [];
        that.templateId = null;
        if (!event.length) {
          CurrentAlarmUtil.clearData(that);
          that.isClickSlider = false;
          that.queryCondition.pageCondition = new PageCondition(1, that.pageBean.pageSize);
          that.refreshData();
        } else {
          const filterEvent = CurrentAlarmUtil.handleFilter(event, that);
          that.pageBean = new PageModel(that.queryCondition.pageCondition.pageSize);
          that.queryCondition.filterConditions = filterEvent;
          that.queryCondition.pageCondition = new PageCondition(that.pageBean.pageIndex, that.pageBean.pageSize);
          that.refreshData();
        }
      },
      // 导出
      handleExport: (event: ListExportModel<AlarmListModel[]>) => {
        // 处理参数
        that.exportParams = new ExportRequestModel(event.columnInfoList, event.excelType, new QueryConditionModel());
        const propertyName = ['alarmFixedLevel', 'alarmSourceTypeId', 'alarmCleanStatus',
          'alarmBeginTime', 'alarmNearTime', 'alarmConfirmTime', 'alarmCleanTime',
          'alarmContinousTime', 'alarmClassification', 'alarmDeviceTypeId', 'alarmConfirmStatus'];
        that.exportParams.columnInfoList.forEach(item => {
          if (propertyName.indexOf(item.propertyName) !== -1) {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        // 处理选择的项目
        if (event.selectItem.length > 0) {
          event.queryTerm['alarmIds'] = event.selectItem.map(item => item.id);
          // 按照告警id查询
          that.exportParams.queryCondition.filterConditions.push(
            new FilterCondition('id', OperatorEnum.in, event.queryTerm['alarmIds'])
          );
        } else {
          if (that.templateId) {
            // 按照模板id查询
            that.exportParams.queryCondition.filterConditions.push(
              new FilterCondition('templateId', OperatorEnum.in, that.templateId)
            );
          } else {
            that.exportParams.queryCondition.filterConditions = CurrentAlarmUtil.handleFilter(event.queryTerm, that);
          }
        }
        that.exportAlarm(that.exportParams);
      },
      handleSelect: (data: AlarmListModel[]) => {
        that.selectAlarmData = data;
        if (data.length === 0) { return; }
        const arr = data.filter(v => v.father);
        // 只有一条数据 子集
        if (data.length === 1 && arr.length) {
          that.table.allUnChecked = true;
        }
        // 所有数据都是子集
        if (data.length > 1) {
          if (arr.length === data.length) {
            that.table.allUnChecked = true;
          }
        }
      }
    };
  }

  /**
   * 诊断设置
   */
  public static initSetForm(that): void {
    that.tableColumnSet = [
      { // 是否自动诊断
        label: that.language.automaticDiagnosis,
        key: 'isAutoDiagnose',
        type: 'radio',
        require: false,
        col: 24,
        initialValue: AlarmIsAutoDiagnoseEnum.noAutoDiagnose,
        radioInfo: {
          data: [
            {label: that.language.yes, value: AlarmIsAutoDiagnoseEnum.isAutoDiagnose},
            {label: that.language.no, value: AlarmIsAutoDiagnoseEnum.noAutoDiagnose},
          ],
          label: 'label',
          value: 'value'
        },
        rule: [],
        asyncRules: []
      },
      { // 误判阈值
        label: `${that.language.miscalculationThreshold} (%)`,
        key: 'misjudgementThreshold',
        type: 'input', require: false,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getPercent(that.commonLanguage.percentMsg)
        ],
      },
      { // 确诊阈值
        label: `${that.language.diagnosisThreshold} (%)`,
        key: 'diagnosticThreshold',
        type: 'input', require: false,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getPercent(that.commonLanguage.percentMsg)
        ],
      },
      { // 自动核实派单
        label: that.language.automaticVerifyDispatch,
        key: 'isAutoCheckDispatch',
        type: 'radio',
        require: false,
        col: 24,
        initialValue: AlarmIsAutoCheckDisEnum.noAutoCheckDis,
        radioInfo: {
          data: [
            {label: that.language.yes, value: AlarmIsAutoCheckDisEnum.isAutoCheckDis},
            {label: that.language.no, value: AlarmIsAutoCheckDisEnum.noAutoCheckDis},
          ],
          label: 'label',
          value: 'value'
        },
        rule: [],
        asyncRules: []
      },
      { // 自动转故障
        label: that.language.automaticTurnFault,
        key: 'isAutoTurnMalfunction',
        type: 'radio',
        require: false,
        col: 24,
        initialValue: AlarmIsAutoTurnMalEnum.noAutoTurnMal,
        radioInfo: {
          data: [
            {label: that.language.yes, value: AlarmIsAutoTurnMalEnum.isAutoTurnMal},
            {label: that.language.no, value: AlarmIsAutoTurnMalEnum.noAutoTurnMal},
          ],
          label: 'label',
          value: 'value'
        },
        rule: [],
        asyncRules: []
      },
    ];
  }

  /**
   * 备注配置
   */
  public static initFormRemark(that): void {
    that.formColumnRemark = [
      {
        // 备注
        label: that.language.remark,
        key: 'remark',
        type: 'textarea',
        width: 1000,
        rule: [
          that.$ruleUtil.getRemarkMaxLengthRule()
        ],
        customRules: [that.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * 从其他页面跳过来过滤条件
   */
  public static queryFromPage(that) {
    // 获取告警id
    if (that.$active.snapshot.queryParams.id) {
      that.alarmId = that.$active.snapshot.queryParams.id;
      const filter = new FilterCondition('id', OperatorEnum.eq, that.alarmId);
      that.queryCondition.filterConditions = [filter];
    }
    // 获取设施
    if (that.$active.snapshot.queryParams.deviceId) {
      that.deviceId = that.$active.snapshot.queryParams.deviceId;
      const filter = new FilterCondition('alarmDeviceId', OperatorEnum.eq, that.deviceId);
      that.queryCondition.filterConditions = [filter];
    }
    // 获取设备
    if (that.$active.snapshot.queryParams.equipmentId) {
      that.equipmentId = that.$active.snapshot.queryParams.equipmentId;
      const filter = new FilterCondition('alarmSource', OperatorEnum.eq, that.equipmentId);
      that.queryCondition.filterConditions = [filter];
    }
    // 获取设备类型
    if (that.$active.snapshot.queryParams.alarmSourceTypeId) {
      that.equipmentType = that.$active.snapshot.queryParams.alarmSourceTypeId;
      const params = Array.isArray(that.equipmentType) ? that.equipmentType : [that.equipmentType];
      const filter = new FilterCondition('alarm_source_type_id', OperatorEnum.in, params);
      that.queryCondition.filterConditions = [filter];
    }
  }

  /**
   * 告警清除 弹框
   */
  public static popUpClean(that) {
    that.modalService.confirm({
      nzTitle: that.language.prompt,
      nzContent: that.language.alarmAffirmClear,
      nzOkText: that.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: that.language.okText,
      nzOnCancel: () => {
        that.clearAlarmSure();
      },
    });
  }

  /**
   * 区域告警等模板数据清除
   */
  public static clearData(that) {
    that.templateId = null;
    //  告警名称 区域  告警对象 清空
    that.areaList = new AlarmSelectorInitialValueModel();
    that.checkAlarmName = new AlarmSelectorInitialValueModel();
    that.selectEquipments = [];
    that.selectUnitName = '';
    FacilityForCommonUtil.setTreeNodesStatus(that.treeNodes, []);
    that.checkAlarmObject = new AlarmSelectorInitialValueModel();
    that.checkAlarmEquipment = new AlarmSelectorInitialValueModel();
    // 区域
    that.initAreaConfig();
    // 告警名称
    that.initAlarmName();
    // 设备名称(告警对象)
    that.initAlarmEquipment();
    // 设施名称
    that.initAlarmObjectConfig();
  }

  /**
   * 过滤条件处理
   */
  public static handleFilter(filters: FilterCondition[], that) {
    filters.forEach(item => {
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
    return filters;
  }
}
