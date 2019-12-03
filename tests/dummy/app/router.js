import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

export default class Router extends AddonDocsRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('test-lab', function () {
    this.route('then-steps');
  });

  docsRoute(this, function() {
    // Introduction
    this.route('truth');
    this.route('labels');
    this.route('composing');
    this.route('debugging');

    // Usage
    this.route('project-structure');
    this.route('installation');
    this.route('setup-steps-clean');
    this.route('setup-steps-mixed');
    this.route('custom-steps');
    this.route('opinionated-element');
    this.route('step-aliases');
    this.route('label-map');
    this.route('assertions');
    this.route('converters');

    // Steps
    this.route('steps-given');
    this.route('steps-when');
    this.route('steps-then');
    this.route('steps-power-select');
    this.route('steps-power-date-picker');

    // Misc
    this.route('integration-test-helpers');
  });

  this.route('not-found', { path: '/*path' });
});
