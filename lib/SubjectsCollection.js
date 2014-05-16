//SubjectsCollection class
'use strict';
var assert = require('assert');

function SubjectsCollection (subjects) {
  assert(Array.isArray(subjects), "argument 'subjects' must be an array");
  this.subjects = subjects;
  this.trackString = this._buildTrackString();
  this.names = this._buildNamesArray();
  Object.freeze(this);
};

var method = SubjectsCollection.prototype;

method._buildTrackString = function () {
  var track = '';
  this.subjects.forEach(function (subj) {
    subj.lexicalCore.forEach(function (str) {
      track += str + ',';
    });
  });
  return track.substring(0, track.length - 1);
};

method._buildNamesArray = function () {
  var names = [];
  this.subjects.forEach(function (subj) {
    names.push(subj.name);
  });
  return names;
};

method.filterMentionedIn = function (text) {
  assert.equal(typeof (text), 'string', "argument 'text' must be a string");
  var collection = [];
  this.subjects.forEach(function (subj) {
    if (subj.isMentionedIn(text)) {
      collection.push(subj);
    }
  });
  return new SubjectsCollection(collection);
};

module.exports = SubjectsCollection;