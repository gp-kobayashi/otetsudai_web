import { describe, expect, test } from "vitest";
import { usernameSchema, profileSchema } from "@/utils/zod";

describe("zod schemas", () => {
  test("usernameSchemaが正しく機能しているか", () => {
    const validUsername = { username: "testuser" };
    const invalidUsername = { username: "ab" }; // 3文字未満
    const invalidUsername2 = { username: "test?user@" }; // 特殊文字を含む
    const invalidUsername3 = { username: "a".repeat(21) }; // 20文字を超える

    expect(usernameSchema.safeParse(validUsername).success).toBe(true);
    expect(usernameSchema.safeParse(invalidUsername).success).toBe(false);
    expect(usernameSchema.safeParse(invalidUsername2).success).toBe(false);
    expect(usernameSchema.safeParse(invalidUsername3).success).toBe(false);
  });
  test("profileSchemaが正しく機能しているか", () => {
    const validProfile = {
      username: "testuser",
      website: "https://example.com",
      avatar_url: "https://example.com/avatar.png",
      bio: "This is a test bio.",
    };
    const invalidProfile = {
      username: "ab", // 3文字未満
      website: "not-a-url", // 無効なURL
      avatar_url: null,
      bio: null,
    };

    expect(profileSchema.safeParse(validProfile).success).toBe(true);
    expect(profileSchema.safeParse(invalidProfile).success).toBe(false);
  });
});
