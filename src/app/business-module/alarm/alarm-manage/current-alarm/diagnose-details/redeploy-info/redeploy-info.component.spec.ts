import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeployInfoComponent } from './redeploy-info.component';

describe('RedeployInfoComponent', () => {
  let component: RedeployInfoComponent;
  let fixture: ComponentFixture<RedeployInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeployInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeployInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
