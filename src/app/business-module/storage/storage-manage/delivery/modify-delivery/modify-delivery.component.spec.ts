import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDeliveryComponent } from './modify-delivery.component';

describe('ModifyDeliveryComponent', () => {
  let component: ModifyDeliveryComponent;
  let fixture: ComponentFixture<ModifyDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
