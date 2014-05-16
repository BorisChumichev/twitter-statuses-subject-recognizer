//Subject class
'use strict';
var assert = require('assert');

function Subject (name, lexicalCore) {
    assert.equal(typeof (name), 'string', "argument 'name' must be a string");
    assert(Array.isArray(lexicalCore), "argument 'lexicalCore' must be an array");
    assert(lexicalCore.length, "'lexicalCore' must contain at least one element");

    this.name = name;
    this.lexicalCore = lexicalCore;
    this._regExp = this._buildRegExp(lexicalCore);
    Object.freeze(this);
}

var method = Subject.prototype;

method._buildRegExp = function (lexicalCore) {
  var regExpStr = "";
    lexicalCore.forEach(function (str) {
        regExpStr += str + "|";
    });
  return new RegExp(regExpStr.substring(0, regExpStr.length - 1), "i");
};

method.isMentionedIn = function (text) {
    assert.equal(typeof (text), 'string', "argument 'text' must be a string");
    return !!text.match(this._regExp);
};

module.exports = Subject;