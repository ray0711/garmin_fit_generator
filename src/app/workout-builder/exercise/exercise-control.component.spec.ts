import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseControl } from './exercise-control.component';

describe('Exercise', () => {
  let component: ExerciseControl;
  let fixture: ComponentFixture<ExerciseControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseControl],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
