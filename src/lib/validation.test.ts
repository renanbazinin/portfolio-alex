import { describe, expect, it } from "vitest";
import { projectInputSchema, reorderSchema, slugify } from "./validation";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("My Cool Project")).toBe("my-cool-project");
  });

  it("strips punctuation and trims hyphens", () => {
    expect(slugify("  Hello, World! ")).toBe("hello-world");
  });

  it("collapses repeated separators", () => {
    expect(slugify("a___b   c")).toBe("a-b-c");
  });
});

describe("projectInputSchema", () => {
  it("rejects empty title", () => {
    const result = projectInputSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a minimal valid project and applies defaults", () => {
    const result = projectInputSchema.safeParse({ title: "Test" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.publishStatus).toBe("draft");
      expect(result.data.tools).toEqual([]);
      expect(result.data.images).toEqual([]);
    }
  });

  it("rejects an invalid slug", () => {
    const result = projectInputSchema.safeParse({
      title: "Test",
      slug: "Not Valid Slug",
    });
    expect(result.success).toBe(false);
  });

  it("coerces year strings to numbers", () => {
    const result = projectInputSchema.safeParse({ title: "Test", year: "2024" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.year).toBe(2024);
  });
});

describe("reorderSchema", () => {
  it("requires a non-empty id array", () => {
    expect(reorderSchema.safeParse({ order: [] }).success).toBe(false);
    expect(reorderSchema.safeParse({ order: [3, 1, 2] }).success).toBe(true);
  });
});
