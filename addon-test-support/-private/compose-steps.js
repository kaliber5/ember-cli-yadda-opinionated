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



function makeBetterError({error, step, matchedStep, args}) {
  const stack = error.stack.slice(error.message.length + error.constructor.name.length + 2);
  let message = `${error.message}\n  Step: ${step}\n  Matched step: ${matchedStep}\n  Args:\n`;

  args.forEach((arg, i) => {
    const argMessage =
      arg && arg.__isLabelTuple__
        ? `Collection. Length: ${arg[0].length}, Label: ${arg[1]}, Selector: ${arg[2]}`
        : arg;

    message += `    ${i}: ${argMessage}\n`;
  });

  const newError = new Error(message);
  newError.stack = `${message}${stack}`;

  return newError;
}



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

        const decoratedCallback = async function (...args) {
          let result;

          try {
            const currentStepImplementation = lookupStepByAlias(mergedStepDefinitions, stepImplementation);
            result = await currentStepImplementation.call(this, ...args);
          } catch (error) {
            throw makeBetterError({error, step: this.step, matchedStep: stepName, args});
          }

          return result;
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
