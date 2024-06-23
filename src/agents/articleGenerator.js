const OpenAi = require("../lib/openAi");

/**
 * Class representing an Article Generator.
 */
class ArticleGenerator {
    /**
     * Create an Article Generator.
     * @param {Object} options - The options for the ArticleGenerator instance.
     * @param {string} [options.openAiKey=null] - The API key for OpenAI.
     * @param {string} [options.model="gpt-3.5-turbo"] - The model to use for OpenAI.
     * @param {Array<string>} [options.article=[]] - The initial article content.
     * @param {Array<string>} [options.blocks=[]] - The blocks to generate the article from.
     */
    constructor({openAiKey = null, model = "gpt-3.5-turbo", article = [], blocks = []}) {
        /**
         * @type {Array<string>}
         * @private
         */
        this.blocks = blocks;
        
        /**
         * @type {Array<string>}
         * @private
         */
        this.article = article;
        
        /**
         * @type {string}
         * @private
         */
        this.model = model;
        
        /**
         * @type {OpenAi}
         * @private
         */
        this.openAi = new OpenAi({model: this.model, apiKey: openAiKey});
    }

    /**
     * Generate the article based on the provided blocks.
     * @returns {Promise<Array<string>>} The generated article.
     */
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

    /**
     * Modify a specific block in the article.
     * @param {Object} options - The options for modifying the block.
     * @param {number} options.blockIndex - The index of the block to modify.
     * @param {string} options.promptToApply - The prompt to apply.
     * @param {string} options.rules - The rules to apply to the modification.
     * @returns {Promise<string>} The modified block.
     * @throws Will throw an error if the prompt is not found.
     */
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

    /**
     * Format the article as Markdown.
     * @returns {string} The formatted article.
     */
    articleFormatedMarkdown() {
        const article = this.article.join('\n\n');
        return article;
    }

    /**
     * Initialize the first block of the article.
     * @param {Object} options - The options for the initial block.
     * @param {string} options.initialBlock - The initial block content.
     * @returns {Promise<string>} The generated initial block.
     * @private
     */
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

    /**
     * Generate a block of the article.
     * @param {Object} options - The options for the current block.
     * @param {string} options.currentBlock - The current block content.
     * @returns {Promise<string>} The generated block.
     * @private
     */
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