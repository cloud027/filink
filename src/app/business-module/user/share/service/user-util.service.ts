import {Injectable} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {DeviceEquipmentEnum} from '../enum/device-equipment.enum';
import {UserService} from './user.service';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {ResultModel} from '../../../../shared-module/model/result.model';

@Injectable()
export class UserUtilService {

  constructor(private $userService: UserService,
              private $userForCommonService: UserForCommonService,
              public $nzI18n: NzI18nService) {
  }

  /**
   * 递归设置部门的被选状态
   */
  public setAreaNodesStatus(data: any, parentId: string, currentId?: string) {
    data.forEach(areaNode => {
      // 选中父亲
      areaNode.checked = areaNode.id === parentId;
      // 自己不让选
      areaNode.chkDisabled = areaNode.id === currentId;
      if (areaNode.childDepartmentList) {
        this.setAreaNodesStatus(areaNode.childDepartmentList, parentId, currentId);
      }
    });
  }

  /**
   * 递归设置责任单位的被选状态
   */
  public setTreeNodesStatus(data: any, selectData: string[]) {
    data.forEach(treeNode => {
      // 从被选择的数组中找到当前项
      const index = selectData.findIndex(item => treeNode.id === item);
      // 如果找到了 checked 为true
      treeNode.checked = index !== -1;
      if (data.childDepartmentList) {
        this.setTreeNodesStatus(data.childDepartmentList, selectData);
      }
    });
  }


  /**
   * 递归设置角色权限的节点的被选状态(部分)
   */
  public setRoleTreeNodesStatus(data: any, selectData: string[]) {
    data.forEach(node => {
      const name = this.$nzI18n.translate(`setRoleTree.${node.id}`);
      // 如果前端翻译未成功使用数据库初始化name
      if (name !== `setRoleTree.${node.id}`) {
        node.name = name;
      }
      node.checked = selectData.includes(node.id);
      if (node.childPermissionList && node.childPermissionList.length) {
        this.setRoleTreeNodesStatus(node.childPermissionList, selectData);
      }
    });
  }


  /**
   * 递归设置设施被选状态(部分)
   */
  public setFacilityTreeNodesStastus(data: any, selectData: any[] = []) {
    data.forEach(node => {
      const name = this.$nzI18n.translate(`setRoleTree.${node.code}`);
      // 如果前端翻译未成功使用数据库初始化name
      if (name !== `setRoleTree.${node.code}`) {
        node.name = name;
      }
      node.checked = selectData.includes(node.code);
      if (node.children && node.children.length) {
        this.setFacilityTreeNodesStastus(node.children, selectData);
      }
    });
  }


  /**
   * 递归获取角色权限所有节点的id
   */
  public queryTreeNodeListId(nodes: any, ids: any[]): void {
    if (nodes && nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id);
        if (nodes[i].childPermissionList && nodes[i].childPermissionList.length > 0) {
          this.queryTreeNodeListId(nodes[i].childPermissionList, ids);
        }
      }
    }
  }

  /**
   * 递归获取展示的权限
   */
  public queryShowPermission(nodes: any[]) {
    if (nodes && nodes.length > 0) {
      const showData = nodes.filter(item => item.isShow === '1');
      showData.forEach(item => {
        if (item.childPermissionList && item.childPermissionList.length) {
          item.childPermissionList = this.queryShowPermission(item.childPermissionList);
        }
      });
      return showData;
    }
  }

  /**
   * 重置左边树形节点勾选状态
   */
  public resetLeftTreeNodeStatus(leftNodes: any): void {
    leftNodes.forEach(item => {
      item['checked'] = false;
      if (item.childPermissionList) {
        this.resetLeftTreeNodeStatus(item.childPermissionList);
      }
    });
  }



  /**
   * 递归设置区域的被选状态
   */
  public setDeptAreaNodesStatus(data: any, areaIds: string[]) {
    data.forEach(areaNode => {
      areaIds.forEach(item => {
        if (item === areaNode.areaId) {
          areaNode.checked = true;
          areaNode['open'] = true;
        }
      });
      if (areaNode.children) {
        this.setDeptAreaNodesStatus(areaNode.children, areaIds);
      }
    });
  }


  /**
   * 获取所有设施集
   */
  public getAllDeviceType(): Promise<{ code: string }[]> {
    const tenantId = JSON.parse(localStorage.getItem('userInfo')).tenantId;
    return new Promise((resolve, reject) => {
      this.$userForCommonService.queryTenantDevicesById(tenantId).subscribe((result: ResultModel<any>) => {
        const arr = [];
        if (result.code === ResultCodeEnum.success) {
          const data = result.data;
          const deviceObject = {code: DeviceEquipmentEnum.device, children: []};
          const equipmentObject = {code: DeviceEquipmentEnum.equipment, children: []};
          const planProjectObject = {code: DeviceEquipmentEnum.planProject, children: []};
          if (data.deviceTypes && data.deviceTypes.length) {
            // 添加设施集
            data.deviceTypes.forEach(item => {
              deviceObject.children.push({code: item});
            });
            arr.push(deviceObject);
          }
          if (data.equipmentTypes && data.equipmentTypes.length) {
            // 添加设备集
            data.equipmentTypes.forEach(_item => {
              equipmentObject.children.push({code: _item});
            });
            arr.push(equipmentObject);
          }
          if (data.projectPlanningTypes && data.projectPlanningTypes.length) {
            // 添加规划项目集
            data.projectPlanningTypes.forEach(_item => {
              planProjectObject.children.push({code: _item});
            });
            arr.push(planProjectObject);
          }
          resolve(arr);
        } else {
          resolve(arr);
        }
      });
    });
  }

  /**
   * 获取部门列表信息
   * returns {Promise<any>}
   */
  public getDept(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$userForCommonService.queryTotalDept().subscribe((result: ResultModel<any>) => {
        const data = result.data;
        resolve(data);
      });
    });
  }
}

