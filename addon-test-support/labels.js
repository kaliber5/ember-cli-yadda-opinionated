import { assert } from '@ember/debug';
import { dasherize }  from '@ember/string';
import { find, findAll } from "@ember/test-helpers";

const REGEX_ITEM = /^(?:(?:(a|an|the) )|(\d+)(?:(?:st|nd|rd|th)) )?([\w-]+)s?$/i;
const REGEX_SEPARATOR = / (?:of|on|in|inside|under) /;
const REGEX_SELECTOR_WITH_EQ = /(\[data-test-.+\])(?::eq\((\d+)\))?/;

export function selectorFromLabel(label) {
  return label
    .split(new RegExp(REGEX_SEPARATOR))
    .reverse()
    .map((label) => {
      const matchResult = label.match(REGEX_ITEM);

      assert(`selectorFromLabel failed to parse the label: "${label}"`, matchResult);

      const [, article, indexOneStr, subLabel] = matchResult;
      const subAttr = dasherize(subLabel);
      let result = `[data-test-${subAttr}]`;

      const indexZero =
        article     ? 0                               :
        indexOneStr ? (parseInt(indexOneStr, 10) - 1) :
        null;

      if (indexZero != null) {
        result += `:eq(${indexZero})`;
      }

      return result;
    })
    .join(" ");
}

export function findByLabel(label) {
  const selectorCompound = selectorFromLabel(label);
  const selectorsMaybeWithEq = selectorCompound.split(/\s+/);

  return selectorsMaybeWithEq.reduce((parent, selectorMaybeWithEq) => {
    return findElement(parent, selectorMaybeWithEq);
  }, null);
}

export function findElement(parentOrParents, selectorMaybeWithEq) {
  const [selector, index] = _parseSelectorMaybeWithEq(selectorMaybeWithEq);

  if (Array.isArray(parentOrParents)) {
    const collection = parentOrParents
      .map(parent => _findElement(parent, selector))
      .reduce((a, b) => a.concat(b), []) // flatten
      .filter((a) => a); // compact

    return index == null
      ? collection
      : (collection[index] || null);
  } else {
    return _findElement(parentOrParents, selector, index);
  }
}

export function _parseSelectorMaybeWithEq(selectorMaybeWithEq) {
  const matchResult = selectorMaybeWithEq.match(REGEX_SELECTOR_WITH_EQ);
  assert(`findByLabel failed to parse a selector: "${selectorMaybeWithEq}"`, matchResult);
  const [, selector, indexRaw] = matchResult;
  const index = indexRaw && parseInt(indexRaw, 10);
  return [selector, index];
}

export function _findElement(parent, selector, index) {
  const collection =
    parent
      ? parent.querySelectorAll(selector)
      : findAll(selector);

  return index == null
    ? [...collection] // cast NodeList to Array
    : (collection[index] || null);
}
