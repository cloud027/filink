import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockDetailPanelComponent } from './lock-detail-panel.component';

describe('LockDetailPanelComponent', () => {
  let component: LockDetailPanelComponent;
  let fixture: ComponentFixture<LockDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockDetailPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
