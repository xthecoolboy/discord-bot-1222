async function makeRequest(endpoint: string): Promise<any> {
    const res = await fetch("http://localhost:8856/" + endpoint);
    return await res.json();
}

var clientInitialized = false;

/**
 * Holds client data
 */
class Client {
    eventData?: any;
    eventName?: string;
    env: any = {};
    event: Event;

    constructor(public guild: Guild, public user: User) {
        //@ts-ignore
        this.event = null;
    }

    static async newClient(guild: string, user: string, eventName?: string, eventData?: any, env?: any) {
        if(clientInitialized) throw new TypeError("client.newClient is not a function");
        //@ts-ignore Since it gets set right away and there's no way those props will be used
        var c = new Client();
        c.guild = await Guild.getGuild(guild, c);
        c.user = await User.getUser(user, c);
        c.eventData = eventData;
        c.eventName = eventName;
        c.env = env;
        clientInitialized = true;
        return c;
    }

    /**
     * Checks if client has given permission
     * @param permission to check
     */
    async hasPermission(permission: string): Promise<boolean> {
        return await makeRequest("guild/" + this.guild.id + "/permission/" + encodeURI(permission));
    }

    async getEvent(): Promise<any> {
        if(this.event) return this.event;
        switch(this.eventName) {
            case "messageUpdate":
                var oldmsg = this.eventData[0];
                var msg = this.eventData[1];
                var author = await User.getUser(msg.authorID, this);
                var channel = new Channel({
                    client: this,
                    guild: this.guild,
                    id: msg.channelID
                });
                this.event = new MessageUpdateEvent({
                    message: new Message({
                        client: this,
                        channel,
                        author,
                        guild: this.guild,
                        content: msg.content
                    }),
                    client: this,
                    oldMessage: new Message({
                        client: this,
                        channel,
                        author,
                        guild: this.guild,
                        content: oldmsg.content
                    }),
                    channel,
                    guild: this.guild,
                    author
                });
                return this.event;
        }

        throw new Error("Unknown event triggered");
    }
};

/**
 * Holds channel data
 */
class Channel {
    client: Client;
    guild: Guild;
    id: string;

    constructor({
        client,
        guild,
        id
    }: {
        client: Client,
        guild?: Guild,
        id: string
    }) {
        this.client = client;
        this.guild = guild || client.guild;
        this.id = id;
    }

    async send(content: string | Embed | object): Promise<SentMessage> {
        if(!content) throw new Error("Cannot send empty message");

        if(typeof content === "string") {
            content = {
                message: content
            };
        }
        const res = await fetch("http://localhost:8856/message/" + this.guild.id + "/" + this.id, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        });
        try {
            var id = await res.json();
        } catch(e) {
            console.warn(await res.text());
            throw new Error(e);
        }
        if(id.error) throw id.error;
        var msg = new Message({
            client: this.client,
            channel: this,
            guild: this.guild,
            author: this.client.user,
            content: typeof content === "string" ? content : ""
        });
        return new SentMessage({ id, message: msg });
    }
}

/**
 * Type of invoked event
 */
enum EventType {
    NewMessage = 0,
    CustomCommand,
    MessageUpdate
}

/**
 * Holds event data
 */
class Event {
    client: Client;
    type: EventType;
    string: string;

    constructor({
        client,
        type,
        string
    }: {
        client: Client,
        type: EventType,
        string: string
    }) {
        this.client = client;
        this.type = type;
        this.string = string;
    }
}

class NewMessageEvent extends Event {
    type = EventType.NewMessage;

    message: Message;
    guild: Guild;
    channel: Channel;
    author: User;

    constructor({
        message,
        client,
        channel,
        guild,
        author
    }: {
        message: Message,
        client: Client,
        channel: Channel,
        guild: Guild,
        author: User
    }) {
        super({ client, type: EventType.NewMessage, string: "message.new"});
        this.message = message;
        this.channel = channel;
        this.guild = guild;
        this.author = author;
    }
}

class MessageUpdateEvent extends Event {
    type = EventType.MessageUpdate;

    message: Message;
    oldMessage: Message;
    guild: Guild;
    channel: Channel;
    author: User;

    constructor({
        message,
        oldMessage,
        client,
        channel,
        guild,
        author
    }: {
        message: Message,
        oldMessage: Message,
        client: Client,
        channel: Channel,
        guild: Guild,
        author: User
    }) {
        super({ client, type: EventType.NewMessage, string: "message.update"});
        this.message = message;
        this.oldMessage = oldMessage;
        this.channel = channel;
        this.guild = guild;
        this.author = author;
    }
}

/**
 * Holds message data
 */
class Message {
    client: Client;
    channel: Channel | User;
    guild: Guild;
    author: User;
    deleted: boolean = false;
    pinned: boolean = false;
    tts: boolean = false;
    system: boolean = false;
    embeds: Embed[] = [];
    attachments: any[] = [];
    created?: Date;
    edited?: Date;
    webhook: false | string = false;
    content: string;

    constructor({
        client,
        channel,
        guild,
        author,
        content
    }: {
        client: Client,
        channel: Channel | User,
        guild: Guild,
        author: User,
        content: string
    }) {
        this.client = client;
        this.channel = channel;
        this.guild = guild;
        this.author = author;
        this.content = content;
    }

    /**
     * Sends message to same channel as message
     * @param content Content to send
     * @see {Channel.send}
     */
    reply(content: string | Embed): Promise<SentMessage> {
        return this.channel.send(content);
    }
}

/**
 * Holds sent message data
 */
class SentMessage {
    id: string;
    message: Message;

