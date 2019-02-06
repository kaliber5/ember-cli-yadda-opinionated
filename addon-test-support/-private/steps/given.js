/* global server */

import { assert }  from '@ember/debug';
import { camelize, dasherize }  from '@ember/string';
import { pluralize, singularize } from 'ember-inflector';
import { REGEX_COMMA_AND_SEPARATOR } from 'ember-cli-yadda-opinionated/test-support/-private/regex';
import HasMany from 'ember-cli-mirage/orm/associations/has-many';

function findRelationship(type, relationshipName) {
  const Model = server.schema.modelClassFor(type);
  return Model.associationFor(relationshipName);
}

function findRelatedRecords(type, relationshipName, idOrIdsRaw) {
  let result;
  const relationship = findRelationship(type, relationshipName);
  const relatedType = relationship.modelName;
  const relatedTypePlural = pluralize(camelize(relatedType));
  const relatedCollection = server.schema[relatedTypePlural];
  assert(`Collection ${relatedTypePlural} does not exist in Mirage Schema`, relatedCollection);

  if (relationship instanceof HasMany) {
    result =
      idOrIdsRaw
        .split(REGEX_COMMA_AND_SEPARATOR)
        .filter(str => str.length)
        .map(str => str.trim().slice(1))
        .map(id => {
          const relatedRecord = relatedCollection.find(id);
          assert(`Record of type ${relatedType} with id ${id} not found in Mirage Schema`, relatedRecord);
          return relatedRecord;
        });
  } else {
    const id = idOrIdsRaw.trim().slice(1);
    result = relatedCollection.find(id);
    assert(`Record of type ${relatedType} with id ${id} not found in Mirage Schema`, result);
  }

  return result;
}

const steps = {

  "Given there(?: is a|'s a| are|'re) (?:(\\d+) )?records? of type (\\w+)(?: with)?(?: traits? (.+?))?(?: and)?(?: propert(?:y|ies) ({.+?}))?"(countRaw = "1", typeRaw, traitsRaw = "", propertiesRaw = "{}") {
    const count = parseInt(countRaw, 10);
    const type = singularize(dasherize(typeRaw));
    const typePlural = pluralize(camelize(typeRaw));

    assert(`Collection ${typePlural} does not exist in Mirage`, server.db[typePlural]);

    const traits = traitsRaw.split(REGEX_COMMA_AND_SEPARATOR).filter(str => str.length);
    let properties;

    try {
      properties = JSON.parse(propertiesRaw)
    } catch (e) {
      throw new Error(`Invalid JSON passed as "properties"`);
    }

    properties = Object.entries(properties).reduce((result, [key, value]) => {
      key = key.trim();

      if (value.trim) {
        value = value.trim()
      }

      // Ids
      if (value[0] === '@') {
        value = findRelatedRecords(type, key, value.trim());
      }

      // Booleans, Arrays and Objects
      else if (/^{.+}$/.test(value) || /^\[.+]$/.test(value) || value === "true" || value === "false") {
        try {
          value = JSON.parse(value)
        } catch (e) {
          throw new Error(`Invalid JSON passed as "${key}"`);
        }
      }

      result[key] = value;
      return result;
    }, {});

    server.createList(type, count, ...traits, properties);
  },

  "Given there are records of type (\\w+) with the following properties:\n$opinionatedTable"(typeRaw, rows) {
    const type = dasherize(typeRaw);
    const typePlural = pluralize(camelize(typeRaw));

    assert(`Collection ${typePlural} does not exist in Mirage`, server.db[typePlural]);
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
          value = findRelatedRecords(type, key, value);
        }

        // Empty cell
        else if (value.length === 0) {
          value = null;

          // If it's a hasMany relationship, set to empty array
          let relationship;
          try {
            relationship = findRelationship(type, key);
          } catch (e) {} // eslint-disable-line no-empty
          if (relationship instanceof HasMany) {
            value = [];
          }
        }

        // Numbers, Strings, Booleans, Arrays and Objects
        else {
          try {
            value = JSON.parse(value)
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

};

export default steps;
