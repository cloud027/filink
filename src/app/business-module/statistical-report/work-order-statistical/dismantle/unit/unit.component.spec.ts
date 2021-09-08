import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantleUnitComponent } from './unit.component';

describe('DismantleUnitComponent', () => {
  let component: DismantleUnitComponent;
  let fixture: ComponentFixture<DismantleUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantleUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantleUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
