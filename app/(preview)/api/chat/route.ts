import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { experimental_createProviderRegistry, streamText } from "ai";
import { google } from "@ai-sdk/google";

const registry = experimental_createProviderRegistry({
  openai,
  anthropic,
  google,
});

export async function POST(request: Request) {
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
