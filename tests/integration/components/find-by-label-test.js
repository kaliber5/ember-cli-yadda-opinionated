import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { findByLabel } from 'ember-cli-yadda-opinionated/test-support/labels';

module('Integration | Util | find-by-label', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let m;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`
      <article data-test-post id="post_1">
        <section data-test-comment id="comment_1_1">
          <summary data-test-reply id="reply_1_1_1"></summary>
          <summary data-test-reply id="reply_1_1_2"></summary>
          <summary data-test-reply id="reply_1_1_3"></summary>
        </section>
        <section data-test-comment id="comment_1_2">
          <summary data-test-reply id="reply_1_2_1"></summary>
          <summary data-test-reply id="reply_1_2_2"></summary>
          <summary data-test-reply id="reply_1_2_3"></summary>
        </section>
        <section data-test-comment id="comment_1_3">
          <summary data-test-reply id="reply_1_3_1"></summary>
          <summary data-test-reply id="reply_1_3_2"></summary>
          <summary data-test-reply id="reply_1_3_3"></summary>
        </section>
      </article>

      <article data-test-post id="post_2">
        <section data-test-comment id="comment_2_1">
          <summary data-test-reply id="reply_2_1_1"></summary>
          <summary data-test-reply id="reply_2_1_2"></summary>
          <summary data-test-reply id="reply_2_1_3"></summary>
        </section>
        <section data-test-comment id="comment_2_2">
          <summary data-test-reply id="reply_2_2_1"></summary>
          <summary data-test-reply id="reply_2_2_2"></summary>
          <summary data-test-reply id="reply_2_2_3"></summary>
        </section>
        <section data-test-comment id="comment_2_3">
          <summary data-test-reply id="reply_2_3_1"></summary>
          <summary data-test-reply id="reply_2_3_2"></summary>
          <summary data-test-reply id="reply_2_3_3"></summary>
        </section>
      </article>

      <article data-test-post id="post_3">
        <section data-test-comment id="comment_3_1">
          <summary data-test-reply id="reply_3_1_1"></summary>
          <summary data-test-reply id="reply_3_1_2"></summary>
          <summary data-test-reply id="reply_3_1_3"></summary>
        </section>
        <section data-test-comment id="comment_3_2">
          <summary data-test-reply id="reply_3_2_1"></summary>
          <summary data-test-reply id="reply_3_2_2"></summary>
          <summary data-test-reply id="reply_3_2_3"></summary>
        </section>
        <section data-test-comment id="comment_3_3">
          <summary data-test-reply id="reply_3_3_1"></summary>
          <summary data-test-reply id="reply_3_3_2"></summary>
          <summary data-test-reply id="reply_3_3_3"></summary>
        </section>
      </article>
    `);

    const posts = findByLabel('Post');

    m = "`Post` should return an array";
    assert.ok(Array.isArray(posts), m);

    m = "`Post` length";
    assert.equal(posts.length, 3, m);

    m = "`Post` #0";
    assert.equal(findByLabel('Post')[0].id, 'post_1', m);

    m = "`Post` #1";
    assert.equal(findByLabel('Post')[1].id, 'post_2', m);

    m = "`Post` #2";
    assert.equal(findByLabel('Post')[2].id, 'post_3', m);

    ///

    m = "`a Post`";
    assert.equal(findByLabel('a Post').id, 'post_1', m);

    m = "`1st Post`";
    assert.equal(findByLabel('1st Post').id, 'post_1', m);
    m = "`2nd Post`";
    assert.equal(findByLabel('2nd Post').id, 'post_2', m);

    m = "`3rd Post`";
    assert.equal(findByLabel('3rd Post').id, 'post_3', m);

    ///

    const comments = findByLabel('Comment');

    m = "`Comment` should return an array";
    assert.ok(Array.isArray(comments), m);

    m = "`Comment` length";
    assert.equal(comments.length, 9, m);

    m = "`Comment` #0";
    assert.equal(findByLabel('Comment')[0].id, 'comment_1_1', m);

    m = "`Comment` #1";
    assert.equal(findByLabel('Comment')[1].id, 'comment_1_2', m);

    m = "`Comment` #8";
    assert.equal(findByLabel('Comment')[8].id, 'comment_3_3', m);

    ///

    m = "`a Comment`";
    assert.equal(findByLabel('a Comment').id, 'comment_1_1', m);

    m = "`1st Comment`";
    assert.equal(findByLabel('1st Comment').id, 'comment_1_1', m);

    m = "`2nd Comment`";
    assert.equal(findByLabel('2nd Comment').id, 'comment_1_2', m);

    m = "`9th Comment`";
    assert.equal(findByLabel('9th Comment').id, 'comment_3_3', m);

    ///

    m = "`Comment of 3st Post`";
    assert.equal(findByLabel('Comment of 3st Post').length, 3, m);

    m = "`2nd Comment of Post`";
    assert.equal(findByLabel('2nd Comment of Post').id, 'comment_1_2', m);

    m = "`2nd Comment of a Post`";
    assert.equal(findByLabel('2nd Comment of Post').id, 'comment_1_2', m);

    m = "`2nd Comment of 3st Post`";
    assert.equal(findByLabel('2nd Comment of 3st Post').id, 'comment_3_2', m);

    m = "`2nd Reply of 4th Comment`";
    assert.equal(findByLabel('2nd Reply of 4th Comment').id, 'reply_2_1_2', m);

    m = "`2nd Reply of 2nd Comment of 2nd Post`";
    assert.equal(findByLabel('2nd Reply of 2nd Comment of 2nd Post').id, 'reply_2_2_2', m);

    ///

    m = "`4th Post`";
    assert.equal(findByLabel('4th Post'), null, m);

    m = "`Foo`";
    assert.equal(findByLabel('Foo').length, 0, m);

  });
});
