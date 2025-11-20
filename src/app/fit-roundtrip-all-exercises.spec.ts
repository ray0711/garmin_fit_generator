import { FitEncoder } from './fit-encoder';
import FitDecoder from './fit-decoder';
import { Block, WorkoutBlock } from './workout-builder/block';
import { ExerciseCategory } from '../types_auto/fitsdk_enums';
import { Profile } from '../types_generated';

// Matches the Exercise interface used by the app
interface Exercise {
  Name: string;
  NAME_GARMIN: string; // e.g., AB_TWIST
  CATEGORY_GARMIN: string; // e.g., BANDED_EXERCISES
}

function screamingSnakeToCamel(input: string): string {
  return input
    .toLowerCase()
    .split('_')
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');
}

function isExerciseSupportedByProfile(ex: Exercise): boolean {
  // Map CATEGORY_GARMIN (SCREAMING_SNAKE) -> ExerciseCategory key (camelCase)
  const categoryKey = screamingSnakeToCamel(ex.CATEGORY_GARMIN);
  const enumVal = ExerciseCategory[categoryKey as keyof typeof ExerciseCategory] as
    | number
    | undefined;
  if (enumVal === undefined) return false;
  const mapKey = `${categoryKey}ExerciseName`;
  const exerciseMap = (Profile.types as Record<string, Record<number, string> | undefined>)[mapKey];
  if (!exerciseMap) return false;
  const normalizedName = ex.NAME_GARMIN.toUpperCase().replace(/_/g, '');
  // check values of exerciseMap for a match
  const hasName = Object.values(exerciseMap).some(
    (v) => String(v).toUpperCase().replace(/_/g, '') === normalizedName,
  );
  return hasName;
}

function buildBlocksFromExercises(exercises: Exercise[]): Block[] {
  // Create a simple WorkoutBlock per exercise; default TargetTime(60) is already set in ctor
  return exercises
    .filter(isExerciseSupportedByProfile)
    .map((ex) => new WorkoutBlock(ex.Name, false, false, ex.CATEGORY_GARMIN, ex.NAME_GARMIN));
}

function normalizeForCompare(blocks: Block[]): { name: string; categoryGarmin: string }[] {
  return blocks.map((b) => {
    const w = b as WorkoutBlock;
    // Compare by human-readable name (nameOverride) and category; this remains stable via EXERCISE_TITLE
    return { name: w.nameOverride ?? w.name, categoryGarmin: w.categoryGarmin ?? '' };
  });
}

describe('FIT round-trip for full Exercise Library', () => {
  it('adds all exercises, encodes to FIT, uploads (decodes) and preserves order and identity', async () => {
    // Load the same Exercises.json the app uses (served via Karma assets from public/)
    const res = await fetch('Exercises.json');
    expect(res.ok).withContext('Failed to load Exercises.json').toBeTrue();
    const data: Record<string, Exercise> = await res.json();

    // Preserve the library order used by the app (Object.values order)
    const allExercises = Object.values(data);
    // Safety: ensure we have a meaningful dataset
    expect(allExercises.length)
      .withContext('No exercises found in Exercises.json')
      .toBeGreaterThan(0);

    const originalBlocks = buildBlocksFromExercises(allExercises);

    const encoder = new FitEncoder();
    const bytes = encoder.encode(originalBlocks);

    // Simulate download/upload by decoding the bytes back into blocks
    const result = FitDecoder.decode(bytes);
    const decodedBlocks = result.blocks;

    // Compare by Garmin identifiers and order
    const orig = normalizeForCompare(originalBlocks);
    const dec = normalizeForCompare(decodedBlocks);

    expect(dec.length).withContext('Decoded blocks count differs').toBe(orig.length);

    for (let i = 0; i < orig.length; i++) {
      expect(dec[i].categoryGarmin)
        .withContext(`Category mismatch at index ${i}`)
        .toBe(orig[i].categoryGarmin);
      expect(dec[i].name).withContext(`Name mismatch at index ${i}`).toBe(orig[i].name);
    }
  });
});
