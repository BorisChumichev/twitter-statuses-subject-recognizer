'use strict';
var vows = require('vows')
  , assert = require('assert')
  , Subject = require('../lib/Subject.js')
  , SubjectsCollection = require('../lib/SubjectsCollection.js')

vows.describe('SubjectsCollection').addBatch({
  'A collection of subjects': {
    topic: function () {
      var collection = [
        new Subject('Fields', ["math", "physics", "geometry", "logic"]),
        new Subject('Scientists', ["Poisson", "Augustus De Morgan", "Johann Bernoulli"])
      ]
      return new SubjectsCollection(collection)
    },
    'has a list of given subjects': function (subjectsCollection) {
      assert.deepEqual(subjectsCollection.subjects, [
        new Subject('Fields', ["math", "physics", "geometry", "logic"]),
        new Subject('Scientists', ["Poisson", "Augustus De Morgan", "Johann Bernoulli"])
      ])
    },
    'has a \'track string\' that consists of each listed subjects\' lexical cores': function (subjectsCollection) {
      assert.equal(subjectsCollection.trackString, 'math,physics,geometry,logic,Poisson,Augustus De Morgan,Johann Bernoulli')
    },
    'has a list of given subjects\' names': function (subjectsCollection) {
      assert.deepEqual(subjectsCollection.names, ['Fields', 'Scientists'])
    },
    'has a method to filter subjects to which given text refers (rgit eturns new SubjectsCollection instance)': function (subjectsCollection) {
      assert.deepEqual(
        subjectsCollection.filterMentionedIn('Siméon Denis Poisson was a French mathematician, geometer, and physicist.'),
        new SubjectsCollection([
          subjectsCollection.subjects[0],
          subjectsCollection.subjects[1]
        ])
      )
      assert.deepEqual(
        subjectsCollection.filterMentionedIn('Siméon Denis Poisson was a French mathematician, geometer, and physicist.')
            .filterMentionedIn('Poisson was born in Pithiviers, Loiret, the son of soldier Siméon Poisson.'),
        new SubjectsCollection([
          subjectsCollection.subjects[1]
        ])
      )
      assert.equal(subjectsCollection.filterMentionedIn('Mrs. De Morgan resided at various places in the southwest of England.').subjects.length, 0)
    },
    'is immutable': function (subjectsCollection) {
      assert.throws(function () {
        subjectsCollection.subjects = []
      })
    }
  }
}).export(module)