    constructor({
        id,
        message
    }: {
        id: string,
        message: Message
    }) {
        this.id = id;
        this.message = message;
    }

//    edit(content: string | Embed): Promise<void> {}
//    delete(): Promise<void> {}
}

/**
 * Holds guild data
 */
class Guild {
    client: Client;
    id: string;

    name: string;
    userCount: number;

    constructor({
        client,
        id,
        name,
        userCount
    }: {
        client: Client,
        id: string,
        name: string,
        userCount: number
    }) {
        this.client = client;
        this.id = id;
        this.name = name;
        this.userCount = userCount;
    }

    static async getGuild(id: string, client: Client): Promise<Guild> {
        var data = await makeRequest("guild/" + id);
        data.client = client;
        data.userCount = data.memberCount;
        return new Guild(data)
    }
}

class EmbedField {
    title: string;
    content: string;
    inline: boolean;

    constructor({
        title,
        content,
        inline
    }: {
        title: string,
        content: string,
        inline: boolean
    }) {
        this.title = title;
        this.content = content;
        this.inline = inline
    }
}

class EmbedFooter {
    text: string;
    icon: string;

    constructor({
        text,
        icon
    }: {
        text: string,
        icon: string
    }) {
        this.text = text;
        this.icon = icon;
    }
}

class EmbedAuthor {
    url: string;
    icon: string;
    text: string;

    constructor({
        url,
        text,
        icon
    }: {
        url: string,
        text: string,
        icon: string
    }) {
        this.url = url;
        this.text = text;
        this.icon = icon;
    }
}

/**
 * Holds embed data
 */
class Embed {
    title: string = "";
    description: string = "";

    author?: EmbedAuthor;

    fields?: EmbedField[];

    footer?: EmbedFooter;
    color?: string;

    setTitle(title: string): Embed {
        this.title = title;

        return this;
    }

    setDescription(description: string): Embed {
        this.description = description;

        return this;
    }

    setAuthor(text: string, icon: string, url: string): Embed;
    setAuthor(data: EmbedAuthor): Embed;
    
    setAuthor(data: string | EmbedAuthor, icon?: string, url?: string): Embed {
        if(typeof data === "string" && typeof icon === "string" && typeof url === "string") {
            this.author = new EmbedAuthor({ text: data, icon, url });
        } else if(data instanceof EmbedAuthor) {
            this.author = data;
        }

        return this;
    }

    addField(title: string, content: string, inline: boolean = false): Embed {
        if(!this.fields) this.fields = [];
        this.fields.push(new EmbedField({ title, content, inline }));

        return this;
    }

    addFields(fields: EmbedField[]) {
        if(this.fields) {
            this.fields.push(...fields);
        } else {
            this.fields = fields;
        }
        return this;
    }

    setColor(color: string) {
        this.color = color;
    }
}

/**
 * Holds user data
 */
class User {
    client: Client;
    id: string;

    bot: boolean;

    name: string;
    nickname: string;
    tag: string;
    identifier: number;
    avatar: string;

    constructor({
        client,
        id,
        bot,
        name,
        nickname,
        tag,
        identifier,
        avatar
    }: {
        client: Client,
        id: string,
        bot: boolean,
        name: string,
        nickname: string,
        tag: string,
        identifier: number,
        avatar: string
    }) {
        this.client = client;
        this.id = id;
        this.bot = bot;
        this.name = name;
        this.nickname = nickname;
        this.tag = tag;
        this.identifier = identifier;
        this.avatar = avatar;
    }

    /**
     * Fetches user by id
     * @param id of user
     * @param client
     */
    static async getUser(id: string, client: Client): Promise<User> {
        const member = await makeRequest("member/" + client.guild.id + "/" + id);
        const user = await makeRequest("user/" + id);

        var u = new User({
            client,
            id,
            bot: user.bot,
            name: user.username,
            nickname: member.nickname,
            tag: user.tag,
            identifier: user.discriminator,
            avatar: user.avatar_url
        });
        return u;
    }
    /**
     * Bans user from guild for given reason
     * @param reason
     */
    async ban(reason: string): Promise<void> {
        var resp = await makeRequest("member/" + this.client.guild.id + "/" + this.id + "/ban/" + encodeURI(reason));
        if(resp.error) throw resp.error;
    }

    /**
     * Kicks user from guild for given reason
     * @param reason
     */
    async kick(reason: string): Promise<void> {
        var resp = await makeRequest("member/" + this.client.guild.id + "/" + this.id + "/kick/" + encodeURI(reason));
        if(resp.error) throw resp.error;
    }


    /**
     * Warns user in guild for given reason
     * @param reason
     */
    async warn(reason: string): Promise<void> {
        var resp = await makeRequest("member/" + this.client.guild.id + "/" + this.id + "/warn/" + encodeURI(reason));
        if(resp.error) throw resp.error;
    }

    /**
     * Sends DM to user
     * @param content to send
     */
    async send(content: string | Embed | Object): Promise<SentMessage> {
        if(!content) throw new Error("Cannot send empty message");

        if(typeof content === "string") {
            content = {
                message: content
            };
        }
        const res = await fetch("http://localhost:8856/message/" + this.id, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        });
        try {
            var id = await res.json();
        } catch(e) {
            console.warn(await res.text());
            throw new Error(e);
        }
        if(id.error) throw id.error;
        var msg = new Message({
            client: this.client,
            channel: this,
            guild: this.client.guild,
            author: this.client.user,
            content: typeof content === "string" ? content : ""
        });
        return new SentMessage({ id, message: msg });
    }
}

export {
    Client,
    Channel,
    EventType,
    Event,
    NewMessageEvent,
    Message,
    SentMessage,
    Guild,
    EmbedField,
    EmbedFooter,
    EmbedAuthor,
    Embed,
    User
};
