import { assert } from '@ember/debug';
import { dasherize }  from '@ember/string';

import {
  REGEX_ITEM_MATCHING,
  REGEX_SEPARATOR,
} from 'ember-cli-yadda-opinionated/test-support/-private/regex';

import { getLabel, hasLabel } from 'ember-cli-yadda-opinionated/test-support/-private/label-map';
import { getIndexZero } from 'ember-cli-yadda-opinionated/test-support/-private/helpers';

export default function selectorFromLabel(label) {
  return label
    .split(new RegExp(REGEX_SEPARATOR))
    .reverse()
    .map((label) => {
      const matchResult = label.match(REGEX_ITEM_MATCHING);

      assert(`selectorFromLabel failed to parse the label: "${label}"`, matchResult);

      const [,, indexOneStr, ordinal, subAttrRaw, valueRaw] = matchResult;

      let result;
      if (hasLabel(subAttrRaw)) {
        result = getLabel(subAttrRaw);
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

      const indexZero = getIndexZero(ordinal, indexOneStr);

      if (indexZero !== undefined) {
        result += `:eq(${indexZero})`;
      }

      return result;
    })
    .join(" ");
}
