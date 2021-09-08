import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOperateComponent } from './delivery-operate.component';

describe('DeliveryOperateComponent', () => {
  let component: DeliveryOperateComponent;
  let fixture: ComponentFixture<DeliveryOperateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryOperateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryOperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
