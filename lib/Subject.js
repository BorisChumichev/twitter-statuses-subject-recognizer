//Subject class
'use strict';
var assert = require('assert')

/**
 * Instantiates Subject
 * @param {String} name - name for a new subject instance
 * @param {[String]} lexicalCore - array of keywords
 * @constructor
 */
function Subject (name, lexicalCore) {
    assert.equal(typeof (name), 'string', "argument 'name' must be a string")
    assert(Array.isArray(lexicalCore), "argument 'lexicalCore' must be an array")
    assert(lexicalCore.length, "'lexicalCore' must contain at least one element")

    this.name = name
    this.lexicalCore = lexicalCore
    this._regExp = this._buildRegExp(lexicalCore)
    Object.freeze(this)
}

var method = Subject.prototype

/**
 * Returns a regular expression which can be used to check whether a given string is relevant to subject
 * @param {[String]} lexicalCore - array of keywords
 * @returns {RegExp}
 * @private
 */
method._buildRegExp = function (lexicalCore) {
  var regExpStr = ""
    lexicalCore.forEach(function (str) {
        regExpStr += str + "|"
    })
  return new RegExp(regExpStr.substring(0, regExpStr.length - 1), "i")
}

/**
 * Checks whether a given string is relevant to subject
 * @param {String} text - string to check
 * @returns {boolean}
 */
method.isMentionedIn = function (text) {
    assert.equal(typeof (text), 'string', "argument 'text' must be a string")
    return !!text.match(this._regExp)
}

module.exports = Subject
