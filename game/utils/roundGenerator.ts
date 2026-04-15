import { GridCell, IconId, RoundDefinition, ThemeConfig } from '@/game/types';

const HARD_MODE_START_ROUND = 5;

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
  const isHardRound = roundId >= HARD_MODE_START_ROUND;
  const columns = isHardRound ? 5 : theme.gridColumns;
  const gridCellCount = columns * columns;
  const iconIds = theme.icons.map((icon) => icon.id);
  const targetCount = randomInt(theme.targetRange.min, theme.targetRange.max);
  const targetIds = shuffle(iconIds).slice(0, targetCount);
  const guaranteedTargets = buildGuaranteedTargetPool(theme, targetIds);
  const remainingCells = Math.max(gridCellCount - guaranteedTargets.length, 0);
  const filler = Array.from({ length: remainingCells }, () => iconIds[randomInt(0, iconIds.length - 1)]);

  return {
    columns,
    difficulty: isHardRound ? 'hard' : 'normal',
    gridCellCount,
    id: roundId,
    targetIds,
    grid: createGridCells([...guaranteedTargets, ...filler]),
  };
}
