import { LETTER_TABLE } from "./constants";

const TATWEEL = "\u0640"; // ـ — Arabic tatweel / kashida, a visible joining bar

export interface ContextualForms {
  isolated: string;
  initial: string;
  medial: string;
  final: string;
}

/**
 * Build the four contextual forms of an Arabic letter using tatweel
 * (kashida) joiners. Tatweel is a real visible glyph that forces the
 * shaper to pick the connected form, so this works reliably across
 * fonts where ZWJ-based shaping is inconsistent.
 *
 * For letters that don't connect on a side, we omit the tatweel on
 * that side — which correctly collapses initial→isolated and
 * medial→final for non-left-connecting letters (Alif, Dal, Ra, etc.).
 */
export function getContextualForms(base: string): ContextualForms {
  const info = LETTER_TABLE[base];
  const left = info?.joining.left ?? false;
  const right = info?.joining.right ?? false;

  const L = left ? TATWEEL : "";
  const R = right ? TATWEEL : "";

  return {
    isolated: base,
    initial: base + L,
    medial: R + base + L,
    final: R + base,
  };
}
