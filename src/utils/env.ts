// src/env.ts
import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z
    .string()
    .url("VITE_SUPABASE_URL precisa ser uma URL válida (ex: https://xxx.supabase.co)"),

  VITE_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "VITE_SUPABASE_PUBLISHABLE_KEY é obrigatória"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  console.error(parsed.error.format());
  throw new Error("Env inválido. Corrija o arquivo .env e reinicie o Vite.");
}

export const env = parsed.data;
