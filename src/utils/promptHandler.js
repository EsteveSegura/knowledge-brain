const fs = require('fs');

/**
 * Class representing a Prompt Handler.
 */
class PromptHandler {
    /**
     * Create a Prompt Handler.
     */
    constructor() {
        /**
         * @type {string}
         * @private
         */
        this.promptPath = './src/prompts';
    }

    /**
     * Load the content of a prompt file.
     * @param {string} promptFileName - The path to the prompt file.
     * @returns {string} The content of the prompt file.
     * @private
     */
    _promptLoader(promptFileName) {
        try {
            console.log(`${this.promptPath}/${promptFileName}`)
            const promptFile = fs.readFileSync(`${this.promptPath}/${promptFileName}`, 'utf-8');
            return promptFile;
        } catch (error) {
            throw new Error(`Error loading prompt file: ${error.message}`);
        }
    }

    /**
     * Process a prompt template with replacements.
     * @param {string} file - The path to the prompt template file.
     * @param {Object} replacements - The replacements for the template placeholders.
     * @returns {string} The processed prompt with replacements.
     */
    promptTemplateEngine(fileName, replacements) {
        let prompt = this._promptLoader(fileName);

        prompt = prompt.replace(/<<(\w+)>>/g, (match, p1) => {
            return replacements[p1] || match;
        });

        return prompt;
    }

    /**
     * List all the prompts available.
     * @returns {Array<string>} The list of prompts.
     */
    listPrompts() {
        const promptsPaths = fs.readdirSync(this.promptPath);

        // Convert prompts to Object
        // key: prompt name in capital letters and converting camelCase to snake_case
        // value: namefile of the prompt
        const prompts = promptsPaths.reduce((acc, prompt) => {
            const promptName = prompt
            const promptKey = promptName.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase().replace('.PROMPT', '');
            acc[promptKey] = promptName;
            return acc;
        }, {});
        
        return prompts;
    }
}

module.exports = PromptHandler;
