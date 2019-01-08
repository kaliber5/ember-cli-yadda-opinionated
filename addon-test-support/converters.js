import { findByLabel } from './labels';

export default function element(label, next) {
  const collectionOrElement = findByLabel(label);

  next(null, collectionOrElement);
}


