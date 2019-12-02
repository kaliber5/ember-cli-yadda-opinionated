import { module, test } from 'qunit';

import * as regexes from 'ember-cli-yadda-opinionated/test-support/-private/regex';

const cases = [
  { name: 'REGEX_ITEM_MATCHING', str: 'Post',         matches: [null,  null, null,     'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'a Post',       matches: ["a",   null, null,     'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'the Post',     matches: ["the", null, null,     'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'an Post',      matches: ["an",  null, null,     'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'THE Post',     matches: ["THE", null, null,     'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: '1st Post',     matches: [null,  '1',  null,     'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'a 1st Post',   matches: ['a',   '1',  null,     'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'the 1st Post', matches: ['the', '1',  null,     'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'Foo(Bar)',     matches: [null,  null, null,     'Foo',     'Bar'] },
  { name: 'REGEX_ITEM_MATCHING', str: 'Foo+Bar',      matches: [null,  null, null,     'Foo+Bar', null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'first Post',   matches: [null, null, 'first',   'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'second Post',  matches: [null, null, 'second',  'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'third Post',   matches: [null, null, 'third',   'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'fourth Post',  matches: [null, null, 'fourth',  'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'fifth Post',   matches: [null, null, 'fifth',   'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'sixth Post',   matches: [null, null, 'sixth',   'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'seventh Post', matches: [null, null, 'seventh', 'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'eighth Post',  matches: [null, null, 'eighth',  'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'ninth Post',   matches: [null, null, 'ninth',   'Post',    null] },
  { name: 'REGEX_ITEM_MATCHING', str: 'tenth Post',   matches: [null, null, 'tenth',   'Post',    null] },

  { name: 'REGEX_SEPARATOR', str: ' of ',     matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' on ',     matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' in ',     matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' inside ', matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' under ',  matches: [] },
  { name: 'REGEX_SEPARATOR', str: ' zomg ',   matches: null },
  { name: 'REGEX_SEPARATOR', str: 'in',       matches: null },

  { name: 'REGEX_SELECTOR_MAYBE_WITH_EQ', str: 'foo',                          matches: ['foo',                   null] },
  { name: 'REGEX_SELECTOR_MAYBE_WITH_EQ', str: 'foo:eq(2)',                    matches: ['foo',                   '2'] },
  { name: 'REGEX_SELECTOR_MAYBE_WITH_EQ', str: '[data-test]',                  matches: ['[data-test]',           null] },
  { name: 'REGEX_SELECTOR_MAYBE_WITH_EQ', str: '[data-test-foo]',              matches: ['[data-test-foo]',       null] },
  { name: 'REGEX_SELECTOR_MAYBE_WITH_EQ', str: '[data-test-foo-bar]',          matches: ['[data-test-foo-bar]',   null] },
  { name: 'REGEX_SELECTOR_MAYBE_WITH_EQ', str: '[data-test-foo-bar]:eq(0)',    matches: ['[data-test-foo-bar]',   '0'] },
  { name: 'REGEX_SELECTOR_MAYBE_WITH_EQ', str: '[data-test-foo="bar"]:eq(0)',  matches: ['[data-test-foo="bar"]', '0'] },

  { name: 'REGEX_LABEL_CONSTRAINED', str: 'Post',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'a Post',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: '2nd Post',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'the 2nd Post',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: '4554th Post',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'Foo in Baru',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'a Comment under 2nd Post',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'a Reaction-Emoji under CommentReply in a comment under 2nd Post',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'Foo Bar',  matches: null },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'Foo(Bar)',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'a Foo(Bar)',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: '2nd Foo(Bar)',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'the 2nd Foo(Bar)',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: '2543rd Foo(Bar)',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'a Foo(Bar) in Zomg+Lol',  matches: [] },
  { name: 'REGEX_LABEL_CONSTRAINED', str: 'the 1st Foo(Bar) in 2nd Zomg(Lol) of Baz',  matches: [] },

  { name: 'REGEX_COMMA_AND_SEPARATOR', str: 'foo,bar,    baz and    quux ,fooandbar', matches: [',', ',    ', ' and    ', ' ,'] },

  { regex: new RegExp(regexes.STR_STRING_WITH_ESCAPE, 'g'), str: 'foo "bar" "baz \\"quux\\"" zomg "lol"', matches: ['"bar"', '"baz \\"quux\\""', '"lol"'] },
];

module('Unit | Utility | regex', function(/* hooks */) {
  cases.forEach(({name, regex, str, matches}) => {
    regex = regex || regexes[name];

    test(`${name}: "${str}".match(${regex})`, function(assert) {
      let m;
      const result = str.match(regex);

      if (matches && matches.length) {
        assert.ok(result, "Expected to match, but it didn't");

        matches.forEach((match, i) => {
          const indexEffective = regex.flags.includes('g') ? i : i + 1;

          m = `Match #${i}: ${match}`;
          assert.equal(result[indexEffective], match, m);
        });
      } else if (matches && !matches.length) {
        m = "Expected to match (not checking submatches)";
        assert.ok(result, m);
      } else {
        m = "Expected no match";
        assert.equal(result, null, m);
      }
    });
  });
});
