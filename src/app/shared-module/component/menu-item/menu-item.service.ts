import {Injectable, Optional, SkipSelf} from '@angular/core';
import {BehaviorSubject, combineLatest, merge, Subject} from 'rxjs';
import {auditTime, distinctUntilChanged, filter, map, mapTo, takeUntil} from 'rxjs/operators';
// 关闭菜单
const CLOSE_STATUS = 222;

@Injectable()
export class MenuItemService {
  // 定义流
  public destroy$ = new Subject<any>();
  // 当前菜单的状态
  public isCurrentSubMenuOpen$ = new BehaviorSubject<any>(false);
  // 子菜单的状态
  private isChildSubMenuOpen$ = new BehaviorSubject<any>(false);
  // 鼠标事件的状态
  private isMouseEnterTitleOrOverlay$ = new Subject<any>();
  // 菜单点击
  private childMenuItemClick$ = new Subject<any>();

  constructor(
    @SkipSelf() @Optional() public nzHostSubmenuService: MenuItemService,
  ) {
    // 点击菜单关闭悬浮
    const isClosedByMenuItemClick = this.childMenuItemClick$.pipe(
      filter(mode => mode !== 'inline'),
      mapTo(false)
    );
    const isCurrentSubmenuOpen$ = merge(this.isMouseEnterTitleOrOverlay$, isClosedByMenuItemClick);
    // 结合子菜单的展开状态和当前鼠标移入移出得出当前菜单展开状态
    const isSubMenuOpenWithDebounce$ = combineLatest([this.isChildSubMenuOpen$, isCurrentSubmenuOpen$]).pipe(
      map(([isChildSubMenuOpen, isCurrentSubmenuOpen]) => {
          if (isCurrentSubmenuOpen === CLOSE_STATUS) {
            return false;
          } else {
            return isChildSubMenuOpen || isCurrentSubmenuOpen;
          }
        }
      ),
      auditTime(150),
      distinctUntilChanged()
    );
    isSubMenuOpenWithDebounce$.pipe((takeUntil(this.destroy$))).subscribe(data => {
      this.setOpenStateWithoutDebounce(data);
      if (this.nzHostSubmenuService) {
        // 设置父组件的子菜单展开状态
        this.nzHostSubmenuService.isChildSubMenuOpen$.next(data);
      } else {
        this.isChildSubMenuOpen$.next(false);
      }
    });
  }

  /**
   * 子菜单点击事件
   * param menu
   */
  onChildMenuItemClick(menu: any): void {
    this.childMenuItemClick$.next(menu);
    this.isChildSubMenuOpen$.next(false);
  }

  /**
   * 设置当前菜单的状态
   * param value
   */
  setOpenStateWithoutDebounce(value: any): void {
    this.isCurrentSubMenuOpen$.next(value);
  }

  /**
   * 设置鼠标悬浮的状态
   * param value
   */
  setMouseEnterTitleOrOverlayState(value: any): void {
    this.isMouseEnterTitleOrOverlay$.next(value);
  }
}
