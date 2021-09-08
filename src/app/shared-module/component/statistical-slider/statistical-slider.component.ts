import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import * as Slider from 'swiper/dist/js/swiper.js';
import {MenuOpenMissionService} from '../../../core-module/mission/menu-open.mission';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * 列表上方统计滑块组件
 */
@Component({
  selector: 'xc-statistical-slider',
  templateUrl: './statistical-slider.component.html',
  styleUrls: ['./statistical-slider.component.scss']
})
export class StatisticalSliderComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // 滑块配置
  @Input() sliderConfig: any[] = [];
  // 显示卡片个数 默认6.1
  @Input() showCardNum: number = 6.1;
  // 选择滑块变化
  @Output() selectChange = new EventEmitter<any>();
  // 滑块隐藏显示变化事件
  @Output() slideShowChange = new EventEmitter<any>();
  // 是否隐藏
  public isHidden: boolean = true;
  // 禁用
  public disabled: boolean = true;
  // 滑块实例
  public mySlider: any;
  // 页面加载
  public pageLoading: boolean = false;
  // 滑块显示隐藏
  public slideShow: boolean = true;
  // 定时器变量
  public timer: number;
  // 订阅流关闭
  private destroy$ = new Subject<void>();

  constructor(private $menuOpenMissionService: MenuOpenMissionService) {
  }

  ngOnInit() {
    this.$menuOpenMissionService.menuOpenChangeHook.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      // 左侧菜单栏200毫秒关闭 等dom 完成渲染之后再更新滑块样式
      this.pageLoading = true;
      setTimeout(() => {
        this.mySlider.updateSize();
        this.mySlider.updateSlides();
        this.pageLoading = false;
      }, 250);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // 消耗前先消耗定时器
    window.clearTimeout(this.timer);
    this.timer = null;
    // 消耗滑块对象，防止内存泄漏
    if (this.mySlider) {
      this.mySlider.destroy();
      this.mySlider = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.pageLoading = true;
    if (this.mySlider) {
      this.mySlider.destroy();
      this.mySlider = null;
    }
    window.clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.mySlider = new Slider('.swiper-container', {
        direction: 'horizontal', // 垂直切换选项
        loop: false, // 循环模式选项
        slidesPerView: this.showCardNum,
        spaceBetween: 10,
        // 如果需要前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          disabledClass: 'my-button-disabled',
          hideOnClick: false,
        },
        grabCursor: true,
        // 被选中的滑块居中，默认居左
        centeredSlides: false,
        autoplay: false,
        speed: 1000,
      });
      this.pageLoading = false;
    });
  }

  ngAfterViewInit(): void {
  }

  /**
   * 鼠标悬浮事件
   */
  public mouseover(): void {
    this.isHidden = false;
  }

  /**
   * 鼠标离开事件
   */
  public mouseout(): void {
    this.isHidden = true;
  }

  /**
   * 点击滑块事件
   * param slide
   */
  public clickSlide(slide: any): void {
    this.selectChange.emit(slide);
  }

  /**
   * 切换滑块事件
   */
  public toggleSlide() {
    this.slideShow = !this.slideShow;
    this.slideShowChange.emit(this.slideShow);
  }
}
