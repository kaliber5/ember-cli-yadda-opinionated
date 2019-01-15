import { assert } from '@ember/debug';
import { dasherize }  from '@ember/string';

import {
  REGEX_ITEM_MATCHING,
  REGEX_SEPARATOR,
} from 'ember-cli-yadda-opinionated/test-support/-private/regex';

import { labelMap } from 'ember-cli-yadda-opinionated/test-support/-private/maps';

export default function selectorFromLabel(label) {
  return label
    .split(new RegExp(REGEX_SEPARATOR))
    .reverse()
    .map((label) => {
      const matchResult = label.match(REGEX_ITEM_MATCHING);

      assert(`selectorFromLabel failed to parse the label: "${label}"`, matchResult);

      const [,, indexOneStr, ordinal, subAttrRaw, valueRaw] = matchResult;

      let result;
      if (labelMap.has(subAttrRaw)) {
        result = labelMap.get(subAttrRaw);
      } else {
        const subAttr = dasherize(subAttrRaw);

        result =
          subAttr
            .split('+')
            .map((attr) => {
              const value = valueRaw ? `="${valueRaw}"` : '';
              return `[data-test-${attr}${value}]`;
            })
            .join('');
      }

      if (indexOneStr || ordinal) {
        const indexZero =
          ordinal === 'first'   ? 0 :
          ordinal === 'second'  ? 1 :
          ordinal === 'third'   ? 2 :
          ordinal === 'fourth'  ? 3 :
          ordinal === 'fifth'   ? 4 :
          ordinal === 'sixth'   ? 5 :
          ordinal === 'seventh' ? 6 :
          ordinal === 'eighth'  ? 7 :
          ordinal === 'ninth'   ? 8 :
          ordinal === 'tenth'   ? 9 :
                                 parseInt(indexOneStr, 10) - 1;

        result += `:eq(${indexZero})`;
      }

      return result;
    })
    .join(" ");
}
