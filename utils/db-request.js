let request = {};

module.exports = request;

request.create = {
	users: `CREATE TABLE "users" (
		"user_id"	VARCHAR NOT NULL UNIQUE,
		"nickname"	VARCHAR,
		"status"	VARCHAR DEFAULT 'offline',
		"lastseen"	DATE DEFAULT CURRENT_TIMESTAMP,
		"connectAt"	DATE DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY("user_id")
	)`,
	guilds: `CREATE TABLE "guilds" (
		"guild_id"	TEXT NOT NULL UNIQUE,
		"channel_id"	TEXT NOT NULL,
		"bot_monitored"	TEXT
	)`
}
