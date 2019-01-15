import findByLabel from 'ember-cli-yadda-opinionated/test-support/-private/find-by-label';

export function element(label, next) {
  const collectionOrElement = findByLabel(label);

  next(null, collectionOrElement);
}
