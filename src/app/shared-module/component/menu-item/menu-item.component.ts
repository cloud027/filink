import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MenuItemService} from './menu-item.service';
import {Router} from '@angular/router';
import {DEFAULT_SUBMENU_POSITIONS} from './menu.const';
import {fadeIn} from '../../animations/fadeIn';
import {zoomBigMotion} from '../../animations/zoom-big-motion';
import {slideMotion} from '../../animations/slide-motion';
import {UpdateHostClassService} from '../../service/dom-until/update-host-class.service';
import {TableQueryTermStoreService} from '../../../core-module/store/table-query-term.store.service';
import {MenuModel} from '../../../core-module/model/system-setting/menu.model';
import {SystemLanguageEnum} from '../../../core-module/enum/alarm/system-language.enum';
import {MenuSearchService} from '../../service/menu-search/menu-search.service';
import {LanguageTypeEnum} from '../../../core-module/enum/language-type.enum';

/**
 * 菜单组件
 */
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [fadeIn, zoomBigMotion, slideMotion],
  providers: [MenuItemService, UpdateHostClassService],
})
export class MenuItemComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  // 当前项菜单数据
  @Input()
  menuItem;
  // 菜单是否展开
  @Input()
  isMenuOpen: boolean = false;
  // 左侧slider是否收拢
  @Input()
  isCollapsed: boolean = false;
  // 菜单缩进
  @Input()
  public menuIndent: number = 50;
  // 是否是菜单预览
  @Input()
  isMenuPreview: boolean = false;
  // 当前语言环境
  @Input() languageConfig;
  // 子菜单展开事件
  @Output()
  public menuClickHandle = new EventEmitter();
  // 子菜单选中事件
  @Output()
  // 菜单选中事件
  public menuSelected = new EventEmitter<MenuModel>();
  // 悬浮菜单的宽度
  public cdkConnectedOverlayWidth: number = 160;
  // 悬浮菜单的位置
  public overlayPositions = [...DEFAULT_SUBMENU_POSITIONS];
  // 菜单是否激活
  public isActive: boolean = false;
  // 菜单是否选中
  public isSelected: boolean = false;
  // 订阅流
  private destroy$ = new Subject<void>();
  // 语言配置枚举
  public languageEnum = SystemLanguageEnum;
  // 当前语言环境
  public currentLangType: boolean = false;


  constructor(public menuItemService: MenuItemService,
              private cdr: ChangeDetectorRef,
              private tableQueryTermStoreService: TableQueryTermStoreService,
              private $router: Router,
              private $menuSearchService: MenuSearchService) {
  }

  ngOnInit() {
    this.currentLangType = localStorage.getItem('localId') === LanguageTypeEnum.en;
    // 当为二级菜单试悬浮菜单的宽度
    if (this.menuItem.menuLevel === 2) {
      this.cdkConnectedOverlayWidth = 186;
    }
    // 当前菜单的展开状态
    this.menuItemService.isCurrentSubMenuOpen$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      if (!this.isMenuPreview) {
        this.isActive = open;
      }
      if (open !== this.isMenuOpen) {
        // 当左侧slider展开 并且当前菜单是一级菜单使用向下展开菜单
        if (!this.isCollapsed && this.menuItem.menuLevel === 1) {
          this.isMenuOpen = false;
        } else {
          this.isMenuOpen = open;
        }
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.menuItemService.destroy$.next();
    this.menuItemService.destroy$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isCollapsed && changes.isCollapsed.currentValue) {
      if (this.menuItem.expand) {
        this.menuItem.expand = false;
      }
    }
  }

  ngAfterViewInit(): void {
  }

  /**
   * 鼠标点击事件
   * param event
   */
  public menuClick(event: any): void {
    if (!this.isCollapsed && this.menuItem.menuLevel === 1) {
      this.menuItem.expand = !this.menuItem.expand;
      if (!this.isMenuPreview) {
        this.menuClickHandle.emit(this.menuItem);
      }
    }
    if (this.isMenuPreview) {
      return;
    }
    if (!(this.menuItem.children && this.menuItem.children.length)) {
      this.menuItem.isSelected = true;
      this.menuSelected.emit(this.menuItem);
      if (this.menuItemService.nzHostSubmenuService) {
        this.menuItemService.nzHostSubmenuService.onChildMenuItemClick(this.menuItem);
      }
      Promise.resolve().then(() => {
        this.$menuSearchService.eventEmit.emit({menuShow: false});
        this.$router.navigate([this.menuItem.menuHref]).then(() => {
          this.tableQueryTermStoreService.clearQueryTerm();
        });
      });
    }
    event.stopPropagation();
  }

  /**
   * 菜单选中回调
   * param menuItem MenuModel
   */
  public menuSelectedHandle(menuItem: MenuModel): void {
    this.menuItem.children.forEach(item => {
      if (item.menuId !== menuItem.menuId && item.isSelected) {
        item.isSelected = false;
        if (item.children && item.children.length) {
          this.setStatus(item.children);
        }
      }
    });
    this.menuItem.isSelected = true;
    this.menuSelected.emit(this.menuItem);
  }

  /**
   * 设置鼠标悬浮后的展开状态
   * param event 事件对象
   * param data 状态
   */
  public setMouseEnterState(event: any, data: boolean): void {
    this.menuItemService.setMouseEnterTitleOrOverlayState(data);
    event.stopPropagation();
  }

  /**
   * 设施状态
   * param data
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
}
