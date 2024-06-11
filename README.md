
# Movie Web / Sudo Flix Meta Tag Grabber

This will help your movie-web/sudo-flix instance grab the meta tags (movie name, movie images, movie description) to serve to preview crawlers. Such as Facebook, Discord, Telegram, Twitter, etc.

## How it works

Basically, all this script does is write out the meta tags of the movie URL. You need to setup re-write rules as movie-web/sudo-flix doesn't do server-side rendering. That's what this script is for. 

## How To Setup

This requires you to host your movie web or sudo flix instance on Cloudflare or at least use Cloudflare to proxy your DNS. 

-  Login to Cloudflare and select the domain of your main movie-web/sudo-flix site.

-  Go to Rules > Transform Rules > Modify Request Header > Create Rule 

-  Name your rule something like "If Preview Crawler"

- In the box below "Expression Preview", to the right click "Edit Expression"

- Paste the following into the box:

```
(http.user_agent contains "facebookinternalhit") or (http.user_agent contains "facebookinternalhit/") or (http.user_agent eq "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)") or (http.user_agent eq "https://postman-echo.com/get") or (http.user_agent contains "TwitterBot") or (http.user_agent contains "Twitterbot") or (http.user_agent eq "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)") or (http.user_agent contains "Discordbot/2.0") or (http.user_agent contains "Discordbot")
```

- Under "Then" select "Set Static" 

- Set Header Name to `"X-Rewrite"` and Value to `"true"`

- Then go to your `vercel.json` file of your movie-web/sudo-flix source code

- Redo your `rewrites` to look like the following:

```
 "rewrites": [
    {
      "source": "/opensearch.xml",
      "destination": "/opensearch.xml"
    },
    {
      "source": "/media/(.*)",
      "has": [
        {
          "type": "header",
          "key": "x-rewrite",
          "value": "true"
        }
      ],
      "destination": "https://yourmetatagappdomaian.com/media/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ],
```

Replace https://yourmetatagappdomain.com with whatever URL you're hosting this code on. 

- Go to your `.env.example` file for your Meta Tag grabber source
- Rename it to `.env`
- Set your `TMDB_API_KEY` and `MW_BASE_URL` (MW_BASE URL = your main movie-web/sudo-flix website without trailing slash)
- Deploy your code. 


## Author

[Josh Holly (wafflehacker)](https://www.github.com/joshholly)