import { z } from 'zod';

export const OBISelectSchema = z.object({
  date: z
    .string()
    .length(6)
    .regex(/^[0-9]+$/, {
      message: '숫자만 입력할 수 있습니다.',
    }),
});
