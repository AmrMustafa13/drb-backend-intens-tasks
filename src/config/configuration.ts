import z from 'zod';
import { config } from 'dotenv';

config();

const validatedEnvVars = z
  .object({
    PORT: z.coerce.number().int().min(0).max(65535).default(3000),
    NODE_ENV: z.enum(['development', 'production']).default('development'),

    LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
      .default('info'),

    MONGO_URI: z.string().min(1),
  })
  .parse(process.env);

export const configuration = () => validatedEnvVars;
