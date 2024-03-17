# Slackbot for Claude API

This is a straightforward Slackbot designed to facilitate interaction with the Claude API.

- This is designed for use within a single Slack workspace.
- Please note that this project is a work in progress and may have unresolved bugs or incomplete features.

## Features

- [x] Responds to mentions
- [x] Calls the Claude API with thread messages
- [x] Processes reactions by emoji
- [ ] Image integration (upcoming)

## Setup

### 1. Create a Slack App

Visit [Slack API](https://api.slack.com/apps) and create a new app with [slack-app-manifest.json](https://github.com/satetsu888/slackbot-for-claude/blob/main/slack-app-manifest.json)

*Note: You'll need to replace some URLs in the manifest file.

### 2. Install the App to your Workspace

1. Go to `OAuth & Permissions` and click `Install App to Workspace`.
2. Click `Allow` to grant the app the necessary permissions.

*If you don't have a permission to install the app, you need to setup the app with OAuth flow mode and obtain the Bot Token. In this case, the admin of your workspace needs to install the app. For more details, please refer to [OAuth flow mode](https://github.com/satetsu888/slackbot-for-claude/blob/main/oauth-flow-mode.md).

### 3. Get the Slack Bot Token

1. Go to `OAuth & Permissions` and copy the `Bot User OAuth Access Token`.

### 4. Get the Claude API Key

1. Visit the [Claude API Dashboard](https://console.anthropic.com/) and create a new API key.

### 5. Run the App

1. Clone the repository.
2. Set the following environment variables:

    ```bash
    export SLACK_BOT_TOKEN=<Slack Bot Token you get from the previous step>
    export SLACK_SIGNING_SECRET=<Get it from Slack App Basic Information>
    export ANTHROPIC_API_KEY=<Claude API Key you get from the previous step>
    ```

3. Run the app with the following command:

    ```bash
    npm install
    npm start
    ```

4. Invite the bot to a channel and mention the bot to see the response.

You can deploy the app wherever you prefer, as long as the environment supports Node.js or Docker.

## Options

Some options can be set with environment variables.

| ENVS | default | description |
| -------- | -------- | -------- |
| CLAUDE_MODEL | `claude-3-sonnet-20240229` | The model name to be used with the Claude API. You can choose from `claude-3-opus-20240229`, `claude-3-sonnet-20240229`, or `claude-3-haiku-20240307`. |
| FLAT_RESPONSE   | false  | If set to true, the bot will respond directly in the channel instead of creating a thread. |
| REACTION_EMOJI   | `thinking_face` | Change the emoji displayed while the bot is processing. |
| PORT   | 3000   | Port number.  |
| SKIP_CLAUDE_API   | false   | If set to true, the bot will skip calling the Claude API and always provide a dummy message. |
