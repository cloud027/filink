import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';

/**
 * 分页组件对于大数据分页的备用
 */
@Component({
  selector: 'xc-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input()
  xcLoading: boolean = false;
  @Input()
  xcShowSizeChanger = false;
  @Input()
  jumpPageFive: boolean = false;
  @Output()
  xcPageIndexChange = new EventEmitter();
  @Output()
  xcPageSizeChange = new EventEmitter();
  @Output()
  xcPageChange = new EventEmitter();
  public pages: number[] = [];
  // 分页options
  public xcPageSizeOptions = [10, 20, 30, 40, 50];
  // 第一个页码
  public firstIndex = 1;
  // 语言包
  public language: any = {};

  constructor(private i18n: NzI18nService) {
  }

  // 总条数
  private _xcTotal: number;

  get xcTotal(): number {
    return this._xcTotal;
  }

  @Input()
  set xcTotal(value: number) {
    this._xcTotal = value;
  }

  // 当前页码
  private _xcPageIndex: number;

  get xcPageIndex(): number {
    return this._xcPageIndex;
  }

  @Input()
  set xcPageIndex(value: number) {
    if (value < 1) {
      value = 1;
    }
    if (value > this.lastIndex) {
      value = this.lastIndex;
    }
    this._xcPageIndex = value;
    this.bingPageRange();

  }

  // 当前分页大小
  private _xcPageSize: number;

  get xcPageSize(): number {
    return this._xcPageSize;
  }

  @Input()
  set xcPageSize(value: number) {
    if (this.xcPageIndex > this.lastIndex) {
      this.xcPageIndex = this.lastIndex;
      this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
    }
    this._xcPageSize = value;
    this.bingPageRange();

  }

  @ViewChild('renderItemTemplate') private _xcItemRender: TemplateRef<{ $implicit: 'page' | 'prev' | 'next', page: number }>;

  @Input()
  get xcItemRender() {
    return this._xcItemRender;
  }

  set xcItemRender(value) {
    this._xcItemRender = value;
  }

  get lastIndex(): number {
    return Math.ceil(this.xcTotal / this.xcPageSize);
  }

  ngOnInit() {
    this.language = this.i18n.getLocaleData('Pagination');
  }

  /**
   * 上一页
   */
  public previous(): void {
    if (this.xcPageIndex === 1) {
      return;
    }
    this.jump(this.xcPageIndex - 1);
  }

  /**
   * 下一页
   */
  public next(): void {
    if (this.xcPageIndex === this.lastIndex) {
      return;
    }
    this.jump(this.xcPageIndex + 1);
  }

  /**
   * 向后跳5页
   * param index
   */
  public pageFive(index: number): void {
    this.jump(this.xcPageIndex + index);
  }

  /**
   * 跳向第几页
   * param currentIndex
   */
  public jump(currentIndex: number): void {
    if (this.xcLoading) {
      return;
    }
    this.xcLoading = true;
    this.xcPageIndex = currentIndex;
    this.xcPageIndexChange.emit(this.xcPageIndex);
    this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
  }

  /**
   * pageSize 变化
   * param evt
   */
  public onPageSizeChange(evt: number): void {
    if (this.xcLoading) {
      return;
    }
    this.xcLoading = true;
    this.xcPageSize = evt;
    this.xcPageSizeChange.emit(this.xcPageSize);
    if (this.xcPageIndex > this.lastIndex) {
      this.xcPageIndex = this.lastIndex;
      this.xcPageIndexChange.emit(this.xcPageIndex);
    }
    this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
  }

  /**
   * 输入值变化
   * param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.xcPageSize && changes.xcPageIndex || changes.xcTotal) {
      this.bingPageRange();
    }
  }

  /**
   * 绑定的页码
   */
  private bingPageRange(): void {
    const temPages = [];
    const sum = 7;
    if (this.lastIndex < sum) {
      for (let i = 1; i <= this.lastIndex; i++) {
        temPages.push(i);
      }
    } else {
      const currentIndex = this.xcPageIndex;
      let left = Math.max(1, currentIndex - Math.floor(sum / 2));
      let right = Math.min(currentIndex + Math.floor(sum / 2), this.lastIndex);
      if (currentIndex - 1 <= Math.floor(sum / 2)) {
        right = sum;
      }
      if (this.lastIndex - currentIndex <= Math.floor(sum / 2)) {
        left = this.lastIndex - sum + 1;
      }
      for (let i = left; i <= right; i++) {
        temPages.push(i);
      }
    }
    this.pages = temPages;
  }
}
