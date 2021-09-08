import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTableHeaderComponent } from './area-table-header.component';

describe('AreaTableHeaderComponent', () => {
  let component: AreaTableHeaderComponent;
  let fixture: ComponentFixture<AreaTableHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaTableHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
