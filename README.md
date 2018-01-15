### ⛔️ This project is a bit stale and not maintained anymore. Consider using [twitter-stream-channels](https://github.com/topheman/twitter-stream-channels)

# twitter-statuses-subject-recognizer

`twitter-statuses-subject-recognizer` lets you define subjects to track using Twitter Streaming APIs and recognize incoming statuses' subjects.

## What problem does this module solve?
If you decide working with Twitter Streaming APIs and want to track statuses that relate to numerous topics (subjects) you will face the problem that Twitter pushes all statuses in one stream so that your application needs a way to identify the subject of each status. `twitter-statuses-subject-recognizer` solves that problem. Of course it may be used not only with Streaming APIs (e.g., assume you have large amount of tweets stored in database, and you want to filter those tweets that relate to one or various particular topics).

# Install

	$ npm install twitter-statuses-subject-recognizer

# How to use

Lets say you want to track Twitter statuses related to GitHub, pastries, and Vladimir Putin. First you need to define your subjects and instantiate parser object:

```javascript
var TSSR = require('twitter-statuses-subject-recognizer').TwitterStatusesSubjectRecognizer;

// Define subjects:
var subjects = [
  {
    name: "GitHub",
    keywords: ["github"]
  },
  {	
	name: "Pastries",
	keywords: ["banitsa", "eclair", "blachindla", "chouquette"]
  },
  {
	name: "Putin", 
	keywords: ["путин", "putin", "普京"]
  }
];

// Instantiate parser object:
var tssr = new TSSR(subjects);
```

In that case your request to Twitters API may look like:
	
	https://stream.twitter.com/1.1/statuses/filter.json?track=github,banitsa,eclair,blachindla,chouquette,путин,putin,普京

where `track` parameter holds all keywords concatinated by commas. You don't have to hardcode `track` parameter, once parser object were instantiated it has `trackString` property which you can use as `track` parameter.

	console.log(tssr.trackString);
	-> 'github,banitsa,eclair,blachindla,chouquette,путин,putin,普京'
	
Once you have connected to streaming endpoint you can use `parse` method to recognize subjects of incoming tweets:
```javascript
var augmentedTweet = tssr.parse(tweet);
```
That's it! `tssr.parse` method creates new object that has all properties of the original tweet and `subjectsCollection` property that holds subjects it's related to. To get names of related subjects use: `augmentedTweet.subjectsCollection.names`.



# Example

![Terminal output](https://raw.githubusercontent.com/BorisChumichev/twitter-statuses-subject-recognizer/master/term-shot.png)

This example utilizes [`twit` – Twitter API Client for node](https://github.com/ttezel/twit).

> **Note:** In order to make authorized calls to Twitter’s APIs, your application must first obtain an OAuth access token on behalf of a Twitter user. Follow [this guide](https://dev.twitter.com/oauth/overview) in order to obtain access token.

```javascript
'use strict';

var Twit = require('twit')
  , TSSR = require('twitter-statuses-subject-recognizer').TwitterStatusesSubjectRecognizer
  , colors = require('colors')
  , format = require('util').format

// Instatiate Twitter client using your application credentials:
var T = new Twit({
  'consumer_key': "your consumer key",
  'consumer_secret': "your consumer secret",
  'access_token': "your access token",
  'access_token_secret': "your access token secret"
})

// Define subjects to track
var subjects = [
  {
    name: "GitHub",
    keywords: ["github"]
  },
  {
    name: "AngularJS",
    keywords: ["angularjs", "angular", "angular.js"]
  },
  {
    name: "Node",
    keywords: ["node", "node.js", "nodejs"]
  },
  {
    name: "npm",
    keywords: ["npm"]
  }
]

// Instantiate parser object:
var tssr = new TSSR(subjects)

// Connect to 'statuses/filter' endpoint using twit module.
// Use tssr.trackString property as track parameter:
var stream = T.stream('statuses/filter', {track: tssr.trackString})

stream.on('tweet', function (tweet) {
  // Recognize subjects:
  var augmentedTweet = tssr.parse(tweet)
  // Log subject names:
  console.log(format('\nNew tweet about %s by @%s', augmentedTweet.subjectsCollection.names.toString().green)
    , augmentedTweet.user.screen_name)
  // Log status text:
  console.log(format('  -> %s', augmentedTweet.text.blue))
})
// Todo: in real world don't forget to handle stream's "error" event ;)
```
	
