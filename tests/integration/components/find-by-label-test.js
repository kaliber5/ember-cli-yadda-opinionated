import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import findByLabel from 'ember-cli-yadda-opinionated/test-support/-private/find-by-label';

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

      <article data-test-post="3rd" id="post_3">
        <section data-test-comment id="comment_3_1">
          <summary data-test-reply id="reply_3_1_1"></summary>
          <summary data-test-reply id="reply_3_1_2"></summary>
          <summary data-test-reply id="reply_3_1_3"></summary>
        </section>
        <section data-test-comment id="comment_3_2" data-test-active>
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

    const [posts, label] = findByLabel('Post');

    m = "`Post` label";
    assert.equal(label, 'Post', m);

    m = "`Post` should return an array";
    assert.ok(Array.isArray(posts), m);

    m = "`Post` length";
    assert.equal(posts.length, 3, m);

    m = "`Post` #0";
    assert.equal(posts[0].id, 'post_1', m);

    m = "`Post` #1";
    assert.equal(posts[1].id, 'post_2', m);

    m = "`Post` #2";
    assert.equal(posts[2].id, 'post_3', m);

    ///

    m = "`a Post` should return an array";
    assert.ok(Array.isArray(findByLabel('a Post')[0]), m);

    m = "`a Post`";
    assert.equal(findByLabel('a Post')[0][0].id, 'post_1', m);

    m = "`1st Post`";
    assert.equal(findByLabel('1st Post')[0][0].id, 'post_1', m);

    m = "`2nd Post`";
    assert.equal(findByLabel('2nd Post')[0][0].id, 'post_2', m);

    m = "`3rd Post`";
    assert.equal(findByLabel('3rd Post')[0][0].id, 'post_3', m);

    ///

    m = "`first Comment`";
    assert.equal(findByLabel('first Comment')[0][0].id, 'comment_1_1', m);

    m = "`second Comment`";
    assert.equal(findByLabel('second Comment')[0][0].id, 'comment_1_2', m);

    m = "`third Comment`";
    assert.equal(findByLabel('third Comment')[0][0].id, 'comment_1_3', m);

    m = "`fourth Comment`";
    assert.equal(findByLabel('fourth Comment')[0][0].id, 'comment_2_1', m);

    m = "`fifth Comment`";
    assert.equal(findByLabel('fifth Comment')[0][0].id, 'comment_2_2', m);

    m = "`sixth Comment`";
    assert.equal(findByLabel('sixth Comment')[0][0].id, 'comment_2_3', m);

    m = "`seventh Comment`";
    assert.equal(findByLabel('seventh Comment')[0][0].id, 'comment_3_1', m);

    m = "`eighth Comment`";
    assert.equal(findByLabel('eighth Comment')[0][0].id, 'comment_3_2', m);

    m = "`ninth Comment`";
    assert.equal(findByLabel('ninth Comment')[0][0].id, 'comment_3_3', m);

    m = "`tenth Comment`";
    assert.equal(findByLabel('tenth Comment')[0][0], null, m);

    ///

    const [comments] = findByLabel('Comment');

    m = "`Comment` should return an array";
    assert.ok(Array.isArray(comments), m);

    m = "`Comment` length";
    assert.equal(comments.length, 9, m);

    m = "`Comment` #0";
    assert.equal(comments[0].id, 'comment_1_1', m);

    m = "`Comment` #1";
    assert.equal(comments[1].id, 'comment_1_2', m);

    m = "`Comment` #8";
    assert.equal(comments[8].id, 'comment_3_3', m);

    ///

    m = "`a Comment`";
    assert.equal(findByLabel('a Comment')[0][0].id, 'comment_1_1', m);

    m = "`1st Comment`";
    assert.equal(findByLabel('1st Comment')[0][0].id, 'comment_1_1', m);

    m = "`2nd Comment`";
    assert.equal(findByLabel('2nd Comment')[0][0].id, 'comment_1_2', m);

    m = "`9th Comment`";
    assert.equal(findByLabel('9th Comment')[0][0].id, 'comment_3_3', m);

    m = "`the 1st Comment`";
    assert.equal(findByLabel('the 1st Comment')[0][0].id, 'comment_1_1', m);

    ///

    m = "`Comment of 3st Post`";
    assert.equal(findByLabel('Comment of 3st Post')[0].length, 3, m);

    m = "`2nd Comment of Post`";
    assert.equal(findByLabel('2nd Comment of Post')[0][0].id, 'comment_1_2', m);

    m = "`2nd Comment of a Post`";
    assert.equal(findByLabel('2nd Comment of Post')[0][0].id, 'comment_1_2', m);

    m = "`2nd Comment of 3st Post`";
    assert.equal(findByLabel('2nd Comment of 3st Post')[0][0].id, 'comment_3_2', m);

    m = "`2nd Reply of 4th Comment`";
    assert.equal(findByLabel('2nd Reply of 4th Comment')[0][0].id, 'reply_2_1_2', m);

    m = "`2nd Reply of 2nd Comment of 2nd Post`";
    assert.equal(findByLabel('2nd Reply of 2nd Comment of 2nd Post')[0][0].id, 'reply_2_2_2', m);

    ///

    m = "`4th Post`";
    assert.equal(findByLabel('4th Post')[0].length, 0, m);

    m = "`Foo`";
    assert.equal(findByLabel('Foo')[0].length, 0, m);

    ///
    m = "`a Post(3rd)`";
    assert.equal(findByLabel('a Post(3rd)')[0][0].id, "post_3", m);

    ///
    m = `Active+Comment`;
    assert.equal(findByLabel('Active+Comment')[0][0].id, "comment_3_2", m);


  });
});
