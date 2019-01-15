import yadda from 'yadda';
import { element } from 'ember-cli-yadda-opinionated/test-support/-private/converters';
import { REGEX_LABEL } from 'ember-cli-yadda-opinionated/test-support/-private/regex';

export default function setupDictionary(dictionary) {
  return dictionary
    .define('opinionatedTable', /([^\u0000]*)/, yadda.converters.table) // eslint-disable-line no-control-regex
    .define('opinionatedElement', REGEX_LABEL, element)
}
