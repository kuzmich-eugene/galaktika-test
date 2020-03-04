import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirplaneUpdateComponent } from './airplane-update.component';

describe('AirplaneUpdateComponent', () => {
  let component: AirplaneUpdateComponent;
  let fixture: ComponentFixture<AirplaneUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirplaneUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirplaneUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
