/* global server */

import { findByLabel } from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';
import { assert }  from '@ember/debug';
import { camelize, dasherize }  from '@ember/string';
import { pluralize, singularize } from 'ember-inflector';

export function element(label, next) {
  const collectionOrElement = findByLabel(label);

  next(null, collectionOrElement);
}

export function json(jsonString, next) {
  let result;

  try {
    result = JSON.parse(jsonString)
  } catch (e) {
    throw new Error(`Invalid JSON:\n${jsonString}`);
  }

  next(null, result);
}

export function string(unescapedString, next) {
  next(null, unescapedString.replace(/\\"/g, "\""));
}

export function modelName(modelNameRaw, next) {
  const modelName = singularize(dasherize(modelNameRaw));
  const modelNamePlural = pluralize(camelize(modelNameRaw));

  assert(`Collection ${modelNamePlural} does not exist in Mirage`, server.db[modelNamePlural]);

  next(null, modelName);
}
