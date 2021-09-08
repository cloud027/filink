import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolScriptAddComponent } from './protocol-script-add.component';

describe('ProtocolScriptAddComponent', () => {
  let component: ProtocolScriptAddComponent;
  let fixture: ComponentFixture<ProtocolScriptAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolScriptAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolScriptAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
