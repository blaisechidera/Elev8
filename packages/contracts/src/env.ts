import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(1),
  // Toronto-specific configs
  TORONTO_LAT: z.number().default(43.6532),
  TORONTO_LNG: z.number().default(-79.3832),
});

export type Env = z.infer<typeof envSchema>;
