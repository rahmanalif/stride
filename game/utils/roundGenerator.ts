import { GridCell, IconId, RoundDefinition, ThemeConfig } from '@/game/types';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDifficultyProfile(theme: ThemeConfig, roundId: number) {
  const columns = roundId >= 10 ? 5 : theme.gridColumns;
  const gridCellCount = columns * columns;

  const targetCount =
    roundId <= 4 ? 2 : roundId <= 14 ? 3 : 4;

  const minMatchesPerTarget =
    roundId <= 4 ? 2 : roundId <= 9 ? 2 : roundId <= 14 ? 2 : 2;
  const maxMatchesPerTarget =
    roundId <= 4 ? 2 : roundId <= 9 ? 2 : roundId <= 14 ? 3 : 2;

  const roundTimeLimitSeconds = clamp(
    roundId <= 4 ? 24 : roundId <= 9 ? 26 : roundId <= 14 ? 28 : 30,
    theme.roundTimeRange.min,
    theme.roundTimeRange.max
  );

  return {
    columns,
    gridCellCount,
    maxMatchesPerTarget,
    minMatchesPerTarget,
    roundTimeLimitSeconds,
    targetCount,
  };
}

function pickWeightedFiller(iconIds: IconId[], targetIds: IconId[], targetBias: number) {
  const shouldUseTarget = Math.random() < targetBias;
  const pool = shouldUseTarget ? targetIds : iconIds;

  return pool[randomInt(0, pool.length - 1)];
}

function createGridCells(iconIds: IconId[]) {
  return shuffle(iconIds).map<GridCell>((iconId, index) => ({
    id: `cell-${index}-${iconId}`,
    iconId,
    status: 'idle',
  }));
}

export function countTargetCells(grid: GridCell[], targetIds: IconId[]) {
  return grid.filter((cell) => targetIds.includes(cell.iconId)).length;
}

export function generateRound(theme: ThemeConfig, roundId: number): RoundDefinition {
  const difficulty = getDifficultyProfile(theme, roundId);
  const iconIds = theme.icons.map((icon) => icon.id);
  const targetIds = shuffle(iconIds).slice(0, difficulty.targetCount);
  const guaranteedTargets = targetIds.flatMap((iconId) =>
    Array.from(
      { length: randomInt(difficulty.minMatchesPerTarget, difficulty.maxMatchesPerTarget) },
      () => iconId
    )
  );
  const remainingCells = Math.max(difficulty.gridCellCount - guaranteedTargets.length, 0);
  const targetBias = clamp(
    roundId <= 4 ? 0.08 : roundId <= 9 ? 0.1 : roundId <= 14 ? 0.12 : 0.14,
    0.08,
    0.16
  );
  const filler = Array.from({ length: remainingCells }, () => pickWeightedFiller(iconIds, targetIds, targetBias));

  return {
    columns: difficulty.columns,
    difficulty: difficulty.columns === 5 ? 'hard' : 'normal',
    gridCellCount: difficulty.gridCellCount,
    id: roundId,
    roundTimeLimitSeconds: difficulty.roundTimeLimitSeconds,
    targetIds,
    grid: createGridCells([...guaranteedTargets, ...filler]),
  };
}
