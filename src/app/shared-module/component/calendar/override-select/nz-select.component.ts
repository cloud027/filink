import { FocusMonitor } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import {
  forwardRef,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { merge, EMPTY, Subject } from 'rxjs';
import { flatMap, startWith, takeUntil } from 'rxjs/operators';
import { NzSelectTopControlComponent } from './nz-select-top-control.component';
import { NzSelectService } from './nz-select.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {isNotNil, toBoolean, NzOptionGroupComponent} from 'ng-zorro-antd';
import { OverrideNzOptionComponent } from './nz-option.component';

@Component({
  selector           : 'override-nz-select',
  preserveWhitespaces: false,
  providers          : [
    NzSelectService,
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OverrideNzSelectComponent),
      multi      : true
    }
  ],
  changeDetection    : ChangeDetectionStrategy.OnPush,
  encapsulation      : ViewEncapsulation.None,
  animations         : [ trigger('slideMotion', [
    state('bottom', style({
      opacity        : 1,
      transform      : 'scaleY(1)',
      transformOrigin: '0% 0%'
    })),
    state('top', style({
      opacity        : 1,
      transform      : 'scaleY(1)',
      transformOrigin: '0% 100%'
    })),
    transition('void => bottom', [
      style({
        opacity        : 0,
        transform      : 'scaleY(0.8)',
        transformOrigin: '0% 0%'
      }),
      animate('100ms cubic-bezier(0.755, 0.05, 0.855, 0.06)')
    ]),
    transition('bottom => void', [
      animate('100ms cubic-bezier(0.755, 0.05, 0.855, 0.06)', style({
        opacity        : 0,
        transform      : 'scaleY(0.8)',
        transformOrigin: '0% 0%'
      }))
    ]),
    transition('void => top', [
      style({
        opacity        : 0,
        transform      : 'scaleY(0.8)',
        transformOrigin: '0% 100%'
      }),
      animate('100ms cubic-bezier(0.755, 0.05, 0.855, 0.06)')
    ]),
    transition('top => void', [
      animate('100ms cubic-bezier(0.755, 0.05, 0.855, 0.06)', style({
        opacity        : 0,
        transform      : 'scaleY(0.8)',
        transformOrigin: '0% 100%'
      }))
    ])
  ]) ],
  templateUrl        : './nz-select.component.html',
  // tslint:disable-next-line:use-host-property-decorator
  host               : {
    '[class.ant-select-lg]'         : 'nzSize==="large"',
    '[class.ant-select-sm]'         : 'nzSize==="small"',
    '[class.ant-select-enabled]'    : '!nzDisabled',
    '[class.ant-select-no-arrow]'   : '!nzShowArrow',
    '[class.ant-select-disabled]'   : 'nzDisabled',
    '[class.ant-select-allow-clear]': 'nzAllowClear',
    '[class.ant-select-open]'       : 'open',
    '(click)'                       : 'toggleDropDown()'
  },
  styles             : [ `
    .ant-select-dropdown {
      top: 100%;
      left: 0;
      position: relative;
      width: 100%;
      margin-top: 4px;
      margin-bottom: 4px;
    }
  ` ]
})
export class OverrideNzSelectComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy, AfterContentInit {
  open = false;
  // tslint:disable-next-line:no-any
  value: any | any[];
  onChange: (value: string | string[]) => void = () => null;
  onTouched: () => void = () => null;
  dropDownPosition: 'top' | 'center' | 'bottom' = 'bottom';
  triggerWidth: number;
  private _disabled = false;
  private _allowClear = false;
  private _showSearch = false;
  private _autoFocus = false;
  private destroy$ = new Subject();
  @ViewChild(CdkOverlayOrigin) cdkOverlayOrigin: CdkOverlayOrigin;
  @ViewChild(CdkConnectedOverlay) cdkConnectedOverlay: CdkConnectedOverlay;
  @ViewChild(NzSelectTopControlComponent) nzSelectTopControlComponent: NzSelectTopControlComponent;
  /** should move to nz-option-container when https://github.com/angular/angular/issues/20810 resolved **/
  @ContentChildren(OverrideNzOptionComponent) listOfNzOptionComponent: QueryList<OverrideNzOptionComponent>;
  @ContentChildren(NzOptionGroupComponent) listOfNzOptionGroupComponent: QueryList<NzOptionGroupComponent>;
  @Output() readonly nzOnSearch = new EventEmitter<string>();
  @Output() readonly nzScrollToBottom = new EventEmitter<void>();
  @Output() readonly nzOpenChange = new EventEmitter<boolean>();
  @Output() readonly nzBlur = new EventEmitter<void>();
  @Output() readonly nzFocus = new EventEmitter<void>();
  @Input() nzSize = 'default';
  @Input() nzDropdownClassName: string;
  @Input() nzDropdownMatchSelectWidth = true;
  @Input() nzDropdownStyle: { [ key: string ]: string; };
  @Input() nzNotFoundContent: string;
  @Input() nzPlaceHolder: string;
  @Input() nzMaxTagCount: number;
  @Input() nzDropdownRender: TemplateRef<void>;
  @Input() nzSuffixIcon: TemplateRef<void>;
  @Input() nzClearIcon: TemplateRef<void>;
  @Input() nzRemoveIcon: TemplateRef<void>;
  @Input() nzMenuItemSelectedIcon: TemplateRef<void>;
  @Input() nzShowArrow = true;
  @Input() nzTokenSeparators: string[] = [];
  // tslint:disable-next-line:no-any
  @Input() nzMaxTagPlaceholder: TemplateRef<{ $implicit: any[] }>;

  @Input()
  set nzAutoClearSearchValue(value: boolean) {
    this.nzSelectService.autoClearSearchValue = toBoolean(value);
  }

