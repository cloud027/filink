import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePointModelComponent } from './change-point-model.component';

describe('ChangePointModelComponent', () => {
  let component: ChangePointModelComponent;
  let fixture: ComponentFixture<ChangePointModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePointModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePointModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
