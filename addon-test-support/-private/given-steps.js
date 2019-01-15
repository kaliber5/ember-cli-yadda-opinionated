/* global server */

import { assert }  from '@ember/debug';
import { camelize, dasherize }  from '@ember/string';
import { pluralize, singularize } from 'ember-inflector';
import { REGEX_COMMA_AND_SEPARATOR } from 'ember-cli-yadda-opinionated/test-support/-private/regex';

function findRelatedRecords(relatedTypeRaw, idOrIdsRaw, step) {
  let result;
  const relatedTypePlural = pluralize(camelize(relatedTypeRaw));
  const relatedCollection = server.schema[relatedTypePlural];
  assert(`Collection ${relatedTypePlural} does not exist in Mirage Schema, step: ${step}`, relatedCollection);

  if (relatedTypeRaw === pluralize(relatedTypeRaw)) {
    result =
      idOrIdsRaw
        .split(REGEX_COMMA_AND_SEPARATOR)
        .filter(str => str.length)
        .map(str => str.trim().slice(1))
        .map(id => {
          const relatedRecord = relatedCollection.find(id);
          assert(`Record of type ${relatedTypeRaw} with id ${id} not found in Mirage, step: ${step}`, relatedRecord);
          return relatedRecord;
        });
  } else {
    const id = idOrIdsRaw.trim().slice(1);
    result = relatedCollection.find(id);
    assert(`Record of type ${relatedTypeRaw} with id ${id} not found in Mirage, step: ${step}`, result);
  }

  return result;
}

const steps = {

  "Given there(?: is a|'s a| are|'re) (?:(\\d+) )?records? of type (\\w+)(?: with)?(?: traits? (.+?))?(?: and)?(?: propert(?:y|ies) ({.+?}))?"(countRaw = "1", typeRaw, traitsRaw = "", propertiesRaw = "{}") {
    const count = parseInt(countRaw, 10);
    const type = singularize(dasherize(typeRaw));
    const typePlural = pluralize(camelize(typeRaw));

    assert(`Collection ${typePlural} does not exist in Mirage, step: ${this.step}`, server.db[typePlural]);

    const traits = traitsRaw.split(REGEX_COMMA_AND_SEPARATOR).filter(str => str.length);
    let properties;

    try {
      properties = JSON.parse(propertiesRaw)
    } catch (e) {
      throw new Error(`Invalid properties JSON passed into step: ${this.step}`);
    }

    properties = Object.entries(properties).reduce((result, [key, value]) => {
      key = key.trim();

      if (value.trim) {
        value = value.trim()
      }

      // Ids
      if (value[0] === '@') {
        value = findRelatedRecords(key, value.trim(), this.step);
      }

      // Booleans, Arrays and Objects
      else if (/^{.+}$/.test(value) || /^\[.+]$/.test(value) || value === "true" || value === "false") {
        try {
          value = JSON.parse(value)
        } catch (e) {
          throw new Error(`Invalid JSON passed as ${key} into step: ${this.step}`);
        }
      }

      result[key] = value;
      return result;
    }, {});

    server.createList(type, count, ...traits, properties);
  },

  "Given there are records of type (\\w+) with the following properties:\n$table"(typeRaw, rows) {
    const type = dasherize(typeRaw);
    const typePlural = pluralize(camelize(typeRaw));

    assert(`Collection ${typePlural} does not exist in Mirage, step: ${this.step}`, server.db[typePlural]);
    rows.forEach(row => {
      let traits = [];

      const properties = Object.entries(row).reduce((result, [key, value]) => {
        key = key.trim();
        value = value.trim();

        // Traits
        if (key === 'trait' || key === 'traits') {
          traits = value.split(REGEX_COMMA_AND_SEPARATOR).filter(str => str.length)
        }

        // Ids
        else if (value[0] === '@') {
          value = findRelatedRecords(key, value, this.step);
        }

        // Empty cell
        else if (value.length === 0) {
          value = null;
        }

        // Numbers, Strings, Booleans, Arrays and Objects
        else {
          try {
            value = JSON.parse(value)
          } catch (e) {
            throw new Error(`Invalid JSON passed as ${key} into step: ${this.step}`);
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

};

export default steps;
