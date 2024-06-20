const OpenAi = require('../lib/openAi');
const Obsidian = require('../lib/obsidian');
const NoteCreator = require('../lib/noteCreatorObsidian');

/**
 * Class representing a Regular Note.
 */
class RegularNote {
    /**
     * Create a Regular Note.
     * @param {Object} options - The options for the RegularNote instance.
     * @param {string} options.obsidianPath - The path to the Obsidian directory.
     */
    constructor({ obsidianPath }) {
        /**
         * @type {OpenAi}
         * @private
         */
        this.openAi = new OpenAi({apiKey: ""});

        /**
         * @type {NoteCreator}
         * @private
         */
        this.noteCreator = new NoteCreator();

        /**
         * @type {Obsidian}
         * @private
         */
        this.obsidian = new Obsidian({folderPath: obsidianPath});
    }

    /**
     * Run the process to create and save a regular note.
     * @param {Object} options - The options for running the note creation process.
     * @param {string} options.title - The title of the note.
     * @param {Array<string>} [options.pages=[]] - The pages to link in the note.
     * @param {string} [options.link=null] - The link to add to the note.
     * @param {string} [options.image=null] - The image to add to the note.
     * @param {string} [options.noteToExtend=null] - The existing note content to extend.
     * @returns {Promise<string>} The created note content.
     */
    async run({ title, pages = [], link = null, image = null, noteToExtend = null }) {
        const existingPages = await this.obsidian.extractExistingPages();

        const summary = await this._runInference({ existingPages, noteToExtend });
        const note = this._createNote({ title, summary, link, image, pages });

        this.obsidian.saveMarkdownFile(`${title}.md`, note)
        return note;
    }

    /**
     * Run the inference to generate a summary.
     * @param {Object} options - The options for running the inference.
     * @param {Array<string>} options.existingPages - The existing pages in Obsidian.
     * @param {string} [options.noteToExtend=null] - The existing note content to extend.
     * @returns {Promise<string>} The generated summary.
     * @private
     */
    async _runInference({ existingPages, noteToExtend }) {
        // TODO: The prompt should be passed as an argument to the function
        // Prompt to be used for the inference
        const {REGULAR_NOTE} = this.openAi.listPrompts();

        // Replacements for the prompt
        const replacements = {
            NOTE: noteToExtend,
            PAGES: JSON.stringify(existingPages),
        };

        // Run the inference
        const prompt = this.openAi.buildPrompt(REGULAR_NOTE, replacements);
        const summary = await this.openAi.inference({prompt});

        return summary;
    }

    /**
     * Create the note content.
     * @param {Object} options - The options for creating the note.
     * @param {string} options.title - The title of the note.
     * @param {string} options.summary - The summary of the note.
     * @param {string} [options.link=null] - The link to add to the note.
     * @param {string} [options.image=null] - The image to add to the note.
     * @param {Array<string>} [options.pages=null] - The pages to link in the note.
     * @returns {string} The created note content.
     * @private
     */
    _createNote({ title, summary, link, image, pages = [] }) {
        const note = this.noteCreator.setTitle(title)
            .setNoteContent(summary)
            .setCardTitle(title)
            .setCardLinkResource(link)
            .setCardImage(image);

        pages.forEach(page => note.setCardPageLinks(page));

        const finalNote = note.build();
        return finalNote;
    }
}

const newNote = new RegularNote({
    obsidianPath: '/home/gir/Documents/obsidian/GiR',
});
newNote.run({
    title: 'New Note',
    link: 'none',
    image: 'https://i.ytimg.com/vi/2utAfvGAbgg/maxresdefault.jpg',
    noteToExtend: 'This is an existing note content.',
    pages: ['Page 1', 'Page 2'],
});

module.exports = RegularNote;