  @Input()
  set nzMaxMultipleCount(value: number) {
    this.nzSelectService.maxMultipleCount = value;
  }

  @Input()
  set nzServerSearch(value: boolean) {
    this.nzSelectService.serverSearch = toBoolean(value);
  }

  @Input()
  set nzMode(value: 'default' | 'multiple' | 'tags') {
    this.nzSelectService.mode = value;
    this.nzSelectService.check();
  }

  @Input()
  set nzFilterOption(value) {
    this.nzSelectService.filterOption = value;
  }

  @Input()
  // tslint:disable-next-line:no-any
  set compareWith(value: (o1: any, o2: any) => boolean) {
    this.nzSelectService.compareWith = value;
  }

  @Input()
  set nzAutoFocus(value: boolean) {
    this._autoFocus = toBoolean(value);
    this.updateAutoFocus();
  }

  get nzAutoFocus(): boolean {
    return this._autoFocus;
  }

  @Input()
  set nzOpen(value: boolean) {
    this.open = value;
    this.nzSelectService.setOpenState(value);
  }

  @Input()
  set nzDisabled(value: boolean) {
    this._disabled = toBoolean(value);
    this.nzSelectService.disabled = this._disabled;
    this.nzSelectService.check();
    if (this.nzDisabled) {
      this.closeDropDown();
    }
  }

  get nzDisabled(): boolean {
    return this._disabled;
  }

  @Input()
  set nzAllowClear(value: boolean) {
    this._allowClear = toBoolean(value);
  }

  get nzAllowClear(): boolean {
    return this._allowClear;
  }

  @Input()
  set nzShowSearch(value: boolean) {
    this._showSearch = toBoolean(value);
  }

  get nzShowSearch(): boolean {
    return this._showSearch;
  }

  updateAutoFocus(): void {
    if (this.nzSelectTopControlComponent.inputElement) {
      if (this.nzAutoFocus) {
        this.renderer.setAttribute(this.nzSelectTopControlComponent.inputElement.nativeElement, 'autofocus', 'autofocus');
      } else {
        this.renderer.removeAttribute(this.nzSelectTopControlComponent.inputElement.nativeElement, 'autofocus');
      }
    }
  }

  focus(): void {
    if (this.nzSelectTopControlComponent.inputElement) {
      this.focusMonitor.focusVia(this.nzSelectTopControlComponent.inputElement, 'keyboard');
      this.nzFocus.emit();
    }
  }

  blur(): void {
    if (this.nzSelectTopControlComponent.inputElement) {
      this.nzSelectTopControlComponent.inputElement.nativeElement.blur();
      this.nzBlur.emit();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    this.nzSelectService.onKeyDown(event);
  }

  toggleDropDown(): void {
    if (!this.nzDisabled) {
      this.nzSelectService.setOpenState(!this.open);
    }
  }

  closeDropDown(): void {
    this.nzSelectService.setOpenState(false);
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.dropDownPosition = position.connectionPair.originY;
  }

  updateCdkConnectedOverlayStatus(): void {
    this.triggerWidth = this.cdkOverlayOrigin.elementRef.nativeElement.getBoundingClientRect().width;
  }

  updateCdkConnectedOverlayPositions(): void {
    setTimeout(() => {
      if (this.cdkConnectedOverlay && this.cdkConnectedOverlay.overlayRef) {
        this.cdkConnectedOverlay.overlayRef.updatePosition();
      }
    });
  }

  constructor(private renderer: Renderer2,
              public nzSelectService: NzSelectService,
              private cdr: ChangeDetectorRef,
              private focusMonitor: FocusMonitor,
              elementRef: ElementRef) {
    renderer.addClass(elementRef.nativeElement, 'ant-select');
  }

  /** update ngModel -> update listOfSelectedValue **/
  // tslint:disable-next-line:no-any
  writeValue(value: any | any[]): void {
    this.value = value;
    let listValue = [];
    if (isNotNil(value)) {
      if (Array.isArray(value)) {
        listValue = value;
      } else {
        listValue = [ value ];
      }
    }
    this.nzSelectService.updateListOfSelectedValue(listValue, false);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.nzDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.nzSelectService.searchValue$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.nzOnSearch.emit(data);
      this.updateCdkConnectedOverlayPositions();
    });
    this.nzSelectService.modelChange$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(modelValue => {
      this.value = modelValue;
      this.onChange(this.value);
      this.updateCdkConnectedOverlayPositions();
      // if (this.value !== modelValue) {
      //   this.value = modelValue;
      //   this.onChange(this.value);
      //   this.updateCdkConnectedOverlayPositions();
      // }
    });
    this.nzSelectService.open$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      if (this.open !== value) {
        this.nzOpenChange.emit(value);
      }
      if (value) {
        this.focus();
        this.updateCdkConnectedOverlayStatus();
      } else {
        this.blur();
        this.onTouched();
      }
      this.open = value;
    });
    this.nzSelectService.check$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.updateCdkConnectedOverlayStatus();
  }

  ngAfterContentInit(): void {
    this.listOfNzOptionGroupComponent.changes.pipe(
      startWith(true),
      flatMap(() => merge(
        this.listOfNzOptionGroupComponent.changes,
        this.listOfNzOptionComponent.changes,
        ...this.listOfNzOptionGroupComponent.map(group => group.listOfNzOptionComponent ? group.listOfNzOptionComponent.changes : EMPTY)
      ).pipe(
        startWith(true)
      ))
    ).subscribe(() => {
      this.nzSelectService.updateTemplateOption(
        this.listOfNzOptionComponent.toArray(),
        this.listOfNzOptionGroupComponent.toArray()
      );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
