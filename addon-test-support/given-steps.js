/* global server */

import { assert }  from '@ember/debug';
import { camelize, dasherize }  from '@ember/string';
import { pluralize } from 'ember-inflector';
import REGEX_COMMA_AND_SEPARATOR from 'ember-cli-yadda-opinionated/test-support/regex';

const steps = {

  async "Given there(?: is a|'s a| are|'re) (?:(\\d+) )?records? of type (\\w+)(?: with)?(?: traits? (.+?))?(?: and)?(?: propert(?:y|ies) ({.+?}))? in Mirage"(countRaw = "1", typeRaw, traitsRaw = "", propertiesRaw = "{}") {
    const count = parseInt(countRaw, 10);
    const type = dasherize(typeRaw);
    const typePlural = pluralize(camelize(typeRaw));

    assert(`Collection ${typePlural} does not exist in Mirage, step: ${this.step}`, server.db[typePlural]);

    const traits = traitsRaw.split(REGEX_COMMA_AND_SEPARATOR).filter(str => str.length)
    let properties;

    try {
      properties = JSON.parse(propertiesRaw)
    } catch (e) {
      throw new Error(`Invalid properties JSON passed into step: ${this.step}`);
    }

    server.createList(type, count, ...traits, properties);
  },

};

export default steps;
