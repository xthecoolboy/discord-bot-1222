# ice-bot

## About

Universal discord bot to suite all of your needs.

Want to use Ice? Invite link can be found on ice's [website](http://ice.danbulant.eu).

## Setting up

The setup is quite simple:

* Grab latest release and extract the contents somewhere on the disk
* If you're on windows, you need to change download directory (found in services/player/player.js) to some other location, as `/tmp/` doesn't exist there.
* Install dependencies (See #dependencies)
* Aquire token (from [discord developer portal](https://discordapp.com/developers)) and save it in token.txt
* Create `managers/mysql.js` that exports pool (see wiki)
* Create MySQL databse with correct tables. (See wiki)
* ~~Do steps in eval_docker/README.md [setup](eval_docker/README.md#setup)~~ No docker required!
* Start the bot (with `node .`)

*If you also want to run ice as a service on a debian (ubuntu) based machine, this repo contains `ice.service`. Edit the directory in it to match this repo location, copy it to /etc/systemd/system/ice.service and run `sudo systemctl daemon-reload && sudo systemctl enable ice`. Then to start, simply do `sudo systemctl start ice`.*

## Dependencies

* Node (Tested with v12 & v13. Running on another version? Let us know!)
* NPM (bundled with Node on modern releases)
* Deno - Use as new version as possible. Needs to be installed by same user as the one running bot.
* *(optional)* Git (or even better, hub) for simple updates - run one command and your bot is up to date

### Node dependencies

Those are installed with `npm i` automatically.

* ascii-table -> shows fancy table in logs
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
* vm2 -> secure VM for code evaluation
* pokedex-promise-v2 -> Promises for pokedex
* unique-random-array -> for our reddit command

## Commands

The bot has as of now the following commands

### Anime

* **nekos \<endpoint>** - Wrapper to nekos-dot-life API (SFW)
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

* **djs** - Searches through Discord.js documentation
* **php** - Searches through PHP documentation
* **dstatus** - Shows status of discord servers
* **eval** - Evaluates given JS code. Has a limit of 10 seconds, running in NodeVM without access to require.
* **google** - Google it!
* **code** - Shows information about given HTTP code. Supports some non-official ones. *Thanks Wikipedia!*
* **logme** - *Disabled on live version*. Logs message to console. Useful for debugging this bot.
* **npm** - Gets information about given package
* **request** (alias `req`)- Makes request. See `req help`

### Essentials

* **achievments** - Shows which achievments you currently own
* **avatar** - Shows your or someone else's (Ping 'em!) high-res avatar
* **fact** - Gets a random fact
* **help** - ~~Shows a simple help (currently link to website).~~ Full commando help.
* **invite** - Link to invite the bot
* **news** - ~~Shows current news.~~ Depended on another bot and only for czech news, removed.
* **ping** - Pings the discord API and shows how much time it consumed
* **puppy** - Because everyone likes images of puppies
* **reddit** - Shows random image from given subreddit. If not on image-only subreddit, bot may **not** reply as of now.

### Fun

* ~~**ascii** - Figlet!~~ Broken on latest release, hidden by default
* **cow** - The original cowsay/cowthink
* **clap** - Clapify given message
* **cool** - Cools something
* **dab** - <o/
* **joke** - Random joke of given type. If no type provided, uses random
* **leet** Leetify message
* **lenny** - Everyone knows what's lenny
* **say** - Make the bot say anything you want
* **spoiler** - Annoying spoilers
* **vaporwave** - Vaporify string

### Image

* **fone** - Uses happyfone API
* **meme** - Generates memes. Usage: `meme <photo/link to avatar> [top text] [bottom text]`
* **xkcd** - Shows todays xkcd comic

### Minecraft

* **skin** - Shows skin of given player. ~~Tries using authors nickname if no player provided.~~

### Mod

* **count** - Counts members
* **info** - Info about author or given user
* **stats** - Stats of ice bot
* **giveaway** - *Testing only.* Makes a giveaway in `channel` which resolves after `x` minutes and wins `item`

### Music

* **join** - Joins the bot to voice channel you are currently in.
* **leave** - Leaves the voice channel
* **get** - (Alias search) finds song by URL or name
* **pause** - Pauses playback
* **play** - Starts playing queue
* **stop** - Stops playing queue
* **remove** - Removes song from queue
* **resume** - Resumes playback
* **jump** - Jumps to song in queue
* **seek** - Seeks current song
* **shuffle** - Shuffles queue
* **skip** - Skips current song
* **stash** - View music search stash
* **view** - Views current queue
* **volume** - Sets or gets volume of playback

### NSFW

These commands are premium only (and aren't in this repository)

* **e621** - possibly NSFW
* **nekos-lewd** - Not so safe endpoints of nekos.life
* **rule34** - Well you should know what this is

### Pokemon

* **poke** - Has subcommands, see poke help
