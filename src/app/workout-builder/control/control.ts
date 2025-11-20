import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  ModelSignal,
  output,
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
} from '../block';
import { toSignal } from '@angular/core/rxjs-interop';
import { intensity } from '../../../types_auto/fitsdk_enums';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { StepTarget } from '../step-target/step-target';
import { MatIcon } from '@angular/material/icon';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatTooltip } from '@angular/material/tooltip';

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
  notes: FormControl<string>;
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
    MatSlideToggle,
    CdkDragHandle,
    StepTarget,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatTooltip,
  ],
  templateUrl: './control.html',
  styleUrl: './control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Control {
  selected = false;
  block = model<Block>();
  deleteMe = output<boolean>();

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
    notes: this.fb.control<string>('', { nonNullable: true }),
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
  readonly nameOverrideLabel = computed(() => {
    const b = this.block();
    if(b instanceof WorkoutBlock){
      if(b.nameOverride.trim() !== b.name.trim()) return ` for: ${b.nameGarmin}`;
    }
    return '';
  });
  workoutOrUndefined = this.block as ModelSignal<WorkoutBlock | undefined>;
  autoRestBlock = computed(() => {
    const b = this.block();
    return b instanceof RepeatBlock ? b.autoRest : undefined;
  });

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

  intensityLabel(value: intensity | undefined): string {
    return this.intensityOptions.find((o) => o.value === value)?.label ?? 'Unknown';
  }

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
        notes: b.notes,
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
    const b = this.block()?.clone();
    if (!(b instanceof WorkoutBlock)) return;
    const v = this.workoutFormValue();
    if (!v.formInitialized) {
      return;
    }
    if (typeof v.nameOverride === 'string') b.nameOverride = v.nameOverride;
    if (typeof v.notes === 'string') b.notes = v.notes;
    if (v.intensity !== undefined) b.intensity = v.intensity;
    if (!b.equals(this.block())) {
      this.block.set(b);
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

  toggleSelected($event: Event) {
    $event.stopPropagation();
    const b = this.block()?.clone();
    if (b) {
      b.selected = !b.selected;
      this.block.set(b);
    }
  }

  toggleAutoRest() {
    const b = this.block()?.clone();
    if (b instanceof RepeatBlock) {
      if (b.autoRest) {
        b.autoRest = undefined;
      } else {
        b.autoRest = new WorkoutBlock('Rest', false, false, undefined, undefined, intensity.rest);
      }
      this.block.set(b);
    }
  }

  updateAutoRest(autoRest: Block | undefined) {
    if (!autoRest || !(autoRest instanceof WorkoutBlock)) return;
    const b = this.block()?.clone();
    if (b instanceof RepeatBlock) {
      b.autoRest = autoRest;
      this.block.set(b);
    }
  }

  protected delete() {
    this.deleteMe.emit(true);
  }

  protected openPanel() {
    const clone = this.block()?.clone();
    if (clone != undefined) {
      clone.opened = true;
      this.block.set(clone);
    }
  }

  protected closePanel() {
    const clone = this.block()?.clone();
    if (clone != undefined) {
      clone.opened = false;
      this.block.set(clone);
    }
  }

  protected headerDescription(): string {
    const b = this.block();

    if (b instanceof RepeatBlock) return `Sets: ${b.sets}`;
    if (b instanceof WorkoutBlock)
      return `${this.intensityLabel(b.intensity)} ${this.targetDescription(b)}`;
    return '';
  }

  protected targetDescription(block: WorkoutBlock): string {
    if (block.target instanceof TargetTime) return `${block.target.durationSeconds}s`;
    if (block.target instanceof TargetCalories) return `${block.target.calories}C`;
    if (block.target instanceof TargetReps)
      return `${block.target.reps}x @ ${block.target.weight}kg`;
    if (block.target instanceof HeartRateTarget)
      return `${block.target.type} ${block.target.heartRate}bpm`;
    return `Lap button`;
  }
}
