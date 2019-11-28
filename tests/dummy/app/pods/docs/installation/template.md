# Installation

1. Make sure you have `ember-cli-yadda` installed.

2. Install the addon and its dependencies:

    ```
    ember install ember-cli-yadda-opinionated
    ember install ember-cli-chai
    yarn add -D chai-dom                       # or: npm install -D chai-dom
    ```

3. Add test hooks.

    In your app's `tests/helpers/yadda-annotations.js` file, import the setup helper:

    ```js
    import { setupYaddaOpinionated } from 'ember-cli-yadda-opinionated/test-support';
    ```

    Find this fragment:

    ```js
    if (annotations.setupapplicationtest) {
      return setupApplicationTest;
    }
    ```

    And replace it with this:

    ```js
    if (annotations.setupapplicationtest) {
      return function() {
        const hooks = setupApplicationTest();
        setupYaddaOpinionated(hooks);
      };
    }
    ```

4. Set up steps.

    If you're only using opinionated steps in your test suite (recommended), <LinkTo @route="docs.setup-steps-clean">setup is drastically simpler</LinkTo>.

    If you have to combine the opinionated approach with the conventional one imposed by `ember-cli-yadda`, <LinkTo @route="docs.setup-steps-mixed">setup is a more elablorate</LinkTo>.
