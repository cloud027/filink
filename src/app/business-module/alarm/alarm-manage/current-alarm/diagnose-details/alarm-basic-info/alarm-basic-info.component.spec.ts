import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmBasicInfoComponent } from './alarm-basic-info.component';

describe('AlarmBasicInfoComponent', () => {
  let component: AlarmBasicInfoComponent;
  let fixture: ComponentFixture<AlarmBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
