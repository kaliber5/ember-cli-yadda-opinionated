/* eslint-disable no-control-regex */
import yadda from 'yadda';
import { element, json } from 'ember-cli-yadda-opinionated/test-support/-private/converters';
import { REGEX_LABEL } from 'ember-cli-yadda-opinionated/test-support/-private/regex';

export default function setupDictionary(dictionary) {
  return dictionary
    .define('opinionatedInteger', /(\d+)/, yadda.converters.integer)
    .define('opinionatedText', /([^\u0000]*)/)
    .define('opinionatedTable', /([^\u0000]*)/, yadda.converters.table) // eslint-disable-line no-control-regex
    .define('opinionatedElement', REGEX_LABEL, element)
    .define('opinionatedJSON', REGEX_LABEL, json)

    // Allows escaping double qoutes: `"foo \\"bar\\" baz"`.
    .define('opinionatedString', /"((?:[^"\\]|\\.)*)"/, (unescapedString, next) => {
      next(null, unescapedString.replace(/\\"/g, "\""));
    })
    ;
}
