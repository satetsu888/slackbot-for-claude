import { type ConversationsRepliesResponse as SlackConversationsRepliesResponse } from "@slack/web-api"
import { ClaudeAPIMessage } from "./types"

export const checkRequiredEnvs = (): Array<string> => {
  const requiredEnvs = [
    "SLACK_SIGNING_SECRET",
    "ANTHROPIC_API_KEY",
  ]

  const emptyEnvs: Array<string> = []

  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      emptyEnvs.push(env)
    }
  })

  // check for oauth setting
  if (!process.env["SLACK_BOT_TOKEN"]) {
    const oauthRequiredEnvs = [
      "SLACK_CLIENT_ID",
      "SLACK_CLIENT_SECRET",
    ]

    oauthRequiredEnvs.forEach((env) => {
      if (!process.env[env]) {
        emptyEnvs.push(env)
      }
    })
  }

  return emptyEnvs
}

export const buildClaudeAPIMessageFromSlackThread = async (thread: SlackConversationsRepliesResponse  , botId: string): Promise<ClaudeAPIMessage[]> => {
  if (!thread.messages) {
    return []
  }

  const messages = thread.messages.map<ClaudeAPIMessage>((message) => {
    return {
      role: message.bot_id === botId ? "assistant" : "user",
      content: [{type: "text", text: message.text ?? ""}],
    }
  }).reduce((acc: Array<ClaudeAPIMessage>, message: ClaudeAPIMessage) => {
    if (acc.length === 0) {
      return [message]
    }

    const last = acc[acc.length - 1]
    if (last.role === message.role) {
      last.content = last.content.concat(message.content)
      return acc
    } else {
      return acc.concat([message])
    }
  }, [])
  if(isDebug) console.debug("messages", JSON.stringify(messages, null, 2))

  return messages
}

export const isDebug = process.env.NODE_ENV !== "production"
