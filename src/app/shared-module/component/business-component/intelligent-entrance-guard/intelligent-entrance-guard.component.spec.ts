import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelligentEntranceGuardComponent } from './intelligent-entrance-guard.component';

describe('IntelligentEntranceGuardComponent', () => {
  let component: IntelligentEntranceGuardComponent;
  let fixture: ComponentFixture<IntelligentEntranceGuardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntelligentEntranceGuardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelligentEntranceGuardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
