import { module, test } from 'qunit';

import * as regexes from 'ember-cli-yadda-opinionated/test-support/regex';

const cases = [
  { name: 'REGEX_ITEM_MATCHING', str: 'Post',       matches: [null,  null, 'Post'] },
  { name: 'REGEX_ITEM_MATCHING', str: 'a Post',     matches: ["a",   null, 'Post'] },
  { name: 'REGEX_ITEM_MATCHING', str: 'the Post',   matches: ["the", null, 'Post'] },
  { name: 'REGEX_ITEM_MATCHING', str: 'an Post',    matches: ["an",  null, 'Post'] },
  { name: 'REGEX_ITEM_MATCHING', str: 'THE Post',   matches: ["THE", null, 'Post'] },
  { name: 'REGEX_ITEM_MATCHING', str: '1st Post',   matches: [null,  '1',  'Post'] },
  { name: 'REGEX_ITEM_MATCHING', str: 'a 1st Post', matches: null },

  { name: 'REGEX_SEPARATOR', str: ' of ',     matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' on ',     matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' in ',     matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' inside ', matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' under ',  matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' zomg ',   matches: null },
  { name: 'REGEX_SEPARATOR', str: 'in',       matches: null },

  { name: 'REGEX_SELECTOR_WITH_EQ', str: '[data-test]',                matches: null },
  { name: 'REGEX_SELECTOR_WITH_EQ', str: '[data-test-foo]',            matches: ['[data-test-foo]',     null] },
  { name: 'REGEX_SELECTOR_WITH_EQ', str: '[data-test-foo-bar]',        matches: ['[data-test-foo-bar]', null] },
  { name: 'REGEX_SELECTOR_WITH_EQ', str: '[data-test-foo-bar]:eq(0)',  matches: ['[data-test-foo-bar]', 0] },

  { name: 'REGEX_LABEL', str: 'Post',  matches: [] },
  { name: 'REGEX_LABEL', str: 'a Post',  matches: [] },
  { name: 'REGEX_LABEL', str: '2nd Post',  matches: [] },
  { name: 'REGEX_LABEL', str: 'the 2nd Post',  matches: [] },
  { name: 'REGEX_LABEL', str: '4554th Post',  matches: [] },
  { name: 'REGEX_LABEL', str: 'a Comment under 2nd Post',  matches: [] },
  { name: 'REGEX_LABEL', str: 'a Reaction-Emoji under CommentReply in a comment under 2nd Post',  matches: [] },
];

module('Unit | Utility | regex', function(/* hooks */) {
  cases.forEach(({name, str, matches}) => {
    const regex = regexes[name];

    test(`${name}: "${str}".match(${regex})`, function(assert) {
      let m;
      const result = str.match(regex);

      if (matches && matches.length) {
        matches.forEach((match, i) => {
          m = `Match #${i}: ${match}`;
          assert.equal(result[i + 1], match, m);
        });
      } else if (matches && !matches.length) {
          assert.ok(true, "Matched without submatches");
      } else {
        m = "Expected no match";
        assert.equal(result, null, m);
      }
    });
  });
});
