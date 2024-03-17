# slackbot for Claude API

Simple slack bot to request Claude API.

- This bot is designed for a single workspace.
- Please note that this project is a work in progress and may have unresolved bugs or incomplete features.

## Features

- [x] response to mentions
- [x] call Claude API with thread messages
- [x] processing reaction by emoji
- [ ] image integration

## Setup

### 1. Create a Slack App

Go to [Slack API](https://api.slack.com/apps) and create a new app with [slack-app-manifest.json](https://github.com/satetsu888/slackbot-for-claude/blob/main/slack-app-manifest.json)

*You need to replace some urls in the manifest file.

### 2. Install the App to your Workspace

1. Go to `OAuth & Permissions` and click `Install App to Workspace`.
2. Click `Allow` to grant the app the necessary permissions.

*If you don't have a permission to install the app, you need to setup the app with OAuth flow mode and get the Bot Token. Please read [OAuth flow mode](#) for the details.

### 3. Get the Bot Token

1. Go to `OAuth & Permissions` and copy the `Bot User OAuth Access Token`.

### 4. Run the App

1. Clone the repository.
2. Set the following environment variables:

    ```bash
    export SLACK_BOT_TOKEN=<Bot Token you get from the previous step>
    export SLACK_SIGNING_SECRET=<Get it from Slack App Basic Information>
    export ANTHROPIC_API_KEY=<Create this in Claude API Dashboard>
    export CLAUDE_MODEL=claude-3-sonnet-20240229
    ```

3. Run the app with the following command:

    ```bash
    npm install
    npm start
    ```

4. Invite the bot to a channel and mention the bot to see the response.

You can deploy it anywhere you like, which supports Node.js or Docker.

## Options

Some options can be set with environment variables.

| ENVS | default | description |
| -------- | -------- | -------- |
| FLAT_RESPONSE   | false  | In default, bot response will create a thread, if set true bot respond message to the channel.  |
| REACTION_EMOJI   | `thinking_face` | Change the emoji displayed while the bot is processing. |
| PORT   | 3000   | Port number.  |
| SKIP_CLAUDE_API   | false   | If set true, skip Claude API call and always get dummy message.  |
