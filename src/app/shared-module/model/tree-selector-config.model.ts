/**
 * Created by wh1709040 on 2018/12/27.
 * 树选择器配置
 */
export class TreeSelectorConfigModel {
  treeSetting?: any;
  treeNodes?: any[];
  width?: string;
  height?: string;
  title?: string;
  selectedColumn?: any[];
  onlyLeaves?: boolean;
  leftTitle?: string;
  rightTitle?: string;
  leftNodes?: any[];
  rightNodes?: any[];
  treeLeftSetting?: any;
  treeRightSetting?: any;
  isMultiple?: boolean;

  constructor() {
    this.treeSetting = {data: {key: {name: 'name'}, simpleData: {idKey: 'id'}}};
    this.treeLeftSetting = {data: {key: {name: 'name'}, simpleData: {idKey: 'id'}}};
    this.treeRightSetting = {data: {key: {name: 'name'}, simpleData: {idKey: 'id'}}};
    this.treeNodes = [];
    this.width = '500px';
    this.title = 'select';
    this.isMultiple = false;
  }
}
