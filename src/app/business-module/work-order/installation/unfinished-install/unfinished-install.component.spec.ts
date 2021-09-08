import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedInstallComponent } from './unfinished-install.component';

describe('UnfinishedInstallComponent', () => {
  let component: UnfinishedInstallComponent;
  let fixture: ComponentFixture<UnfinishedInstallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedInstallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedInstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
