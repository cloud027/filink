import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityMigrationComponent } from './facility-migration.component';

describe('FacilityMigrationComponent', () => {
  let component: FacilityMigrationComponent;
  let fixture: ComponentFixture<FacilityMigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityMigrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
