import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ExportMessagePushComponent} from './export-message-push.component';

describe('DatePickerComponent', () => {
  let component: ExportMessagePushComponent;
  let fixture: ComponentFixture<ExportMessagePushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportMessagePushComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportMessagePushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
