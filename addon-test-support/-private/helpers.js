import { settled } from '@ember/test-helpers';

export function isVisible(elem) {
  // https://github.com/jquery/jquery/blob/3.3.1/src/css/hiddenVisibleSelectors.js#L12
  return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}

export async function pause(ms = 0) {
  await new Promise(resolve => setTimeout(resolve, ms));
  return settled();
}
