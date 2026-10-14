import { LETTER_TABLE } from "./constants";
import type { LetterData, Position } from "./types";

export function canConnectLeft(base: string): boolean {
  return LETTER_TABLE[base]?.joining.left ?? false;
}

export function canConnectRight(base: string): boolean {
  return LETTER_TABLE[base]?.joining.right ?? false;
}

export function computePosition(letters: LetterData[], i: number): Position {
  const cur = letters[i];
  const prev = letters[i - 1];
  const next = letters[i + 1];
  const joinedRight = !!prev && prev.joining.left && cur.joining.right;
  const joinedLeft = !!next && cur.joining.left && next.joining.right;

  if (joinedRight && joinedLeft) return "Medial";
  if (!joinedRight && joinedLeft) return "Initial";
  if (joinedRight && !joinedLeft) return "Final";
  return "Isolated";
}

export function applyPositions(letters: LetterData[]): LetterData[] {
  return letters.map((l, i) => ({ ...l, position: computePosition(letters, i) }));
}