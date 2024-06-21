const { exec } = require('child_process');
const fs = require('fs').promises;

function _execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error al ejecutar el comando: ${error.message}`);
                return;
            }

            if (stderr) {
                reject(`Error en la salida del comando: ${stderr}`);
                return;
            }

            resolve(stdout);
        });
    });
}

async function getVideoInfo(url) {
    try {
        const command = `yt-dlp -j ${url}`;
        const output = await _execCommand(command);
        
        const videoInfo = JSON.parse(output);

        return {
            title: videoInfo.fulltitle,
            uploader: videoInfo.uploader,
            duration: videoInfo.duration,
            categories: videoInfo.categories,
            viewCount: videoInfo.view_count,
            likeCount: videoInfo.like_count,
            uploadDate: videoInfo.upload_date,
            chapters: videoInfo.chapters,
            uploaderUrl: videoInfo.uploader_url,
            thumbnail: videoInfo.thumbnail,
            description: videoInfo.description,
            tags: videoInfo.tags,
            videoUrl: url,
        };
    } catch (error) {
        throw error;
    }
}

async function getVideoTranscript(url) {
    try {
        const command = `yt-dlp --write-auto-subs --sub-lang en --skip-download -o "%(id)s.%(ext)s" ${url}`;
        await _execCommand(command);
        
        const videoId = url.split('v=')[1];
        const subtitleFile = `${videoId}.en.vtt`;
        
        const subtitleContent = await fs.readFile(subtitleFile, 'utf8');
        await fs.unlink(subtitleFile);
        
        return subtitleContent;
    } catch (error) {
        throw error;
    }
}

module.exports = { getVideoInfo, getVideoTranscript };