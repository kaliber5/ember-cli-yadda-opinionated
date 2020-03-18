## Implementing custom steps

It is recommended that you rely on steps provided by this addon as much as possible.

However, sooner or later you're face a necessity to implement custom steps.

This addon lets you organize your steps grouped into files by function, rather than by feature where they're gonna be used. This is convenient because a step can be used in more than one feature.

1. Think about a good name for your set of steps.

    Good examples:

    * authentication steps
    * local storage steps
    * table sorting steps (sortable table can be used on various pages)
    * URL steps
    * blog steps (if dealing with a complex blog component with unique behavior)

    Bad examples:

    * my steps
    * custom steps
    * blog steps (if containing simple steps that are unnecessarily coupled to the blog feature)

2. Start a custom steps file:

        tests/acceptance/steps/_<steps collection name>.js

3. Export a plain object that contains methods representing steps:

    ```js
    export default {
      'Given foo bar baz'() {
      },
    }
    ```

4. Use this.owner.lookup to access services

    ```js
        const session = this.owner.lookup('service:session');
    ```

5. Return a promise for the test to wait for something

    ```js
      'Given I am authenticated'() {
        const session = this.owner.lookup('service:session');
        return session.authenticate('foo');
      },
    ```

   Or make the step asynchronous

  ```js
      async 'Given I am authenticated'() {
        const session = this.owner.lookup('service:session');
        await session.authenticate('foo');
      },
  ```

6. Make assertions

    You can use `chai` to make assertions:

    ```js
    import { expect } from 'chai';

    export default {
      'Then I should be authenticated'() {
        const session = this.owner.lookup('service:session');
        expect(session.isAuthenticated).to.be.true;
      },
    }
    ```

    or simply throw an error:

    ```js
    import { expect } from 'chai';

    export default {
      'Then I should be authenticated'() {
        const session = this.owner.lookup('service:session');
        
        if (!session.isAuthenticated) {
          throw new Error('Expected to be authenticated');
        }
      },
    }
    ```

    Either way, `ember-cli-yadda-opinionated` will automatically take care of <LinkTo @route="docs.debugging">forming a helpul assertion error message</LinkTo>.

7. Accept arguments with regexp capturing groups

    ```js
    'Then I should be authenticated as (.+)'(role) {
      const session = this.owner.lookup('service:session');
      return session.authenticate(role);
    },
    ```


7. Use macros (aka converters)

    ```js
    /* global server */
    import { expect } from 'chai';

    'Then record of type $recordNamePlural and id (.+?) should have the following body:\n$text'(recordNamePlural, id, expectedBody) {
      const actualBody = server[recordNamePlural].find(id).body;
  
      expect(actualBody).to.equal(expectedBody);
    },
    ```

    Note: we recommend that you only use macros/converters that you have [defined](https://acuminous.gitbooks.io/yadda-user-guide/en/usage/dictionaries.html#converters).

    To capture unconverted text, use `(.+)` or `(.+?)` capturing groups.


8. <LinkTo @route="docs.opinionated-element">Accept opinonated labels as an argument</LinkTo>
