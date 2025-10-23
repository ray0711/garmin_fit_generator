import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutBuilder } from './workout-builder';

describe('WorkoutBuilder', () => {
  let component: WorkoutBuilder;
  let fixture: ComponentFixture<WorkoutBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
