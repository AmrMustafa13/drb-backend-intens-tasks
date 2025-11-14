import z from 'zod';
import { config } from 'dotenv';

config();

const jwtValidationSchema = () =>
  z
    .string()
    .regex(
      /^\d+[mhd]$/,
      'Must be a number followed by m (minutes), h (hours), or d (days)',
    );

const validatedEnvVars = z
  .object({
    PORT: z.coerce.number().int().min(0).max(65535).default(3000),
    NODE_ENV: z.enum(['development', 'production']).default('development'),

    LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
      .default('info'),

    ACCESS_TOKEN_SECRET: z.string().min(1),
    ACCESS_TOKEN_EXPIRES_IN: jwtValidationSchema(),

    REFRESH_TOKEN_SECRET: z.string().min(1),
    REFRESH_TOKEN_EXPIRES_IN: jwtValidationSchema(),

    MONGO_URI: z.string().min(1),
  })
  .parse(process.env);

export const configuration = () => validatedEnvVars;
