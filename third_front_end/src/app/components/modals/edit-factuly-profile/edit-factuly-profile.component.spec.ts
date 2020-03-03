import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFactulyProfileComponent } from './edit-factuly-profile.component';

describe('EditFactulyProfileComponent', () => {
  let component: EditFactulyProfileComponent;
  let fixture: ComponentFixture<EditFactulyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFactulyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFactulyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
