const OpenAi = require("../lib/openAi");
const fs = require('fs')

class ArticleGenerator {
    constructor({model = "gpt-3.5-turbo", article = [], blocks = []}) {
        // Params
        this.blocks = blocks;
        this.article = article;
        
        // OpenAI Settings
        this.model = model;
        this.openAi = new OpenAi({model: this.model});
    }

    async generateArticle() {
        // Generate initial block (title and introduction)
        const initialBlock = await this._initBlock({initialBlock: this.blocks[0]});
        this.article.push(initialBlock);
        
        // Generate the rest of the blocks, not included the first one
        for (let i = 1; i < this.blocks.length; i++) {
            const currentBlock = this.blocks[i];
            const block = await this._runBlocks({currentBlock});
            this.article.push(block);
        }

        return this.article;
    }

    async modifyBlock({blockIndex, promptToApply, rules}) {
        // Check if the prompt exists in our library
        const listPrompts = this.openAi.listPrompts();
        const promptLoad = listPrompts[promptToApply];
        if (!promptLoad) {
            throw new Error(`Prompt ${promptToApply} not found`);
        }

        // Block to modify
        const articlePart = this.article[blockIndex];

        // Prepare the inference
        const replacements = {
            PERSONALITY: "You're a professional writer with a deep knowledge of Javascript",
            ARTICLE: this.articleFormatedMarkdown(),
            CURRENT_BLOCK: articlePart,
            RULES: rules
        };

        const prompt = this.openAi.buildPrompt(promptLoad, replacements);
        const blockInference = await this.openAi.inference({prompt});

        this.article[blockIndex] = blockInference;
        return blockInference;
    }

    articleFormatedMarkdown() {
        const article = this.article.join('\n\n');
        return article
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

/* Exmaple of article generaton
const articleGenerator = new ArticleGenerator({
    blocks: [
    "Why using math.random() is a bad idea",
    "Explain how computer can generate random numbers",
    "Explain what is the entropy, using a real life example: tossing a coin",
    "Provide the solution to generate random numbers in Javascript with crypto library",
    "Numerate some of the dangerous parts of using math.random() in Javascript (some one can intercept a password generator",
    "Write a final conclusion"
]
});
articleGenerator.generateArticle().then((res) => {
    console.log(articleGenerator.articleFormatedMarkdown());
    fs.writeFileSync('./blogPost.md', articleGenerator.articleFormatedMarkdown(), 'utf-8')

    console.log('------------------------------------ START BLOCK 2 ------------------------------------')
    console.log(articleGenerator.article[1]);
    console.log('------------------------------------ END BLOCK 2 ------------------------------------')
    articleGenerator.modifyBlock({
        blockIndex: 1,
        promptToApply: 'ARTICLE_GENERATOR_MODIFY_BLOCK',
        rules: "- The title of this part of the blog post should include the word r4nd0m (in leet speak)"
    }).then((res) => {
        console.log('------------------------------------ START BLOCK MODIFIED 2 ------------------------------------')
        console.log(articleGenerator.article[1]);
        console.log('------------------------------------ END BLOCK MODIFIED 2 ------------------------------------')
    }).catch((err) => {
        console.log(err)
    })
});
*/

module.exports = ArticleGenerator;