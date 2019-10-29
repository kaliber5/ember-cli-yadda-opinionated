import { restoreOriginalConfig } from './config';

export default function setup (hooks) {
  hooks.afterEach(restoreOriginalConfig);
}
