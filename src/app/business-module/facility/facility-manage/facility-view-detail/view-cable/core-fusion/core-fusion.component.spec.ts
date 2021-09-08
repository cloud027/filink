import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreFusionComponent } from './core-fusion.component';

describe('CoreFusionComponent', () => {
  let component: CoreFusionComponent;
  let fixture: ComponentFixture<CoreFusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreFusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
