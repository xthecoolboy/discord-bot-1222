module.exports = class Helper {
    /**
     * Constructs a paginated string list out of array
     * @param list
     * @param page
     * @param perPage
     * @returns string|null
     */
    static getPaginatedList(list, page = 1, perPage = 10) {
        const sep = "\n";
        const pages = Math.ceil(list.length / perPage);
        if (page > pages || list.length === 0) return "Nothing here....";

        // slices array by paginated entries, starting at (perPage) records per page,
        // first arg decides the first index of sliced array
        const startIndex = (page * perPage) <= perPage ? 0 : ((page - 1) * perPage);
        const endIndex = startIndex + perPage < list.length ? startIndex + perPage : list.length;
        const queue = list.slice(startIndex, endIndex);
        let str = `Total: ${list.length}, Current page: ${page}, last page: ${pages}` + sep;

        let count = startIndex;
        for (const item of queue) {
            str += `${++count}. ${item.title.replace("'", "")} [${item.url}]\n`;
        }

        return str + "\n";
    }

    /**
     * @param message
     * @param append
     * @param maxLen
     * @returns {Promise.<void>}
     */
    static async constructLoadingMessage(message, append = ".", maxLen = 150) {
        try {
            message = await message.channel.fetchMessage(message.id);
            if (message && message.deletable) {
                let content = message.content + append;
                if (content.length >= maxLen) content = append;

                if (message.editable) {
                    message = (await message.edit(content));
                    setTimeout(async function() {
                        await Helper.constructLoadingMessage(message, append, maxLen);
                    }, 1100);
                }
            }
            return message;
        } catch (error) {
            return message;
        }
    }
};
