import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmNameSelectComponent } from './alarm-name-select.component';

describe('AlarmNameSelectComponent', () => {
  let component: AlarmNameSelectComponent;
  let fixture: ComponentFixture<AlarmNameSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmNameSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmNameSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
