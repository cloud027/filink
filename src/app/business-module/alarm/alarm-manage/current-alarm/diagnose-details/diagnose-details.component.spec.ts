import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnoseDetailsComponent } from './diagnose-details.component';

describe('DiagnoseDetailsComponent', () => {
  let component: DiagnoseDetailsComponent;
  let fixture: ComponentFixture<DiagnoseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnoseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnoseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
