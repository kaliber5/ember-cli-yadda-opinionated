import { assert } from '@ember/debug';
import { dasherize }  from '@ember/string';

import {
  REGEX_ITEM_MATCHING,
  REGEX_SEPARATOR,
} from 'ember-cli-yadda-opinionated/test-support/regex';

import { labelMap } from 'ember-cli-yadda-opinionated/test-support/maps';

export default function selectorFromLabel(label) {
  return label
    .split(new RegExp(REGEX_SEPARATOR))
    .reverse()
    .map((label) => {
      const matchResult = label.match(REGEX_ITEM_MATCHING);

      assert(`selectorFromLabel failed to parse the label: "${label}"`, matchResult);

      const [,, indexOneStr, subAttrRaw, valueRaw] = matchResult;

      let result;
      if (labelMap.has(subAttrRaw)) {
        result = labelMap.get(subAttrRaw);
      } else {
        const subAttr = dasherize(subAttrRaw);
        const value = valueRaw ? `="${valueRaw}"` : '';
        result = `[data-test-${subAttr}${value}]`;
      }

      if (indexOneStr) {
        const indexZero = parseInt(indexOneStr, 10) - 1;
        result += `:eq(${indexZero})`;
      }

      return result;
    })
    .join(" ");
}
