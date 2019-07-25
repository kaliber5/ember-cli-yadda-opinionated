import selectorFromLabel from 'ember-cli-yadda-opinionated/test-support/-private/selector-from-label';
import { labelMap } from 'ember-cli-yadda-opinionated/test-support/-private/maps';
import { module, test } from 'qunit';

const cases = [
  { input: 'FooBar', expected: '[data-test-foo-bar]' },
  { input: 'Foo-Bar', expected: '[data-test-foo-bar]' },
  { input: 'Foo+Bar', expected: '[data-test-foo][data-test-bar]' },
  { input: 'foo-bar', expected: '[data-test-foo-bar]' },
  { input: 'FooBar(Baz)', expected: '[data-test-foo-bar="Baz"]' },
  { input: 'FoosBars', expected: '[data-test-foos-bar]' },
  { input: 'a FooBar', expected: '[data-test-foo-bar]' },
  { input: 'a FooBar(Baz)', expected: '[data-test-foo-bar="Baz"]' },
  { input: '1st FooBar',  expected: '[data-test-foo-bar]:eq(0)' },
  { input: '1st FooBar(Baz)', expected: '[data-test-foo-bar="Baz"]:eq(0)' },
  { input: '1st FooBar(Baz Quux)', expected: '[data-test-foo-bar="Baz Quux"]:eq(0)' },
  { input: '2nd FooBar', expected: '[data-test-foo-bar]:eq(1)' },
  { input: '3rd FooBar', expected: '[data-test-foo-bar]:eq(2)' },
  { input: '4th FooBar', expected: '[data-test-foo-bar]:eq(3)' },
  { input: '4th FooBar(Baz)', expected: '[data-test-foo-bar="Baz"]:eq(3)' },
  { input: '35th FooBar', expected: '[data-test-foo-bar]:eq(34)' },
  { input: 'a 1st FooBar', expected: '[data-test-foo-bar]:eq(0)' },
  { input: 'the 1st FooBar', expected: '[data-test-foo-bar]:eq(0)' },
  { input: 'the 1st FooBar(Baz)', expected: '[data-test-foo-bar="Baz"]:eq(0)' },
  { input: 'the 1st FooBar(Baz Quux) of Zomg(Holy Cow)', expected: '[data-test-zomg="Holy Cow"] [data-test-foo-bar="Baz Quux"]:eq(0)' },
  { input: 'FooBar of Baz-Quux', expected: '[data-test-baz-quux] [data-test-foo-bar]' },
  { input: 'a FooBar under the 33rd Baz-Quux in Zomg', expected: '[data-test-zomg] [data-test-baz-quux]:eq(32) [data-test-foo-bar]' },
  { input: 'a FooBar(Baz) under the 33rd Baz+Quux in Zomg', expected: '[data-test-zomg] [data-test-baz][data-test-quux]:eq(32) [data-test-foo-bar="Baz"]' },
  { input: 'first FooBar',  expected: '[data-test-foo-bar]:eq(0)' },
  { input: 'second FooBar',  expected: '[data-test-foo-bar]:eq(1)' },
  { input: 'third FooBar',  expected: '[data-test-foo-bar]:eq(2)' },
  { input: 'fourth FooBar',  expected: '[data-test-foo-bar]:eq(3)' },
  { input: 'fifth FooBar',  expected: '[data-test-foo-bar]:eq(4)' },
  { input: 'sixth FooBar',  expected: '[data-test-foo-bar]:eq(5)' },
  { input: 'seventh FooBar',  expected: '[data-test-foo-bar]:eq(6)' },
  { input: 'eighth FooBar',  expected: '[data-test-foo-bar]:eq(7)' },
  { input: 'ninth FooBar',  expected: '[data-test-foo-bar]:eq(8)' },
  { input: 'tenth FooBar',  expected: '[data-test-foo-bar]:eq(9)' },
]

module('Unit | Utility | selector-from-label', function(hooks) {
  hooks.beforeEach(() => {
    labelMap.clear();
  });

  cases.forEach(({input, expected}) => {
    test(input, function(assert) {
      let result = selectorFromLabel(input);
      assert.equal(result, expected);
    });
  });

  test('Working with labelMap', function (assert) {
    let m;
    labelMap.set("Boo", "Bar");

    m = "Foo in Boo of Baz";
    assert.equal(selectorFromLabel(m, m), "[data-test-baz] Bar [data-test-foo]");

    m = "a Foo in 1st Boo of 2nd Baz";
    assert.equal(selectorFromLabel(m, m), "[data-test-baz]:eq(1) Bar:eq(0) [data-test-foo]");
  });
});
