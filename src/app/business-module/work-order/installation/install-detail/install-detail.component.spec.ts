import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallDetailComponent } from './install-detail.component';

describe('InstallDetailComponent', () => {
  let component: InstallDetailComponent;
  let fixture: ComponentFixture<InstallDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
