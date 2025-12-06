export interface N8nIngestionConfig {
  webhookUrl: string;
  authToken?: string;
}

export function getN8nIngestionConfig(): N8nIngestionConfig {
  const url = process.env.N8N_INGESTION_WEBHOOK_URL;
  const token =
    process.env.N8N_INGESTION_WEBHOOK_TOKEN ?? process.env.N8N_INGESTION_API_KEY;

  if (!url || url.trim().length === 0) {
    throw new Error("Missing N8N_INGESTION_WEBHOOK_URL env variable");
  }

  return {
    webhookUrl: url,
    authToken: token && token.trim().length > 0 ? token : undefined,
  };
}

export function logN8nConfigIfDev(): void {
  if (process.env.NODE_ENV !== "development") return;

  try {
    const cfg = getN8nIngestionConfig();
    console.log("[n8n] Ingestion webhook configured:", {
      webhookUrl: cfg.webhookUrl,
      hasAuthToken: !!cfg.authToken,
    });
  } catch (err) {
    console.warn("[n8n] Ingestion webhook NOT fully configured:", (err as Error).message);
  }
}
