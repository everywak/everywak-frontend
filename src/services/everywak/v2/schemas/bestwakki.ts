import { z } from 'zod';
import { OrderByEnum, SearchTargetEnum } from '../types/bestwakki';

export const PopularArticlesSelectSchema = z
  .object({
    keyword: z.string().optional(),
    searchTarget: SearchTargetEnum.optional().default('title'),
    beginAt: z.number().optional(),
    endAt: z.number().optional(),
    orderBy: OrderByEnum.optional().default('time'),
    perPage: z.number().int().min(5).max(500).optional().default(30),
    page: z.number().int().min(1).optional().default(1),
  })
  .refine(
    (data) => {
      return !(!!data.beginAt && !!data.endAt) || new Date(data.beginAt) < new Date(data.endAt);
    },
    {
      message: 'beginAt은 endAt보다 빨라야 합니다.',
      path: ['endAt'],
    },
  );

export const PopularArticlesSelectUrlQuerySchema = z
  .object({
    keyword: z.string().optional(),
    searchTarget: SearchTargetEnum.optional().default('title'),
    beginAt: z
      .string()
      .transform((val, ctx) => {
        const parsed = Number(val);
        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'beginAt은 숫자여야 합니다.',
          });
          return z.NEVER;
        }
        return parsed;
      })
      .optional(),
    endAt: z
      .string()
      .transform((val, ctx) => {
        const parsed = Number(val);
        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'endAt은 숫자여야 합니다.',
          });
          return z.NEVER;
        }
        return parsed;
      })
      .optional(),
    orderBy: OrderByEnum.optional().default('time'),
  })
  .refine(
    (data) => {
      return !(!!data.beginAt && !!data.endAt) || new Date(data.beginAt) < new Date(data.endAt);
    },
    {
      message: 'beginAt은 endAt보다 빨라야 합니다.',
      path: ['endAt'],
    },
  );
