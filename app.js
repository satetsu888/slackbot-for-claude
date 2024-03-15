const { App } = require('@slack/bolt');
const { Anthropic } = require('@anthropic-ai/sdk')

// Initializes your app with your bot token and signing secret

if (!process.env.SLACK_BOT_TOKEN) {
  console.error("SLACK_BOT_TOKEN is required")
  process.exit(1)
}

if (!process.env.SLACK_SIGNING_SECRET) {
  console.error("SLACK_SIGNING_SECRET is required")
  process.exit(1)
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is required")
  process.exit(1)
}

if (!process.env.CLAUDE_MODEL) {
  console.error("CLAUDE_MODEL is required")
  process.exit(1)
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

app.event("app_mention", async ({ event, context, client, say }) => {
  console.debug("event", event);
  console.debug("context", context)

  let messages = [];
  if (event.thread_ts) {
    const thread = await client.conversations.replies({
      channel: event.channel,
      ts: event.thread_ts,
    });
    console.debug("thread", thread);

    messages = thread.messages.map((message) => {
      return {
        role: message.bot_id === context.botId ? "assistant" : "user",
        content: [{type: "text", text: message.text}],
      }
    }).reduce((acc, message) => {
      if (acc.length === 0) {
        return [message]
      } else {
        const last = acc[acc.length - 1]
        if (last.role === message.role) {
          last.content = last.content.concat(message.content)
          return acc
        } else {
          return acc.concat([message])
        }
      }
    }, [])
  } else {
    messages.push({ role: "user", content: event.text })
  }
  console.debug("messages", JSON.stringify(messages, null, 2))

  const threadTs = event.thread_ts ?? event.ts

  const message = await anthropic.messages.create({
    max_tokens: 1024,
    messages: messages,
    model: process.env.CLAUDE_MODEL,
  })
  // const message = {
  //   content: [
  //     {
  //       text: "dummy",
  //     },
  //   ],
  // }
  console.debug("message", message)

  await say({
    text: message.content[0].text,
    thread_ts: threadTs,
  })
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();