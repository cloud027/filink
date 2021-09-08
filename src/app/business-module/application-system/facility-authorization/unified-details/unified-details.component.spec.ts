import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnifiedDetailsComponent } from './unified-details.component';

describe('UnifiedDetailsComponent', () => {
  let component: UnifiedDetailsComponent;
  let fixture: ComponentFixture<UnifiedDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnifiedDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnifiedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
