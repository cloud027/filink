import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteAddComponent } from './remote-add.component';

describe('RemoteAddComponent', () => {
  let component: RemoteAddComponent;
  let fixture: ComponentFixture<RemoteAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
