import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TreeSelectorConfigModel} from '../../model/tree-selector-config.model';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {CommonUtil} from '../../util/common-util';

declare var $: any;

/**
 * 区域选择器
 */
@Component({
  selector: 'xc-tree-area-selector',
  templateUrl: './tree-area-selector.component.html',
  styleUrls: ['./tree-area-selector.component.scss']
})
export class TreeAreaSelectorComponent implements OnInit, OnChanges, AfterViewInit {
  // 页面类型
  @Input() pageType;
  // 级别
  @Input() level;
  // 树选择器配置
  @Input() treeSelectorConfig: any = new TreeSelectorConfigModel();
  // 是否有child
  @Input() hasChild: boolean;
  // 可否清除
  @Input() canClear: boolean = true;
  // 是否隐藏按钮
  @Input() isHiddenButton = false;
  @Input() nodeDisabled = false;
  // 判断是否是单位选择器，针对单位选择器的级别做另外的处理
  @Input() isUnitSelector: boolean = false;
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<any>();
  // 搜索值
  public searchValue;
  // 搜索结果
  public searchResult = [];
  // 被选择数据
  public checkedNode = [];
  // tree实例
  public treeInstance: any;
  // 显示隐藏
  private _xcVisible = false;
  // form语言包
  public language: any;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 树的id
  public treeId: string;
  // 选择信息变量
  public selectInfo = {
    data: [],
    label: 'label',
    value: 'code'
  };
  get xcVisible() {
    return this._xcVisible;
  }

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  constructor(private $message: FiLinkModalService,
              private $i18n: NzI18nService) {
  }

  ngOnInit() {
    this.language = this.$i18n.getLocaleData('form');
    this.commonLanguage = this.$i18n.getLocaleData('common');
    this.treeId = CommonUtil.getUUid();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.xcVisible && changes.xcVisible.currentValue) {
      this.searchValue = null;
      this.checkedNode = [];
      setTimeout(() => {
        this.treeInstance = $.fn.zTree.init($(`#${this.treeId}`), Object.assign(this.treeSelectorConfig.treeSetting, {
          callback: {
            beforeCheck: (treeId, treeNode) => {
              // 如果为修改 只能选同一级别的
              if (this.pageType === 'update' && this.level) {
                // ztree 的级别从0开始 要先加1
                if (treeNode.level + 1 + 1 !== this.level) {
                  this.$message.error(this.commonLanguage.levelEdit);
                  return false;
                }
              }
              // 针对单位选择器做特别处理，用每个节点的deptLevel属性判断是否是第5级，
              // 如果是第二级单位下的人员登录，则在新增单位时，单位选择器事从第二级开始展示的，所以不能用树本身的level来判断
              if (this.isUnitSelector && this.pageType && Number(treeNode.deptLevel) === 5) {
                this.$message.error(this.commonLanguage.levelLimit);
                return false;
              }
              // 最多只能有5级
              if (this.pageType && treeNode.level + 1 === 5) {
                this.$message.error(this.commonLanguage.levelLimit);
                return false;
              }
              if (!this.treeSelectorConfig.isMultiple) {
                const checkedSelf = treeNode.checked;
                const checkedItems = this.treeInstance.getCheckedNodes(true);
                // 所有去选
                this.treeInstance.checkAllNodes(false);
                const id = this.treeSelectorConfig.treeSetting.data.simpleData.idKey;
                if (checkedItems.length > 0 && checkedItems[0][id] === treeNode[id] && this.canClear) {
                  if (this.hasChild) {
                    // 还原自己的选择状态 下次取反
                    treeNode.checked = checkedSelf;
                    this.$message.error(this.commonLanguage.levelEdit);
                    return false;
                  } else {
                    treeNode.checked = checkedSelf;
                  }
                }
              }
            }
          }
        }), this.treeSelectorConfig.treeNodes);
        // 获取刚进来的时候的选中状态
        this.checkedNode = this.treeInstance.getCheckedNodes(true);
        if (this.checkedNode.length > 0) {
          this.treeInstance.selectNode(this.checkedNode[0]);
        }
        if (this.nodeDisabled) {
          const nodes = this.treeInstance.transformToArray(this.treeInstance.getNodes());
          nodes.forEach(item => {
            this.treeInstance.setChkDisabled(item, true);
          });
        }
      }, 0);
    }
  }

  ngAfterViewInit(): void {
  }

  /**
   * 取消事件
   */
  public handleCancel(): void{
    this.xcVisible = false;
  }

  /**
   * 确定事件
   */
  public handleOk(): void {
    this.selectDataChange.emit(this.treeInstance.getCheckedNodes(true));
    this.handleCancel();
  }

  /**
   * 定位到某一条
   * param item
   */
  public selectNode(item): void {
    this.treeInstance.selectNode(item);
  }

  /**
   * 重置数据
   */
  public restSelectData(): void {
    this.searchValue = null;
    // 如果原来有值到情况下重置到原来到状态
    this.treeInstance.checkAllNodes(false);
    if (this.checkedNode.length > 0) {
      this.checkedNode.forEach(item => {
        this.treeInstance.checkNode(item, true, false);
      });
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
   * 搜索框input值变化
   * param event
   */
  public inputChange(event: string): void {
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

  /**
   * 搜索组件选中某一条
   * param event id
   */
  public modelChange(event: any): void {
    const node = this.treeInstance.getNodeByParam(this.treeSelectorConfig.treeSetting.data.simpleData.idKey, event, null);
    this.treeInstance.selectNode(node);
  }
}
