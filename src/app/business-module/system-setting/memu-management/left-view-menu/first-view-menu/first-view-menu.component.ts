import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {fadeIn} from '../../../../../shared-module/animations/fadeIn';

/**
 * 一级菜单
 */
@Component({
  selector: 'app-view-first-menu',
  templateUrl: './first-view-menu.component.html',
  styleUrls: ['./first-view-menu.component.scss'],
  animations: [
    fadeIn
  ]
})

export class FirstViewMenuComponent {
  // 菜单列表
  @Input() menuList = [];
  // 推送取消事件
  @Output() changeThreeMenu = new EventEmitter();
  // 当前点击菜单
  public menuName: string = '';
  // 一级菜单名称
  public firstMenuName: string = '';
  // 菜单id
  public menuId = null;
  // 延时处理
  public timer = null;

  constructor(private $router: Router) {
  }

  /**
   * 路由跳转
   * param item
   */
  public itemClick(item, menuName: string): void {
    this.menuName = item.menuName;
    if (item.children && item.children.length > 0) {
      this.firstMenuName = menuName;
      this.changeThreeMenu.emit(item);
    } else {
      this.changeThreeMenu.emit({});
      // 判断是不是一级菜单  主要用于菜单收起是背景颜色控制
      if (!item.parentMenuId) {
        this.firstMenuName = item.menuName;
      } else {
        this.firstMenuName = menuName;
      }
    }
  }

  /**
   * 展开事件
   * param item
   */
  public expandItem(item): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.menuId !== item.menuId) {
        this.menuId = item.menuId;
        const nodes = JSON.parse(JSON.stringify(this.menuList));
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].menuId === item.menuId) {
            nodes[i].expand = true;
          } else {
            nodes[i].expand = false;
          }
        }
        this.menuList = nodes;
      }
    }, 300);

  }
}
