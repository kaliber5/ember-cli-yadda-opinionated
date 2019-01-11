/* global server */

import { assert }  from '@ember/debug';
import { camelize }  from '@ember/string';
import { pluralize } from 'ember-inflector';

export const labelMap = new Map();

export const transformsMap = new Map(Object.entries({
  string(value) {
    return value;
  },

  boolean(value) {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    }

    assert(`Expected value to be "true" or "false", was ${value}`, false);
  },

  number(value) {
    return parseInt(value, 10);
  },

  record(value, { mirageKey, recordKey = "id" }, key) {
    if (!mirageKey) {
      mirageKey = key;
    }

    const mirageKeyFinal = camelize(pluralize(mirageKey));
    const collection = server.db[mirageKeyFinal];
    assert(`Mirage collection: ${mirageKeyFinal} not found${mirageKey === mirageKeyFinal ? "" : ` (inferred from ${mirageKey})`}`, collection);

    const [record] = collection.where({ [recordKey]: value });
    assert(`Record of type: ${mirageKey} and ${recordKey}: ${value} not found`, record);
    return record;
  },
}));
