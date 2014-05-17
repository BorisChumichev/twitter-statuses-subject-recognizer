'use strict'
var AugmentedTweet = require('./lib/AugmentedTweet.js')
  , Subject = require('./lib/Subject.js')
  , SubjectsCollection = require('./lib/SubjectsCollection.js')
  , TwitterStatusesSubjectRecognizer = require('./lib/TwitterStatusesSubjectRecognizer.js');

module.exports.TwitterStatusesSubjectRecognizer = TwitterStatusesSubjectRecognizer;
module.exports.AugmentedTweet = AugmentedTweet;
module.exports.Subject = Subject;
module.exports.SubjectsCollection = SubjectsCollection;