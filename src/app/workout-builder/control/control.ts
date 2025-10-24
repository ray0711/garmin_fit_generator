import { ChangeDetectionStrategy, Component, computed, effect, inject, input, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Block, RepeatBlock, WorkoutBlock, Target, TargetTime, TargetReps, TargetCalories, HeartRateTarget, TargetLapButton } from '../block';
import { toSignal } from '@angular/core/rxjs-interop';
import { intensity } from '../../../types/fitsdk_enums';

type TargetType = 'time' | 'reps' | 'lap' | 'calories' | 'hr';
type HrType = 'above' | 'below';

type FormValue<T> = { [K in keyof T]: T[K] extends FormControl<infer V> ? V : never };

interface RepeatFormShape {
  sets: FormControl<number>;
}

interface WorkoutFormShape {
  name: FormControl<string>;
  intensity: FormControl<intensity>;
  targetType: FormControl<TargetType>;
  durationSeconds: FormControl<number>;
  reps: FormControl<number>;
  weight: FormControl<number>;
  heartRate: FormControl<number>;
  hrType: FormControl<HrType>;
  calories: FormControl<number>;
  formInitialized: FormControl<boolean>;
}

function isTargetTime(t: Target): t is TargetTime {
  return typeof t === 'object' && t !== null && 'durationSeconds' in t;
}
function isTargetReps(t: Target): t is TargetReps {
  return typeof t === 'object' && t !== null && 'reps' in t;
}
function isTargetCalories(t: Target): t is TargetCalories {
  return typeof t === 'object' && t !== null && 'calories' in t;
}
function isHeartRateTarget(t: Target): t is HeartRateTarget {
  return typeof t === 'object' && t !== null && 'heartRate' in t;
}

@Component({
  selector: 'app-control',
  imports: [ReactiveFormsModule],
  templateUrl: './control.html',
  styleUrl: './control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Control {
  block = input<Block>();

  private fb = inject(FormBuilder);

  // Repeat form
  readonly repeatForm = this.fb.group<RepeatFormShape>({
    sets: this.fb.control(1, { nonNullable: true, validators: [Validators.min(1)] }),
  });

  // Workout form
  readonly workoutForm = this.fb.group<WorkoutFormShape>({
    name: this.fb.control<string>('', { nonNullable: true }),
    intensity: this.fb.control<intensity>(intensity.active, { nonNullable: true }),
    targetType: this.fb.control<TargetType>('time', { nonNullable: true }),
    // time
    durationSeconds: this.fb.control<number>(60, { nonNullable: true, validators: [Validators.min(1)] }),
    // reps
    reps: this.fb.control<number>(1, { nonNullable: true, validators: [Validators.min(1)] }),
    weight: this.fb.control<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    // hr
    heartRate: this.fb.control<number>(120, { nonNullable: true, validators: [Validators.min(0)] }),
    hrType: this.fb.control<HrType>('above', { nonNullable: true }),
    // calories
    calories: this.fb.control<number>(100, { nonNullable: true, validators: [Validators.min(1)] }),
    formInitialized: this.fb.control<boolean>(false, { nonNullable: true}),
  });

  // Helpers to switch UI based on block subtype
  readonly isRepeat = computed(() => this.block() instanceof RepeatBlock);
  readonly isWorkout = computed(() => this.block() instanceof WorkoutBlock);

  // Intensity options for select
  readonly intensityOptions: readonly { label: string; value: intensity }[] = [
    { label: 'Active', value: intensity.active },
    { label: 'Rest', value: intensity.rest },
    { label: 'Warmup', value: intensity.warmup },
    { label: 'Cooldown', value: intensity.cooldown },
    { label: 'Recovery', value: intensity.recovery },
    { label: 'Interval', value: intensity.interval },
    { label: 'Other', value: intensity.other },
  ];

  // reflect current block into the forms
  private readonly blockSignal: Signal<Block | undefined> = computed(() => this.block());

  private readonly repeatFormValue = toSignal(this.repeatForm.valueChanges, { initialValue: this.repeatForm.getRawValue() as FormValue<RepeatFormShape> });
  private readonly workoutFormValue = toSignal(this.workoutForm.valueChanges, { initialValue: this.workoutForm.getRawValue() as FormValue<WorkoutFormShape> });

  // When the input block changes, patch forms
  private readonly patchOnBlockChange = effect(() => {
    const b = this.blockSignal();
    if (!b) return;

    if (b instanceof RepeatBlock) {
      this.repeatForm.patchValue({ sets: b.sets }, { emitEvent: false });
    }

    if (b instanceof WorkoutBlock) {
      const targetType = this.getTargetType(b.target);
      const patch: Partial<FormValue<WorkoutFormShape>> = { name: b.name, intensity: b.intensity, targetType, formInitialized: true };
      if (isTargetTime(b.target)) patch.durationSeconds = b.target.durationSeconds;
      if (isTargetReps(b.target)) {
        patch.reps = b.target.reps;
        patch.weight = b.target.weight;
      }
      if (isTargetCalories(b.target)) patch.calories = b.target.calories;
      if (isHeartRateTarget(b.target)) {
        patch.heartRate = b.target.heartRate;
        patch.hrType = b.target.type;
      }
      this.workoutForm.patchValue(patch, { emitEvent: false });
    }
  });

  // When forms change, update the underlying block instance
  private readonly applyRepeatChanges = effect(() => {
    const b = this.blockSignal();
    if (!(b instanceof RepeatBlock)) return;
    const v = this.repeatFormValue();
    b.sets = Math.max(1, v.sets ?? 1);
  });

  private readonly applyWorkoutChanges = effect(() => {
    const b = this.blockSignal();
    if (!(b instanceof WorkoutBlock)) return;
    const v = this.workoutFormValue();
    if(!v.formInitialized){
      return;
    }
    // name and intensity always mapped
    if (typeof v.name === 'string') b.name = v.name;
    if (v.intensity !== undefined) b.intensity = v.intensity;

    // target mapping based on selected type
    switch (v.targetType) {
      case 'time': {
        const t: TargetTime = { durationSeconds: Math.max(1, v.durationSeconds ?? 60) };
        b.target = t;
        break;
      }
      case 'reps': {
        const t: TargetReps = { reps: Math.max(1, v.reps ?? 1), weight: Math.max(0, v.weight ?? 0) };
        b.target = t;
        break;
      }
      case 'calories': {
        const t: TargetCalories = { calories: Math.max(1, v.calories ?? 1) };
        b.target = t;
        break;
      }
      case 'hr': {
        const t: HeartRateTarget = { heartRate: Math.max(0, v.heartRate ?? 0), type: (v.hrType ?? 'above') };
        b.target = t;
        break;
      }
      case 'lap': {
        const t: TargetLapButton = {};
        b.target = t; // lap button marker
        break;
      }
    }
  });

  // Utility to detect current target type
  private getTargetType(target: Target): TargetType {
    if (isTargetTime(target)) return 'time';
    if (isTargetReps(target)) return 'reps';
    if (isTargetCalories(target)) return 'calories';
    if (isHeartRateTarget(target)) return 'hr';
    return 'lap';
  }
}
