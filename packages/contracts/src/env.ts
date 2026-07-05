import { z } from 'zod';

export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional(),

  // Clerk Auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/onboarding'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/onboarding'),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // Analytics
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().url().optional(),

  // Email
  RESEND_API_KEY: z.string().min(1).optional(),

  // App
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),

  // Toronto-specific configs
  TORONTO_LAT: z.number().default(43.6532),
  TORONTO_LNG: z.number().default(-79.3832),
});

export type Env = z.infer<typeof envSchema>;
