//TwitterStatusesSubjectRecognizer class
'use strict';
var assert = require('assert')
  , AugmentedTweet = require('./AugmentedTweet.js')
  , Subject = require('./Subject.js')
  , SubjectsCollection = require('./SubjectsCollection.js')

function TwitterStatusesSubjectRecognizer (arr) {
  assert(Array.isArray(arr), "argument must be an array")
  arr.forEach(function (el) {
    assert.equal(typeof (el.name), 'string', "subject's 'name' must be a string")
    assert(Array.isArray(el.keywords), "subject's 'keywords' must be an array")
    assert(el.keywords.length, "subject's 'keywords' must not be empty")
  })

  var subjectsBuffer = []
  arr.forEach(function (el) {
    subjectsBuffer.push(new Subject(el.name, el.keywords))
  })
  this.subjectsCollection = new SubjectsCollection(subjectsBuffer)
  this.trackString = this.subjectsCollection.trackString
}

var method = TwitterStatusesSubjectRecognizer.prototype

method.parse = function (tweet) {
  try {
    assert.equal(typeof (tweet.id_str), 'string')
    assert.equal(typeof (tweet.user), 'object')
    assert.equal(typeof (tweet.text), 'string')
  } catch (ex) {
    throw new Error("argument 'tweet' must be a Tweets object: https://dev.twitter.com/docs/platform-objects/tweets")
  }

  return new AugmentedTweet(tweet, this.subjectsCollection)
}

module.exports = TwitterStatusesSubjectRecognizer
