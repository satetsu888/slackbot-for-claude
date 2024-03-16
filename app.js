const { App } = require('@slack/bolt');
const { Anthropic } = require('@anthropic-ai/sdk')
const { checkRequiredEnvs, buildMessageFromSlackThread, isDebug } = require('./utils');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

app.event("app_mention", async ({ event, context, client, say }) => {
  if(isDebug) console.debug("event", event)
  if(isDebug) console.debug("context", context)

  await client.reactions.add({
    channel: event.channel,
    name: "thinking_face",
    timestamp: event.ts,
  });


  let messages
  if (event.thread_ts) {
    const thread = await client.conversations.replies({
      channel: event.channel,
      ts: event.thread_ts,
    });
    if(isDebug) console.debug("thread", thread)

    messages = await buildMessageFromSlackThread(thread, context.botId)
  } else {
    messages = [{ role: "user", content: event.text }]
  }

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
  if(isDebug) console.debug("message", message)

  await client.reactions.remove({
    channel: event.channel,
    name: "thinking_face",
    timestamp: event.ts,
  });

  await say({
    text: message.content[0].text,
    thread_ts: threadTs,
  })
});

(async () => {
  const emptyEnvs = checkRequiredEnvs()
  if (emptyEnvs.length > 0) {
    console.error(`The following environment variables are not set: ${emptyEnvs.join(", ")}`)
    process.exit(1)
  }

  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();