# Using labels as direct references to elements with test selectors

As explained <LinkTo @route="docs.truth">previously</LinkTo>, we want to move the truth from step implementations to feature files. A great way to do it is with test selectors.

To learn about test selectors, please see the [ember-test-selectors](https://github.com/simplabs/ember-test-selectors) addon. Though you can start using test selectors without the addon, it is recommended to have it installed in your app.

`ember-cli-yadda-opinonated` introduces *labels*: a DSL for your Cucumber feature files that lets you reference page elements via test selectors.

In its simplest form, a label can look like: `Menu-Item`, `MenuItem` or `menu-item`. Any of these lables translates to `[data-test-menu-item]`.

You can also use articles. They will be ignored by the addon, but will contribute to readability: `a Menu-Item` and `the Menu-Item` behave identically to `Menu-Item`.

Resulting steps could looks like this:

```feature
When I click the Info-Button
Then there should be an Info-Box
```

These steps are equivalent to:

```js
await click('[data-test-info-button']);
assert.ok(find('[data-test-info-box']));
```



## Targeting nested elements

You can nest labels using prepositions `in`, `inside`, `under`, `of`, `on` and `from`.

For example, `Save-Button in Post-Edit-Form` produces selector `[data-test-post-edit-form] [data-test-save-button]`.

You can nest selectors up to 5 levels deep.

Note how the order of elements is inverted. This is because for a human it's more convenient to say "A menu item in the main menu" than "A main menu-contained menu item". But CSS requires the ancestor to appear before the descendant.



## Referencing Nth element

If you have multiple elements on the same page and you want to target one of them by index, you can use index prefixes like: `1st`, `2nd`, `3rd`, `4th`, `543rd`, etc. Since we're using a natural language, they are one-indexed.

Literal indices from `first` to `tenth` are also available.

Label `2nd Menu-Item`, `the 2nd Menu-Item`, `second Menu-Item` or `the second Menu-Item` produce selector `[data-test-menu-item]:eq(1)` internally.

`:eq(n)` is not a standard selector, it is an equivalent to `array[n]` in JS. The idea is borrowed [from jQuery](https://api.jquery.com/eq-selector/).

Thus, `[data-test-menu-item]:eq(1)` will find all menu items on the page, then pick the second one.

Note that this is totally different from `:nth-child(n)`, which can target more than one element!

Here's a more complicated example:

    Link in 2nd Menu-Item from the 1st Menu

This will find the first menu, in that menu it will take the second menu item, and in that menu item it will take a link:

    [data-test-menu]:eq(0) [data-test-menu-item]:eq(1) [data-test-link]



## Compound labels

Each element you want to target should have one semantic label.

In addition to a semantic label, you might want to add additional labels on the same element. Here are two common cases:

* Distinguishing sibling items. E. g. each menu item may have a unique label such as `Home`, `Products`, `About`, `Contacts`, etc.
* Tracking state: `Active`, `Expanded`, etc.

Use `+` to compose multiple labels.

E. g. you can target an active menu item with `Active+MenuItem`. This will translate to `[data-test-menu-item][data-test-active]`.

Note that you can use the **label map** (see below) to map the `Active` label to the `.active` selector. If you do, `Active+MenuItem` will translate to `[data-test-menu-item].active`.



## Test attribute values

You can distinguish sibling items with values of test selectors: `Menu-Item(Products)` targes `[data-test-menu-item="Products"]`.

Note that unlike attribute names, values are case-sensitive.



## Mapping labels to selectos

Labels are designed to prevent you from using non-semantic selectors, which are pure evil. But there's a situation where this evil is inevitable.

Sometimes you want your tests to operate on page elements produced by a third-party addon or library. You don't have control over its HTML output and thus can't sprinkle it with test selectors.

To resolve the issue, you can provide a mapping of labels to selectors. For example, you can configure a label `Bootstrap-Text-Input` to target `input.form-control[type="text"]`.

You should only use it to target HTML that you are unable to edit. If you can, you should instead add test selectors to elements and use normal, unmapped labels to target them.
