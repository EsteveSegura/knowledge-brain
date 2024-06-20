const { getVideoInfo, getVideoTranscript } = require('../utils/youtubeDlpHandler');

/**
 * Class representing a YouTube video summary.
 */
class YoutubeVideoSummary {
    /**
     * Create a YouTube Video Summary.
     * @param {string} videoUrl - The URL of the YouTube video.
     */
    constructor(videoUrl) {
        /**
         * @type {string}
         * @private
         */
        this.videoUrl = videoUrl;
    }
    
    /**
     * Get information about the video.
     * @returns {Promise<Object>} The information about the video.
     */
    getVideoInfo() {
        return getVideoInfo(this.videoUrl);
    }

    /**
     * Get the transcription of the video.
     * @returns {Promise<string>} The transcription of the video.
     */
    getTranscription() {
        return getVideoTranscript(this.videoUrl);
    }
}

module.exports = YoutubeVideoSummary;