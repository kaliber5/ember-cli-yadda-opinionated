export const REGEX_STEP_NAME = /^(\S+) ([\s\S]+)$/;

export default function composeSteps(libraryFactory, ...stepDefinitions) {
  return function () {
    const library = libraryFactory();

    stepDefinitions.forEach((stepDefinition) => {
      Object
        .keys(stepDefinition)
        .forEach((stepName) => {
          const stepImplementation = stepDefinition[stepName];

          const [, methodNameRaw, assertionName] = stepName.match(REGEX_STEP_NAME);
          const methodName = methodNameRaw.toLowerCase();

          const decoratedCallback = function (...args) {
            return stepImplementation.call(this, ...args);
          };

          if (typeof library[methodName] !== "function") {
            throw new Error(`Yadda step name must start with given/when/then, was: "${stepName}"`);
          }

          console.log(assertionName)

          library[methodName](assertionName, decoratedCallback);
        });
    });

    console.log('library', library)

    return library;
  };
}
