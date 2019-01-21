export const REGEX_STEP_NAME = /^(\S+) ([\s\S]+)$/;

export default function composeSteps(libraryFactory, ...stepDefinitions) {
  return function () {
    const library = libraryFactory();

    const mergedStepDefinitions = stepDefinitions.reduce((a, b) => ({...a, ...b}));

    Object
      .keys(mergedStepDefinitions)
      .forEach((stepName) => {
        const stepImplementation = mergedStepDefinitions[stepName];

        const [, methodNameRaw, assertionNameRaw] = stepName.match(REGEX_STEP_NAME);
        const methodName = methodNameRaw.toLowerCase();

        const decoratedCallback = function (...args) {
          let currentStepImplementation = stepImplementation;
          let i = 0;

          // Lookup by alias
          while (typeof currentStepImplementation === "string") {
            i++;

            if (i >= 256) {
              throw new Error(`Infinite loop in Yadda step aliases, step: ${stepImplementation}`);
            }

            currentStepImplementation = mergedStepDefinitions[stepImplementation];
          }

          return currentStepImplementation.call(this, ...args);
        };

        if (typeof library[methodName] !== "function") {
          throw new Error(`Yadda step name must start with given/when/then/define, was: "${stepName}"`);
        }

        // https://github.com/acuminous/yadda/issues/243#issuecomment-453115035
        const assertionName = `${assertionNameRaw}$`;

        library[methodName](assertionName, decoratedCallback);
      });

    return library;
  };
}
