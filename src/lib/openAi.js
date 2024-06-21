require("dotenv").config();
const OpenAI = require("openai");
const PromptHandler = require('../utils/promptHandler');

/**
 * Class representing an OpenAI client.
 */
class OpenAi {
    /**
     * Create an OpenAI client.
     * @param {Object} options - The options for the OpenAi instance.
     * @param {string} [options.apiKey=process.env.OPENAI_KEY] - The API key for OpenAI.
     * @param {string} [options.model="gpt-4o"] - The model to use for OpenAI.
     */
    constructor({apiKey = process.env.OPENAI_KEY, model = "gpt-3.5-turbo"}) {
        /**
         * @type {string}
         * @private
         */
        this.apiKey = apiKey;

        /**
         * @type {string}
         * @private
         */
        this.model = model;

        /**
         * @type {OpenAI}
         * @private
         */
        this.openAi = new OpenAI({
            apiKey: apiKey,
        });

        /**
         * @type {PromptHandler}
         * @private
         */
        this.promptHandler = new PromptHandler();
    }

    /**
     * List all the prompts available.
     * @returns {Array<string>} The list of prompts.
     * @public
     */
    listPrompts() {
        return this.promptHandler.listPrompts();
    }

    /**
     * Build a prompt template with replacements.
     * @param {string} promptFilePath - The path to the prompt template file.
     * @param {Object} replacements - The replacements for the template.
     * @returns {string} The built prompt.
     * @public
     */
    buildPrompt(promptFilePath, replacements) {
        return this.promptHandler.promptTemplateEngine(promptFilePath, replacements);
    }

    /**
     * Perform inference using the OpenAI model.
     * @param {Object} options - The options for the inference.
     * @param {string} options.prompt - The prompt to send to the model.
     * @param {number} [options.temperature=1] - The temperature setting for the model.
     * @param {number} [options.top_p=1] - The top_p setting for the model.
     * @param {number} [options.frequency_penalty=0] - The frequency penalty for the model.
     * @param {number} [options.presence_penalty=0] - The presence penalty for the model.
     * @returns {Promise<string>} The response from the model.
     * @public
     */
    async inference({prompt, temperature = 1, top_p = 1, frequency_penalty = 0, presence_penalty = 0}) {
        const response = await this.openAi.chat.completions.create({
            model: this.model,
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt,
                        }
                    ]
                }
            ],
            temperature,
            top_p,
            frequency_penalty,
            presence_penalty,
        });

        return response.choices[0].message.content;
    }
}

module.exports = OpenAi;
