import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyDismantleComponent } from './already-dismantle.component';

describe('AlreadyDismantleComponent', () => {
  let component: AlreadyDismantleComponent;
  let fixture: ComponentFixture<AlreadyDismantleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlreadyDismantleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyDismantleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
