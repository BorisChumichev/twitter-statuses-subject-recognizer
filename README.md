twitter-statuses-subject-recognizer
===================================

`twitter-statuses-subject-recognizer` lets you define subjects to track using Twitter Streaming APIs and recognize incoming statuses' subjects.

##What problem does this module solve?
If you decide working with Twitter Streaming APIs and want to track statuses that relate to numerous topics (subjects) you will face the problem that Twitter pushes all statuses in one stream so that your application needs a way to identify the subject of each status. `twitter-statuses-subject-recognizer` solves that problem. Of course it may be used not only with Streaming APIs – assume you have large amount of tweets in your database, and you want to filter those tweets that relate to one or various particular topics.

#Install

	$ npm install twitter-statuses-subject-recognizer

#How to use

Lets say you want to track Twitter statuses related to GitHub, pastries, and Vladimir Putin. First you need to define your subjects and instantiate parser object:

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
	
In that case your request to Twitters API may look like:
	
	https://stream.twitter.com/1.1/statuses/filter.json?track=github,banitsa,eclair,blachindla,chouquette,путин,putin,普京

where `track` parameter holds all the keywords. You don't have to hardcode `track` parameter, once parser object were instantiated it has `trackString` property which you can use as `track` parameter.

	console.log(tssr.trackString);
	-> 'github,banitsa,eclair,blachindla,chouquette,путин,putin,普京'
	
Once you have connected to streaming endpoint you can use `parse` method to recognize subjects of incoming tweets:

	var augmentedTweet = tssr.parse(tweet);
	
That's it! `tssr.parse` method creates new object that has all properties of the original tweet and `subjectsCollection` property that holds subjects it's related to. To get names of related subjects use:

	augmentedTweet.subjectsCollection.names

You can read more about subjectsCollection property in documentation section.

# Example

This example utilizes [`twit` – Twitter API Client for node](https://github.com/ttezel/twit).

	var Twit = require('twit')
  	  , TSSR = require('twitter-statuses-subject-recognizer').TwitterStatusesSubjectRecognizer
	
	// Instatiate Twitter client using your application credentials:
	var T = new Twit({
	  'consumer_key': "your consumer key",
	  'consumer_secret': "your consumer secret",
	  'access_token': "your access_token",
	  'access_token_secret': "your access token secret"
	});
	
	// Define subjects to track
	var subjects = [
	  {
	    name: "Putin", 
	    keywords: ["путин", "putin", "普京"]
	  }
	];
	
	// Instantiate parser object:
	var tssr = new TSSR(subjects);
	
	// Connect to 'statuses/filter' endpoint using twit module.
	// Use tssr.trackString property as track parameter:
	var stream = T.stream('statuses/filter', {track: tssr.trackString});
	
	stream.on('tweet', function (tweet) {
	  // Recognize subjects:
	  augmentedTweet = tssr.parse(tweet);
	  // Log subject names:
	  console.log(augmentedTweet.subjectsCollection.names);
	});
	
#Documentation

##TwitterStatusesSubjectRecognizer class

**TwitterStatusesSubjectRecognizer** constructor creates new instance of parser for a given set of subjects.

#####Syntax

	new TwitterStatusesSubjecttRecognizer([subject1, subject2, ..., subjectN]);
	
#####Parameters

**[subject1, subject2, ..., subjectN]** – an Array of subject objects. Each subject must have `name` and `keywords` properties:

	var exampleSubject = {
	  name: "expampleName",
	  keywords: ["keyword1", "keyword2", ..., "keywordN"]
	}
	
#####Example

	var TSSR = require('twitter-statuses-subject-recognizer').TwitterStatusesSubjectRecognizer
	var subjects = [
	  {
	    name: "Pastries",
  		keywords: ["banitsa", "eclair", "blachindla", "chouquette"]
	  },
	  {
	    name: "Prefectures of Japan",
  		keywords: ["iwate", "yamaguchi", " ehime", "kagawa"]
	  },
	  {
	    name: "Obama",
  		keywords: ["обама", "obama", "オバマ"]
	  }
	];
	var tssr = new TSSR(subjects);
	
###TwitterStatusesSubjectRecognizer.trackString
Track parameter for Twitter Streaming APIs. 

#####Syntax

	tssr.trackString

#####Example

	var TSSR = require('twitter-statuses-subject-recognizer').TwitterStatusesSubjectRecognizer
	var subjects = [
	  {
	    name: "Pastries",
  		keywords: ["banitsa", "eclair", "blachindla", "chouquette"]
	  }
	];
	var tssr = new TSSR(subjects);
	console.log(tssr.trackString);
	
	-> 'banitsa,eclair,blachindla,chouquette'

###TwitterStatusesSubjectRecognizer.prototype.parse()
Recognizes subjects related to a given tweet object. Returns new object of **AugmentedTweet** class.

#####Syntax

	tssr.parse(tweet);
	
#####Parameters

**tweet** must be an instance of Twitter [Tweets](https://dev.twitter.com/docs/platform-objects/tweets) class.