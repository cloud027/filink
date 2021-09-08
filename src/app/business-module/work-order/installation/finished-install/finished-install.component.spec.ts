import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedInstallComponent } from './finished-install.component';

describe('FinishedInstallComponent', () => {
  let component: FinishedInstallComponent;
  let fixture: ComponentFixture<FinishedInstallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedInstallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedInstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
