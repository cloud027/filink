/**
 * 初始化树结构
 */
export class WorkOrderInitTreeUtil {
  /**
   * 初始化单位选择器配置
   */
  public static initTreeSelectorConfig(that, nodes?) {
    that.treeSelectorConfig = {
      title: that.InspectionLanguage ? that.InspectionLanguage.responsibleUnit : that.inspectionLanguage.responsibleUnit,
      width: '400px',
      height: '300px',
      treeNodes: nodes ? nodes : that.unitTreeNodes,
      treeSetting: {
        check: { enable: true, chkStyle: 'radio', radioType: 'all' },
        data: {
          simpleData: { enable: true, idKey: 'id', pIdKey: 'deptFatherId', rootPid: null },
          key: { name: 'deptName', children: 'childDepartmentList' },
        },
        view: { showIcon: false, showLine: false }
      },
      onlyLeaves: false,
      selectedColumn: []
    };
  }
  /**
   * 初始化指派单位树配置
   */
  public static initAssignTreeConfig(that) {
    that.assignTreeSelectorConfig = {
      title: that.workOrderLanguage.selectAssignDept,
      width: '400px',
      height: '300px',
      treeNodes: that.assignTreeNode,
      treeSetting: {
        check: { enable: true, chkStyle: 'radio', radioType: 'all' },
        data: {
          simpleData: { enable: true, idKey: 'id', pIdKey: 'deptFatherId', rootPid: null },
          key: { name: 'deptName', children: 'childDepartmentList' },
        },
        view: { showIcon: false, showLine: false }
      },
      onlyLeaves: false,
      selectedColumn: []
    };
  }

  /**
   * 初始化区域选择器配置
   */
  public static initAreaSelectorConfig(that, nodes?) {
    let title = '';
    if (that.InspectionLanguage) {
      title = `${that.InspectionLanguage.selected}${that.InspectionLanguage.area}`;
    } else {
      title = `${that.inspectionLanguage.selected}${that.inspectionLanguage.area}`;
    }
    that.areaSelectorConfig = {
      width: '400px',
      height: '300px',
      title: title,
      treeSetting: {
        check: { enable: true, chkStyle: 'radio', radioType: 'all' },
        data: {
          simpleData: { enable: true, idKey: 'areaId'},
          key: { name: 'areaName' },
        },
        view: { showIcon: false, showLine: false }
      },
      treeNodes: nodes ? nodes : that.areaNodes
    };
  }

  /**
   * 设施地图弹窗
   */
  public static initMapSelectorConfig(that) {
    that.mapSelectorConfig = {
      title: that.InspectionLanguage.setDevice,
      width: '1100px', height: '465px', mapData: [],
      selectedColumn: [
        {title: that.InspectionLanguage.deviceName, key: 'deviceName', width: 80},
        {title: that.InspectionLanguage.deviceCode, key: 'deviceCode', width: 60},
        {title: that.InspectionLanguage.deviceType, key: 'deviceType', width: 90},
        {title: that.InspectionLanguage.parentId, key: 'address', width: 80}
      ]
    };
  }

  /**
   * 设备地图弹窗
   */
  public static initEquipmentMapSelectorConfig(that) {
    that.equipmentMapSelectorConfig = {
      title: that.InspectionLanguage.inspectionEquipment,
      width: '1100px', height: '465px', mapData: [],
      selectedColumn: [
        {title: that.InspectionLanguage.deviceName, key: 'equipmentName', width: 80},
        {title: that.InspectionLanguage.deviceCode, key: 'equipmentCode', width: 80},
        {title: that.InspectionLanguage.deviceType, key: 'equipmentType', width: 60},
        {title: that.InspectionLanguage.parentId, key: 'areaName', width: 80}
      ]
    };
  }
}
