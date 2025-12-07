// Minimal OpenAI chat helper used for document extraction and other backend AI calls.
// Uses fetch to call OpenAI's chat completions API with JSON response_format.

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const OPENAI_API_URL = process.env.OPENAI_API_URL ?? "https://api.openai.com/v1/chat/completions";

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  return key;
}

export interface ChatJsonOptions {
  model?: string;
  temperature?: number;
}

export async function callOpenAIChatJSON(
  messages: ChatMessage[],
  options?: ChatJsonOptions
): Promise<string> {
  const apiKey = getApiKey();
  const model = options?.model ?? DEFAULT_MODEL;
  const temperature = options?.temperature ?? 0;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response missing content");
  }

  return content;
}

export function getOpenAIClient() {
  throw new Error("OpenAI client not configured yet. Will be implemented after environment setup.");
}
