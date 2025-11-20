import { FitEncoder } from './fit-encoder';
import { WorkoutBlock } from './workout-builder/block';

describe('FitEncoder', () => {
  let encoder: FitEncoder;

  beforeEach(() => {
    encoder = new FitEncoder();
  });

  it('should create an instance', () => {
    expect(encoder).toBeTruthy();
  });

  describe('encode', () => {
    it('should accept workoutName parameter', () => {
      const workout: WorkoutBlock[] = [];
      expect(() => encoder.encode(workout, 'Test Workout')).not.toThrow();
    });

    it('should use default workout name when not provided', () => {
      const workout: WorkoutBlock[] = [];
      expect(() => encoder.encode(workout)).not.toThrow();
    });

    it('should encode workout with provided name', () => {
      const workout: WorkoutBlock[] = [];
      const result = encoder.encode(workout, 'My Custom Workout');
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
