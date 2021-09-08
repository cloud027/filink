import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationTableComponent } from './installation-table.component';

describe('InstallationTableComponent', () => {
  let component: InstallationTableComponent;
  let fixture: ComponentFixture<InstallationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
