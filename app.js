const { App } = require('@slack/bolt');
const { Anthropic } = require('@anthropic-ai/sdk')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

app.event("app_mention", async ({ event, context, client, say }) => {
  console.debug("event", event);

  const threadTs = event.thread_ts ? event.thread_ts : event.ts;

  const message = await anthropic.messages.create({
    max_tokens: 1024,
    messages: [{ role: "user", content: event.text }],
    model: process.env.CLOUD_MODEL,
  });
  console.debug("message", message);

  await say({
    text: message.content[0].text,
    thread_ts: threadTs,
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();