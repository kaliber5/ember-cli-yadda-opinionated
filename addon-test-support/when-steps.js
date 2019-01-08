
import { click, visit, fillIn } from '@ember/test-helpers';
import pause from './helpers';

const steps = {

  async "when user visits `$url`"(url) {
    await visit(url);
    if (this.ctx.debug) { debugger; result; }// eslint-disable-line
  },

  "when user clicks $element"($element, { assert }) {
    let m = "element count";
    assert.equal($element.length, 1, m);

    if (this.ctx.debug) { debugger; }// eslint-disable-line

    return click($element[0]);
  },

  async "when user moves the mouse pointer into $element"($element, { assert }) {
    m = "element count";
    assert.equal($element.length, 1, m);

    await $element.mouseenter();
    await pause(10);

    if (this.ctx.debug) { debugger; result; }// eslint-disable-line
  },

  async "when user moves the mouse pointer out of $element"($element, { assert }) {
    m = "element count";
    assert.equal($element.length, 1, m);

    await $element.mouseleave();
    await pause(10);

    if (this.ctx.debug) { debugger; result; }// eslint-disable-line
  },

  async "when user selects `$text` from select box $element"(text, $element, { assert }) {
    await click($element.find(sel("[Trigger]"))[0]);
    await fillIn($element.find(sel("[Search Input]"))[0], text);
    await wait();

    const $options = $element.find(sel("[Option]"));

    m = "Exactly one option is expected to be revealed";
    assert.equal($options.length, 1, m);

    await click($options[0]);

    if (this.ctx.debug) { debugger; result; }// eslint-disable-line
  },

};

export default steps;
