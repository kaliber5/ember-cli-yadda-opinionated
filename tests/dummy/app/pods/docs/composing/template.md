# Composing Yadda step implementations

## The problem

[Yadda](https://github.com/acuminous/yadda), the Cucumber implementation behind this addon, uses method chains to register step implementations. Here's an example from the [ember-cli-yadda](https://github.com/albertjan/ember-cli-yadda) readme:

```js
import steps from 'my-app/tests/acceptance/steps/steps';

export default function(assert) {
  return steps(assert)
    .given('it\'s next to apples', function() {
      let apples = this.element.querySelectorAll('.apple');
      assert.ok(apples.length > 0)
    })
    .when('left together for a while', function(next) {
      // bananas rot really quickly next to apples.
      setTimeout(next, 1000);
    })
    .then('the banana rots', function () {
      let banana = this.element.querySelector('.banana');
      assert.ok(banana.classList.contains('rotten'));
    });
}
```

This approach has disadvantages:

* It's quite boilerplatey.
* It has a lot of visual noise, the code is harder to read than it could be.
* It does not allow step composition. You can only inherit one file from another (similar to JS class inheritance), whereas assembling a library from multiple sources would be handy (similar to mixins).
* Steps can only be organized into files *by feature*, whereas most steps can be used in multiple features.
  
    For example, you have some generic `steps.js` and then you have acceptance-test specific `login-steps.js`. According to `ember-cli-yadda` stadnard, `login-steps.js` inherits from `steps.js`.

    Now imagine you're building another accepntance test with `post-steps.js` that also inherits from `steps.js`. You have a use case where an anonymous user must see a post without edit button, then login and see the edit button. You have the login step already implemented in `login-steps.js`, so you inherit `post-steps.js` from  `login-steps.js`.

    Now Yadda will complain about conflicting steps and refuse to start: `steps.js` was inherited twice.

    You can work around this by not inheriting `post-steps.js` from `steps.js`. This works, but only until you want to borrow some more steps from another step file: if two step files inherit from `steps.js`, you can't inherit from both! :(

    The only solution is to move all shared steps to the generic `steps.js`. Eventually it becomes large, mixed up, hard to read and to maintain.



## The solution

`ember-cli-yadda-opinionated` lets you store steps in simple objects with methods. The above example can be rewritten like this:

```js
// tests/acceptance/steps/_fruit-steps.js

export default {

  "Given it's next to apples" (assert) {
    let apples = this.element.querySelectorAll('.apple');
    assert.ok(apples.length > 0)
  },

  'When left together for a while', function() {
    // next() is not available. Return a promise or use async/await.
    return new Promise(resolve => setTimeout(resolve, 1000)); 
  }),

  'Then the banana rots', function () {
    let banana = this.element.querySelector('.banana');
    assert.ok(banana.classList.contains('rotten'));
  },

};
```

This is cleaner and easier to read.

(Note: this example is borrowed from the Yadda readme and is not using the opinionated approach of <LinkTo @route="docs.truth">reusable steps</LinkTo> and <LinkTo @route="docs.labels">labels</LinkTo>.)

`ember-cli-yadda-opinionated` lets you organize steps *by topic*, not directly bound to a specific feature. For example, you can have a collection of *authentication* steps and use them in all features that require anonymous/authenticated/admin user, logging out, etc.

You can compose such steps with the `composeSteps` helper. It lets you include steps from multiple sources.

Conflicting step names will not crash your test suite, letting you manually control the composition: the last conflicting step overwrites previous ones.

The plain object approach lets you run one step from another:

```js
export default const steps = {

  // A one-liner step to seed a single post
  "Given a post with $fields"(fields) {
    /* seeding */
  },

  // A step that uses table syntax: useful to seed multiple records,
  // but not practical to seed just one, since it consumes at least four lines of the feature file
  "Given the following posts with\n$opinionatedTable"(rows) {
    rows.forEach(row => {
      steps["Given a post with $fields"].call(this, row);
    })
  },

};
```
