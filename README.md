# slackbot for Claude API

Simple slackbot for calling the Claude API.

Please note that this project is a work in progress and may have unresolved bugs or incomplete features.

## Features

- [x] response to mentions
- [x] call Claude API with thread messages
- [x] thinking reaction by emoji
- [ ] image data integration

## Setup

TBD

## Options

| ENVS | default | description |
| -------- | -------- | -------- |
| FLAT_RESPONSE   | false  | In default, bot response will create a thread, if set true bot respond message to the channel.  |
| REACTION_EMOJI   | `thinking_face` | Change the emoji displayed while the bot is processing. |
| SKIP_CLAUDE_API   | false   | If set true, skip Claude API call and always get dummy message.  |
