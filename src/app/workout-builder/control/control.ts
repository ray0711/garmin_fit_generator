import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import {
  Block,
  RepeatBlock,
  WorkoutBlock,
  Target,
  TargetTime,
  TargetReps,
  TargetCalories,
  HeartRateTarget,
  TargetLapButton,
} from '../block';
import { toSignal } from '@angular/core/rxjs-interop';
import { intensity } from '../../../types_auto/fitsdk_enums';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { CdkDragHandle } from '@angular/cdk/drag-drop';

export type TargetType = 'time' | 'reps' | 'lap' | 'calories' | 'hr';
export type HrType = 'above' | 'below';

type FormValue<T> = { [K in keyof T]: T[K] extends FormControl<infer V> ? V : never };

interface RepeatFormShape {
  sets: FormControl<number>;
  formInitialized: FormControl<boolean>;
}

interface WorkoutFormShape {
  name: FormControl<string>;
  nameOverride: FormControl<string>;
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

@Component({
  selector: 'app-control',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    CdkDragHandle,
  ],
  templateUrl: './control.html',
  styleUrl: './control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Control {
  selected = false;
  block = model<Block>();

  private fb = inject(FormBuilder);

  // Repeat form
  readonly repeatForm = this.fb.group<RepeatFormShape>({
    sets: this.fb.control(1, { nonNullable: true, validators: [Validators.min(1)] }),
    formInitialized: this.fb.control<boolean>(false, { nonNullable: true }),
  });

  // Workout form
  readonly workoutForm = this.fb.group<WorkoutFormShape>({
    name: this.fb.control<string>('', { nonNullable: true }),
    nameOverride: this.fb.control<string>('', { nonNullable: true }),
    intensity: this.fb.control<intensity>(intensity.active, { nonNullable: true }),
    targetType: this.fb.control<TargetType>('time', { nonNullable: true }),
    // time
    durationSeconds: this.fb.control<number>(60, {
      nonNullable: true,
      validators: [Validators.min(1)],
    }),
    // reps
    reps: this.fb.control<number>(1, { nonNullable: true, validators: [Validators.min(1)] }),
    weight: this.fb.control<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    // hr
    heartRate: this.fb.control<number>(120, { nonNullable: true, validators: [Validators.min(0)] }),
    hrType: this.fb.control<HrType>('above', { nonNullable: true }),
    // calories
    calories: this.fb.control<number>(100, { nonNullable: true, validators: [Validators.min(1)] }),
    formInitialized: this.fb.control<boolean>(false, { nonNullable: true }),
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

  private readonly repeatFormValue = toSignal(this.repeatForm.valueChanges, {
    initialValue: this.repeatForm.getRawValue() as FormValue<RepeatFormShape>,
  });
  private readonly workoutFormValue = toSignal(this.workoutForm.valueChanges, {
    initialValue: this.workoutForm.getRawValue() as FormValue<WorkoutFormShape>,
  });

  // When the input block changes, patch forms
  private readonly patchOnBlockChange = effect(() => {
    const b = this.block();
    if (!b) return;

    if (b instanceof RepeatBlock) {
      this.repeatForm.patchValue({ sets: b.sets, formInitialized: true }, { emitEvent: false });
    }

    if (b instanceof WorkoutBlock) {
      const targetType = this.getTargetType(b.target);
      const patch: Partial<FormValue<WorkoutFormShape>> = {
        name: b.name,
        nameOverride: b.nameOverride,
        intensity: b.intensity,
        targetType,
        formInitialized: true,
      };
      if (b.target instanceof TargetTime) patch.durationSeconds = b.target.durationSeconds;
      if (b.target instanceof TargetReps) {
        patch.reps = b.target.reps;
        patch.weight = b.target.weight;
      }
      if (b.target instanceof TargetCalories) patch.calories = b.target.calories;
      if (b.target instanceof HeartRateTarget) {
        patch.heartRate = b.target.heartRate;
        patch.hrType = b.target.type;
      }
      this.workoutForm.patchValue(patch, { emitEvent: false });
    }
  });

  // When forms change, update the underlying block instance
  private readonly applyRepeatChanges = effect(() => {
    const b = this.block();

    if (!(b instanceof RepeatBlock)) return;
    const v = this.repeatFormValue();
    if (!v.formInitialized) {
      return;
    }
    b.sets = Math.max(1, v.sets ?? 1);
  });

  private readonly applyWorkoutChanges = effect(() => {
    const b = this.block();
    if (!(b instanceof WorkoutBlock)) return;
    const v = this.workoutFormValue();
    if (!v.formInitialized) {
      return;
    }
    // map editable fields
    if (typeof v.nameOverride === 'string') b.nameOverride = v.nameOverride;
    if (v.intensity !== undefined) b.intensity = v.intensity;

    // target mapping based on selected type
    switch (v.targetType) {
      case 'time': {
        const t = new TargetTime(Math.max(1, v.durationSeconds ?? 60));
        b.target = t;
        break;
      }
      case 'reps': {
        const t = new TargetReps(Math.max(1, v.reps ?? 1), Math.max(0, v.weight ?? 0));
        b.target = t;
        break;
      }
      case 'calories': {
        const t = new TargetCalories(Math.max(1, v.calories ?? 1));
        b.target = t;
        break;
      }
      case 'hr': {
        const t = new HeartRateTarget(Math.max(0, v.heartRate ?? 0), v.hrType ?? 'above');
        b.target = t;
        break;
      }
      case 'lap': {
        const t = new TargetLapButton();
        b.target = t; // lap button marker
        break;
      }
    }
  });

  // Utility to detect current target type
  private getTargetType(target: Target): TargetType {
    if (target instanceof TargetTime) return 'time';
    if (target instanceof TargetReps) return 'reps';
    if (target instanceof TargetCalories) return 'calories';
    if (target instanceof HeartRateTarget) return 'hr';
    return 'lap';
  }

  toggleSelected() {
    this.selected = !this.selected;
  }
}
