/* global require */

export const REGEX_STEP_NAME = /^(\S+) ([\s\S]+)$/;

function lookupStepByAlias(mergedStepDefinitions, stepImplementation) {
  let currentStepImplementation = stepImplementation;
  let i = 0;

  // Lookup by alias
  while (typeof currentStepImplementation === "string") {
    i++;

    if (i >= 256) {
      throw new Error(`Infinite loop in Yadda step aliases`);
    }

    if (!mergedStepDefinitions[stepImplementation]) {
      throw new Error(`Yadda step references a non-existing step.\nAlias: ${stepImplementation}`);
    }

    currentStepImplementation = mergedStepDefinitions[stepImplementation];
  }

  return currentStepImplementation;
}



function makeBetterMessage({message, stepName, stepImplName, args}) {
  message = `\n👟 ${stepName}\n⚙ ${stepImplName}\n⚠ ${message}\n\n🛠Arguments:`;

  args.forEach((arg, i) => {
    const argMessage =
      arg && arg.__isLabelTuple__
        ? `Collection. Length: ${arg[0].length}, Label: ${arg[1]}, Selector: ${arg[2]}`
        : arg;

    message += `\n    ${i}: ${argMessage}`;
  });

  return message;
}



function makeBetterError({error, stepName, stepImplName, args, message = makeBetterMessage({message: error.message, stepName, stepImplName, args})}) {
  const stack = error.stack.slice(error.message.length + error.constructor.name.length + 2);
  const newError = new Error(message);

  newError.stack = `${message}\n\n${stack}`;

  return newError;
}



async function runAndLogOrThrow({ assert, callback, stepName, stepImplName, args }) {
    let result;
    let isSuccessful = true;

    try {
      result = await callback();
    } catch (error) {
      const betterError = makeBetterError({error, stepName, stepImplName, args});

      /* QUnit */
      if (require.has('qunit')) {

        // No Try/Catch
        const QUnit = require('qunit').default;
        if (QUnit.config.notrycatch) {
          throw betterError;
        }

        // Normal
        assert.pushResult({result: false, message: betterError.message});
        isSuccessful = false;

        // Stop scenario execution without spamming into the report output
        throw new Error("Terminating further scenario execution after a previous error");
      }

      /* Mocha and everything else*/
      else {
        throw betterError
      }
    }

    // Log successful step to QUnit
    if (isSuccessful && assert && assert.pushResult) {
      // eslint-disable-next-line no-irregular-whitespace
      assert.pushResult({result: true, message: `👟 ${stepName}\n  ⚙ ${stepImplName}`});
    }

    return result;
}



export default function composeSteps(libraryFactory, ...stepDefinitions) {
  return function (assert) {
    const library = libraryFactory();

    const mergedStepDefinitions = stepDefinitions.reduce((a, b) => ({...a, ...b}));

    Object
      .keys(mergedStepDefinitions)
      .forEach((stepImplName) => {
        const stepImplementation = mergedStepDefinitions[stepImplName];

        const [, methodNameRaw, assertionNameRaw] = stepImplName.match(REGEX_STEP_NAME);
        const methodName = methodNameRaw.toLowerCase();

        async function decoratedCallback (...args) {
          const currentStepImplementation = lookupStepByAlias(mergedStepDefinitions, stepImplementation);

          return runAndLogOrThrow({
            assert,
            callback: () => currentStepImplementation.call(this, ...args),
            stepName: this.step,
            stepImplName,
            args,
          });
        }

        if (typeof library[methodName] !== "function") {
          throw new Error(`Yadda step name must start with given/when/then/define, was: "${stepImplName}"`);
        }

        // https://github.com/acuminous/yadda/issues/243#issuecomment-453115035
        const assertionName = `${assertionNameRaw}$`;

        library[methodName](assertionName, decoratedCallback);
      });

    return library;
  };
}
