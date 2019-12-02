# Why Cucumber

Cucumber is a famous BDD implementation that gives exciting promises.



## Acceptance tests in form of <em>user stories</em> offer a lot of benefits:

* provide <em>guarantees</em>
* and thus, they have business value
* integrate into the BDD cycle in a broader sense
* thread through all the feature life, from conception to deployment
* involve all team members: not only developers, but also managers, designers, product owners, customer representatives



## Extensive user story coverage can be very helpful:

* reveals true size of features
* allows for more realistic estimations
* serves as a technical design specification
* is written in a human-readable language, understandable to non-developers
* serves as <em>the</em> source of truth for resolving disagreements
* simplifies progress tracking
* focuses on user needs, [rather than developer needs](https://www.goodreads.com/book/show/44098.The_Inmates_Are_Running_the_Asylum)
* encourages creating numerous minimal test cases, as opposing to huge cases that attempt to test everything in one go
* integrates well into automated testing



# Cucumber's problems — solved

Though Cucumber has a large army of faithful fans, it has an equally large amount of haters. Lots of developers have tried Cucumber and found that it caused more trouble than it solved.

Many, including me, have started as avid Cucumber enthusiasts and got severely disappointed, or got their teammates on — or over — the fence.

I'm convinced that it's not Cucumber to blame, it's the misuse that causes grief. In much the same way, it would be ridiculous to advocate against using knives in the kitchen because you have cut your finger. 😏

I have identified a number of issues with how Cucumber is typically used and, I believe, successfully solved them. The resulting approach is quite radical and quite effective. Read on!

-- [Andrey Mikhaylov @lolmaus](https://github.com/lolmaus)



# Glossary


## BDD, in a narrow sense

An approach to coding which adds a second loop to the TDD cycle: you are supposed to write an acceptance test before writing a unit test. Also, a different style of writing assertions: `expect` or `should` instead of `assert`.



## BDD, in a broad sense


A methodology of software development, which involves all the team, not only developers. When a feature is conceived, it is captured in form of human-readable user stories. These user stories serve as a spec and are used to guide and validate development from planning to deployment.


## Cucumber

Initially, an automated testing library designed for BDD in Ruby. Today, an industry standard approach to BDD, popular in almost every programming language.

[https://cucumber.io/](https://cucumber.io/)



## Yadda

A JS library which implements the Cucumber approach for Node and browsers. It's an alternative to Cucumber.js and others.

[https://github.com/acuminous/yadda](https://github.com/acuminous/yadda)



## ember-cli-yadda

An Ember addon that adds Yadda into Ember apps. Includes necessary boilerplate and pairings with QUnit and Mocha.

[https://github.com/albertjan/ember-cli-yadda](https://github.com/albertjan/ember-cli-yadda)



## ember-cli-yadda-opinionated

This addon.

⚠ To use this addon, you should be familiar `ember-cli-yadda` in order to avoid frustration.



# What ember-cli-yadda-opinionated includes

1. An opinionated pattern for desigining Cucumber steps.
2. A pattern for declaring Yadda step implementations.
3. A set of tools making working with Yadda and `ember-cli-yadda` easier.
4. A library of reusable step implementations.
5. A set of tools making it easier to implement custom steps.
