import { settled } from '@ember/test-helpers';

export function isVisible(elem) {
  // https://github.com/jquery/jquery/blob/3.3.1/src/css/hiddenVisibleSelectors.js#L12
  return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}

export async function pause(ms = 0) {
  await new Promise(resolve => setTimeout(resolve, ms));
  return settled();
}

export function getIndexZero(ordinal, indexOneStr, defaultValue) {
  return (
    ordinal === 'first'   ? 0 :
    ordinal === 'second'  ? 1 :
    ordinal === 'third'   ? 2 :
    ordinal === 'fourth'  ? 3 :
    ordinal === 'fifth'   ? 4 :
    ordinal === 'sixth'   ? 5 :
    ordinal === 'seventh' ? 6 :
    ordinal === 'eighth'  ? 7 :
    ordinal === 'ninth'   ? 8 :
    ordinal === 'tenth'   ? 9 :
    indexOneStr           ? parseInt(indexOneStr, 10) - 1 :
                            defaultValue
  );
}
