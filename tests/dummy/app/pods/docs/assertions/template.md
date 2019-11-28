# Making assertions

Steps use Mocha-style assertions.

If no error has been thrown, the step is assumed to be successful. If your app is using QUnit, a successful assertion will be logged with the step name.

When an error is thrown, its message will be used as an assertion error.

This enables using assertion libraries like [Chai](https://www.chaijs.com/).

Assertion/error messages are enriched with additional details:
  * 👟 Step name
  * ⚙ The name of the step implementation used (useful to make sure Yadda picked the correct implementation)
  * ⚠ Assertion or error message thrown
  * 🛠 List of arguments passed into the step
