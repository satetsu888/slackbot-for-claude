import type { TextBlock } from "@anthropic-ai/sdk/resources";

export type ClaudeAPIMessage = {
  role: "assistant" | "user";
  content: Array<TextBlock>;
}
