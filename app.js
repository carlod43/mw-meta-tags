const express = require('express');
const axios = require('axios');
const useragent = require('useragent');
//pull from .env file. Remove this line below if you want to hardcode the values
require('dotenv').config();

const app = express();
const PORT = 3000;

// Replace with your TMDB API key and main movie-web or sudo-flix site (without trailing slash)
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MW_BASE_URL = process.env.MW_BASE_URL;

// Redirect root to base URL
app.get('/', (req, res) => {
    res.redirect(301, MW_BASE_URL);
});

// Updated route to capture optional season and episode IDs
app.get('/media/:type(tmdb-tv|tmdb-movie)-:id-:title/:seasonID?/:episodeID?', async (req, res) => {
    const { type, id, title, seasonID, episodeID } = req.params;
    const userAgent = req.headers['user-agent'];
    const agent = useragent.parse(userAgent);

    const botPatterns = /bot|chatgpt|facebookexternalhit|WhatsApp|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|MetaInspector/i;
    // Check if the user agent is a bot, if not, just take them to main site.
    if (!botPatterns.test(agent.source)) {
        return res.redirect(`${MW_BASE_URL}/media/${type}-${id}-${title}`);
    }

    try {
        const tmdbType = type === 'tmdb-tv' ? 'tv' : 'movie';
        const response = await axios.get(`https://api.themoviedb.org/3/${tmdbType}/${id}?api_key=${TMDB_API_KEY}&language=en-US`);

        const media = response.data;
        let mediaTitle = media.title || media.name;

        // Truncate mediaTitle if longer than 22 characters
        if (mediaTitle.length > 22) {
            mediaTitle = mediaTitle.substring(0, 22) + '...';
        }

        const metaTags = `<!DOCTYPE html><html><head><title>${mediaTitle} | Vid Binge - Stream Your Favorite Movies & TV Shows For Free</title>
<meta property="og:title" content="${mediaTitle} | Vid Binge - Stream Movies & TV Shows For Free" />
<meta property="og:description" content="${media.overview}" />
<meta property="og:image" content="https://image.tmdb.org/t/p/original${media.backdrop_path}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${mediaTitle} | Vid Binge - Stream Movies & TV Shows For Free" />
<meta name="twitter:description" content="${media.overview}" />
<meta name="twitter:image" content="https://image.tmdb.org/t/p/original${media.backdrop_path}" /></head><body>If you're seeing this, you might be a bot. If you want to see the real site, make sure you set your user agent back to normal and re-visit the website to watch content.</body><html>`;

        res.send(metaTags);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
