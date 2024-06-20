/**
 * Class representing a Note Creator.
 */
class NoteCreator {
    constructor() {
        /**
         * @type {string}
         * @private
         */
        this.title = "";
        
        /**
         * @type {string}
         * @private
         */
        this.preNoteContent = "";
        
        /**
         * @type {string}
         * @private
         */
        this.noteContent = "";
        
        /**
         * @type {string}
         * @private
         */
        this.postNoteContent = "";

        // Card
        /**
         * @type {string}
         * @private
         */
        this.cardTitle = "";
        
        /**
         * @type {string}
         * @private
         */
        this.cardLinkResource = "";
        
        /**
         * @type {string}
         * @private
         */
        this.cardImage = "";
        
        /**
         * @type {string}
         * @private
         */
        this.authorCard = "";
        
        /**
         * @type {Array<string>}
         * @private
         */
        this.tagsCard = [];
        
        /**
         * @type {Array<string>}
         * @private
         */
        this.categoriesCard = [];
        
        /**
         * @type {Array<string>}
         * @private
         */
        this.cardPageLinks = [];
    }

    /**
     * Set the title of the note.
     * @param {string} title - The title of the note.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setTitle(title) {
        this.title = title;
        return this;
    }

    /**
     * Set the pre-note content.
     * @param {string} preNoteContent - The pre-note content.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setPreNoteContent(preNoteContent) {
        this.preNoteContent = `${preNoteContent}\n`;
        return this;
    }

    /**
     * Set the main note content.
     * @param {string} noteContent - The main note content.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setNoteContent(noteContent) {
        this.noteContent = `${noteContent}\n`;
        return this;
    }

    /**
     * Set the post-note content.
     * @param {string} postNoteContent - The post-note content.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setPostNoteContent(postNoteContent) {
        this.postNoteContent = `${postNoteContent}\n`;
        return this;
    }

    /**
     * Set the card title.
     * @param {string} cardTitle - The card title.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setCardTitle(cardTitle) {
        this.cardTitle = `**title**: ${cardTitle}\n`;
        return this;
    }

    /**
     * Set the card link resource.
     * @param {string} url - The URL for the resource link.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setCardLinkResource(url) {
        this.cardLinkResource = `[Link to resource](${url})\n`;
        return this;
    }

    /**
     * Set the card image.
     * @param {string|null} cardImageUrl - The URL for the card image.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setCardImage(cardImageUrl) {
        if (cardImageUrl === null) {
            return this;
        }
        this.cardImage = `![cardImage](${cardImageUrl})\n`;
        return this;
    }

    /**
     * Set the card author.
     * @param {string} authorCard - The author of the card.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setAuthorCard(authorCard) {
        this.authorCard = `**author**: ${authorCard}\n`;
        return this;
    }

    /**
     * Add a tag to the card.
     * @param {string} tagsCard - The tag to add.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setTagsCard(tagsCard) {
        this.tagsCard.push(tagsCard);
        return this;
    }

    /**
     * Add a category to the card.
     * @param {string} categoriesCard - The category to add.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setCategoriesCard(categoriesCard) {
        this.categoriesCard.push(categoriesCard);
        return this;
    }

    /**
     * Add a page link to the card.
     * @param {string} cardPageLinks - The page link to add.
     * @returns {NoteCreator} The instance of NoteCreator.
     */
    setCardPageLinks(cardPageLinks) {
        this.cardPageLinks.push(`[[${cardPageLinks}]]`);
        return this;
    }

    /**
     * Build the card tags.
     * @returns {string} The built card tags.
     * @private
     */
    _buildCardTags() {
        if (this.tagsCard.length === 0) {
            return '';
        }
        return `**tags**: ${this.tagsCard.join(', ')}\n`;
    }

    /**
     * Build the card categories.
     * @returns {string} The built card categories.
     * @private
     */
    _buildCardCategories() {
        if (this.categoriesCard.length === 0) {
            return '';
        }
        return `**categories**: ${this.categoriesCard.join(', ')}\n`;
    }

    /**
     * Build the card page links.
     * @returns {string} The built card page links.
     * @private
     */
    _buildCardPageLinks() {
        if (this.cardPageLinks.length === 0) {
            return '';
        }
        return `**pages**: ${this.cardPageLinks.join(', ')}\n`;
    }

    /**
     * Build the entire card content.
     * @returns {string} The built card content.
     * @private
     */
    _buildCard() {
        return `${this.cardTitle}${this.authorCard}${this._buildCardTags()}${this._buildCardCategories()}${this._buildCardPageLinks()}${this.cardLinkResource}${this.cardImage}`;
    }

    /**
     * Build the complete note.
     * @returns {string} The built note.
     */
    build() {
        return `${this.preNoteContent}${this._buildCard()}${this.noteContent}${this.postNoteContent}`;
    }
}

module.exports = NoteCreator;

/* Exmaple of the full implementation 
    const noteCreator = new NoteCreator();
    const note = noteCreator.setTitle("title")
        .setPreNoteContent("preNoteContent")
        .setNoteContent("noteContent")
        .setPostNoteContent("postNoteContent")
        .setCardTitle("cardTitle")
        .setCardLinkResource("cardLinkResource")
        .setCardImage("cardImage")
        .setAuthorCard("authorCard")
        .setTagsCard("tagsCard")
        .setTagsCard("tagsCard2")
        .setCategoriesCard("categoriesCard")
        .setCategoriesCard("categoriesCard2")
        .setCardPageLinks("cardPageLinks")
        .setCardPageLinks("cardPageLinks2")
        .build()
*/
