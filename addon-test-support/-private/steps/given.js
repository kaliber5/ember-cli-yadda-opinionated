/* global server */

import { REGEX_COMMA_AND_SEPARATOR } from 'ember-cli-yadda-opinionated/test-support/-private/regex';
import { overrideConfig } from 'ember-cli-yadda-opinionated/test-support/-private/config';
import { STR_STRING_WITH_ESCAPE as opinonatedString } from '../regex';



const steps = {

  [`Given there(?: is a|'s a| are|'re) (?:(\\d+) )?records? of type $opinionatedModelName(?: with)?(?: traits? ${opinonatedString})?(?: and)?(?: propert(?:y|ies) ({.+?}))?`](countRaw = "1", type, traitsRaw = "", propertiesRaw = "{}") {
    const count = parseInt(countRaw, 10);
    const traits = traitsRaw.split(REGEX_COMMA_AND_SEPARATOR).filter(str => str.length);
    let properties;

    try {
      properties = JSON.parse(propertiesRaw)
    } catch (e) {
      throw new Error(`Invalid JSON passed as "properties"`);
    }

    server.createList(type, count, ...traits, properties);
  },

  [`Given there(?: is a|'s a| are|'re) (?:(\\d+) )?records? of type $opinionatedModelName with(?: traits? ${opinonatedString})?(?: and)? the following properties:\n$opinionatedJSONObject`](countRaw = "1", type, traitsRaw = "", properties) {
    const count = parseInt(countRaw, 10);
    const traits = traitsRaw.split(REGEX_COMMA_AND_SEPARATOR).filter(str => str.length);
    server.createList(type, count, ...traits, properties);
  },

  "Given there is a record of type $opinionatedModelName with the following properties:\n$opinionatedTable"(type, rows) {
    let traits = [];

    const properties = rows.reduce((result, {key, value}) => {
      key = key.trim();
      value = value.trim();

      // Traits
      if (key === 'trait' || key === 'traits') {
        traits = value.split(REGEX_COMMA_AND_SEPARATOR).filter(str => str.length)
      }

      // Empty cell
      else if (value.length === 0) {
        value = null;
      }

      // Numbers, Strings, Booleans, Arrays and Objects
      else {
        try {
          value = JSON.parse(value);
        } catch (e) {
          throw new Error(`Invalid JSON passed as "${key}":\n${value}`);
        }
      }

      result[key] = value;
      return result;
    });

    delete properties.trait;
    delete properties.traits;

    server.create(type, ...traits, properties);
  },

  "Given there are records of type $opinionatedModelName with the following properties:\n$opinionatedTable"(type, rows) {
    rows.forEach(row => {
      let traits = [];

      const properties = Object.entries(row).reduce((result, [key, value]) => {
        key = key.trim();
        value = value.trim();

        // Traits
        if (key === 'trait' || key === 'traits') {
          traits = value.split(REGEX_COMMA_AND_SEPARATOR).filter(str => str.length)
        }

        // Empty cell
        else if (value.length === 0) {
          value = null;
        }

        // Numbers, Strings, Booleans, Arrays and Objects
        else {
          try {
            value = JSON.parse(value);
          } catch (e) {
            throw new Error(`Invalid JSON passed as "${key}"`);
          }
        }

        result[key] = value;
        return result;
      }, {});

      delete properties.trait;
      delete properties.traits;

      server.create(type, ...traits, properties);
    });
  },

  "Given server.logging"() {
    server.logging = true;
  },

  'Given there is a $opinionatedInteger error for the API $opinionatedString call to $opinionatedString'(
    status,
    methodName,
    url
  ) {
    this.server[methodName.toLowerCase()](url, { message: 'There was an error' }, status);
  },

  'Given configuration property $opinionatedString is set to $opinionatedJSON'(key, value) {
    overrideConfig(key, value);
  },

  'Given local storage key $opinionatedString is set to $opinionatedString'(key, value) {
    window.localStorage.setItem(key, value);
  },

  'Given local storage key $opinionatedString is set to the following value:\n$opinionatedText':
    'Given local storage key $opinionatedString is set to $opinionatedString',

  'Given local storage key $opinionatedString does not exist'(key) {
    window.localStorage.removeItem(key);
  },

  'Given local storage is empty'() {
    window.localStorage.clear();
  },

};

export default steps;
