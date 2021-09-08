import {UserRoleModel} from '../../model/user/user-role.model';

/**
 * 用户工具类
 */
export class UserForCommonUtil {
  /**
   * 递归设置部门的被选状态
   */
  public static setAreaNodesStatus(data, parentId, currentId?) {
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
   * param data
   * param selectData
   * param option idKey 回显时用来对比key值
   */
  public static setTreeNodesStatus(data, selectData: string[], option: { idKey: string } = {idKey: ''}) {
    data.forEach(treeNode => {
      // 从被选择的数组中找到当前项
      const index = selectData.findIndex(item => treeNode[option.idKey || 'id'] === item);
      // 如果找到了 checked 为true
      treeNode.checked = index !== -1;
      if (treeNode.childDepartmentList) {
        this.setTreeNodesStatus(treeNode.childDepartmentList, selectData, option);
      }
    });
  }

  /**
   * 设施授权门编号排序
   */
  public static sort(a, b) {
    return Number(a.value) - Number(b.value);
  }


  /**
   * json数组去重(多次重复只保留一个)(勾选设施列表专用)
   */
  public static unique(arr) {
    if (arr && arr.length > 1) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const deviceId = arr[j].deviceId;
          const doorNum = arr[j].doorNum;
          if (arr[i].deviceId === deviceId && arr[i].doorNum === doorNum) {
            arr.splice(j, 1);
          }
        }
      }
    }
    return arr;
  }

  /**
   * 用户选择
   */
  public static selectUser(list: UserRoleModel[], that): void {
    that.checkUserObject = {
      userIds: list.map(v => v.id) || [],
      userName: list.map(v => v.userName).join(',') || '',
    };
    that.userFilterValue.filterValue = that.checkUserObject.userIds.length > 0 ? that.checkUserObject.userIds : null;
    that.userFilterValue.filterName = that.checkUserObject.userName;
  }
}
