# ice-bot ![Formatted](https://github.com/iceproductions/discord-bot/workflows/CI/badge.svg)

[![Discord Bots](https://top.gg/api/widget/654725534365909043.svg)](https://top.gg/bot/654725534365909043)

## About

Universal discord bot to suite all of your needs.

Want to use Ice? Invite link can be found on ice's [website](http://ice.danbulant.eu).

## Setting up

The setup is quite simple:

* Grab latest release and extract the contents somewhere on the disk
* Install dependencies (See [#dependencies])
* Aquire token (from [discord developer portal](https://discordapp.com/developers)) and save it in config.json as token
* Create `managers/mysql.js` that exports pool (see [wiki](https://github.com/danbulant/ice-bot/wiki/Setting-up-database))
* Create MySQL databse with correct tables. (See [wiki](https://github.com/danbulant/ice-bot/wiki/Setting-up-database))
* Start the bot (with `node .`)

Then optionaly if you want to have link checking, add `virustotal` field into config.json containing VirusTotal api key.

## Dependencies

* Node (Tested with v12 & v13. Running on another version? Let us know!)
* NPM (bundled with Node on modern releases)
* Deno - Use as new version as possible. Needs to be installed by same user as the one running bot.
* *(optional)* Git (or even better, hub) for simple updates - run one command and your bot is up to date

### Node dependencies

Those are installed with `npm i` automatically.
**Note: these aren't all dependencies, for list of all, see `package.json`**

* discord.js -> the framework we use for ice
* discord.js-docs -> searches through documentation
* pacote -> searches through npm registry
* cowsay -> a library for cowsay command
* eventemitter3 -> better event emitter class
* got -> because request **got** deprecated
* javascript-time-ago -> yes, we are lazy to reinvent the wheel
* mysql -> connection to MySQL
* nekos.life -> Cute ~~catgirls~~ nekos
* node-html-parser -> because not every website has an API
* pokedex-promise-v2 -> Promises for pokedex
* unique-random-array -> for our reddit command
* vm2 -> secure VM for code evaluation
* singleline -> allows multiline strings
* ffmpeg -> music playback coder
* ytdl-core -> for music playback
* figlet -> for rendering `ascii` command

## Non-command related features

### Message previews

Messages can be previewed by sending a link to it. If ice has access to the server and channel the message was in, it will send an embed containing information about the message.

## Commands

The bot has as of now the following commands

### Anime

* **konachan** - Safe version of konachan
* **nekos \<endpoint>** - Wrapper to nekos-dot-life API (SFW)
* **safebooru** - It's safe, but just to make sure...
* **sofurry** - Gives random image from sofurry. Please don't use this in non-furry servers
* **waifu** - Random AI-generated waifu + story

### Balance

This category is yet to be done.

* **balance** - shows current balance of user
* **pay \<amount> \<who>** - *Not yet implemented*. Sends \<amount> to \<who>
* **mine** - Mines the daily amount. Can be called every 12 hours.
* **premium** - Shows if you have premium access or not

### Dev

This category is for developers who are working on discord. Hope it helps!

* **apm** - Gets information of Atom Text Editor Package
* **bang** (alias **ddg**) - Sends info from `duckduckgo` instant answer or link from `bang`
* **deno** - Full deno runtime. Limit of 15 seconds. Only network allowed.
* **djs** - Searches through Discord.js documentation
* **php** - Searches through PHP documentation
* **dstatus** - Shows status of discord servers
* **jseval** - Evaluates given JS code. Has a limit of 10 seconds, running in NodeVM without access to require.
* **format** - Formatting guide
* **google** - Google it!
* **code** - Shows information about given HTTP code. Supports some non-official ones. *Thanks Wikipedia!*
* **logme** - *Disabled on live version*. Logs message to console. Useful for debugging this bot.
* **npm** - Gets information about given package
* **request** (alias `req`)- Makes request. See `req help`
* **format** - Shows formatting help
* **stackoverflow** (alias `so`) - Searches in SO and shows both question and answer

### Essentials

* **achievments** - Shows which achievments you currently own
* **avatar** - Shows your or someone else's (Ping 'em!) high-res avatar7
* **covid** - Shows covid statistics
* **fact** - Gets a random fact
* **invite** - Link to invite the bot
* **math** (alias `calc` or `calculate`) - Calculates given math expression and returns the result. See [mathjs.org](https://mathjs.org)
* **oldest** - Shows list of users ordered by the time of registration at discord
* **ping** - Pings the discord API and shows how much time it consumed
* **puppy** - Because everyone likes images of puppies
* **reddit** - Shows random image from given subreddit. If not on image-only subreddit, bot may **not** reply as of now.
* **voted** (Alias `vote`) - Checks status of user vote and if user didn't vote, shows link.

### Fun

* **ascii** (alias `figlet`) - Figlet text, also known as ascii-art text
* **cow** - The original cowsay/cowthink
* **clap** - Clapify given message
* **cool** - Cools something
* **cowsay** - Make cow say or think text
* **dab** - <o/
* **joke** - Random joke of given type. If no type provided, uses random
* **leet** Leetify message
* **lenny** - Everyone knows what's lenny
* **reddituser** - Shows info about reddit user (disabled until fixed)
* **say** - Make the bot say anything you want
* **spoiler** - Annoying spoilers
* **subinfo** - Shows info about reddit subreddit
* **urban** [alias **ud**] - Find the meaning in the Urban Dictionary
* **vaporwave** - Vaporify string

### Image

* **fone** - Uses happyfone API
* **meme** - Generates memes. Usage: `meme <photo/link to avatar> [top text] [bottom text]`
* **qr** (alias `qrcode`) - Generates QR Code from given text
* **xkcd** - Shows todays xkcd comic

### Minecraft

* **skin** - Shows skin of given player. ~~Tries using authors nickname if no player provided.~~

### Mod

* **allow-channels** - Allows usage of bot only in specified channels.
* **toggle-level** - Toggles level up messages.
* **announce** - Make an announcement in the same channel. Admin only.
* **ban** - Bans user
* **case** - Shows info about case (warn/kick/ban).
* **clearsettings** - Clears bot data about current server. **THIS ACTION IS IRREVERSIBLE**
* **count** - Counts members
* **editreason** - Edits reason about specified case
* **giveaway** - Starts a giveaway
* **history** - Shows users history (kicks/bans/warns).
* **info** - Info about author or given user
* **kick** - Kicks user from the server
* **log** - Log settings, not yet done.
* **purge \<x> \<delete report (true/false)>** - Purges last `x` messages
* **role** - Manages roles. See help.
* **stats** - Stats of ice bot
* **warn** - Warns user

### Music

* **join** - Joins the bot to voice channel you are currently in.
* **jump** - Jumps to selected position in queue.
* **leave** - Leaves the voice channel
* **pause** - Pauses playback
* **play** - Starts playing queue
* **stop** - Stops playing queue
* **remove** - Removes song from queue
* **resume** - Resumes playback
* **shuffle** - Shuffles queue
* **skip** - Skips current song (accepts number as argument, any integer value allowed)
* **view** - Views current queue
* **volume** - Sets or gets volume of playback (in %)

### NSFW

These commands are premium only (and aren't in this repository)

* **booru \<booru>** - Random image from specified booru
* **danbooru** - Random image from danbooru
* **gelbooru** - Random image from gelbooru
* **hypnohub** - Random image from hypnohub
* **konachan-lewd** - Highquality wallpapers
* **nekos-lewd** - Not so safe endpoints of nekos.life
* **realbooru** - Realistic version of rule34
* **rule34** - Well you should know what this is
* **xbooru** - The dirty sister of rule34
* **yandere** - Random yandere image

### Pokemon

* **poke** - Has subcommands, see poke help

### Special

This category contains owner-only commands

* **blacklist** - Doesn't yet work
* **guilds** - List guilds


