import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTarget } from './step-target';

describe('StepTarget', () => {
  let component: StepTarget;
  let fixture: ComponentFixture<StepTarget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepTarget],
    }).compileComponents();

    fixture = TestBed.createComponent(StepTarget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
