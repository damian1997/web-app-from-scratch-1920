# Web app from scratch - CMD Minor 1920
Repository for the Web app from scratch course.

* [Description](#description)
* [Installing](#installing)
	* [Packages](#packages)
* [Api](#api)
* [UI Design](#ui-design)

## Description
With this application you can get insight into who has forked your repository and if they have done any work on your project.

## Installing

To install this application localy type the following into your terminal
```
git clone https://github.com/damian1997/web-app-from-scratch-1920.git
npm install
```

To serve the application to your browser type the following into your terminal
```
npm run dev
```

To generate production files type the following into your terminal
```
npm run prod
```

### Packages
This project makes use of the following packages and technologies:
* [Webpack](https://webpack.js.org/)

## Api
This project makes use of the following Api
* [Github Api V3](https://developer.github.com/v3/)

### Rate limiting
For API requests using Basic Authentication or OAuth, you can make up to 5000 requests per hour. Authenticated requests are associated with the authenticated user, regardless of whether [Basic authentication](For API requests using Basic Authentication or OAuth, you can make up to 5000 requests per hour. Authenticated requests are associated with the authenticated user, regardless of whether Basic Authentication or an OAuth token was used.) or an [OAuth](https://developer.github.com/v3/#oauth2-token-sent-in-a-header) was used.

For unauthenticated requests, the rate limit allows for up to 60 requests per hour. Unauthenticated requests are associated with the originating IP address, and not the user making requests.

#### Used authentication
This project currentcly fetched data with unauthenticates requests.

#### Fetch forkers output
When fetching forkers the api outputs the following

<details>
 <summary>Show output</summary>

 ```json

 [
    {
        "gitusername": "meessour",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "DanielvandeVelde",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "Jaouad90",
        "repository": "GarbageScraper"
    },
    {
        "gitusername": "TimTerwijn",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "LarsBreuren",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "heralt",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "lennartdeknikker",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "thijsbordewijk",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "Mokerstier",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "randy554",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "Zeijls",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "TomasS666",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "MohamadAlGhorani",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "mordock",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "ReiniervanLimpt",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "Coenmathijssen",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "charder001",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "jenniferslagt",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "Ramon96",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "iSirThijs",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "marissaverdonck",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "martendebruijn",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "CountNick",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "Stanargy",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "qiubee",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "robert-hoekstra",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "Aidan98",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "tnanhekhan",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "gijslaarman",
        "repository": "web-app-from-scratch-1920"
    },
    {
        "gitusername": "MonikaaS",
        "repository": "web-app-from-scratch-1920"
    }
]

 ```
</details>

<details>
 <summary>Show output</summary>

 ```json

 {
    "gitusername": "meessour",
    "repository": "web-app-from-scratch-1920",
    "commits": [
        {
            "sha": "73cac56178a0549a5a2d4f29f001f99a13ffb577",
            "node_id": "MDY6Q29tbWl0MjM4MDMxNDU1OjczY2FjNTYxNzhhMDU0OWE1YTJkNGYyOWYwMDFmOTlhMTNmZmI1Nzc=",
            "commit": {
                "author": {
                    "name": "msourHvA",
                    "email": "meessour@gmail.com",
                    "date": "2020-02-11T19:29:58Z"
                },
                "committer": {
                    "name": "msourHvA",
                    "email": "meessour@gmail.com",
                    "date": "2020-02-11T19:29:58Z"
                },
                "message": "Added routing. Added show songs of artist on click. Fixed visuals",
                "tree": {
                    "sha": "77e8eec5096cca51029ad7bcf44d96e4d1f7f5ae",
                    "url": "https://api.github.com/repos/meessour/web-app-from-scratch-1920/git/trees/77e8eec5096cca51029ad7bcf44d96e4d1f7f5ae"
                },
                "url": "https://api.github.com/repos/meessour/web-app-from-scratch-1920/git/commits/73cac56178a0549a5a2d4f29f001f99a13ffb577",
                "comment_count": 0,
                "verification": {
                    "verified": false,
                    "reason": "unsigned",
                    "signature": null,
                    "payload": null
                }
            },
            "url": "https://api.github.com/repos/meessour/web-app-from-scratch-1920/commits/73cac56178a0549a5a2d4f29f001f99a13ffb577",
            "html_url": "https://github.com/meessour/web-app-from-scratch-1920/commit/73cac56178a0549a5a2d4f29f001f99a13ffb577",
            "comments_url": "https://api.github.com/repos/meessour/web-app-from-scratch-1920/commits/73cac56178a0549a5a2d4f29f001f99a13ffb577/comments",
            "author": {
                "login": "meessour",
                "id": 32935392,
                "node_id": "MDQ6VXNlcjMyOTM1Mzky",
                "avatar_url": "https://avatars3.githubusercontent.com/u/32935392?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/meessour",
                "html_url": "https://github.com/meessour",
                "followers_url": "https://api.github.com/users/meessour/followers",
                "following_url": "https://api.github.com/users/meessour/following{/other_user}",
                "gists_url": "https://api.github.com/users/meessour/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/meessour/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/meessour/subscriptions",
                "organizations_url": "https://api.github.com/users/meessour/orgs",
                "repos_url": "https://api.github.com/users/meessour/repos",
                "events_url": "https://api.github.com/users/meessour/events{/privacy}",
                "received_events_url": "https://api.github.com/users/meessour/received_events",
                "type": "User",
                "site_admin": false
            },
            "committer": {
                "login": "meessour",
                "id": 32935392,
                "node_id": "MDQ6VXNlcjMyOTM1Mzky",
                "avatar_url": "https://avatars3.githubusercontent.com/u/32935392?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/meessour",
                "html_url": "https://github.com/meessour",
                "followers_url": "https://api.github.com/users/meessour/followers",
                "following_url": "https://api.github.com/users/meessour/following{/other_user}",
                "gists_url": "https://api.github.com/users/meessour/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/meessour/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/meessour/subscriptions",
                "organizations_url": "https://api.github.com/users/meessour/orgs",
                "repos_url": "https://api.github.com/users/meessour/repos",
                "events_url": "https://api.github.com/users/meessour/events{/privacy}",
                "received_events_url": "https://api.github.com/users/meessour/received_events",
                "type": "User",
                "site_admin": false
            },
            "parents": [
                {
                    "sha": "a90db6d862f4d58b444e251aa00671d364d716ba",
                    "url": "https://api.github.com/repos/meessour/web-app-from-scratch-1920/commits/a90db6d862f4d58b444e251aa00671d364d716ba",
                    "html_url": "https://github.com/meessour/web-app-from-scratch-1920/commit/a90db6d862f4d58b444e251aa00671d364d716ba"
                }
            ]
		},
    ]
}

 ```

 </details>

## UI Design

### Desktop

Home page when launching the application

<img src="./src/images/github/desktopdesign-overview.png">

Commit detail page

<img src="./src/images/github/desktopdesign-detail.png">

### Mobile

Home page when launching the application

<img src="./src/images/github/mobiledesign-wafs.png">

Commit detail page

<img src="./src/images/github/mobiledesign-detailpage.png">
<!-- Add a link to your live demo in Github Pages 🌐-->

<!-- ☝️ replace this description with a description of your own work -->

<!-- replace the code in the /docs folder with your own, so you can showcase your work with GitHub Pages 🌍 -->

<!-- Add a nice poster image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Maybe a table of contents here? 📚 -->

<!-- How about a section that describes how to install this project? 🤓 -->

<!-- ...but how does one use this project? What are its features 🤔 -->

<!-- What external data source is featured in your project and what are its properties 🌠 -->

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

<!-- How about a license here? 📜 (or is it a licence?) 🤷 -->
