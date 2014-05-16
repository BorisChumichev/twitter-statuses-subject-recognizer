//AugmentedTweet class
'use strict';
var assert = require('assert');

function AugmentedTweet (tweet, subjectsCollection) {
  this._mixinTweet(tweet);
  this.isRetweet = this.hasOwnProperty('retweeted_status');
  this.subjectsCollection = this._filterReferredEntities(subjectsCollection);
};

var method = AugmentedTweet.prototype;

method._mixinTweet = function (tweet) {
  for (var field in tweet) {
    if (tweet.hasOwnProperty(field)) {
      Object.defineProperty(this, field, {
        value: tweet[field],
        enumerable: true
      });
    }
  }
};

method._filterReferredEntities = function (subjectsCollection) {
  var text = this.text;
  if (this.entities && this.entities.urls) {
    this.entities.urls.forEach(function (el) {
      text += el['expanded_url'];
    });
  }
  if (this.isRetweet) {
    text += this['retweeted_status'].text;
  }
  return subjectsCollection.filterMentionedIn(text);
};

module.exports = AugmentedTweet;