const fs = require('fs').promises;
const path = require('path');

/**
 * Class representing an Obsidian.
 */
class ObsidianExtractor {
    /**
     * Create an Obsidian Extractor.
     * @param {Object} options - The options for the ObsidianExtractor instance.
     * @param {string} options.folderPath - The path to the Obsidian folder.
     */
    constructor({ folderPath }) {
        /**
         * @type {string}
         * @private
         */
        this.folderPath = folderPath;
        console.log(this.folderPath,'123')
    }

    /**
     * Extract existing pages from the folder, optionally excluding a specific file.
     * @param {string} [excludeFileName=null] - The file name to exclude.
     * @returns {Promise<Array<{file: string, matches: Array<string>}>>} The extracted pages and their matches.
     */
    async extractExistingPages(excludeFileName = null) {
        try {
            const files = await this._getMarkdownFiles();
            const allMatches = [];

            for (const file of files) {
                if (file === excludeFileName) {
                    continue; // Exclude the specified file
                }

                const filePath = path.join(this.folderPath, file);
                const content = await this._readFileContent(filePath);
                const matches = this._extractStrings(content);
                allMatches.push({ file, matches });
            }

            return allMatches;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Get the content of a markdown file.
     * @param {string} fileName - The name of the file.
     * @returns {Promise<string>} The content of the file.
     * @throws Will throw an error if the file cannot be read.
     */
    async getFileContent(fileName) {
        const filePath = path.join(this.folderPath, fileName);
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return content;
        } catch (err) {
            throw new Error(`Error reading the file: ${err.message}`);
        }
    }

    /**
     * Get all markdown files in the folder.
     * @returns {Promise<Array<string>>} The list of markdown files.
     * @throws Will throw an error if the folder cannot be read.
     * @private
     */
    async _getMarkdownFiles() {
        try {
            console.log(this.folderPath)
            const files = await fs.readdir(this.folderPath);
            return files.filter(file => path.extname(file) === '.md');

        } catch (err) {
            throw new Error(`Error reading the folder: ${err.message}`);
        }
    }

    /**
     * Read the content of a file.
     * @param {string} filePath - The path to the file.
     * @returns {Promise<string>} The content of the file.
     * @throws Will throw an error if the file cannot be read.
     * @private
     */
    async _readFileContent(filePath) {
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (err) {
            throw new Error(`Error reading the file: ${err.message}`);
        }
    }

    /**
     * Extract strings that follow the pattern [[STRING]].
     * @param {string} content - The content to extract strings from.
     * @returns {Array<string>} The extracted strings.
     * @private
     */
    _extractStrings(content) {
        const regex = /\[\[([^\]]+)\]\]/g;
        const matches = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            matches.push(match[1]);
        }
        return matches;
    }

    /**
     * Save a markdown file.
     * @param {string} fileName - The name of the file.
     * @param {string} payload - The content to save in the file.
     * @returns {Promise<void>}
     * @throws Will throw an error if the file cannot be saved.
     */
    async saveMarkdownFile(fileName, payload) {
        const filePath = path.join(this.folderPath, fileName);
        try {
            await fs.writeFile(filePath, payload, 'utf8');
            console.log(`File Saved: ${fileName}`);
        } catch (err) {
            console.log(err)
            throw new Error(`Error saving the file: ${err.message}`);
        }
    }
}

module.exports = ObsidianExtractor;
