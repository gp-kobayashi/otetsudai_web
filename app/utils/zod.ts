import {z} from "zod";

export const profileSchema = z.object({
    username: z
      .string()
      .min(1, "ユーザー名は必須です")
      .max(20, "ユーザー名は20文字以内で入力してください")
      .regex(/^[a-zA-Z0-9]+$/, "ユーザー名は英数字のみ使用できます"),
    website: z
      .string()
      .url("正しいURL形式で入力してください")
      .nullable()
      .or(z.literal("")), 
    avatar_url: z.string().nullable().or(z.literal("")),
    bio: z.string().nullable().or(z.literal(""))
  });