const { exec } = require('child_process');
const fs = require('fs')

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

        const title = videoInfo.fulltitle;
        const uploader = videoInfo.uploader;
        const duration = videoInfo.duration;
        const categories = videoInfo.categories;
        const viewCount = videoInfo.view_count;
        const likeCount = videoInfo.like_count;
        const uploadDate = videoInfo.upload_date;
        const chapters = videoInfo.chapters;
        const uploaderUrl = videoInfo.uploader_url;
        const thumbnail = videoInfo.thumbnail;
        const description = videoInfo.description;
        const tags = videoInfo.tags;
        const videoUrl = url

        return {
            title,
            uploader,
            duration,
            categories,
            viewCount,
            likeCount,
            uploadDate,
            chapters,
            uploaderUrl,
            thumbnail,
            description,
            tags,
            videoUrl,
        }
    } catch (error) {
        console.error(error);
    }
}

async function getVideoTranscript(url) {
    try {
        const command = `yt-dlp --write-auto-subs --sub-lang en --skip-download -o "%(id)s.%(ext)s" ${url}`;
        await _execCommand(command);
        
        // Obtener el ID del video para leer el archivo de subtítulos
        const videoId = url.split('v=')[1];
        const subtitleFile = `${videoId}.en.vtt`;
        
        // Read the file generated and store the content in memory
        const subtitleContent = fs.readFileSync(subtitleFile, 'utf8');
        // Remove the file
        fs.unlinkSync(subtitleFile);
        
        return subtitleContent;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {getVideoInfo, getVideoTranscript}