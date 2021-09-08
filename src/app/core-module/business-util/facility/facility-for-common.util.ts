import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {DeviceSortWeightEnum, DeviceStatusEnum, DeviceTypeEnum} from '../../enum/facility/facility.enum';
import {
  EquipmentSortEnum,
  EquipmentStatusEnum,
  equipmentStatusSortEnum,
  equipmentStatusSortRankEnum,
  EquipmentTypeEnum
} from '../../enum/equipment/equipment.enum';
import {SelectModel} from '../../../shared-module/model/select.model';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {MapConfig as BMapConfig} from '../../../shared-module/component/map/b-map.config';
import {MapTypeEnum} from '../../../shared-module/enum/filinkMap.enum';

/**
 * 资产工具类
 */
export class FacilityForCommonUtil {

  /**
   * 获取区域配置
   */
  public static getAreaSelectorConfig(title: string, nodes: NzTreeNode[]): TreeSelectorConfigModel {
    return {
      width: '500px',
      height: '300px',
      title: title,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all'
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName'
          },
        },

        view: {
          showIcon: false,
          showLine: false
        }
      },
      treeNodes: nodes
    };
  }

  /**
   * 递归设置区域的被选状态
   * param data
   * param parentId
   */
  public static setAreaNodesStatus(data, parentId, areaId?): void {
    data.forEach(areaNode => {
      // 选中父亲
      areaNode.checked = areaNode.areaId === parentId;
      // 自己不让选 没权限不让选
      areaNode.chkDisabled = (areaNode.areaId === areaId) || (areaNode.hasPermissions === false);
      // 如果是已经选中可以选
      if (areaNode.checked) {
        areaNode.chkDisabled = false;
      }
      if (areaNode.children) {
        this.setAreaNodesStatus(areaNode.children, parentId, areaId);
      }
    });
  }

  /**
   * 中式区域需求变更 区域选择默认有权限
   * param data
   * param parentId
   * param areaId
   */
  public static setAreaNodesStatusUnlimited(data, parentId, areaId?, idKey: string = 'areaId'): void {
    data.forEach(areaNode => {
      // 选中父亲
      areaNode.checked = areaNode[idKey] === parentId;
      // 自己不让选
      areaNode.chkDisabled = areaNode[idKey] === areaId;
      // 如果是已经选中可以选
      if (areaNode.checked) {
        areaNode.chkDisabled = false;
      }
      if (areaNode.children) {
        this.setAreaNodesStatusUnlimited(areaNode.children, parentId, areaId, idKey);
      }
    });
  }

  /**
   * 递归设置部门的被选状态
   */
  public static setUnitNodesStatus(data, parentId, currentId?) {
    data = data ? data : [];
    data.forEach(areaNode => {
      // 选中父亲
      areaNode.checked = areaNode.id === parentId;
      // 自己不让选
      areaNode.chkDisabled = areaNode.id === currentId;
      if (areaNode.childDepartmentList) {
        this.setUnitNodesStatus(areaNode.childDepartmentList, parentId, currentId);
      }
    });
  }

  /**
   * 递归设置区域的被选状态(多选)
   * param data
   * param selectData
   */
  public static setAreaNodesMultiStatus(data, selectData): void {
    data.forEach(areaNode => {
      // 从被选择的数组中找到当前项
      const index = selectData.findIndex(item => areaNode.areaId === item);
      // 如果找到了 checked 为true
      areaNode.checked = index !== -1;
      if (areaNode.checked) {
        areaNode.chkDisabled = false;
      }
      if (areaNode.children) {
        this.setAreaNodesMultiStatus(areaNode.children, selectData);
      }
    });
  }

  /**
   * 递归设置责任单位的被选状态
   * param data
   * param selectData
   */
  public static setTreeNodesStatus(data, selectData: string[], bol?) {
    if (!bol) {
      data.forEach(treeNode => {
        // 从被选择的数组中找到当前项
        const index = selectData.findIndex(item => treeNode.id === item);
        // 如果找到了 checked 为true
        treeNode.checked = index !== -1;
        if (treeNode.childDepartmentList) {
          this.setTreeNodesStatus(treeNode.childDepartmentList, selectData);
        }
      });
    } else {
      data.forEach(treeNode => {
        // 从被选择的数组中找到当前项
        const index = selectData.findIndex(item => treeNode.deviceId === item);
        // 如果找到了 checked 为true
        treeNode.checked = index !== -1;
        if (treeNode.childDepartmentList) {
          this.setTreeNodesStatus(treeNode.childDepartmentList, selectData, true);
        }
      });
    }
  }

  /**
   * 获取设施类型
   */
  public static translateDeviceType(i18n: NzI18nService, code = null): any {
    return CommonUtil.codeTranslate(DeviceTypeEnum, i18n, code);
  }

  /**
   * 设施状态
   */
  public static translateDeviceStatus(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(DeviceStatusEnum, i18n, code);
  }

  /**
   * 设备类型
   */
  public static translateEquipmentType(i18n: NzI18nService, code = null): any {
    return CommonUtil.codeTranslate(EquipmentTypeEnum, i18n, code);
  }

  /**
   * 设备状态
   */
  public static translateEquipmentStatus(i18n: NzI18nService, code = null) {
    return CommonUtil.codeTranslate(EquipmentStatusEnum, i18n, code, 'facility');
  }

  /**
   * 设备排序
   */
  public static equipmentSort(arr) {
    // 循环添加权重值
    arr.forEach(item => {
      item.number = CommonUtil.enumMappingTransform(item.equipmentType ? item.equipmentType : item.code, EquipmentTypeEnum, EquipmentSortEnum);
    });
    arr = _.sortBy(arr, (item) => {
      return item.number;
    });
    // 删除权重值
    arr.forEach(item => {
      delete item.number;
    });
    return arr;
  }

  /**
   * 设施排序
   */
  public static deviceSort(arr) {
    // 循环添加权重值
    arr.forEach(item => {
      item.number = CommonUtil.enumMappingTransform(item.deviceType ? item.deviceType : item.code, DeviceTypeEnum, DeviceSortWeightEnum);
    });
    arr = _.sortBy(arr, (item) => {
      return item.number;
    });
    // 删除权重值
    arr.forEach(item => {
      delete item.number;
    });
    return arr;
  }

  /**
   * 设备状态排序
   */
  public static equipmentStatusSort(arr) {
    // 循环添加权重值
    arr.forEach(item => {
      item.number = CommonUtil.enumMappingTransform(item.equipmentStatus, equipmentStatusSortEnum, equipmentStatusSortRankEnum);
    });
    arr = _.sortBy(arr, (item) => {
      return item.number;
    });
    // 删除权重值
    arr.forEach(item => {
      delete item.number;
    });
    return arr;
  }


  /**
   *  查询当前登录用户权限的设备类型
   */
  public static getRoleEquipmentType(i18n: NzI18nService): SelectModel[] {
    // 从用户信息里面获取权限列表
    const userInfo = SessionUtil.getUserInfo();
    const equipmentType: SelectModel[] = CommonUtil.codeTranslate(EquipmentTypeEnum, i18n) as SelectModel[];
    // 先获取当前用户权限下的设备
    const equipmentList = userInfo.role.roleDeviceTypeDto.equipmentTypes;
    if (!_.isEmpty(equipmentList)) {
      return equipmentType.filter(item => equipmentList.includes(item.code)) || [];
    }
    return [];
  }

  /**
   * 获取权限下的可用设施
   */
  public static getRoleFacility(i18n: NzI18nService): SelectModel[] {
    // 从登录用户中获取权限
    const userInfo = SessionUtil.getUserInfo();
    const deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, i18n) as SelectModel[];
    // 获取登录之后返回的设施权限
    let facilityList = [];
    if (userInfo.role.roleDeviceTypeDto) {
      facilityList = userInfo.role.roleDeviceTypeDto.deviceTypes;
    }
    if (!_.isEmpty(facilityList)) {
      return deviceType.filter(item => facilityList.includes(item.code)) || [];
    }
    return [];
  }

  /**
   * 获取地图视图下区域内设施
   */
  public static getFacilityListInWindow(that, language) {
    // 获取视图下的区域
    if (that.mainMap.mapService.getZoom() <= BMapConfig.areaZoom) {
      if (that.mainMap.$mapCoverageService.showCoverage === MapTypeEnum.equipment) {
        that.$message.info(language.pleaseComeInToEquipmentMap);
      } else {
        that.$message.info(language.pleaseComeInToFacilityMap);
      }
      return false;
    }
    const bound = that.mainMap.mapService.mapInstance.getBounds(); // 地图可视区域
    const facilityListInWindow = [];
    that.mainMap.mapService.getMarkerMap().forEach(value => {
      if (bound.containsPoint(value.marker.point) === true && !value.data.code) {
        facilityListInWindow.push(value.data);
      }
    });
    if (facilityListInWindow.length === 0) {
      that.$message.info('当前视图内无设备或设施');
      return false;
    } else {
      return facilityListInWindow;
    }
  }
  /**
   * 打印qunee图片工具
   */
  public static onPrint(graph, language): boolean {
    // 画布打印缩放级别和范围内容
    const imageInfo = graph.exportImage(1, graph.bounds);
    if (!imageInfo || !imageInfo.data) {
      return false;
    }
    const bytes = window.atob(imageInfo.data.split(',')[1]);
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    const file = new Blob([ab], {type: 'image/png'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download =  `${language.exportImg}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
