# Moving the truth to feature files

## The problem

One major reason for getting disappointed in Cucumber is **the burden of maintaining a huge library of step implementations**:

* In a mature project, there are hundreds, sometimes thousands of steps. As the step library grows, it becomes virtually impossible to remember all the steps and use them efficiently.
* As a consequence, duplicate steps get introduced.
* At a certain point, some steps may be no longer used and become dead code.
* There is no simple, automated way to look up a step implementation for a given step name. As far as we know, no IDE and no Cucumber implementation has a tool for this. (If you know a such tool for Yadda, please [start an issue in this repo](https://github.com/kaliber5/ember-cli-yadda-opinionated/issues/new) and share.)
* Many step implementations are repetitous: they do essentially the same thing with slight variations. There is a lot of code duplication.
* As you write new tests, you have to implement more and more steps, which makes writing tests very slow.
* Step implementations obscure the truth. Step names in feature files essentially behave as references to step implementations. There is no guarantee that a step implementation will do what its name suggests. This may result in false positives.
* The problem of obscured truth is especially tough with seeding steps. Many acceptance tests require very elaborate setups, which are impossible to express with a single phrase.
* Seeding with a sequence of steps is an option, but a typical problem here is that such steps implicitly depend on each other's internal implementation, not exposed in feature files: cross-references with ids, amount of child records, values of attributes — are all implied.
* Assertion steps then expect certain amounts and attribute values, even though they are not obvious from the feature file, e. g.:

    ```feature
    Given 5 posts with comments
    Then the author of 3rd comment under 2nd post should be Alice
    ```

    It is impossible to validate (ensure correctness of) this feature file by reading it. You have to look into actual step implementations.

    Even though this code sample may seem exagerrated or even ridiculous, every developer who dared to convert an acceptance test suite of a large project to Cucumber surely stumbled over this problem.
* Regular expressions overlap, causing irrelevant implementations being selected for steps. The more steps you have, the more severe this problem is.



## The solution

We believe we know a radical solution to all of these problems: *do not* obscure any truth in step implementations. Instead, expose *all* truth in feature files.

There are only so much types of actions a user can do on the page:

* see something,
* click something,
* type text into something
* etc

Overall, this amounts to maybe a couple dozen of common action types, plus a few dozen of less common (but still fully reusable) ones, such as selecting items in a multi-select dropdown.

So instead of implementing a non-reusable step like this:

```feature
Then the save button should be disabled
```

we suggest that you have a reusable step like this:

```feature
Then [element] should [not ]have HTML attribute "[attr]"
```

This would allow you writing steps like:

```
Then the Save-Button should have HTML attribute `aria-disabled`
And the About-Link should not have HTML attribute `target`
```

A similar thing can be done with seeding. Instead of doing:

```feature
Given 5 posts with comments
```

...be explicit:

```
Given the following User records:
  --------------------------------------------
  | id        | name               | role    |
  | "frankie" | "Frankie Foster"   | "admin" |
  | "cheese'  | "Cheese"           | "user"  |
  --------------------------------------------

And the following Post records:
  ------------------------------------------------------
  | id | body            | slug            | authorId  |
  | 1  | "I'm 22!"       | "my-age"        | "frankie" |
  | 2  | "I like cereal" | "i-like-cereal" | "cheese"  |
  ------------------------------------------------------

And the following Comment records:
  ---------------------------------------------------------------
  | id | postId | author    | body                              |
  | 1  | 1      | "cheese"  | "I like chocolate milk"           |
  | 2  | 2      | "frankie" | "YOU DON'T LIVE HERE! GO HOOOME!" |
  | 3  | 2      | "cheese"  | "Television tastes funny"         |
  ---------------------------------------------------------------
```

Now the feature file is explicit about what's going on in the database. The feature is unambiguous!

Though it comes with a great deal of verbosity, it exposes all dependencies between records and no longer conceals implementation.

This addon provides step implementations and tools to streamline these steps. The latter feature sample is served by a *single* step implementation!

Note that steps don't need to rely on context (`this.ctx`), since records can cross-reference each other with ids and types.



## Pros and cons of this approach

Let's start with **cons**.

The suggested approach:

* Makes feature files more explicit and more technical.
* As a result, features become somewhat harder to read, especially for non-developers.

This is an inevitable price you have to pay for the compromise. The other side of the coin.

Is it worth it?

By paying this price, you get the following **pros**:

* A compact library of fully reusable steps:
    * Easy to learn.
    * Easy to navigate thanks to documentation available here.
    * Little to no maintenance.
    * You no longer need to have a steps file for each acceptance test. Why bother, when all steps are fully reusable across all acceptance tests?
    * The amount of regexp collisions between steps is reduced drastically.
* As you're making new tests:
    * You don't need to code step implementations.
    * Writing new tests is fast and enjoyable.
    * You can expand existing features with more cases by simply copying the first case and adjusting the options. Not that you weren't able to do this before, but now it's even easier.
* The truth is no longer hidden inside the black box of step implementations:
    * It is now possible to reliable validate features: by reading them, ensure they are making correct assertions in correct connditions.
    * No false positives caused by black-boxed logic.
    * Steps can cross-reference records with ids. As a result, they no longer need to rely on context (`this.ctx`), making the implementation less tangled.
