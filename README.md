ember-cli-yadda-opinionated <!-- omit in toc -->
==============================================================================

[![Travis](https://img.shields.io/travis/kaliber5/ember-cli-yadda-opinionated.svg)](https://travis-ci.com/kaliber5/ember-cli-yadda-opinionated)
![ember-cli](https://img.shields.io/badge/ember--cli-3.6.1-blue.svg)

This Ember addon provides a few opnionated techniques to make working with Cucumber easier:

* A compact library of fully reusable steps.
* An easy way to compose steps from multiple sources.

It is a companion for the [ember-cli-yadda](https://github.com/albertjan/ember-cli-yadda#ember-cli-yadda) addon which in turn leverages the [Yadda](https://github.com/acuminous/yadda) library -- an implementation of Cucumber.



Table of contents <!-- omit in toc -->
------------------------------------------------------------------------------

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Roadmap](#roadmap)
- [Rationale](#rationale)
  - [Moving the truth to feature files](#moving-the-truth-to-feature-files)
    - [The problem](#the-problem)
    - [The solution](#the-solution)
    - [Pros and cons](#pros-and-cons)
  - [Using labels as direct references to elements with test selectors](#using-labels-as-direct-references-to-elements-with-test-selectors)
    - [Targeting nested elements](#targeting-nested-elements)
    - [Referencing Nth element](#referencing-nth-element)
    - [Compound labels](#compound-labels)
  - [Composing Yadda step implementations](#composing-yadda-step-implementations)
    - [The problem](#the-problem-1)
    - [The solution](#the-solution-1)
- [Installation](#installation)
- [Usage](#usage)
  - [Project structure](#project-structure)
  - [Composable step files](#composable-step-files)
  - [Composing steps](#composing-steps)
  - [Implementing steps with the $opinionatedElement converter](#implementing-steps-with-the-opinionatedelement-converter)
  - [Using step aliases](#using-step-aliases)
  - [Mapping labels to selectors](#mapping-labels-to-selectors)
  - [The steps library](#the-steps-library)
    - [Given steps](#given-steps)
      - [Seed record(s) with same properties/traits](#seed-records-with-same-propertiestraits)
      - [Seed records with a table](#seed-records-with-a-table)
    - [When steps](#when-steps)
      - [Visit](#visit)
      - [Settled](#settled)
      - [Click](#click)
      - [Double click](#double-click)
      - [Fill in](#fill-in)
      - [Mouse enter](#mouse-enter)
      - [Mouse leave](#mouse-leave)
    - [Then steps](#then-steps)
      - [Pause](#pause)
      - [Debugger](#debugger)
      - [Current URL](#current-url)
      - [Element existence](#element-existence)
      - [Element visibility](#element-visibility)
      - [Element text](#element-text)
      - [Element HTML class](#element-html-class)
      - [Element HTML attr](#element-html-attr)
    - [ember-power-select steps](#ember-power-select-steps)
      - [Items count](#items-count)
  - [In integration tests](#in-integration-tests)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



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

The suggested approach:

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
    * Steps can cross-reference records with ids. As a result, they no longer need to rely on context (`this.ctx`), making the implementation less tangled.



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

Literal indices from `first` to `tenth` are also available.

A label `2nd Menu-Item`, `the 2nd Menu-Item`, `second Menu-Item` or `the second Menu-Item` produces a selector `[data-test-menu-item]:eq(1)` internally.

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
  opinonatedSteps // The step library
} from 'ember-cli-yadda-opinionated/test-support';

// Step implementations
import library from 'my-app/tests/acceptance/steps'; // A steps library, can be empty, but initialized with converters, etc
import loginSteps from 'my-app/tests/acceptance/login-steps'; // Hand-written steps from the previous example

export default composeSteps(library, opinonatedSteps, loginSteps);
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
  "Given the following posts with\n$opinionatedTable"(rows) {
    rows.forEach(row => {
      steps["Given a post with $fields"].call(this, row);
    })
  },
  
};
```



Installation
------------------------------------------------------------------------------

1. Make sure you have `ember-cli-yadda installed.

2. Install the addon and its dependencies:

        ember install ember-cli-yadda-opinionated
        ember install ember-cli-chai
        npm install -D chai-dom  # or: yarn add -D chai-dom

3. Extend your dictionary.

    In your app's `tests/acceptance/steps/steps.js` file, you should have this:

    ```js
    new yadda.Dictionary()
      .define('number', /(\d+)/, yadda.converters.integer)
      .define('table', /([^\u0000]*)/, yadda.converters.table);
    ```

    Extend it like this:

    ```js
    import { setupDictionary } from 'ember-cli-yadda-opinionated/test-support';

    const dictionary = new yadda.Dictionary()
      .define('number', /(\d+)/, yadda.converters.integer)
      .define('table', /([^\u0000]*)/, yadda.converters.table);

    setupDictionary(dictionary)
    ```

    Note that the default table converter from Yadda is required, named `table`.

4. Extend you steps. See below.



Usage
------------------------------------------------------------------------------

### Project structure

According to `ember-cli-yadda`, you are supposed to organize steps like this:

1. Primary `steps.js`

    Located at `tests/acceptance/steps/steps.js`. In this file, you:
    
    1. Initialize a Yadda [dictionary with converters](https://acuminous.gitbooks.io/yadda-user-guide/en/usage/dictionaries.html).
    2. Optionally, bind to Yadda [events](https://acuminous.gitbooks.io/yadda-user-guide/en/usage/events.html) (though this can also be done in `tests/test-helper.js`).
    3. Implement steps that should be shared across multiple feature files.

    Though this is not strictly required, we suggest that you move all step implementations from `steps.js` to composable step definitions (see below).

2. Per-feature steps files: `<feature>-steps.js`

    Located at `tests/acceptance/steps/<feature-name>-steps.js`.

    You must have such file for each feature file, otherwise tests won't start.

    In these files, you are supposed to implement steps that are only relevant to one feature.

As explained in [the rationale section](#composing-yadda-step-implementations), this approach is troublesome because very often you want to use steps from one feature in another feature. The only way to do it with `ember-cli-yadda` is to move those step implementations to the primary `steps.js`, preventing you from organizing step implementations into files by topic.

`ember-cli-yadda-opinionated` lets you organize steps by topic, not directly bound to a specific feature. For example, you can have a collection of *authentication* steps. You can use these steps in a `login-and-logout.feature`, but in addition to that you can use them in any other features that need logging in as part of user stories. Say, in an `admin-panel.feature` you want to test that the access to the admin panel is restricted once the user logs out.

We suggest that you organize such composable steps in files prefixed with an underscore (file contents is explained below):

    tests/acceptances/steps/_authentication-steps.js
    tests/acceptances/steps/_side-menu-steps.js

The underscore would distinguish composable steps from `ember-cli-yadda`'s step fiels..

We also recommend that you move all existing step implementations from `steps.js` and `<feature>-steps.js` into composable step files.

If you do so, the `steps.js` file should export an empty Yadda step library factory:

```js
export default function() {
  return yadda.localisation.default.library(dictionary);
}
```



### Composable step files

`ember-cli-yadda-opinionated` uses a simple syntax for defining step implementations.

Each composable step file, e. g. `_authentication-steps.js`, should export a simple object with methods:

```js
export default {
  'Given I am logged in as a $role'(role) {
    /* ... */
  },
}
```

The name of each method is a step name pattern.

The pattern should start with `Given`, `When`, `Then` or `Define`.

The name can contain converter macros, e. g. `$role`, and regular expressions. In fact, the whole step name is used a regular expression.

Yadda adds `^` to the beginning of the regex, and `ember-cli-yadda-opinionated` also terminates it with a `$`.

Don't forget that you must use double backslashes for escaping, e. g. `(\\d+)`. Single backslashes are swallowed by the string.



### Composing steps

`ember-cli-yadda` still requires that you have one individual step file for each accepatnce test, e. g.:

    tests/acceptance/steps/login-logout-steps.js

In that file, you normally would normally have:

```js
import steps from 'ember-cli-yadda-opinionated/test-support/-private/steps';

export default function() {
  return steps()
    .given('I am logged in as a $role', function(role) {
      /* ... */
    })
}
```

Replace it with:

```js
import libraryFactory from 'ember-cli-yadda-opinionated/test-support/-private/steps';
import { composeSteps, opinonatedSteps } from 'ember-cli-yadda-opinionated/test-support';
import authenticationSteps from '<my-app>/tests/acceptance/steps/_authentication-steps';

export default composeSteps(libraryFactory, opinonatedSteps, authenticationSteps);
```

`composeSteps` accepts the Yadda step library factory (from `steps.js`) as the first argument. Other arguments are composable step files that you want to be used with this feature.

Note that `<feature>-steps.js` files no longer contain step implementations. Instead, for each feature, you compose steps from reusable composable step files.

This way you can keep your step implementations organized by topic. For each acceptance test, you can include the ones you need.

If you make your steps fully reusable and not concealing any truth (see [rationale](moving-the-truth-to-feature-files)), then you can include *all* your steps for every feature. This way, all individual `<feature>-steps.js` files for your acceptance tests will be identical.

Otherwise, composable steps behave as normal Yadda steps defined with the chained syntax `.given().when().then()`. If you return a promise from a step, the step will become async. You can also make a step async by using the `async/await` syntax.



### Implementing steps with the $opinionatedElement converter

The `$opinionatedElement` [converter](https://acuminous.gitbooks.io/yadda-user-guide/en/usage/dictionaries.html) accepts an `ember-cli-yadda-opinionated` label (see above) and returns an array of matching elements.

A step pattern `When I click $opinionatedElement` will match the following step names:

```feature
When I click Button
When I click a Button
When I click the 2nd Button in the Post-Edit-Form of the Active+Post
```

In each case, `$opinionatedElement` will resolve with a collection of matched buttons.

:warning: Note that it will always return an array, even for `a Button`. When only a single element is matched, the array will contain one element. If none are matched, the array will be empty.

The exact return value of `$opinionatedElement` is `[collection, label, selector]`. It is a tuple (an array with fixed number of elements) that contains:

* 0: `collection`: an array with matched elements.
* 1: `label`: the label used in the step name, useful for debugging.
* 2: `selector`: the selector that the label was converted to, useful for debugging.

In its simplest form, a clicking step could be implemented like this: 

```js
import {click} from `@ember/test-helpers`;

export {
  "When I click $opinionatedElement"([collection]) {
    const element = collection[0];
    return click(element);
  }
}
```

But this step will crash with a cryptic error in case the label didn't match an element. And if the element matched multiple elements, the outcome of the step may be unpredictable and hard to debug.

To resolve this issue, you should guard against it:

```js
import {click} from `@ember/test-helpers`;

export {
  "When I click $opinionatedElement"([collection, label, selector]) {
    assert(
      `Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`,
      collection.length === 1
    );

    return click(collection[0]);
  }
}
```



### Using step aliases

Sometimes it's useful to provide two different phrasings for the same step. Very often the prhasing are too different to cover them with a single regular expression.

You can resolve this by referencing one step from another like this:

```js
import {click} from `@ember/test-helpers`;

export {
  "When I click $opinionatedElement"([collection, label, selector]) {
    assert(
      `Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`,
      collection.length === 1
    );

    return click(collection[0]);
  },

  "When $opinionatedElement is clicked": "When I click $opinionatedElement"
}
```



### Mapping labels to selectors

Sometimes you want your tests to operate on page elements produced by a third-party addon or library. You don't have control over its HTML output and thus can't sprinkle it with test selectors.

To resolve the issue, you can provide a mapping of labels to selectors. Do this in `tests/acceptanse/steps/steps.js` or `tests/test-helper.js`:

```js
import { labelMap } from 'ember-cli-yadda-opinionated';

labelMap.set('Bootstrap-Text-Input', 'input.form-control[type="text"]');
labelMap.set('Bootstrap-Textarea',   'textarea.form-control');
```

These labels will be automatically converted to selectors (case-sensitive).

You should consider scoping those selectors with a library's unique HTML class, if available.



### The steps library

`ember-cli-yadda-opinionated` aims to offer an extensive and universal steps library. Steps are organized into three composable modules: given, when and then. See [Composing steps](#composing-steps) to find out how to them.



#### Given steps

`ember-cli-yadda-opinionated` provides a generic step to seed Mirage records of any type. It covers basic cases.

For advanced cases, we recommend to implement one custom seeding per each model (see below).



##### Seed record(s) with same properties/traits

It will simply pass provided properties and traits as-is to Mirage's `server.createList()`, with the following nuances:

* The model name will be camelCased.
* Property names and values are used as-is.
* If a value starts with `@`, it is treated as a relationship id. The key will be camelCased and used to look up a related record and associated with the new record. For a to-many relationship, use plural key and delimit ids with commas.
  
    This way you can populate one-to-one and one-to-many relationships (from the one side).

    Alternatively, you can use Mirage's default behavior and pass ids, e. g. `{"comment_ids": [1, 2]}`.

Signature: `Given there(?: is a|'s a| are|'re) (?:(\\d+) )?records? of type (\\w+)(?: with)?(?: traits? (.+?))?(?: and)?(?: propert(?:y|ies) ({.+?}))?`

Examples:

```feature
Given there is a record of type Post
Given there's a record of type Post
Given there is a record of type Post with property {"id": "1"}
Given there is a record of type Post with properties {"id": "1", "title": "Foo", author: "@mike"}
Given there is a record of type Post with properties {"id": "1", "title": "Foo", authors: "@mike, @bob"}
Given there are 2 records of type Post with trait published
Given there is a record of type Post with traits published, pinned and commented
Given there is a record of type Post with traits published and commented and properties {"id": "1", "title": "Foo"}
```



##### Seed records with a table

Though this step is similar to the above, it has slightly different behavior:

* The model name will be camelCased.
* Keys (column headers) and values are trimmed.
* Property names are used as-is, except for names `trait` and `traits`, which are used for traits.
* If a value starts with `@`, it is treated as a relationship id or ids. The key will be camelCased and used to look up a related record and associated with the new record. For a to-many relationship, use plural key and delimit ids with commas.
  
    This way you can populate one-to-one and one-to-many relationships (from the one side).

    Alternatively, you can use Mirage's default behavior and pass ids, e. g. `{"comment_ids": [1, 2]}`.

    If you need a non-id string that starts with `@`, wrap it with quotes.

* Empty cells are treated as `null`.

* Other values are parsed as JSON. Note that strings, numbers, booleans and `null` are JSON entries in their full right. :)

    This means that you must wrap strings in double quotes.

Signature: `Given there are records of type (\\w+) with the following properties:\n$opinionatedTable`

Examples:

```feature
Given there are records of type User with the following properties:
  ----------------------------------------
  | id     | name                  | trait |
  | "bloo" | "Blooregard Q. Kazoo" | admin |
  | "wilt" | "Wilt"                | user  |
  --------------------------------------
And there are records of type Post with the following properties:
  ---------------------------------
  | id | title           | author |
  | 1  | "Hello, World!" | @bloo  |
  | 2  | "Foo Bar Baz"   | @wilt  |
  ---------------------------------
```



#### When steps

##### Visit

Implements [`visit()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#visit) from `@ember/test-helpers`.

Signature: `When I (?:visit|am at|proceed to) URL $text`.

Examples:

```feature
When I visit URL /login
When I am at URL /products/1
When I proceed to URL /
```



##### Settled

Implements [`await settled()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#settled) from `@ember/test-helpers`.

Signature: `When the app settles`.

Example: `When the app settles`



##### Click

Implements [`click()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#click) from `@ember/test-helpers`.

Will crash if no elements or more than one element matched.

Signature: `When I click (?:on )?$opinionatedElement`.

Examples:

```feature
When I click the Submit-Button
When I click on the 2nd Menu-Item in the Navigation-Menu
```



##### Double click

Implements [`doubleClick()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#click) from `@ember/test-helpers`.

Will crash if no elements or more than one element matched.

Signature: `When I double click (?:on )?$opinionatedElement`.

Examples:

```feature
When I double click the Submit-Button
When I double click on the 2nd Menu-Item in the Navigation-Menu
```



##### Fill in

Implements [`fillIn()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillIn) from `@ember/test-helpers`.

Will crash if no elements or more than one element matched.

Signature: `When I fill \"$text\" into $opinionatedElement`.

Example: `When I fill "cheese" into the Username-Field`



##### Mouse enter

Triggers the `mouseenter` event on the element.

Will crash if no elements or more than one element matched.

Signature: `When I move the mouse pointer into $opinionatedElement`.

Example: `When I move the mouse pointer into the Edit-Button`



##### Mouse leave

Triggers the `mouseleave` event on the element.

Will crash if no elements or more than one element matched.

Signature: `When I move the mouse pointer out of $opinionatedElement`.

Example: `When I move the mouse pointer out of the Edit-Button`.



#### Then steps

##### Pause

When used without an argument, implements [`pauseTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pauseTest) from `@ember/test-helpers`.

When used with a number, waits for given number of milliseconds, then waits for [settled state](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#settled).

Useful for debugging and waiting for processess that are not respected by `settled()`. Please note that doing so makes your tests slow and brittle. Instead, you should try making `settled()` aware of pending processes.

Signature: `Then pause(?: for ?(\\d+) ms)?`

Examples:

```feature
Then pause
Then pause for 50 ms
```



##### Debugger

Implements `debugger()`. Useful for, you guessed it, debugging. :)

Signature: `Then debug(?:ger)?`

Examples:

```feature
Then debug
Then debugger
```



##### Current URL

Checks the [`currentURL()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillIn) to be an exact match of given URL.

Signature: `Then I should (?:still )?be (?:at|on) URL $text`.

Example:

```feature
Then I should be at URL /about
Then I should be on URL /products
Then I still should be at URL /products/1
Then I still should be on URL /
```



##### Element existence

Checks for exactly the specified amount of given element(s) to exist in the DOM.

If number is not provided, it defaults to `1`.

If `NO` is provided, the number is set to `0`.

Signature: `Then there should be (NO |no )?(?:(\\d+) )?$opinionatedElement`.

Example:

```feature
Then there should be an Error-Message
Then there should be 2 Posts
Then there should be NO Comments
```

Invalid usage:

```feature
Then there should be NO 2 Comments
```



##### Element visibility

Checks that exactly the specified amount of given element(s) exist in the DOM and all of them are visible.

If number is not provided, it defaults to `1`.

If `NOT` is provided, the number is set to `0`.

:warning: Uses jQuery [understanding](https://github.com/jquery/jquery/blob/3.3.1/src/css/hiddenVisibleSelectors.js#L12) of [visibility](https://api.jquery.com/visible-selector/).

Signatures:

* `Then (NO |no )?(?:(\\d+) )?$opinionatedElement should be visible`
* `Then I should see (NO |no )?(?:(\\d+) )?$opinionatedElementke`

Example:

```feature
Then an Error-Message should be visible
Then 5 Error-Messages should be visible
Then NO Error-Messages should be visible
Then I should see a Post
Then I should see 2 Posts
Then I should see NO Posts
```

Invalid usage:

```feature
Then NO 2 Error-Messages should be visible
Then I should see NO 5 Posts
```



##### Element text

Checks if given element's trimmed text is equal to the given text.

Will crash if no elements or more than one element matched.

Signature: `Then $opinionatedElement should (NOT | not )?(?:have text|say) \"$text\"`.

Example:

```feature
Then the Error-Message should have text "Something went wrong!"
Then the Error-Message should NOT have text "Something went wrong!"
Then the Title of 1st Post should say "Hello, World!"
Then the Title of 1st Post should NOT say "Hello, World!"
```



##### Element HTML class

Checks if given element has given HTML class.

Will crash if no elements or more than one element matched.

Signature: `Then $opinionatedElement should have (NOT |not )?HTML class \"$text\"`.

Example:

```feature
Then the second Menu-Item should have HTML class "active"
Then the second Menu-Item should NOT have HTML class "active"
```



##### Element HTML attr

Checks if given element has given HTML attr. Optionally checks the attr to match given value.

Will crash if no elements or more than one element matched.

Signature: `Then $opinionatedElement should (NOT |not )?have HTML attr \"$text\"(?: with value \"(.+?)\")?`.

Example:

```feature
Then the second Menu-Item should have HTML attr "href"
Then the second Menu-Item should have HTML attr "href" with value "/products"
Then the second Menu-Item should NOT have HTML attr "href"
Then the second Menu-Item should NOT have HTML attr "href" with value "/products"
```



#### ember-power-select steps

##### Items count

Checks if a `ember-power-select` contains the specified number of items.

Will crash if no elements or more than one element matched the power select.

Signature: `Then there should be (NO|no )?(?:(\\d+) )items? in the dropdown $opinionatedElement`.

Example:

```feature
Then there should be NO items in the dropdown Pet
Then there should be 1 item in the dropdown Pet
Then there should be 2 items in the dropdown Pet
```



### In integration tests

`ember-cli-yadda-opinionated` offers a number of helpers, which are equivalents of helpers from `@ember/test-helpers`:

```js
import {
  findByLabel,
  clickByLabel
} from 'ember-cli-yadda-opinionated/test-support;
```

* `findByLabel(label)` -- eqauivalent of `findAll`. Returns a tuple `[collection, label, selector]`, where `collection` is an array of found elements.
* `clickByLabel(label)` -- equivalent of `click`. Will crash if found more than one element or no elements.
* `fillInByLabel(label, text)` -- equivalent of `fillIn`. Will crash if found more than one element or no elements.



Development
------------------------------------------------------------------------------

Use Yarn.

To update the table of contents after editing the readme, run:

    npx doctoc README.md --github



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.



License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
