import {Injectable} from '@angular/core';
import {SystemLanguageEnum} from '../../../../core-module/enum/alarm/system-language.enum';

@Injectable()
export class TenantMenuTreeOperateService {

  constructor() {
  }

  // 全局存储树结构
  public treeNode = [];
  // 语言配置枚举
  public languageEnum = SystemLanguageEnum;

  /**
   * 当前节点上移
   * param nodeList 树结构
   * param curNode 当前节点
   */
  treeNodeUp(nodeList, curNode) {
    if (nodeList && curNode) {
      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].menuId === curNode.origin.menuId) {
          if (i !== 0) {

            // 交换排序字段
            const sort = nodeList[i - 1].menuSort;
            nodeList[i - 1].menuSort = nodeList[i].menuSort;
            nodeList[i].menuSort = sort;

            // 两个节点交换
            const itemNode = nodeList[i - 1];
            nodeList[i - 1] = nodeList[i];
            nodeList[i] = itemNode;
          } else {
            break;
          }
        } else if (nodeList[i].children && nodeList[i].children.length > 0) {
          this.treeNodeUp(nodeList[i].children, curNode);
        }
      }
      return nodeList;
    } else {
      return null;
    }
  }

  /**
   * 当前节点下移
   * param nodeList
   * param curNode
   */
  treeNodeDown(nodeList, curNode) {
    if (nodeList && curNode) {
      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].menuId === curNode.origin.menuId) {
          if (i !== nodeList.length - 1) {
            // 交换排序字段
            const sort = nodeList[i + 1].menuSort;
            nodeList[i + 1].menuSort = nodeList[i].menuSort;
            nodeList[i].menuSort = sort;
            // 交换当前节点
            const itemNode = nodeList[i + 1];
            nodeList[i + 1] = nodeList[i];
            nodeList[i] = itemNode;
            break;
          } else {
            break;
          }
        } else if (nodeList[i].children && nodeList[i].children.length > 0) {
          this.treeNodeDown(nodeList[i].children, curNode);
        }
      }
      return nodeList;
    } else {
      return null;
    }
  }

  /**
   * 当前节点的显示隐藏
   * param nodeList
   * param curNode
   */
  showStateChange(nodeList, menuId) {
    if (this.treeNode.length === 0) {
      this.treeNode = nodeList;
    }
    if (nodeList && menuId) {
      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].menuId === menuId) {
          if (nodeList[i].isShow !== '2') {
            nodeList[i].isShow = nodeList[i].isShow === '0' ? '1' : '0';
          }
          // 处理子节点，如果存在子节点，则子节点所有状态跟着修改
          if (nodeList[i].children) {
            this.setChildShowState(nodeList[i].children, nodeList[i].isShow);
          }
          // 处理父节点
          if (nodeList[i].parentMenuId) {
            this.setParentShowState(this.treeNode, nodeList[i].parentMenuId);
          }

        } else if (nodeList[i].children && nodeList[i].children.length > 0) {
          this.showStateChange(nodeList[i].children, menuId);
        }
      }
      return nodeList;
    }
  }

  /**
   * 设置子节点显示状态
   * param nodeList
   * param state
   */
  setChildShowState(nodeList, state) {
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].isShow !== 2) {
        nodeList[i].isShow = state;
      }
      if (nodeList[i].children && nodeList[i].children.length > 0) {
        this.setChildShowState(nodeList[i].children, state);
      }
    }
  }


  /**
   * 递归替换菜单名称
   */
  setNodeMenuName(nodeList, menuId, nodeName) {

    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].menuId === menuId) {
        nodeList[i].menuName = nodeName;
        break;
      } else if (nodeList[i].children && nodeList[i].children.length) {
        this.setNodeMenuName(nodeList[i].children, menuId, nodeName);
      }
    }
    return nodeList;

  }

  /**
   * 设置父节点的显示状态
   * param nodeList
   * param parentMenuId
   */
  setParentShowState(nodeList, parentMenuId) {
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].menuId === parentMenuId) {
        if (nodeList[i].isShow !== '2') {
          nodeList[i].isShow = this.checkChildHasShow(nodeList[i].children) ? '1' : '0';
        }
        if (nodeList[i].parentMenuId) {
          this.setParentShowState(this.treeNode, nodeList[i].parentMenuId);
        }
        break;
      } else if (nodeList[i].children && nodeList[i].children.length > 0) {
        this.setParentShowState(nodeList[i].children, parentMenuId);
      }
    }
  }

  /**
   * 检查子节点是否都是隐藏状态
   * param nodeList
   */
  checkChildHasShow(nodeList) {
    return nodeList.find((item => item.isShow === '1' || item.isShow === '2'));
  }

}
