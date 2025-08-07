import {z} from "zod";


export const usernameSchema = z.object({
    username: z
      .string()
      .min(3, "ユーザー名は3文字以上で入力してください")
      .max(20, "ユーザー名は20文字以内で入力してください")
      .regex(/^[a-zA-Z0-9]+$/, "ユーザー名は英数字のみ使用できます"),
  });

export const profileSchema = z.object({
    username: usernameSchema.shape.username,
    website: z
      .string()
      .url("正しいURL形式で入力してください")
      .nullable()
      .or(z.literal("")), 
    avatar_url: z.string().nullable().or(z.literal("")),
    bio: z
      .string()
      .max(500, "自己紹介は500文字以内で入力してください")
      .nullable()
      .or(z.literal("")),
  });

export const searchSchema = z.object({
  keyword: z
    .string()
    .max(50, "検索キーワードは50文字以内で入力してください")
    //アルファベット、数字、ひらがな、カタカナ、漢字、スペース、全角スペース、句読点、記号を許可
    .regex(/^[\p{Script=Latin}\p{Nd}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\s\u3000、。・ー〜！？「」『』（）\[\]【】]+$/u, "特殊文字は使用できません"),
});

   