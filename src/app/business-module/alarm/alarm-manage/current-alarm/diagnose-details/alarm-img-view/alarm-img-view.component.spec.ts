import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmImgViewComponent } from './alarm-img-view.component';

describe('AlarmImgViewComponent', () => {
  let component: AlarmImgViewComponent;
  let fixture: ComponentFixture<AlarmImgViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmImgViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmImgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
