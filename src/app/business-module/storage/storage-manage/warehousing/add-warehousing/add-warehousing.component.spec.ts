import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWarehousingComponent } from './add-warehousing.component';

describe('AddWarehousingComponent', () => {
  let component: AddWarehousingComponent;
  let fixture: ComponentFixture<AddWarehousingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWarehousingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWarehousingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
