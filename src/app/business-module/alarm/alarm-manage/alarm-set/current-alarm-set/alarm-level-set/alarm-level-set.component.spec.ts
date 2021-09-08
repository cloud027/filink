import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmLevelSetComponent } from './alarm-level-set.component';

describe('AlarmLevelSetComponent', () => {
  let component: AlarmLevelSetComponent;
  let fixture: ComponentFixture<AlarmLevelSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmLevelSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmLevelSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
