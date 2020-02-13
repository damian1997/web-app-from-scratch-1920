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

 ```javascript

 {
  "count": 0,
  "next": "http://example.com",
  "previous": "http://example.com",
  "results": [
    {
    "id": 0,
    "name": "string",
    "slug": "string",
    "games_count": 0,
    "image_background": "http://example.com"
    }
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
