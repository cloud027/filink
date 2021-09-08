import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallOrderViewComponent } from './install-order-view.component';

describe('InstallOrderViewComponent', () => {
  let component: InstallOrderViewComponent;
  let fixture: ComponentFixture<InstallOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
