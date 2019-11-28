# What this addon is

Let's start with some glossary.



#### BDD, in a narrow sense

An approach to coding which adds a second loop to the TDD cycle: you are supposed to write an acceptance test before writing a unit test. Also, a different style of writing assertions: `expect` or `should` instead of `assert`.



#### BDD, in a broad sense


A methodology of software devleopment, which involves all the team, not only developers. When a feature is conceieved, it is specced out in form of human-readable user stories. These user stories serve as a spec and are used to guide and validate development from planning to deployment.



#### Cucumber

Initially, an automated testing library designed for BDD in Ruby. Today, an industry standard approach to BDD, popular in almost every programming language.

https://cucumber.io/



#### Yadda

A JS library which implements the Cucumber approach for Node and browsers. It's an alternative to Cucumber.js and others.

https://github.com/acuminous/yadda



#### ember-cli-yadda

An Ember addon that adds Yadda into Ember apps. Includes necessary boilerplate and pairings with QUnit and Mocha.

https://github.com/albertjan/ember-cli-yadda



#### ember-cli-yadda-opinionated

This addon.

⚠ To use this addon, you should be familiar `ember-cli-yadda` in order to avoid frustration.



## What ember-cli-yadda-opinionated includes

1. An opinionated pattern for desigining Cucumber steps.
2. A pattern for declaring Yadda step implementations.
3. A set of tools making working with Yadda and `ember-cli-yadda` easier.
4. A library of reusable step implementations.
5. A set of tools making it easier to implement custom steps.



## Project structure

* `tests/helpers/yadda-annotations.js`

    This file is created by `ember-cli-yadda`.
    
    This is where you hook into `beforeEach` and `afterEach`. Here you can also define custom Yadda [annotations](https://acuminous.gitbooks.io/yadda-user-guide/en/feature-specs/annotations.html).

* `tests/acceptance/steps/steps.js`

    This file is created by `ember-cli-yadda`.

    They entry point for step definitions. If you're not planning to mix the opinionated approach with Yadda's conventional approach, then you should <LinkTo @route="docs.setup-steps-clean">replace</LinkTo> this file with the opinonated variant (recommended).

    This also where you declare macros (aka [converters](https://acuminous.gitbooks.io/yadda-user-guide/en/usage/dictionaries.html#converters)) and <LinkTo @route="docs.labels">custom labels</LinkTo>.

* `tests/acceptance/<feature-name>.feature`

    This file is created from the `feature` blueprint.

    Each of this file represents a single acceptance test module, which should include one or more Cucumber scenarios.

    Written in the Cucumber language (aka Gherkin syntax).

* `tests/acceptance/steps/<feature-name>-steps.js`

    This file is created from the `feature` blueprint.

    `ember-cli-yadda` requires such a file to exist for every feature file you have.

    In this file, you are supposed to include steps that you're going to use in the corresponding feature.

    If you're not planning to mix the opinionated approach with Yadda's conventional approach, then you don't actually need this file, because all the steps are included in the main `steps.js` file. Unfortunately, `ember-cli-yadda` would crash without these files, so you need to replace their content with the following: `export { default } from './steps';`.

* `tests/acceptance/steps/_<steps-collection-name>.js`

    This is a suggested place to put your custom opinionated step implementations, e. g.:
    
    ```
    tests/acceptances/steps/_authentication.js
    tests/acceptances/steps/_local-storage_.js
    ```

    You need to import them into your steps library:
      * If you're using the clean opinionated approach (recommended), import custom steps into the main `steps.js`. <LinkTo @route="docs.setup-steps-clean">Read more</LinkTo>
      * If you're mixing opinionated and conventional approaches, import custom steps into individual `<feature-name>-steps.js` files. <LinkTo @route="docs.setup-steps-mixed">Read more</LinkTo>
