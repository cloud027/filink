import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmFiltrationAddComponent } from './alarm-filtration-add.component';

describe('AlarmFiltrationAddComponent', () => {
  let component: AlarmFiltrationAddComponent;
  let fixture: ComponentFixture<AlarmFiltrationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmFiltrationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmFiltrationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
