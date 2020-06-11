
class Ruleset {
    constructor(ruleset) {
        this.ruleset = ruleset;
    }

    /**
     * Tests if string works with rule
     * @param {string} string To test
     * @param {string} rule to test against
     * @private
     */
    match(string, rule) {
        if(string === rule) return true;
        var stringChunks = string.split(".");
        var ruleChunks = rule.split(".");

        for(const index in stringChunks) {
            if(!stringChunks[index]) {
                if(ruleChunks[index] === "*" || ruleChunks[index - 1] === "*") return true;
                if(ruleChunks[index - 1] && ruleChunks[index - 1].substr(-1) === "?") return true;
                return false;
            } else if(!ruleChunks[index]) {
                if(ruleChunks[index] === "*") return true;
                return false;
            }
            var chunk = { string: stringChunks[index].trim(), rule: ruleChunks[index].trim() };
            if(chunk.string === chunk.rule) continue;
            if(chunk.rule === "*") continue;
            if(chunk.rule === "**") break;
            return false;
        }

        return true;
    }

    test(string) {
        const [enabled, disabled] = this.ruleset.split("!");
        const enabledChunks = enabled.split("|");
        const disabledChunks = disabled.split("|");

        var matches = false;

        for(const chunk of enabledChunks) {
            if(this.match(string, chunk)) {
                matches = true;
                break;
            }
        }

        for(const chunk of disabledChunks) {
            if(this.match(string, chunk)) {
                matches = false;
                break;
            }
        }

        return matches;
    }
}
