import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevanceFaultComponent } from './relevance-fault.component';

describe('RelevanceFaultComponent', () => {
  let component: RelevanceFaultComponent;
  let fixture: ComponentFixture<RelevanceFaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelevanceFaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevanceFaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
