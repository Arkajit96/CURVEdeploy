import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFacultyProfileComponent } from './edit-faculty-profile.component';

describe('EditFactulyProfileComponent', () => {
  let component: EditFacultyProfileComponent;
  let fixture: ComponentFixture<EditFacultyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFacultyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFacultyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
