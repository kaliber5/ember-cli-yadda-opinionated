## Debugging, investigating issues

`ember-cli-yadda-opinionated` provides handy ways to investigate problems and avoid frustration.



## Rich error messages

One big problem with Cucumber is how difficult it is to debug a problem.

Typically, you'd receive a non-meaningful error such as "Expected 1 to be 0". To make errors meaningful, a lot of effort needs to be put into carefully crafting *each* step.

`ember-cli-yadda-opinionated` *automatically* provides helpful detailed information, whenever a test crashes with an assertion error or exception:

<img src={{root-url "error.png"}} alt="Screenshot">

Here's what you get out of the box:

* The name of the step that failed.
  
* The name of the implementation that was selected for that step.

    With Cucumber, a lot of grief often comes from a wrong implementation being selected for a step. Such a situation would typically produce an irrelevant error message.

    `ember-cli-yadda-opinionated` lets you effortlessly montior which implementation has been selected for which step, including passed steps.

* The error message.

* The list of arguments passed into the step implementation.

    This lets you see whether Yadda macros have been expanded properly.

    Each label argument will be expanded to show the label itself, resulting selector and the amount of elements matched on the page.

This drastically simplifies investigating errors.



## Pausing and debugging

Additionally, the addon provides you with two simple steps: `And pause` and `And debugger`.

Both will stop the test and lets you inspect the app in its current state.

`And pause` is perfect for development ahead of the backend. Setting up Mirage and seedin any particular state you need lets you develop the frontend without waiting for the backend to implement the API.

`And debugger` lets you see what exact state the next step starts with. It is a very common problem that a certain process in the app is not waited upon, and the next step fires too early. The resulting error message will typically be unhelpful and cause frustration. Whenever you feel frustrated, put `And debugger` before the failing step and check of the app is in the correct state!
