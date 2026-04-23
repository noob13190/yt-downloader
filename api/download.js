const ytdl = require('ytdl-core');

export default async function handler(req, res) {
    // Vercel mein req.query se direct parameters milte hain
    const videoURL = req.query.url;
    const formatType = req.query.format || 'mp4';

    // Validation
    if (!videoURL || !ytdl.validateURL(videoURL)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '_');

        if (formatType === 'mp3') {
            res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
            res.setHeader('Content-Type', 'audio/mpeg');
            ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
            res.setHeader('Content-Type', 'video/mp4');
            ytdl(videoURL, { format: 'mp4', quality: 'highest' }).pipe(res);
        }
    } catch (error) {
        console.error("Vercel Serverless Error:", error);
        res.status(500).json({ error: 'Failed to download video.' });
    }
}
