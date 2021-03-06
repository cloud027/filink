import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzOptionLiComponent } from './nz-option-li.component';
import { OverrideNzOptionComponent } from './nz-option.component';
import { NzSelectService } from './nz-select.service';
import { NzOptionGroupComponent } from 'ng-zorro-antd';

@Component({
  selector           : '[override-nz-option-container]',
  changeDetection    : ChangeDetectionStrategy.OnPush,
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  templateUrl        : './nz-option-container.component.html'
})
export class OverrideNzOptionContainerComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject();
  @ViewChildren(NzOptionLiComponent) listOfNzOptionLiComponent: QueryList<NzOptionLiComponent>;
  @ViewChild('dropdownUl') dropdownUl: ElementRef;
  @Input() nzNotFoundContent: string;
  @Input() nzMenuItemSelectedIcon: TemplateRef<void>;
  @Output() readonly nzScrollToBottom = new EventEmitter<void>();

  scrollIntoViewIfNeeded(option: OverrideNzOptionComponent): void {
    // delay after open
    setTimeout(() => {
      if (this.listOfNzOptionLiComponent && this.listOfNzOptionLiComponent.length && option) {
        const targetOption = this.listOfNzOptionLiComponent.find(
          o => this.nzSelectService.compareWith(o.nzOption.nzValue, option.nzValue)
        );
        /* tslint:disable-next-line:no-string-literal */
        if (targetOption && targetOption.el && targetOption.el[ 'scrollIntoViewIfNeeded' ]) {
          /* tslint:disable-next-line:no-string-literal */
          targetOption.el[ 'scrollIntoViewIfNeeded' ](false);
        }
      }
    });
  }

  trackLabel(_index: number, option: NzOptionGroupComponent): string | TemplateRef<void> {
    return option.nzLabel;
  }

  // tslint:disable-next-line:no-any
  trackValue(_index: number, option: OverrideNzOptionComponent): any {
    return option.nzValue;
  }

  constructor(public nzSelectService: NzSelectService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.nzSelectService.activatedOption$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((option) => {
      this.scrollIntoViewIfNeeded(option);
    });
    this.nzSelectService.check$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.cdr.markForCheck();
    });
    this.ngZone.runOutsideAngular(() => {
      const ul = this.dropdownUl.nativeElement;
      fromEvent<MouseEvent>(ul, 'scroll').pipe(
        takeUntil(this.destroy$)
      ).subscribe(e => {
        e.preventDefault();
        e.stopPropagation();
        if (ul && (ul.scrollHeight < (ul.clientHeight + ul.scrollTop + 10))) {
          this.ngZone.run(() => {
            this.nzScrollToBottom.emit();
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
