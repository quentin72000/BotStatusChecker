# BotStatusChecker
A bot that send alerts in a defined channel when slected bots are down.

Invite link: [Click here](https://discord.com/api/oauth2/authorize?client_id=867653161036152832&permissions=8&scope=applications.commands%20bot)

# **Warning**: You need to enable the `PRESENCE INTENT` **and** the `SERVER MEMBERS INTENT` intents in the [developer page](https://discord.com/developers/applications) of your bot.

# Setup and launch

 Rename the file `config.json.exemple` to `config.json`
 And the file `.env.exemple` to `.env`

 ## Configuration options (`config.json` file)
```json5
{
    "prefix": "YOUR_PREFIX", // prefix of message commands
    "interval_check_in_second": 15, // interval between check in second, default : 15
    "bot_server": "SERVER_ID", // server id where bots are in to check them.
    "whitelistUsers": ["USERS", "ID"] // whitelised user list to use some admin only command
}
```

## Enviroment config
```basic
TOKEN=REPLACE_THIS_BY_YOUR_TOKEN
```


## Launch
Run `node index.js` in a cmd open in the folder of the bot



# Todo-list

 - [x] Multi-channel support
 - [ ] Adding the choice of the bots that are supervised
 - [ ] Multi-language support