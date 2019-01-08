

export const REGEX_ITEM_MATCHING = /^(?:(a|an|the) )?(?:(\d+)(?:st|nd|rd|th) )?([\w-]+?)(s\b|\b)?$/i;
export const REGEX_SEPARATOR = / (?:of|on|in|inside|under) /;
export const REGEX_SELECTOR_WITH_EQ = /(\[data-test-.+\])(?::eq\((\d+)\))?/;

export const STR_ITEM_NON_MATCHING = `(?:(?:a|an|the) )?(?:\\d+(?:st|nd|rd|th) )?[\\w-]+s?`;

export function generateLabelRegexString(depth = 5) {
  let result = STR_ITEM_NON_MATCHING;

  Array(depth - 1).fill(null).forEach(() => { // _.times
    result = `(?:${result}${REGEX_SEPARATOR})?${result}`;
  });

  return `(${result})`;
}

export const STR_LABEL = generateLabelRegexString();
export const REGEX_LABEL = new RegExp(STR_LABEL);
