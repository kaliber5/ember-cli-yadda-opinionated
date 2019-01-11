ember-cli-yadda-opinionated
==============================================================================

This Ember addon provides a few opnionated techniques to make working with Cucumber easier:

* A compact library of fully reusable steps.
* An easy way to compose steps from multiple sources.

It is a companion for the [ember-cli-yadda](https://github.com/albertjan/ember-cli-yadda#ember-cli-yadda) which in turn leverages the [Yadda](https://github.com/acuminous/yadda) library -- an implementation of Cucumber.





Roadmap
------------------------------------------------------------------------------

This addon is in early development. See [the first release milestone](https://github.com/kaliber5/ember-cli-yadda-opinionated/milestone/1) to track progress.

:warning: It is currently coupled with Mocha. QUnit support is planned but not in active development. If you want to use `ember-cli-yadda-opinionated` with QUnit, please let us know in [#3](https://github.com/kaliber5/ember-cli-yadda-opinionated/issues/3).



Rationale
------------------------------------------------------------------------------

### Moving the truth to feature files

#### The problem

Cucumber is a technology that has always had mixed opinions. It has lots of devoted fans, but it also has many haters, as well as people who have adopted it with enthusiasm but then got disappointed and regretted the decision.

As with many things in life, Cucumber is a tool that can give joy or grief, depending on how you use it.

One major reason for getting disappointed in Cucumber is the burden of maintaining a huge library of step implementations:

* In a matured project, there are hundreds, sometimes thousands of steps. As the step library grows, it becomes birtually impossible to know it and use it efficiently.
* As a consequence, duplicate steps are sometimes introduced.
* At certain point, some steps may be no longer used and become dead code.
* There is no simple, automated to look up a step implementation for a given step name. As far as we know, no IDE and no Cucumber implementation has a tool for this. (If you know a such tool for Yadda, please start an issue in this repo and share.)
* Many step implementations are repetitous: they do essentially same things with slight variations. There is a lot of code duplication.
* As you write new tests, you have to implement more and more steps, which makes writing tests very slow.
* Step implementations obscure the truth. Step names in feature files essentially behave as references to step implementations. There is no guarantee that a step implementation will do what its name suggests. This may result in false positives.
* The problem of obscured truth is especially tough with seeding steps. Many acceptance tests require very elaborate setups, which are impossible to express with a single phrase.
* Seeding with a sequence of steps is an option, but a typical problem here is that such steps implicitly depend on each other's internal implementation, not exposed in feature files: cross-references with ids, amount of child records, values of attributes -- are implied.
* Assertion steps then expect certain amounts and attribute values, even though they are not obvious from the feature file, e. g.:

    ```feature
    Given 5 posts with comments
    Then the author of 3rd comment under 2nd post should be Alice
    ```

    It is impossible to validate (ensure correctness of) this feature file by reading it. You have to look into actual step implementations.

    This code sample is exagerrated and maybe even ridiculous. But every developer who dared to convert an acceptance test suite of a large project to Cucumber has surely stumbled into this problem.

#### The solution

We believe we know a radical solution to all of these problems: do *not* obscure any truth in step implementations, instead expose *all* truth in feature files (step names).

There are only so much things a user can do on the page. There are maybe a couple dozens of common things to do: see something, click something, type text into something; and a few dozen of less common (but still fully reusable) ones, such as select items in a multi-select dropdown.

So instead of doing this:

```feature
Then the save button should be disabled
```

we suggest that you do this:

```feature
Then the SaveButton should have attribute `aria-disabled`
```

Here `SaveButton` will be converted to a `[data-test-save-button]` [test selector](https://github.com/simplabs/ember-test-selectors#ember-test-selectors), and `aria-disabled` is an actual HTML attribute name to be looked upon the referenced element.

A similar thing can be done with seeding. Instead of doing:

```feature
Given 5 posts with comments
```

...be explicit:

```
Given the following User records:
  -------------------------------------------
  | Id       | Name               | Role    |
  | @frankie | "Frankie Foster"   | "admin" |
  | @cheese  | "Cheese"           | "user"  |
  -------------------------------------------
And the following Post records:
  -----------------------------------------------------
  | Id | Body            | Slug            | Author   |
  | @1 | "I'm 22!"       | "my-age"        | @frankie |
  | @2 | "I like cereal" | "i-like-cereal" | @cheese  |
  -----------------------------------------------------
And the following Comment records:
  ------------------------------------------------------------
  | Id | Post | Author   | Body                              |
  | @1 | @1   | @cheese  | "I like chocolate milk"           |
  | @2 | @2   | @frankie | "YOU DON'T LIVE HERE! GO HOOOME!" |
  | @3 | @2   | @cheese  | "Television tastes funny"         |
  ------------------------------------------------------------
```

Now the feature file is explicit about what's going on in the database. The feature is unambiguous!

And we'll provide step implementations and tools to streamline these stems!

In the best case, all steps from the latter feature sample can be served by a *single* step implementation. This step implementation will look up Mirage models and set up relationships automatically. Remaining properties will be applied as attributes.

In the worst case, you'll have to create one step per model. In such a step, you provide a contract -- a mapping between keys/values from feature files to keys/values in the database. There you can:
* Customize attribute names: use meaningful, human-friendly names in feature files and have them automatically converted to actual attributes.
* Cast types, create non-primitive values, lookup relationships by criteria, etc.
* Expand a single source value to a certain combination of attribute values.

Note that steps don't need to rely on context (`this.ctx`), since they can cross-reference each other with ids and types.



#### Pros and cons

Let's start with **cons**.

* The suggested approach:
  * Makes feature files more explicit and more techinical.
  * As a result, features become harder to read, especially for non-developers.

This is an inevitable price you have to pay for the compromise. The other side of the coin.

Is it worth it?

By paying this price, you get the following **pros**:

* A compact library of fully reusable steps:
    * Easy to learn.
    * Easy to navigate thanks to documentation available here.
    * Little to no maintenance.
    * You no longer need to have a steps file for each acceptance test. Why bother, when all steps are fully reusable across all acceptance tests?
* As you're making new tests:
    * You don't need to code step implementations.
    * Writing new tests is fast and enjoyable.
    * You can expand existing features with more cases by simply copying the first case and adjusting the options. Not that you weren't able to do this before, but now it's even easier.
* The truth is no longer hidden inside the black box of step implementations:
    * It is now possible to reliable validate features: by reading them, ensure they are making correct assertions in correct connditions.
    * No false positives caused by black-boxed logic.
    * Steps no longer need to rely on context (`this.ctx`), making the implementation less tangled.



### Using labels as direct references to elements with test selectors

As explained above, we want to move the truth from step implementations to feature files. A great way to do it is with test selectors.

To learn about test selectors, please see the [ember-test-selectors](https://github.com/simplabs/ember-test-selectors) addon. This addon is not required but it may be useful.

`ember-cli-yadda-opinonated` introduces *labels*: a DSL to reference page elements via test selectors.

In its simplest form, a label can look like: `Menu-Item`, `MenuItem` or `menu-item`. Any of these lables translates to `[data-test-menu-item]`.

You can also use articles: `a Menu-Item` and `the Menu-Item` behave identically to `Menu-Item`.



#### Targeting nested elements

You can nest labels using prepositions `in`, `inside`, `under`, `of`, `on` and `from`.

For example, `Save-Button in Post-Edit-Form` produces selector `[data-test-post-edit-form] [data-test-save-button]`.

You can nest selectors up to 5 levels deep.



#### Referencing Nth element

If you have multiple elements on the same page and you want to target one of them by index, you can use index prefixes like: `1st`, `2nd`, `3rd`, `4th`, `543rd`, etc. Since we're using a natural language, they are one-indexed.

A label `2nd Menu-Item` or `the 2nd Menu-Item` produces a selector `[data-test-menu-item]:eq(1)` internally.

`:eq(n)` is not a standard selector. We use it as an equivalent to `array[n]` in JS.

So `[data-test-menu-item]:eq(1)` will find all menu items on the page, then pick the second one.

Note that this is totally different from `:nth-child(n)`!

Here's a more complicated example:

    Link in 2nd Menu-Item from the 1st Menu

This will find the first menu, in that menu it will take the second menu item, and in that menu item it will take a link.



#### Compound labels

Each element you want to target should have one semantic label.

In addition to a semantic label, you might want to add additional labels. Here are two common cases:
* Distinguishing sibling items. E. g. each menu item may have a unique label such as `Home`, `Products`, `About`, `Contacts`, etc.
* Tracking state: `Active`, `Expanded`, etc.

Use `+` to compose multiple labels.

E. g. you can target an active menu item with `Active+MenuItem`. This will translate to `[data-test-menu-item][data-test-active]`.

Note that you can use the [label map](mapping-labels-to-selectors) to map the `Active` label to the `.active` selector. If you do, `Active+MenuItem` will translate to `[data-test-menu-item].active`.



### Composing Yadda step implementations

#### The problem

Yadda uses method chains to register step implementations. Here's an example from the `ember-cli-yadda` readme:

```js
import steps from 'ember-cli-yadda-opinionated/test-support/steps';

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

This approach has two disadvantages:

* It's quite boilerplatey, has a lot of visual noise.
* It does not allow step composition. You can only inherit one file from another (similar to JS class inheritance), whereas assembling a library from multiple sources would be handy (similar to mixins).
  
    For example, you have some generic `steps.js` and then you have acceptance-test specific `login-steps.js`. According to `ember-cli-yadda` stadnard, `login-steps.js` inherits from `steps.js`.

    Now imagine you're building some other accepntance test with `post-steps.js` that also inherits from `steps.js`. You have a use case where an anonymous user must see a post without edit button, then login and see the edit button. You have the login step already implemented in `login-steps.js`, so you inherit `post-steps.js` from  `login-steps.js`.

    Now Yadda will complain about conflicting steps and refuse to start: `steps.js` was inherited twice.

    You can work around this by not inheriting from `steps.js`. This works, but only until you want to borrow some more steps from another step file: if two step files inherit from `steps.js`, you can't inherit from both! :(

    The only solution is to move all shared steps to the generic `steps.js`. Eventually it becomes large, mixed up, hard to read and to maintain.



#### The solution

`ember-cli-yadda-opinionated` lets you store steps in simple objects with methods. The above example can be rewritten like this:

```js
// tests/acceptance/steps/_fruit-steps.js

export default {

  "Given it\'s next to apples" (assert) {
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

You can compose such steps with the `composeSteps` helper:

```js
// tests/acceptance/steps/post-steps.js

import {
  composeSteps, // The helper

  // Opinionated steps!
  givenSteps,
  whenSteps,
  thenSteps
} from 'ember-cli-yadda-opinionated/test-support';

// Step implementations
import library from 'my-app/tests/acceptance/steps'; // A steps library, can be empty, but initialized with converters, etc
import loginSteps from 'my-app/tests/acceptance/login-steps'; // Hand-written steps from the previous example

export default composeSteps(library, [
  givenSteps,
  whenSteps,
  thenSteps,
  loginSteps,
]);
```

This way, you can compose steps from multiple sources.

Conflicting step names will not produce an unnecessary crash, letting you manually control the composition: the last conflicting step overwrites previous ones.

This also lets you run one step from another:

```js
export default const steps = {
  // A one-liner step to seed a single post
  "Given a post with $fields"(fields) {
    /* seeding */
  },

  // A step that uses table syntax: useful to seed multiple records,
  // but not practical to seed just one, since it consumes at least four lines of feature file
  "Given the following posts with\n$table"(rows) {
    rows.forEach(row => {
      steps["Given a post with $fields"].call(this, row);
    })
  },
  
};
```



Installation
------------------------------------------------------------------------------

1. Make sure you have `ember-cli-yadda installed.

2. Install the addon:

        ember install ember-cli-yadda-opinionated

3. Extend your dictionary.

    In your app's `tests/acceptance/steps/steps.js` file, you should have this:

    ```js
    new yadda.Dictionary()
    ```

    Extend it like this:

    ```js
    import { REGEX_LABEL, element } from 'ember-cli-yadda-opinionated/test-support';

    new yadda.Dictionary()
      .define('element', REGEX_LABEL, element)
    ```

4. Extend you steps. See below.


Usage
------------------------------------------------------------------------------

### Defining custom steps with the composable syntax

[See above](#composing-yadda-step-implementations) for rationale behind composable steps syntax.

You can store step implementations in simple POJOs and store them however you like.

We suggest that you organize them in files by function, each file prefixed with an underscore:

    tests/acceptances/steps/_authentication-steps.js
    tests/acceptances/steps/_side-menu-steps.js

The underscore would distinguish composable steps to traditional Yadda steps (libararies).

The file content should be like this:

```js
export default {
  'Given I am logged in as a $role'(role) {
    /* ... */
  },
}
```



### Composing steps

Create an individual `steps/*-steps.js` file for your acceptance test, as you normally would with `ember-cli-yadda`:

    tests/acceptance/steps/my-test-name-steps.js

In that file, you normally would have:

```js
import steps from 'ember-cli-yadda-opinionated/test-support/steps';

export default function() {
  return steps()
    .given('I am logged in as a $role', function(role) {
      /* ... */
    })
}
```

Replace it with:

```js
import libraryFactory from 'ember-cli-yadda-opinionated/test-support/steps';
import { composeSteps, givenSteps, whenSteps, thenSteps } from 'ember-cli-yadda-opinionated/test-support';
import authenticationSteps from '<my-app>/tests/acceptance/steps/_authentication-steps';

export default composeSteps(libraryFactory, givenSteps, whenSteps, thenSteps, authenticationSteps);
```

This way you can keep your step implementations organized by function. For each acceptance test, you can include the ones you need.

If you make your steps fully reusable and not concealing any truth ([rationale](moving-the-truth-to-feature-files)), then you can include *all* your steps. This way, all individual step files for your acceptance tests will be identical.



### Mapping labels to selectors

Sometimes you want your tests to operate on page elements produced by a third-party addon or library. You don't have control over its HTML output and thus can't sprinkle it with test selectors.

To resolve the issue, you can provide a mapping of labels to selectors. Do this in `tests/acceptanse/steps/steps.js` or `tests/test-helper.js`:

```js
import { labelMap } from 'ember-cli-yadda-opinionated';

labelMap.set('Bootstrap-Text-Input', 'input.form-control[type="text"]');
labelMap.set('Bootstrap-Textarea',   'textarea.form-control');
```

These labels will be automatically converted to selectors (case-sensitive).

You should consider scoping those selectors with a library's unique HTML class, if available. And stay semantic!



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.



License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
