import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import 'ztree';
import {TreeSelectorConfigModel} from '../../model/tree-selector-config.model';
import {PageModel} from '../../model/page.model';
import {TableComponent} from '../table/table.component';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {CommonUtil} from '../../util/common-util';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';

declare var $: any;

/**
 * 树选择器
 */
@Component({
  selector: 'xc-tree-selector',
  templateUrl: './tree-selector.component.html',
  styleUrls: ['./tree-selector.component.scss']
})
export class TreeSelectorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // 弹框样式类名，用于覆盖弹框内部组件的样式
  @Input()
  modalClassName: string = '';
  // 是否隐藏按钮
  @Input() isHiddenButton = false;
  // 树回调
  @Input() treeCallback: any;
  // 树选择器配置
  @Input() treeSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选择数据变化
  @Output() selectDataChange = new EventEmitter<any[]>();
  // table实例
  @ViewChild(TableComponent) childCmp: TableComponent;
  // 树实例
  public treeInstance: any;
  // 搜索的值
  public searchValue: string = '';
  // 搜索的结果
  public searchResult: any[] = [];
  // 选择的数据
  public selectData: any[] = [];
  // 选择数据分页结果
  public selectPageData = [];
  // 选择的数据分页
  public selectPageBean: PageModel = new PageModel(6, 1, 0);
  public data: any[] = [];
  // 树设置
  public settings = {
    callback: {
      onCheck: (event, treeId, treeNode) => {
        this.selectData = this.getTreeCheckedNodes();
        this.refreshSelectPageData();
      },
      beforeCheck: (treeId, treeNode) => {
        if (this.treeCallback && this.treeCallback.beforeCheck) {
          return this.treeCallback.beforeCheck(treeId, treeNode);
        } else {
          return true;
        }
      }
    },
  };
  // 选择器配置
  public selectorConfig;
  // 被选总数
  public treeNodeSum: number = 0;
  // form语言包
  public language: any;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 树id
  public treeId: string;
  // 搜索框配置
  public selectInfo = {
    data: [],
    label: 'label',
    value: 'code'
  };
  // 第一次被选数据
  private firstSelectData: any[];

  constructor(private $i18n: NzI18nService, private $message: FiLinkModalService) {
  }

  private _xcVisible = false;

  get xcVisible() {
    return this._xcVisible;
  }

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  ngOnInit() {
    this.language = this.$i18n.getLocaleData('form');
    this.commonLanguage = this.$i18n.getLocaleData('common');
    this.treeId = CommonUtil.getUUid();
    this.selectorConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      searchTemplate: null,
      scroll: {x: '440px', y: '310px'},
      noAutoHeight: true,
      columnConfig: [
        {type: 'select', width: 62}
      ].concat(this.treeSelectorConfig.selectedColumn),
      showPagination: false,
      bordered: false,
      showSearch: false,
      showSizeChanger: false,
      handleSelect: (data, currentItem) => {
        // 点击列表某一个checkbox
        if (currentItem) {
          // 如果去选拦截先做一道拦截
          if (this.treeCallback && this.treeCallback.beforeTableCheck) {
            this.treeCallback.beforeTableCheck([currentItem.id]).then(res => {
              // 有工单或者告警转工单规则 不能去选择
              if (res) {
                this.$message.error(this.$message.language.accountabilityUnitCheckMsg);
                this.restoreSelected();
              } else {
                this.deleteSomeOne(currentItem);
              }
            }, () => {
            }).catch();
          } else {
            this.deleteSomeOne(currentItem);
          }
          //  去选右边所有的
        } else if (data && data.length === 0) {
          // 如果去选拦截先做一道拦截
          if (this.treeCallback && this.treeCallback.beforeTableCheck) {
            const arr = this.selectData.map(item => item.id);
            this.treeCallback.beforeTableCheck(arr).then(res => {
              // 有工单或者告警转工单规则 不能去选择
              if (res) {
                this.$message.error(this.$message.language.accountabilityUnitCheckMsg);
                this.restoreSelected();
              } else {
                this.deleteAll();
              }
            }, () => {
            }).catch();
          } else {
            this.deleteAll();
          }
        }
      }
    };
  }

  /**
   * 取消事件
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * 确认事件
   */
  public handleOk(): void {
    this.selectDataChange.emit(this.selectData);
    this.handleCancel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.xcVisible.currentValue) {
      this.searchValue = null;
      $.fn.zTree.init($(`#${this.treeId}`),
        Object.assign(this.treeSelectorConfig.treeSetting, this.settings),
        this.treeSelectorConfig.treeNodes);
      this.treeInstance = $.fn.zTree.getZTreeObj(this.treeId);
      if (this.treeInstance) {
        let nodes = [];
        if (this.treeSelectorConfig.onlyLeaves) {
          nodes = this.treeInstance.getNodesByFilter((node) => {
            return (!node.isParent);
          });
        } else {
          nodes = this.treeInstance.getNodes();
        }
        this.treeNodeSum = this.treeInstance.transformToArray(nodes).length;
        this.firstSelectData = this.getTreeCheckedNodes();
        if (this.firstSelectData.length > 0) {
          this.firstSelectData.forEach(item => {
            this.treeInstance.selectNode(item);
          });
        }
        this.selectData = CommonUtil.deepClone(this.firstSelectData);
        this.refreshSelectPageData();
      }
    }
  }

  ngAfterViewInit(): void {
  }

  /**
   * 为了阻止事件冒泡
   * param event
   */
  public click(event: any): void {
    event.stopPropagation();
  }

  /**
   * 左边表格数据变化
   * param event
   */
  public selectPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.selectPageBean.pageIndex = event.pageIndex;
    this.selectPageBean.pageSize = event.pageSize;
  }

  /**
   * 清空数据
   */
  public restSelectData(): void {
    this.searchValue = null;
    this.selectData = CommonUtil.deepClone(this.firstSelectData);
    this.refreshSelectPageData();
    this.treeInstance.checkAllNodes(false);
    this.firstSelectData.forEach(item => {
      this.treeInstance.checkNode(item, true, false);
    });
  }

  /**
   * 键盘弹起事件
   * param event
   */
  public onInputKeyUp(event): void {
    if (event.keyCode === 13) {
      this.search();
      const a = document.getElementById('searchDropDown') as any;
      const obj = document.createEvent('MouseEvents');
      obj.initMouseEvent('click', true,
        true, window, 1, 12,
        345, 7, 220,
        false, false, true, false, 0, null);
      a.dispatchEvent(obj);
    }
  }

  /**
   *用于父组件调用设置被选择的节点
   * param node
   * param {any} checked
   * param {any} checkTypeFlag
   * param {any} callbackFlag
   */
  public checkNode(data, checked, checkTypeFlag, callbackFlag): void {
    data.forEach(item => {
      const node = this.treeInstance.getNodesByParam(this.treeSelectorConfig.treeSetting.data.simpleData.idKey, item, null);
      this.treeInstance.checkNode(node, checked, checkTypeFlag, callbackFlag);
    });
  }

  /**
   * 搜索值变化事件
   * param event
   */
  public modelChange(event): void {
    const node = this.treeInstance.getNodeByParam(this.treeSelectorConfig.treeSetting.data.simpleData.idKey, event, null);
    this.treeInstance.selectNode(node);
  }

  /**
   * 搜索输入框值变化事件
   * param event
   */
  public inputChange(event): void {
    this.searchValue = event;
    if (event) {
      const node = this.treeInstance.getNodesByParamFuzzy(this.treeSelectorConfig.treeSetting.data.key.name || 'name',
        event, null);
      this.selectInfo = {
        data: node,
        label: this.treeSelectorConfig.treeSetting.data.key.name || 'name',
        value: this.treeSelectorConfig.treeSetting.data.simpleData.idKey || 'id'
      };
    } else {
      this.selectInfo = {
        data: [],
        label: this.treeSelectorConfig.treeSetting.data.key.name || 'name',
        value: this.treeSelectorConfig.treeSetting.data.simpleData.idKey || 'id'
      };
    }

  }

  ngOnDestroy(): void {
    this.childCmp = null;
  }

  /**
   * 删除右边列表的某一项
   * param currentItem
   */
  private deleteSomeOne(currentItem: any): void {
    // 找到要删除的项目
    const index = this.selectData.findIndex(item => item.id === currentItem.id);
    this.selectData.splice(index, 1);
    // 删除完刷新被选数据
    this.childCmp.checkStatus();
    this.refreshSelectPageData();
    this.getTreeCheckedNodes().forEach(item => {
      if (item.id === currentItem.id) {
        item.checked = false;
      }
    });
    // 右侧去除勾选后联动左侧树的勾选，并根据树的勾选触发回调去除右侧列表数据
    this.treeInstance.checkNode(currentItem, false, true, true);
  }

  /**
   * 删除右边列表的全部
   */
  private deleteAll(): void {
    this.selectData = [];
    this.refreshSelectPageData();
    this.treeInstance.checkAllNodes(false);
  }

  /**
   * 重新回到选中状态
   */
  private restoreSelected(): void {
    this.selectData.forEach(item => {
      item.checked = true;
    });
    this.childCmp.checkStatus();
  }

  /**
   * 搜索
   */
  private search(): void {
    if (this.searchValue) {
      const node = this.treeInstance.getNodesByParamFuzzy(this.treeSelectorConfig.treeSetting.data.key.name || 'name',
        this.searchValue, null);
      this.searchResult = node;
    }
  }

  /**
   * 定位到某一条
   * param item
   */
  private selectNode(item: any): void {
    this.treeInstance.selectNode(item);
  }

  /**
   * 刷新数据
   */
  private refreshSelectPageData(): void {
    this.selectPageBean.pageSize = this.selectData.length;
    this.selectPageBean.Total = this.selectData.length;
  }

  /**
   * 获取选中的节点
   */
  private getTreeCheckedNodes(): any[] {
    let checkedNodes = [];
    // 只选中叶子
    if (this.treeSelectorConfig.onlyLeaves) {
      checkedNodes = this.treeInstance.getNodesByFilter((node) => {
        return (!node.isParent && node.checked);
      });
    } else {
      checkedNodes = this.treeInstance.getCheckedNodes(true);
    }
    return checkedNodes;
  }

}
