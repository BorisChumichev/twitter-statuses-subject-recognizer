'use strict';
var vows = require('vows')
  , assert = require('assert')
  , fs = require('fs')
  , TwitterStatusesSubjectRecognizer = require('../lib/TwitterStatusesSubjectRecognizer.js');

var testTweet = JSON.parse(fs.readFileSync('tests/test_tweet.json'));

vows.describe('TwitterStatusesSubjectRecognizer').addBatch({
  'A TwitterStatusesSubjectRecognizer instance': {
    topic: function () {
      var subjects = [
        {
          name: 'Obama',
          keywords: ["обама", "obama", "オバマ"]
        },
        {
          name:'Putin', 
          keywords: ["путин", "putin", "普京"]
        }
      ];
      var tssr = new TwitterStatusesSubjectRecognizer(subjects);
      return tssr;
    },
    'has a track string': function (tssr) {
      assert.equal(tssr.trackString, 'обама,obama,オバマ,путин,putin,普京');
    },
    'has a parse method that recognizes subjects of tweet and returns augmented tweet object': function (tssr) {
      var augmentedTweet = tssr.parse(testTweet);
      assert.isTrue(augmentedTweet.isRetweet)
      assert.deepEqual(augmentedTweet.subjectsCollection.names, ["Obama"]);
    }
  }
}).export(module);