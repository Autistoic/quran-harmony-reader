import { describe, expect, it } from "vitest";
import { getPhoneticBadges } from "./phoneticBadges";
import type { VowelType } from "./types";

describe("getPhoneticBadges", () => {
  it.each([
    ["Fatha", "a"],
    ["Kasra", "i"],
    ["Damma", "u"],
  ] as const)("maps %s to %s", (type, label) => {
    expect(getPhoneticBadges({ vowel: { type } })).toEqual([
      { key: "short-vowel", label },
    ]);
  });

  it.each([
    "Sukun",
    "LongA",
    "LongI",
    "LongU",
    "TanweenFatha",
    "TanweenKasra",
    "TanweenDamma",
    "SuperscriptAlif",
  ] satisfies VowelType[])("does not add a supplemental badge for %s", (type) => {
    expect(getPhoneticBadges({ vowel: { type } })).toEqual([]);
  });

  it("returns no supplemental badge when there is no vowel", () => {
    expect(getPhoneticBadges({})).toEqual([]);
  });
});
