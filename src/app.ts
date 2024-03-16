import { App } from '@slack/bolt'
import { Anthropic } from '@anthropic-ai/sdk'
import { checkRequiredEnvs, buildClaudeAPIMessageFromSlackThread, isDebug } from './utils'
import { ClaudeAPIMessage } from './types';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const reactionEmoji = process.env.REACTION_EMOJI ?? "thinking_face"

app.event("app_mention", async ({ event, context, client, say }) => {
  if(isDebug) console.debug("event", event)
  if(isDebug) console.debug("context", context)

  await client.reactions.add({
    channel: event.channel,
    name: reactionEmoji,
    timestamp: event.ts,
  })

  let claudeAPIMessages: Array<ClaudeAPIMessage>
  if (event.thread_ts) {
    const thread = await client.conversations.replies({
      channel: event.channel,
      ts: event.thread_ts,
    })
    if(isDebug) console.debug("thread", thread)

    claudeAPIMessages = await buildClaudeAPIMessageFromSlackThread(thread, context.botId ?? "")
  } else {
    claudeAPIMessages = [
      { role: "user", content: [{ type: "text", text: event.text }] },
    ]
  }

  const threadTs = event.thread_ts ? event.thread_ts : process.env.FLAT_RESPONSE ? undefined : event.ts

  const response = process.env.SKIP_CLAUDE_API
    ? { content: [{ text: "Request to ClaudeAPI is skipped, This is dummy response message." }] }
    : await anthropic.messages.create({
        max_tokens: 1024,
        messages: claudeAPIMessages,
        model: process.env.CLAUDE_MODEL ?? "claude-3-sonnet-20240229",
      })
  if(isDebug) console.debug("response", response)

  await say({
    text: response.content[0].text,
    thread_ts: threadTs,
  })

  await client.reactions.remove({
    channel: event.channel,
    name: reactionEmoji,
    timestamp: event.ts,
  })
});

(async () => {
  const emptyEnvs = checkRequiredEnvs()
  if (emptyEnvs.length > 0) {
    console.error(`The following environment variables are not set: ${emptyEnvs.join(", ")}`)
    process.exit(1)
  }

  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})();