# BotStatusChecker
A bot that send alerts in a defined channel when slected bots are down.

Invite link: [Click here](https://discord.com/api/oauth2/authorize?client_id=867653161036152832&permissions=8&scope=applications.commands%20bot)

# Warning: You need to enable all intents in the developer page of your bot.

# Configuration
```json5
{
    "prefix": "s.", // prefix of message commands
    "interval_check_in_second": 15, // interval between check in second !, default : 15
    "slash_commands_deploy_server": "SERVER_ID", // server id to deploy slash command
    "whitelistUsers": ["USER", "ID"] // whitelist user list to use some admin only command
}
``` 
