const checkRequiredEnvs = () => {
  const requiredEnvs = [
    "SLACK_BOT_TOKEN",
    "SLACK_SIGNING_SECRET",
    "ANTHROPIC_API_KEY",
    "CLAUDE_MODEL",
  ]

  const emptyEnvs = []

  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      emptyEnvs.push(env)
    }
  })

  return emptyEnvs
};

const buildMessageFromSlackThread = async (thread, botId) => {
  const messages = thread.messages.map((message) => {
    return {
      role: message.bot_id === botId ? "assistant" : "user",
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
  if(isDebug) console.debug("messages", JSON.stringify(messages, null, 2))

  return messages
}

const isDebug = process.env.NODE_ENV !== "production"

exports.checkRequiredEnvs = checkRequiredEnvs;
exports.buildMessageFromSlackThread = buildMessageFromSlackThread;
exports.isDebug = isDebug;
