/* global server */

import { assert }  from '@ember/debug';
import { camelize, dasherize }  from '@ember/string';
import { pluralize, singularize } from 'ember-inflector';
import { REGEX_COMMA_AND_SEPARATOR } from 'ember-cli-yadda-opinionated/test-support/-private/regex';
import { overrideConfig } from 'ember-cli-yadda-opinionated/test-support/-private/config';
import HasMany from 'ember-cli-mirage/orm/associations/has-many';
import { REGEX_ID_AND_TYPE, REGEX_REL_NAME } from '../regex';

function findRelationship(server, type, relationshipName) {
  try {
    const Model = server.schema.modelClassFor(type);
    return Model.associationFor(relationshipName);
  } catch (e) {
    return null;
  } // eslint-disable-line no-empty
}

function findRelatedRecord(server, idRaw, relatedTypeFromRelationship) {
  const result = REGEX_ID_AND_TYPE.exec(idRaw);

  if (!result || !result[1]) {
    throw new Error(`Invalid id: ${idRaw}`);
  }

  const [, id, typeFromId] = result;

  const relatedType = typeFromId || relatedTypeFromRelationship;

  const relatedTypePlural = pluralize(camelize(relatedType));
  const relatedCollection = server.schema[relatedTypePlural];

  if (!relatedCollection) {
    throw new Error(`Collection ${relatedTypePlural} does not exist in Mirage Schema`);
  }

  const relatedRecord = relatedCollection.find(id);

  if (!relatedRecord) {
    throw new Error(`Record of type ${relatedType} with id ${id} not found in Mirage Schema`);
  }

  return relatedRecord;
}

function findRelatedRecords(server, type, relationshipName, idOrIdsRaw) {
  idOrIdsRaw = idOrIdsRaw.trim();

  let result;
  let relationship;
  let relatedType;

  if (REGEX_REL_NAME.test(relationshipName)) {
    const result = REGEX_REL_NAME.exec(relationshipName);

    if (!result) {
      throw new Error(`Regex parse error for realtionship name '${relationshipName}'`);
    }

    relationshipName = result[1];
    relationship = findRelationship(server, type, relationshipName);
    assert(`No such relationship "${relationshipName}" on Mirage model ${type}`, relationship);
    relatedType = dasherize(result[2]);
  } else {
    relationship = findRelationship(server, type, relationshipName);
    assert(`No such relationship "${relationshipName} on Mirage model ${type}`, relationship);
    relatedType = relationship.modelName;
  }

  // HasMany
  if (relationship instanceof HasMany) {
    result =
      idOrIdsRaw
        .split(REGEX_COMMA_AND_SEPARATOR)
        .filter(str => str.length)
        .map(idRaw => findRelatedRecord(server, idRaw, relatedType));
  }

  // BelongsTo non-empty
  else if (idOrIdsRaw.length) {
    result = findRelatedRecord(server, idOrIdsRaw, relatedType);
  }

  // BelongsTo empty
  else {
    result = null;
  }

  return [result, relationshipName];
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

      // Relationship
        if (REGEX_REL_NAME.test(key) || findRelationship(server, type, key)) {
        [value, key] = findRelatedRecords(server, type, key, value);
      }

      // Booleans, Arrays, Objects and Null
      else if (/^{.+}$/.test(value) || /^\[.+]$/.test(value) || value === "true" || value === "false" || value === "null") {
        try {
          value = JSON.parse(value)
        } catch (e) {
          throw new Error(`Invalid JSON passed as "${key}"`);
        }
      }

      else {
        throw new Error(`Unexpected value passed as ${key}: \`${value}\``);
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

        // Relationship
        if (REGEX_REL_NAME.test(key) || findRelationship(server, type, key)) {
          [value, key] = findRelatedRecords(server, type, key, value);
        }

        // Traits
        else if (key === 'trait' || key === 'traits') {
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

  'Given there is a $opinionatedInteger error for the API (.+) call to "(.+)"'(
    status,
    methodName,
    url
  ) {
    this.server[methodName.toLowerCase()](url, { message: 'There was an error' }, status);
  },

  'Given configuration property "(.+?)" is set to $opinionatedJSON'(key, value) {
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
