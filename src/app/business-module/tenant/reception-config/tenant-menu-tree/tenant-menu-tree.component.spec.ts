import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantMenuTreeComponent } from './tenant-menu-tree.component';

describe('TenantMenuTreeComponent', () => {
  let component: TenantMenuTreeComponent;
  let fixture: ComponentFixture<TenantMenuTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantMenuTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantMenuTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
