import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { HrType, TargetType } from '../control/control';
import {
  HeartRateTarget,
  Target,
  TargetCalories,
  TargetLapButton,
  TargetReps,
  TargetTime,
  WorkoutBlock,
} from '../block';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

interface StepTargetFormShape {
  targetType: FormControl<TargetType>;
  durationSeconds: FormControl<number>;
  reps: FormControl<number>;
  weight: FormControl<number>;
  heartRate: FormControl<number>;
  hrType: FormControl<HrType>;
  calories: FormControl<number>;
  formInitialized: FormControl<boolean>;
}
type FormValue<T> = { [K in keyof T]: T[K] extends FormControl<infer V> ? V : never };

@Component({
  selector: 'app-step-target',
  imports: [MatOption, MatSelect, MatFormField, MatLabel, ReactiveFormsModule, MatInput],
  templateUrl: './step-target.html',
  styleUrl: './step-target.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepTarget {
  workoutBlock = model<WorkoutBlock>();
  private fb = inject(FormBuilder);
  readonly stepTargetForm = this.fb.group<StepTargetFormShape>({
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

  private readonly stepTargetFormValue = toSignal(this.stepTargetForm.valueChanges, {
    initialValue: this.stepTargetForm.getRawValue() as FormValue<StepTargetFormShape>,
  });

  private readonly patchOnTargetChange = effect(() => {
    const t = this.workoutBlock()?.target;
    if (!t) return;

    const targetType = this.getTargetType(t);
    const patch: Partial<FormValue<StepTargetFormShape>> = {
      targetType,
      formInitialized: true,
    };
    if (t instanceof TargetTime) patch.durationSeconds = t.durationSeconds;
    if (t instanceof TargetReps) {
      patch.reps = t.reps;
      patch.weight = t.weight;
    }
    if (t instanceof TargetCalories) patch.calories = t.calories;
    if (t instanceof HeartRateTarget) {
      patch.heartRate = t.heartRate;
      patch.hrType = t.type;
    }
    this.stepTargetForm.patchValue(patch, { onlySelf: true, emitEvent: false });
  });

  private readonly applyStepTargetChanges = effect(() => {
    const v = this.stepTargetFormValue();
    if (!v.formInitialized) {
      return;
    }
    const block = this?.workoutBlock();
    if (!block) {
      return;
    }

    switch (v.targetType) {
      case 'time': {
        const t = new TargetTime(Math.max(1, v.durationSeconds ?? 60));
        block.target = t;
        break;
      }
      case 'reps': {
        const t = new TargetReps(Math.max(1, v.reps ?? 1), Math.max(0, v.weight ?? 0));
        block.target = t;
        break;
      }
      case 'calories': {
        const t = new TargetCalories(Math.max(1, v.calories ?? 1));
        block.target = t;
        break;
      }
      case 'hr': {
        const t = new HeartRateTarget(Math.max(0, v.heartRate ?? 0), v.hrType ?? 'above');
        block.target = t;
        break;
      }
      case 'lap': {
        const t = new TargetLapButton();
        block.target = t; // lap button marker
        break;
      }
    }
  });

  private getTargetType(target: Target): TargetType {
    if (target instanceof TargetTime) return 'time';
    if (target instanceof TargetReps) return 'reps';
    if (target instanceof TargetCalories) return 'calories';
    if (target instanceof HeartRateTarget) return 'hr';
    return 'lap';
  }
}
