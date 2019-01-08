import { findByLabel } from './labels';

export function element(label, next) {
  const collectionOrElement = findByLabel(label);

  next(null, collectionOrElement);
}


