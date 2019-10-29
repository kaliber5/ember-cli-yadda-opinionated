import config from 'ember-get-config';
import { get, set } from '@ember/object';

export const overriddenConfigProps = {}

export function overrideConfig(key, value) {
  overriddenConfigProps[key] = get(config, key);
  set(config, key, value);
}

export function restoreOriginalConfig() {
  Object.getOwnPropertyNames(overriddenConfigProps).forEach((key) => {
    set(config, key, overriddenConfigProps[key]);
    delete overriddenConfigProps[key];
  });
}
