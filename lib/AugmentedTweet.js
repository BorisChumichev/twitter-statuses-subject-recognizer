//AugmentedTweet class
'use strict';

/**
 * Instantiates new tweet object which actually is wrapper for a copy of original tweet,
 * thus augmented tweet has all fields of original tweet in addition to following fields:
 * - isRetweet {Boolean} indicates whether status is retweet or not
 * - subjectsCollection {Array} filtered SubjectCollection instance
 *
 * @param {Tweet} tweet https://dev.twitter.com/overview/api/tweets
 * @param subjectsCollection
 * @constructor
 */
function AugmentedTweet (tweet, subjectsCollection) {
  this._mixinTweet(tweet)
  this.isRetweet = this.hasOwnProperty('retweeted_status')
  this.subjectsCollection = this._filterReferredEntities(subjectsCollection)
}

var method = AugmentedTweet.prototype

/**
 * Derives own properties from original tweet
 *
 * @param tweet
 * @private
 */
method._mixinTweet = function (tweet) {
  for (var field in tweet) {
    if (tweet.hasOwnProperty(field)) {
      Object.defineProperty(this, field, {
        value: tweet[field],
        enumerable: true
      })
    }
  }
}

/**
 * Filters relevant tweets from given subjects collection
 *
 * @param subjectsCollection
 * @returns {*}
 * @private
 */
method._filterReferredEntities = function (subjectsCollection) {
  var text = this.text
  if (this.entities && this.entities.urls) {
    this.entities.urls.forEach(function (el) {
      text += el['expanded_url']
    })
  }
  if (this.isRetweet) {
    text += this['retweeted_status'].text
  }
  return subjectsCollection.filterMentionedIn(text)
}

module.exports = AugmentedTweet
