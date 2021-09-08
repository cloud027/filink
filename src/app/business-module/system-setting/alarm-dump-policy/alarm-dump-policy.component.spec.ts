import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmDumpPolicyComponent } from './alarm-dump-policy.component';

describe('AlarmDumpPolicyComponent', () => {
  let component: AlarmDumpPolicyComponent;
  let fixture: ComponentFixture<AlarmDumpPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmDumpPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmDumpPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
