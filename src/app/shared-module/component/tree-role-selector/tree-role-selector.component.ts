import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TreeSelectorConfigModel} from '../../model/tree-selector-config.model';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

declare var $: any;

/**
 * 权限选择器
 */
@Component({
  selector: 'xc-tree-role-selector',
  templateUrl: './tree-role-selector.component.html',
  styleUrls: ['./tree-role-selector.component.scss']
})
export class TreeRoleSelectorComponent implements OnInit, OnChanges {
  // 树配置项
  @Input()
  treeSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 显示隐藏改变
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选择的值改变
  @Output() selectDataChange = new EventEmitter<any>();
  // 是否隐藏按钮
  @Input() isHiddenButton = false;
  // 禁用模式
  @Input() nodeDisabled = false;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 左边的数据
  private selectDataLeft;
  // 右边的数据
  private selectDataRight;
  // 左边树实例
  private treeInstanceLeft: any;
  // 右边树实例
  private treeInstanceRight: any;

  constructor(private $i18n: NzI18nService) {
  }

  _xcVisible = false;

  get xcVisible() {
    return this._xcVisible;
  }

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  ngOnInit() {
    this.commonLanguage = this.$i18n.getLocaleData('common');
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.xcVisible && changes.xcVisible.currentValue) {
      // 初始化左边的树
      $.fn.zTree.init($('#roleLeft'),
        Object.assign(this.treeSelectorConfig.treeLeftSetting, {}),
        this.treeSelectorConfig.leftNodes);
      this.treeInstanceLeft = $.fn.zTree.getZTreeObj('roleLeft');
      // 展开到已选数据
      this.selectDataLeft = this.treeInstanceLeft.getCheckedNodes(true);
      if (this.selectDataLeft.length > 0) {
        this.selectDataLeft.forEach(item => {
          this.treeInstanceLeft.selectNode(item);
        });
      }
      if (this.nodeDisabled) {
        const nodes = this.treeInstanceLeft.transformToArray(this.treeInstanceLeft.getNodes());
        nodes.forEach(item => {
          this.treeInstanceLeft.setChkDisabled(item, true);
        });
      }
      // 初始化右边的树
      $.fn.zTree.init($('#roleRight'),
        Object.assign(this.treeSelectorConfig.treeRightSetting, {}),
        this.treeSelectorConfig.rightNodes);
      this.treeInstanceRight = $.fn.zTree.getZTreeObj('roleRight');
      // 展开到已选数据
      this.selectDataRight = this.treeInstanceRight.getCheckedNodes(true);
      if (this.selectDataRight.length > 0) {
        this.selectDataRight.forEach(item => {
          this.treeInstanceRight.selectNode(item);
        });
      }
      if (this.nodeDisabled) {
        const nodes = this.treeInstanceRight.transformToArray(this.treeInstanceRight.getNodes());
        nodes.forEach(item => {
          this.treeInstanceRight.setChkDisabled(item, true);
        });
      }
    }
  }

  /**
   * 确认事件
   */
  public handleOk(): void {
    const selectData = {
      left: this.treeInstanceLeft.getCheckedNodes(true),
      right: this.treeInstanceRight.getCheckedNodes(true),
    };
    this.selectDataChange.emit(selectData);
    this.handleCancel();
  }

  /**
   * 取消事件
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * 重置事件
   */
  public restSelectData(): void {
    // 重置左边数据
    this.treeInstanceLeft.checkAllNodes(false);
    if (this.selectDataLeft.length > 0) {
      this.selectDataLeft.forEach(item => {
        this.treeInstanceLeft.checkNode(item, true, false);
      });
    }
    // 重置右边数据
    this.treeInstanceRight.checkAllNodes(false);
    if (this.selectDataRight.length > 0) {
      this.selectDataRight.forEach(item => {
        this.treeInstanceRight.checkNode(item, true, false);
      });
    }
  }
}
