/* eslint-disable no-control-regex */
import yadda from 'yadda';
import { element, json, modelName, string } from 'ember-cli-yadda-opinionated/test-support/-private/converters';
import { REGEX_LABEL, REGEX_STRING_WITH_ESCAPE } from 'ember-cli-yadda-opinionated/test-support/-private/regex';

export default function setupDictionary(dictionary) {
  return dictionary
    .define('opinionatedInteger', /(\d+)/, yadda.converters.integer)
    .define('opinionatedText', /([^\u0000]*)/)
    .define('opinionatedTable', /(\|[^\u0000]*\|)/, yadda.converters.table) // eslint-disable-line no-control-regex
    .define('opinionatedElement', REGEX_LABEL, element)
    .define('opinionatedJSON', /([^\u0000]*)/, json)
    .define('opinionatedJSONObject', /({[^\u0000]*})/, json)
    .define('opinionatedModelName', /"([\w-]+)"/, modelName)

    // Allows escaping double qoutes: `"foo \\"bar\\" baz"`.
    .define('opinionatedString', REGEX_STRING_WITH_ESCAPE, string)
    ;
}
