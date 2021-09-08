import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import { _isNumberValue } from '@angular/cdk/coercion';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../enum/language.enum';

/**
 * 资产分析表格组件通用（解决表单分析/重置表格数据分页时控制pageIndex的select组件存在的问题）
 */
@Component({
  selector: 'asset-pagination',
  templateUrl: './asset-pagination.component.html',
  styleUrls: ['./asset-pagination.component.scss']
})
export class AssetPaginationComponent implements OnInit, OnChanges {
  @Input()
  xcShowSizeChanger = false;
  @Output()
  xcPageIndexChange = new EventEmitter();
  @Output()
  xcPageSizeChange = new EventEmitter();
  @Output()
  xcPageChange = new EventEmitter();
  public pages: number[] = [];
  // 分页options
  public xcPageSizeOptions = [5, 10, 20, 30, 40];
  // 第一个页码
  public firstIndex = 1;
  // 语言包
  public language: any = {};
  // 公共语言国际化
  public commonLanguage: CommonLanguageInterface;
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
  @Input() nzShowTotal: TemplateRef<{ $implicit: number, range: [ number, number ] }>;
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
    this.commonLanguage = this.i18n.getLocaleData(LanguageEnum.common);
  }

  /**
   * 指定向前或向后跳转多少页
   */
  public jumpDiff(diff: number): void {
    this.jump(this.xcPageIndex + diff);
  }

  /**
   * 跳向第几页
   * param currentIndex
   */
  public jump(index: number): void {
    if (index !== this.xcPageIndex) {
      const pageIndex = this.validatePageIndex(index);
      if(pageIndex !== this.xcPageIndex) {
        this.xcPageIndex = index;
        this.xcPageIndexChange.emit(this.xcPageIndex);
        this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
      }
    }
  }

  /**
   * pageSize 变化
   * param evt
   */
  public onPageSizeChange(evt: number): void {
    this.xcPageSize = evt;
    this.xcPageSizeChange.emit(this.xcPageSize);
    if (this.xcPageIndex > this.lastIndex) {
      this.xcPageIndex = this.lastIndex;
      this.xcPageIndexChange.emit(this.xcPageIndex);
    }
    this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
  }

  /**
   * 输入跳转某一页
   * quickJumperInput 获取到的input元素
   */
  public handleKeyDown(event, quickJumperInput, clearInputValue: boolean): void {
    const target = quickJumperInput;
    const page = _isNumberValue(target.value) ? Number(target.value) : this.xcPageIndex;
    const isValid = typeof page === 'number' && isFinite(page) && Math.floor(page) === page;
    if (isValid && (this.validatePageIndex(page) === page) && page !== this.xcPageIndex) {
      this.xcPageIndex = page;
      this.xcPageIndexChange.emit(this.xcPageIndex);
      this.xcPageChange.emit({pageSize: this.xcPageSize, pageIndex: this.xcPageIndex});
    }
    if (clearInputValue) {
      target.value = null;
    } else {
      target.value = `${this.xcPageIndex}`;
    }
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
    const pages = [];
    if (this.lastIndex <= 9) {
      for (let i = 2; i <= this.lastIndex - 1; i++) {
        pages.push(i);
      }
    } else {
      const current = +this.xcPageIndex;
      let left = Math.max(2, current - 2);
      let right = Math.min(current + 2, this.lastIndex - 1);
      if (current - 1 <= 2) {
        right = 5;
      }
      if (this.lastIndex - current <= 2) {
        left = this.lastIndex - 4;
      }
      for (let i = left; i <= right; i++) {
        pages.push(i);
      }
    }
    this.pages = pages;
  }

  /**
   * 跳转的页面与第一页/最后一页作比较
   */
  private validatePageIndex(value: number): number {
    if (value > this.lastIndex) {
      return this.lastIndex;
    } else if (value < this.firstIndex) {
      return this.firstIndex;
    } else {
      return value;
    }
  }
}
