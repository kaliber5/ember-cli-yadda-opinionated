import { selectorFromLabel } from 'ember-cli-yadda-opinionated/test-support/labels';
import { module, test } from 'qunit';

const cases = [
  { input: 'FooBar',  expected: '[data-test-foo-bar]' },
  { input: 'Foo-Bar', expected: '[data-test-foo-bar]' },
  { input: 'foo-bar', expected: '[data-test-foo-bar]' },
  { input: 'FoosBars', expected: '[data-test-foos-bar]' },
  { input: 'a FooBar', expected: '[data-test-foo-bar]:eq(0)' },
  { input: '1st FooBar',  expected: '[data-test-foo-bar]:eq(0)' },
  { input: '2nd FooBar',  expected: '[data-test-foo-bar]:eq(1)' },
  { input: '3rd FooBar',  expected: '[data-test-foo-bar]:eq(2)' },
  { input: '4th FooBar',  expected: '[data-test-foo-bar]:eq(3)' },
  { input: '35th FooBar',  expected: '[data-test-foo-bar]:eq(34)' },
  { input: 'the 1st FooBar',  expected: '[data-test-foo-bar]:eq(0)' },
  { input: 'FooBar of Baz-Quux',  expected: '[data-test-baz-quux] [data-test-foo-bar]' },
  { input: 'the FooBar under 33rd Baz-Quux in Zomg',  expected: '[data-test-zomg] [data-test-baz-quux]:eq(32) [data-test-foo-bar]:eq(0)' },
]

module('Unit | Utility | selector-from-label', function(/* hooks */) {
  cases.forEach(({input, expected}) => {
    test(input, function(assert) {
      let result = selectorFromLabel(input);
      assert.equal(result, expected);
    });
  })
});
