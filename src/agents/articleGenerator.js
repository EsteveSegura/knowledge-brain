const OpenAi = require("../lib/openAi");
const fs = require('fs')

class ArticleGenerator {
    constructor({model = "gpt-3.5-turbo"}) {
        this.model = model;
        this.openAi = new OpenAi({model: this.model});
        this.article = "";
    }

    async run({blocks = []}) {
        const initialBlock = await this._initBlock({initialBlock: blocks[0]});
        this.article += initialBlock + "\n\n";
        
        for (let i = 1; i < blocks.length; i++) {
            const currentBlock = blocks[i];
            const block = await this._runBlocks({currentBlock});
            this.article += block + "\n\n";
        }

        return this.article;
    }

    async _initBlock({initialBlock}) {
        const {ARTICLE_GENERATOR_INITIAL} = this.openAi.listPrompts();
        const replacements = {
            PERSONALITY: "You're a professional writer with a deep knowledge of Javascript",
            TOPIC: initialBlock,
        };

        const prompt = this.openAi.buildPrompt(ARTICLE_GENERATOR_INITIAL, replacements);
        const initialBlockInference = await this.openAi.inference({prompt});

        return initialBlockInference;
    }

    async _runBlocks({currentBlock}) {
        const {ARTICLE_GENERATOR} = this.openAi.listPrompts();
        const replacements = {
            PERSONALITY: "You're a professional writer with a deep knowledge of Javascript",
            TOPIC: currentBlock,
            ARTICLE: this.article,
        };

        const prompt = this.openAi.buildPrompt(ARTICLE_GENERATOR, replacements);
        const blockInference = await this.openAi.inference({prompt});

        return blockInference;
    }

}


/* Example of usage:
const articleGenerator = new ArticleGenerator({});
articleGenerator.run({blocks: [
    "Why using math.random() is a bad idea",
    "Explain how computer can generate random numbers",
    "Explain what is the entropy, using a real life example: tossing a coin",
    "Provide the solution to generate random numbers in Javascript with crypto library",
    "Numerate some of the dangerous parts of using math.random() in Javascript (some one can intercept a password generator",
    "Write a final conclusion"
]}).then((res) => {
    console.log(res)
    fs.writeFileSync('./blogPost.md', res, 'utf-8')
});
*/

module.exports = ArticleGenerator;