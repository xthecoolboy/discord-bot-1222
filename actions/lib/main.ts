
/**
 * Holds client data
 */
class Client {
    guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
    }

    hasPermission(permission: string): Promise<boolean> {

    }
};

/**
 * Holds channel data
 */
class Channel {
    client: Client;
    guild: Guild;

    constructor({
        client,
        guild
    }: {
        client: Client,
        guild: Guild
    }) {
        this.client = client;
        this.guild = guild;
    }

    send(content: string | Embed): Promise<void> {}
}

/**
 * Type of invoked event
 */
enum EventType {
    NewMessage
}

/**
 * Holds event data
 */
class Event {
    client: Client;
    type: EventType;

    constructor({
        client,
        type
    }: {
        client: Client,
        type: EventType
    }) {
        this.client = client;
        this.type = type;
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
        super({ client, type: EventType.NewMessage});
        this.message = message;
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
    channel: Channel;
    guild: Guild;
    author: User;

    constructor({
        client,
        channel,
        guild,
        author
    }: {
        client: Client,
        channel: Channel,
        guild: Guild,
        author: User
    }) {
        this.client = client;
        this.channel = channel;
        this.guild = guild;
        this.author = author;
    }

    reply(content: string | Embed): Promise<SentMessage> {}
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

    edit(content: string | Embed): Promise<void> {}
    delete(): Promise<void> {}
}

/**
 * Holds guild data
 */
class Guild {
    client: Client;
    id: string;

    name: string;
    userCount: number;
    botCount: number;

    constructor({
        client,
        id,
        name,
        userCount,
        botCount
    }: {
        client: Client,
        id: string,
        name: string,
        userCount: number,
        botCount: number
    }) {
        this.client = client;
        this.id = id;
        this.name = name;
        this.userCount = userCount;
        this.botCount = botCount;
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

    constructor({
        client,
        id,
        bot,
        name,
        nickname,
        tag,
        identifier
    }: {
        client: Client,
        id: string,
        bot: boolean,
        name: string,
        nickname: string,
        tag: string,
        identifier: number
    }) {
        this.client = client;
        this.id = id;
        this.bot = bot;
        this.name = name;
        this.nickname = nickname;
        this.tag = tag;
        this.identifier = identifier;
    }

    ban(reason: string, days: number): Promise<void> {}
    kick(reason: string): Promise<void> {}
    warn(reason: string): Promise<void> {}

    DM(message: string | Embed): Promise<void> {}
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
