import { findByLabel } from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';

export function element(label, next) {
  const collectionOrElement = findByLabel(label);

  next(null, collectionOrElement);
}

export function json(jsonString, next) {
  const result = JSON.parse(jsonString);

  next(null, result);
}
