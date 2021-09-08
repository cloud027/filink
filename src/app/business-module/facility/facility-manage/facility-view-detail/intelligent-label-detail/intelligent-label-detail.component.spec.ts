import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelligentLabelDetailComponent } from './intelligent-label-detail.component';

describe('IntelligentLabelDetailComponent', () => {
  let component: IntelligentLabelDetailComponent;
  let fixture: ComponentFixture<IntelligentLabelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntelligentLabelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelligentLabelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
