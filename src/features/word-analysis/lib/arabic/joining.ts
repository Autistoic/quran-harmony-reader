import { LETTER_TABLE, NON_CONNECTING_LEFT } from "./constants";
import type { LetterData, Position } from "./types";

type ConnectionLetter = Pick<LetterData, "base" | "joining" | "nameKey">;

export interface LetterConnectionState {
  hasPrevious: boolean;
  hasNext: boolean;
  connectsPrevious: boolean;
  connectsNext: boolean;
  previousBreaksConnection: boolean;
  position: Position;
  previous?: ConnectionLetter;
}

export function canConnectLeft(base: string): boolean {
  return LETTER_TABLE[base]?.joining.left ?? false;
}

export function canConnectRight(base: string): boolean {
  return LETTER_TABLE[base]?.joining.right ?? false;
}

/** Derives the active letter form from its actual neighbors, following Arabic RTL joining rules. */
export function getLetterConnection(letters: readonly ConnectionLetter[], i: number): LetterConnectionState {
  const current = letters[i];
  const previous = letters[i - 1];
  const next = letters[i + 1];
  if (!current) {
    return {
      hasPrevious: false,
      hasNext: false,
      connectsPrevious: false,
      connectsNext: false,
      previousBreaksConnection: false,
      position: "Isolated",
    };
  }

  const previousCanJoinCurrent = !!previous
    && previous.joining.left
    && !NON_CONNECTING_LEFT.includes(previous.base)
    && current.joining.right;
  const currentCanJoinNext = !!next
    && current.joining.left
    && !NON_CONNECTING_LEFT.includes(current.base)
    && next.joining.right;

  let position: Position = "Isolated";
  if (previousCanJoinCurrent && currentCanJoinNext) position = "Medial";
  else if (currentCanJoinNext) position = "Initial";
  else if (previousCanJoinCurrent) position = "Final";

  return {
    hasPrevious: !!previous,
    hasNext: !!next,
    connectsPrevious: previousCanJoinCurrent,
    connectsNext: currentCanJoinNext,
    previousBreaksConnection: !!previous
      && !previous.joining.left
      && NON_CONNECTING_LEFT.includes(previous.base)
      && !previousCanJoinCurrent
      && currentCanJoinNext,
    position,
    previous,
  };
}

export function computePosition(letters: LetterData[], i: number): Position {
  return getLetterConnection(letters, i).position;
}

export function applyPositions(letters: LetterData[]): LetterData[] {
  return letters.map((l, i) => ({ ...l, position: computePosition(letters, i) }));
}
