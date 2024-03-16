import type { TextBlock } from "@anthropic-ai/sdk/resources";

export type Role = "assistant" | "user"
export type ClaudeAPIMessage = {
  role: Role,
  content: Array<TextBlock>;
}
