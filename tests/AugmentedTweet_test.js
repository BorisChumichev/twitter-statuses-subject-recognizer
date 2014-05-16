'use strict';
var vows = require('vows')
  , assert = require('assert')
  , fs = require('fs')
  , AugmentedTweet = require('../lib/AugmentedTweet.js')
  , Subject = require('../lib/Subject.js')
  , SubjectsCollection = require('../lib/SubjectsCollection.js');

var testSubjectsCollection = new SubjectsCollection([
  new Subject('Obama', ["обама", "obama", "オバマ"]),
  new Subject('Putin', ["путин", "putin", "普京"])
]);
var testTweet = JSON.parse(fs.readFileSync('tests/test_tweet.json'));

vows.describe('AugmentedTweet').addBatch({
  'An augmented tweet': {
    topic: function () {
      return new AugmentedTweet(testTweet, testSubjectsCollection);
    },
    'contains a given tweet\'s fields': function (augmentedTweet) {
      for (var field in testTweet) {
        if (testTweet.hasOwnProperty(field)) {
          assert.deepEqual(augmentedTweet[field], testTweet[field]);
        }
      }
    },
    'has a boolean retweet status': function (augmentedTweet) {
      assert.isTrue(augmentedTweet.isRetweet);
    },
    'has a field that holds collection of subjects it refers to': function (augmentedTweet) {
      assert.deepEqual(augmentedTweet.subjectsCollection, new SubjectsCollection([testSubjectsCollection.subjects[0]]));
    },
    'original tweet\'s fields are immutable': function (augmentedTweet) {
      assert.throws(function () {
        augmentedTweet.text = "New next";
      });
    }
  }
}).export(module);