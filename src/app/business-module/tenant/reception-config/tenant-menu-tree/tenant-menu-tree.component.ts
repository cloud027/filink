import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {TenantMenuTreeOperateService} from '../../share/sevice/menu-tree-operate.service';
import {SystemLanguageEnum} from '../../../../core-module/enum/alarm/system-language.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-tenant-menu-tree',
  templateUrl: './tenant-menu-tree.component.html',
  styleUrls: ['./tenant-menu-tree.component.scss']
})
export class TenantMenuTreeComponent implements OnInit {
  // 节点
  @Input() nodes;
  // 当前语言环境
  @Input() languageConfig;
  // 操作开关
  @Output() dataChange = new EventEmitter();
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 编辑弹窗显示
  public isVisible: boolean = false;
  // 弹窗loading
  public isConfirmLoading: boolean = false;
  // 弹窗input数据
  public nodeName;
  // 语言配置枚举
  public languageEnum = SystemLanguageEnum;
  // 菜单配置node节点Id
  public nodeId: string = '';
  // 获取全部菜单名称
  private allMenuName: any[] = [];


  constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $menuTreeOperateService: TenantMenuTreeOperateService
  ) {
  }

  public ngOnInit(): void {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
  }

  /**
   * 节点上移
   * param node
   */
  public moveUp(node): void {
    this.nodes = this.$menuTreeOperateService.treeNodeUp(JSON.parse(JSON.stringify(this.nodes)), node);
    this.dataChange.emit(true);
  }

  /**
   * 节点下移
   * param node
   */
  public moveDown(node): void {
    this.nodes = this.$menuTreeOperateService.treeNodeDown(JSON.parse(JSON.stringify(this.nodes)), node);
    this.dataChange.emit(true);
  }

  /**
   * 当前节点的显示隐藏
   * param node
   */
  public isShow(node): void {
    this.nodes = this.$menuTreeOperateService.showStateChange(JSON.parse(JSON.stringify(this.nodes)), node.origin.menuId);
    this.dataChange.emit(true);
    this.$menuTreeOperateService.treeNode = [];
  }

  /**
   * 返回当前树结构
   */
  public getTreeData(): void {
    return this.nodes;
  }


  /**
   * 菜单名称修改
   */
  public titleEdit(node): void {
    this.isVisible = true;
    this.nodeId = node.origin.menuId;
    this.nodeName = node.origin.menuName;

  }

  /**
   * 编辑弹窗确定
   */
  public handleOk(): void {
    this.allMenuName = [];
    this.getAllMenuName(this.nodes);
    if (this.allMenuName.find(item => (item.menuName === this.nodeName && item.menuId !== this.nodeId))) {
      this.$message.info(this.indexLanguage.menuExists);
    } else if (this.nodeName.length === 0 || /^\s+$/.test(this.nodeName)) {
      this.$message.info(this.indexLanguage.NoEmptyOrAllSpaces);
    } else {
      this.nodes = this.$menuTreeOperateService.setNodeMenuName(JSON.parse(JSON.stringify(this.nodes)), this.nodeId, this.nodeName.trim());
      this.dataChange.emit(true);
      this.isVisible = false;
    }
  }


  /**
   * 编辑弹窗取消
   */
  public handleCancel(): void {
    this.isVisible = false;
  }

  /**
   * 递归获取菜单名称
   * @param data 区域树数据
   */
  private getAllMenuName(nodes) {
    nodes.forEach(item => {
      this.allMenuName.push({menuId: item.menuId, menuName: item.menuName});
      if (item.children && item.children.length) {
        this.getAllMenuName(item.children);
      }
    });
  }

}
