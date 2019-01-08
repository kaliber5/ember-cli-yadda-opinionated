import { expect } from 'chai';
import { assert }  from '@ember/debug';

const steps = {

  "Then there should be (?:(\\d+) )?$element"(countRaw, element) {
    if (countRaw) {
      assert("Should receive an array of elements. Did you use a/the unintentionally?", Array.isArray(element));

      const count = parseInt(countRaw, 10);

      expect(element).to.have.length(count);
    } else {
      expect(element).to.be.ok;
    }
  }

};

export default steps;
