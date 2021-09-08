import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NavigationEnd, NavigationError, Router} from '@angular/router';
import {fadeIn} from '../../../../shared-module/animations/fadeIn';
import {MenuModel} from '../../../../core-module/model/system-setting/menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    fadeIn
  ]
})
export class MenuComponent implements OnInit, OnChanges {
  // 菜单数据集合
  @Input() menuList: MenuModel[] = [];
  // 左侧是否收拢
  @Input() isCollapsed: boolean = false;
  // 菜单平铺数据
  private menuMap = new Map<string, MenuModel>();

  constructor(private $router: Router) {
  }

  ngOnInit() {
    this.setMenuHighlight(this.$router.url.split('?')[0]);
    this.handleMenuExpend();
    this.$router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // 租户和管理员视角切换时，确保在menuList数据更新后再通过监听路由的变化来实现菜单的高亮和展开
        setTimeout(() => {
          // 防止链接带参数
          this.setMenuHighlight(event.url.split('?')[0]);
          this.handleMenuExpend();
        })
      }
      if (event instanceof NavigationError) {
        if (event.error && event.error.message) {
          // 也可以用正则 pattern = /Loading chunk chunk-[a-z0-9.]+ failed/;
          if (event.error.message.includes('Loading chunk') && event.error.message.includes('failed')) {
            console.log('项目重新发布，强制页面刷新');
            location.reload();
          } else {
            throw new Error(event.error);
          }
        }
      }
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.menuList && changes.menuList.currentValue && changes.menuList.currentValue.length) {
      this.horizontalTileMenu(this.menuList);
    }

    if (changes.isCollapsed) {
      this.handleMenuExpend()
    }
  }

  /**
   * 点击事件处理回调
   * param event MenuModel
   */
  public menuClickHandle(event: MenuModel): void {
    this.menuList.forEach(item => {
      if (item.menuId !== event.menuId) {
        item.expand = false;
      }
    });
  }

  /**
   * 选中事件处理回调
   * param menuItem
   */
  public menuSelectedHandle(menuItem: MenuModel): void {
    this.menuList.forEach(item => {
      if (item.menuId !== menuItem.menuId && item.isSelected) {
        item.isSelected = false;
        if (item.children && item.children.length) {
          this.setStatus(item.children);
        }
      }
    });
  }

  /**
   * 设施路由高亮
   * param url
   */
  private setMenuHighlight(url: string): void {
    // 因为map数据的顺序可能会乱所以先将所有的选中改成false
    this.menuMap.forEach((value) => {
      value.isSelected = false;
    });
    this.menuMap.forEach((value, key) => {
      if (value.menuHref === url) {
        value.isSelected = true;
        if (value.parentMenuId) {
          this.setParentSelected(value);
        }
      }
    });
  }

  /**
   * 寻找父菜单设置高亮
   * param currentMenu
   */
  private setParentSelected(currentMenu: MenuModel): void {
    const menu = this.menuMap.get(currentMenu.parentMenuId);
    menu.isSelected = true;
    if (menu.parentMenuId) {
      this.setParentSelected(menu);
    }
  }

  /**
   * 设置状态
   * param data MenuModel[]
   */
  private setStatus(data: MenuModel[]): void {
    data.forEach(item => {
      if (item.isSelected) {
        item.isSelected = false;
        if (item.children && item.children.length) {
          this.setStatus(item.children);
        }
      }
    });
  }

  /**
   * 平铺菜单
   * param menuData
   */
  private horizontalTileMenu(menuData: MenuModel[]) {
    menuData.forEach(item => {
      this.menuMap.set(item.menuId, item);
      if (item.children && item.children.length) {
        this.horizontalTileMenu(item.children);
      }
    });
  }

  /**
   * 处理菜单的展开状态
   */
  private handleMenuExpend() {
    if (!this.isCollapsed) {
      // 先将所有的菜单变为折叠状态 防止被多次设置展开
      this.menuList.forEach(item => {
        if (item.expand) {
          item.expand = false;
        }
      });
      // 根据选中的菜单设置展开状态
      this.menuList.forEach(item => {
        if (item.isSelected) {
          item.expand = item.isSelected;
        }
      });
    }
  }
}
