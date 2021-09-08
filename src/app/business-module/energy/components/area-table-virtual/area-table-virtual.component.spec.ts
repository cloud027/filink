import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTableVirtualComponent } from './area-table-virtual.component';

describe('AreaTableVirtualComponent', () => {
  let component: AreaTableVirtualComponent;
  let fixture: ComponentFixture<AreaTableVirtualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaTableVirtualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaTableVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
