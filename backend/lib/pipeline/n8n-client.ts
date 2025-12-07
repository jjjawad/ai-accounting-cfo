/**
 * Thin client to trigger n8n workflows from the backend.
 * URL shape and auth headers can be adjusted when real n8n config is finalized.
 */
export async function triggerWorkflow(nameOrId: string, payload: unknown): Promise<unknown> {
  const baseUrl = process.env.N8N_BASE_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!baseUrl) {
    throw new Error("N8N_BASE_URL is not configured");
  }

  // Placeholder path; adjust when the actual n8n endpoint shape is finalized.
  const url = `${baseUrl.replace(/\/$/, "")}/webhook/${nameOrId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: (error as Error).message ?? "Unknown n8n trigger error",
    };
  }
}
