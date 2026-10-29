import { expect, test } from "vitest";
import { readDiscoveryTab, readInformationTopic, withSearchValue } from "../../src/lib/interface-state";

test("information topics accept only known help panels", () => {
  for (const topic of ["contact", "tracking", "shipping", "returns"]) expect(readInformationTopic(`info=${topic}`)).toBe(topic);
  for (const search of ["", "info=invalid", "info=https://example.com"]) expect(readInformationTopic(search)).toBeNull();
});

test("discovery state is allowlisted and preserves unrelated URL context", () => {
  expect(readDiscoveryTab("discovery=families")).toBe("families");
  expect(readDiscoveryTab("discovery=invalid")).toBe("notes");
  expect(withSearchValue("/en?info=shipping#scents", "discovery", "families")).toBe("/en?info=shipping&discovery=families#scents");
  expect(withSearchValue("/en?discovery=families&q=rose#scents", "discovery", null)).toBe("/en?q=rose#scents");
  for (const href of ["https://example.com", "//example.com", "/\\example.com", "javascript:alert(1)"]) {
    expect(() => withSearchValue(href, "info", "shipping")).toThrow();
  }
});
