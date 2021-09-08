import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CableSettingComponent } from './cable-setting.component';

describe('CableSettingComponent', () => {
  let component: CableSettingComponent;
  let fixture: ComponentFixture<CableSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CableSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CableSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
