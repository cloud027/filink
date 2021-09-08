import {Component, Input} from '@angular/core';

/**
 * 三级菜单
 */
@Component({
  selector: 'app-view-three-menu',
  templateUrl: './three-view-menu.component.html',
  styleUrls: ['./three-view-menu.component.scss']
})

export class ThreeViewMenuComponent {
  // 三级菜单列表
  @Input() threeMenuList = [];
  // 标题
  @Input() title: string = '';
  // 判断菜单是否展开
  public isShow: boolean = true;
  // 菜单名称
  public menuName: string = '';

  constructor() {
  }

  /**
   * 展开事件
   * param item
   */
  public expandItem(item): void {
    const nodes = JSON.parse(JSON.stringify(this.threeMenuList));
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].menuId === item.menuId) {
        if (nodes[i].expand) {
          nodes[i].expand = false;
        } else {
          nodes[i].expand = true;
        }
      }
    }
    this.threeMenuList = nodes;
  }
}
