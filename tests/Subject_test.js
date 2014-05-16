'use strict';
var vows = require('vows')
  , assert = require('assert')
  , Subject = require('../lib/Subject.js');

vows.describe('Subject').addBatch({
  'A Subject instance': {
    topic: function () {
      return new Subject('Obama', ["обама", "obama", "オバマ"]);
    },
    'has a given name': function (subj) {
      assert.equal(subj.name, 'Obama');
    },
    'has a given lexical core': function (subj) {
      assert.deepEqual(subj.lexicalCore, ["обама", "obama", "オバマ"]);
    },
    'has a regular expression built from given lexical core': function (subj) {
      assert.match('Obama is a USA president', subj._regExp);
      assert.match('Обама – президент США', subj._regExp);
      assert.match('米オバマ大統領', subj._regExp);
    },
    'has a method to check if its mentioned in a given piece of text' : function (subj) {
      assert.isTrue(subj.isMentionedIn('Obama is from Africa'));
      assert.isFalse(subj.isMentionedIn('Knight jumps the queen'));
    },
    'is immutable': function (subj) {
      assert.throws(function () {
        subj.name = "New name";
      });
    }
  }
}).export(module);