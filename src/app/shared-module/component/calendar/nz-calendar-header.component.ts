import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {setMonth} from 'date-fns';
import { DateHelperService, NzI18nService as I18n} from 'ng-zorro-antd';
import { OverrideNzSelectComponent } from './override-select/nz-select.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector   : 'override-nz-calendar-header',
  templateUrl: './nz-calendar-header.component.html',
  // tslint:disable-next-line:use-host-property-decorator
  host       : {
    '[style.display]'                : `'block'`,
    '[class.ant-fullcalendar-header]': `true`
  }
})
export class OverrideNzCalendarHeaderComponent implements OnInit, AfterViewInit {
  @Input() mode: 'month' | 'year' = 'month';
  @Output() readonly modeChange: EventEmitter<'month' | 'year'> = new EventEmitter();

  @Input() fullscreen: boolean = true;

  @Input()
  set activeDate(value: Date) {
    this._activeDate = value;
    this.setUpYears();
  }

  get activeDate(): Date {
    return this._activeDate;
  }

  @Output() readonly yearChange: EventEmitter<number> = new EventEmitter();
  @Output() readonly monthChange: EventEmitter<number> = new EventEmitter();
  @ViewChild('monthSelectComponent') monthSelectComponent: OverrideNzSelectComponent;

  _activeDate = new Date();
  yearOffset: number = 10;
  yearTotal: number = 20;
  years: Array<{ label: string, value: number }>;
  months: Array<{ label: string, value: number }>;

  get activeYear(): number {
    return this.activeDate.getFullYear();
  }

  get activeMonth(): number {
    return this.activeDate.getMonth();
  }

  get size(): string {
    return this.fullscreen ? 'default' : 'small';
  }

  get yearTypeText(): string {
    return this.i18n.getLocale().Calendar.year;
  }

  get monthTypeText(): string {
    return this.i18n.getLocale().Calendar.month;
  }

  constructor(private i18n: I18n, private dateHelper: DateHelperService) {
  }

  ngOnInit(): void {
    this.setUpYears();
    this.setUpMonths();
  }

  ngAfterViewInit(): void {

  }

  updateYear(year: number): void {
    this.yearChange.emit(year);
    this.setUpYears(year);
  }

  updateMonth(month: number): void {
    this.monthChange.emit(month);
  }

  private setUpYears(year?: number): void {
    const start = (year || this.activeYear) - this.yearOffset;
    const end = start + this.yearTotal;

    this.years = [];
    for (let i = start; i < end; i++) {
      this.years.push({ label: `${i}`, value: i });
    }
  }

  private setUpMonths(): void {
    this.months = [];

    for (let i = 0; i < 12; i++) {
      const dateInMonth = setMonth(this.activeDate, i);
      const monthText = this.dateHelper.format(dateInMonth, 'MMM');
      this.months.push({ label: monthText, value: i });
    }
  }
}
