import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitControl } from './fit-control';

describe('FitControl', () => {
  let component: FitControl;
  let fixture: ComponentFixture<FitControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitControl],
    }).compileComponents();

    fixture = TestBed.createComponent(FitControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('workoutName', () => {
    it('should accept workoutName input', () => {
      fixture.componentRef.setInput('workoutName', 'My Workout');
      expect(component.workoutName()).toBe('My Workout');
    });

    it('should default to empty string when no workoutName provided', () => {
      expect(component.workoutName()).toBe('');
    });
  });

  describe('download', () => {
    it('should use workout name for filename when provided', () => {
      fixture.componentRef.setInput('workoutName', 'Leg Day');
      const anchorElement = {
        click: jasmine.createSpy('click'),
        href: '',
        download: '',
      } as unknown as HTMLAnchorElement;
      spyOn(document, 'createElement').and.returnValue(anchorElement);

      component.download();

      expect(anchorElement.download).toBe('Leg Day.fit');
    });

    it('should use default filename when workout name is empty', () => {
      fixture.componentRef.setInput('workoutName', '');
      const anchorElement = {
        click: jasmine.createSpy('click'),
        href: '',
        download: '',
      } as unknown as HTMLAnchorElement;
      spyOn(document, 'createElement').and.returnValue(anchorElement);

      component.download();

      expect(anchorElement.download).toBe('workout.fit');
    });
  });
});
