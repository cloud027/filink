import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {FormLanguageInterface} from '../../../../assets/i18n/form/form.language.interface';
import {NzAutocompleteComponent, NzI18nService} from 'ng-zorro-antd';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/internal/operators';
import {LanguageEnum} from '../../enum/language.enum';

/**
 * 搜索输入框组件
 */
@Component({
  selector: 'xc-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnChanges, AfterViewInit {
  // 搜索值
  @Input() searchValue;
  // input样式
  @Input() inputStyle;
  // 每一项的样式
  @Input() itemStyle;
  // 搜索信息配置
  @Input()
  selectInfo = {
    data: [],
    label: 'name',
    value: 'id'
  };
  // 搜索值变化
  @Output() searchValueChange = new EventEmitter<any>();
  // 选中值变化
  @Output() modelChange = new EventEmitter<any>();
  // 输入框值变化
  @Output() inputChange = new EventEmitter<any>();
  // input元素
  @ViewChild('searchInput') searchInput: ElementRef;
  // 结果模板
  @ViewChild('resultTemp') resultTemp: TemplateRef<any>;
  // 自动完成组件实例
  @ViewChild('auto') auto: NzAutocompleteComponent;

  // 表单语言包
  public language: FormLanguageInterface;
  // 当前索引
  public currentIndex;

  constructor(private $i18n: NzI18nService) {
  }

  ngOnInit() {
    this.language = this.$i18n.getLocaleData(LanguageEnum.form);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchValue === null) {
      this.selectInfo.data = [];
    }
  }


  ngAfterViewInit(): void {
    const typeAhead = fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map((e: KeyboardEvent) => e.target['value']),
      debounceTime(500),
      distinctUntilChanged()
    );

    typeAhead.subscribe(data => {
      this.inputChange.emit(data);
    });
  }

  /**
   *  选择变化事件
   * param event
   * param value
   * param name
   */
  public optionChange(event, value: any, name: string): void {
    if (name) {
      this.searchValue = name;
    }
    this.modelChange.emit(value);
  }

  /**
   * 键盘事件
   * param event
   */
  public handleKeyDown(event): void {
    if (event.code === 'Enter') {
      const index = this.auto.getOptionIndex(this.auto.activeItem);
      if (index !== undefined) {
        this.modelChange.emit(this.searchValue);
      }
    }
  }

  /**
   * 点击事件
   */
  public inputClick(): void {
    this.selectInfo.data.forEach(item => {
      if (item.name === this.searchValue) {
        this.modelChange.emit(item.id);
      }
    });
  }
}
