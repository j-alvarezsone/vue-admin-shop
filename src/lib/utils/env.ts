import { z } from "zod";

const envSchema = z.object({
  VITE_TESLO_API_URL: z.string(),
  VITE_STAGE: z.string(),
});

export const env = envSchema.parse(import.meta.env);
