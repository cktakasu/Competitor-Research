import { describe, expect, test } from "vitest";
import { parseIdsFromQuery } from "./page-utils";

describe("MCB Spec Page Utils", () => {
  test("parseIdsFromQuery returns empty array on null", () => {
    expect(parseIdsFromQuery(null)).toEqual([]);
  });

  test("parseIdsFromQuery parses comma-separated string", () => {
    expect(parseIdsFromQuery("acti9-ic60n,acti9-ic60h")).toEqual(["acti9-ic60n", "acti9-ic60h"]);
  });

  test("parseIdsFromQuery handles URI encoded strings and strips empty values", () => {
    expect(parseIdsFromQuery("acti9-ic60n%20,%20,,acti9-ic60l")).toEqual([
      "acti9-ic60n",
      "acti9-ic60l"
    ]);
    expect(parseIdsFromQuery("acti9-ic60n%20,,%20acti9-ic60l%20")).toEqual([
      "acti9-ic60n",
      "acti9-ic60l"
    ]);
  });
});
