import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionConfigComponent } from './reception-config.component';

describe('ReceptionConfigComponent', () => {
  let component: ReceptionConfigComponent;
  let fixture: ComponentFixture<ReceptionConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
