import { expect, test } from "vitest";
import { readDiscoveryTab, readInformationTopic, readDetailPanels, serializeDetailPanels, withSearchValue } from "../../src/lib/interface-state";

test("detail panels have canonical defaults and allowlisted tokens", () => {
  for (const search of ["", "details=invalid", "details=description,notes", "details=notes,description,notes"]) expect(readDetailPanels(search)).toEqual(["description", "notes"]);
  expect(readDetailPanels("details=none")).toEqual([]);
  expect(readDetailPanels("details=notes,unknown,notes")).toEqual(["notes"]);
  expect(readDetailPanels("details=description")).toEqual(["description"]);
  expect(serializeDetailPanels(["notes", "description", "notes"])).toBeNull();
  expect(serializeDetailPanels([])).toBe("none");
  expect(serializeDetailPanels(["notes"])).toBe("notes");
});

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
