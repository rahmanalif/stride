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

function buildGuaranteedTargetPool(theme: ThemeConfig, targetIds: IconId[]) {
  return targetIds.flatMap((iconId) =>
    Array.from({ length: randomInt(theme.requiredMatchesRange.min, theme.requiredMatchesRange.max) }, () => iconId)
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDifficultyProfile(theme: ThemeConfig, roundId: number) {
  const columns = roundId >= 4 ? 5 : theme.gridColumns;
  const gridCellCount = columns * columns;
  const targetCount = clamp(2 + Math.floor((roundId - 1) / 2), theme.targetRange.min, theme.targetRange.max);
  const minMatchesPerTarget = clamp(theme.requiredMatchesRange.min + Math.floor((roundId - 1) / 3), 2, 4);
  const maxMatchesPerTarget = clamp(minMatchesPerTarget + 1, minMatchesPerTarget, 5);
  const roundTimeLimitSeconds = clamp(theme.roundTimeRange.max - (roundId - 1), theme.roundTimeRange.min, theme.roundTimeRange.max);

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
  const targetBias = clamp(0.28 + (roundId - 1) * 0.05, 0.28, 0.55);
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
