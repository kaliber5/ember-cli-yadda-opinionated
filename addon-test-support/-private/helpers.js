import { settled } from '@ember/test-helpers';

export async function pause(ms = 0) {
  await new Promise(resolve => setTimeout(resolve, ms));
  return settled();
}
