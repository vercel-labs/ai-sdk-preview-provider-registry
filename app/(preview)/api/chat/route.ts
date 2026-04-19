import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { experimental_createProviderRegistry, streamText } from "ai";
import { checkBotId } from "botid/server";

export async function POST(request: Request) {
  const { isBot } = await checkBotId();
  if (isBot) {
    return new Response("Access denied", { status: 403 });
  }

  const token = await getVercelOidcToken();

  const registry = experimental_createProviderRegistry({
    openai: createOpenAI({
      baseURL: "https://ai-gateway.vercel.sh/v1",
      apiKey: token,
    }),
    anthropic: createAnthropic({
      baseURL: "https://ai-gateway.vercel.sh/v1",
      apiKey: token,
    }),
  });

  const { messages, model } = await request.json();

  const stream = await streamText({
    model: registry.languageModel(model),
    system: `\
      - you are a friendly assistant
      - you are concise with your responses
      - you do not use lists, that's silly
    `,
    messages,
  });

  return stream.toDataStreamResponse();
}
