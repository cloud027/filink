import {Injectable} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {DeviceEquipmentEnum} from '../enum/device-equipment.enum';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {TenantApiService} from './tenant-api.service';

@Injectable()
export class UserUtilService {

  // json数据对比开关
  public flag: boolean = false;

  constructor(public $tenantApiService: TenantApiService,
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
   * 递归获取租户权限所有节点的id
   */
  public queryTenantTreeNodeListId(nodes: any, ids: any[]): void {
    if (nodes && nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].isShow === '1') {
          ids.push(nodes[i].id);
        }
        if (nodes[i].childPermissionList && nodes[i].childPermissionList.length > 0) {
          this.queryTenantTreeNodeListId(nodes[i].childPermissionList, ids);
        }
      }
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
   * 获取所有设施集
   */
  public getAllDeviceType(): Promise<{ code: string }[]> {
    return new Promise((resolve, reject) => {
      this.$tenantApiService.getDeviceType().subscribe((result: ResultModel<any>) => {
        const arr = [];
        if (result.code === ResultCodeEnum.success) {
          console.log(result.data);
          const data = result.data;
          const deviceObject = {code: DeviceEquipmentEnum.device, children: []};
          const equipmentObject = {code: DeviceEquipmentEnum.equipment, children: []};
          const projectPlanObject  = {code: DeviceEquipmentEnum.planProject, children: []};
          // 添加设施集
          data.deviceTypes.forEach(item => {
            deviceObject.children.push({code: item});
          });
          arr.push(deviceObject);
          // 添加设备集
          data.equipmentTypes.forEach(_item => {
            equipmentObject.children.push({code: _item});
          });
          arr.push(equipmentObject);
          // 添加规划项目集
          data.projectPlanningTypes.forEach(_item => {
            projectPlanObject.children.push({code: _item});
          });
          arr.push(projectPlanObject);
          resolve(arr);
        } else {
          resolve(arr);
        }
      });
    });
  }

  /**
   * json数据对比
   */

  public compreObj(obj1, obj2) {
    this.flag = true;
    this.compre(obj1, obj2);
    return this.compre(obj1, obj2);
  }

  public compre(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      this.flag = false;
    } else {
      for (const x in obj1) {
        if (obj2.hasOwnProperty(x)) {
          if (obj1[x] !== obj2[x]) {
            if (typeof (obj1[x]) === 'number' || typeof (obj1[x]) === 'string' || typeof (obj2[x]) === 'number' || typeof (obj2[x]) === 'string') {
              this.flag = false;
            } else {
              this.compre(obj1[x], obj2[x]);
            }
          }
        } else {
          this.flag = false;
        }
      }
    }
    if (this.flag === false) {
      return false;
    } else {
      return true;
    }
  }


}

