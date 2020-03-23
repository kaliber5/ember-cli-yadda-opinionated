# Given steps

`ember-cli-yadda-opinionated` provides a generic step to seed Mirage records of any type. It covers basic cases.

For advanced cases, we recommend to implement one custom seeding per each model (see below).

Import:

```js
import { givenSteps } from 'ember-cli-yadda-opinionated/test-support';
```



## Server logging

Sets `server.logging` to true in Mirage until end of test.

**Signature**: `Given server.logging`



## Seed record(s) with same properties/traits — single-line

It will simply pass provided properties and traits as-is to Mirage's `server.createList()`, with the following nuances:

* The model name will be camelCased.
* Attribute keys and values are used as-is.
  * For belongs-to relationship, use e. g. `"productId": "1"` form.
  * For has-many relationship, use e. g. `"productIds": ["1", "2"]` form.
  * For polymorphic relationships, replace string ids `"1"` with identities: `{"id": "1", "type": "product-variant"}`.

**Signature**:

    Given there(?: is a|'s a| are|'re) (?:(\d+) )?records? of type $opinionatedModelName(?: with)?(?: traits? "((?:[^"\\]|\\.)*)")?(?: and)?(?: propert(?:y|ies) ({.+?}))?

**Examples**:

```feature
Given there is a record of type "Post"
Given there's a record of type "Post"
Given there is a record of type "Post" with property {"id": "1"}
Given there is a record of type "Post" with properties {"id": "1", "title": "Foo", "authorId": "mike"}
Given there is a record of type "Post" with properties {"id": "1", "title": "Foo", "authorId": {"id": "mike", "type: "user"}}
Given there is a record of type "Post" with properties {"id": "1", "title": "Foo", "authorIds": [{"id": "mike", "type: "user"}}, {"id": "siri", "type: "bot"}]}
Given there are 2 records of type "Post" with trait published
Given there is a record of type "Post" with traits published, pinned and commented
Given there is a record of type "Post" with traits published and commented and properties {"id": "1", "title": "Foo"}
```

Invalid example:

```feature
# Two records of the same type can't have the same id
Given there are 2 records of type "Post" with properties {"id": "1", "title": "Foo", author: "@mike"}
```



## Seed record(s) with same properties/traits — multi-line

Same as the single-line equivalent, but lets you expand JSON to multiple lines. Useful for nested attributes.

This step will simply pass provided properties and traits as-is to Mirage's `server.createList()`, with the following nuances:

* The model name will be camelCased.
* Attribute keys and values are used as-is.
  * For belongs-to relationship, use e. g. `"productId": "1"` form.
  * For has-many relationship, use e. g. `"productIds": ["1", "2"]` form.
  * For polymorphic relationships, replace string ids `"1"` with identities: `{"id": "1", "type": "product-variant"}`.

**Signature**:

    Given there(?: is a|'s a| are|'re) (?:(\d+) )?records? of type $opinionatedModelName with(?: traits? "((?:[^"\\]|\\.)*)")?(?: and)? the following properties:\n$opinionatedJSONObject

**Example**:

```feature
Given there is a record of type "Post" with traits published and commented and the following properties:
  ---
  {
    "id": "1",
    "title": "Foo",
    "authorId": "marina",
    "rewiewerIds": [
      {"id": "joe", "type": "user"},
      {"id": "graham", "type": "bot"}
    ]
  }
  ---
```



## Seed a single record with a table

A more readable way of seeding a single record over a JSON.

Use this step if you don't have nested attributes, otherwise use the JSON step.

* The model name will be camelCased.
* Accepts a table with exactly two columns.
* The first row must have items `key` and `value` — this is the header.
* Keys are used as is, trimmed. Write them without quotes.
* Values are parsed as JSON. Some hints:
  * Don't forget to quote the strings.
  * For belongs-to relationship, use e. g. `productId` as a column header and `"1"` as a value.
  * For has-many relationship, use e. g. `productIds` as a column header and `["1", "2"]` as a value.
  * For polymorphic relationships, replace string ids `"1"` with identities: `{"id": "1", "type": "product-variant"}`.
  * Empty values are treated as `null`. ⚠ For empty has-many relationships, specify an empty array: `[]`.

**Signature:**

    Given there is a record of type $opinionatedModelName with the following properties:\n$opinionatedTable

Example:

```
Given there is a record of type  with the following properties:
  ----------------------------------------------------------------------------------
  | key         | value                                                            |
  | id          | "1"                                                              |
  | title       | "Foo"                                                            |
  | authorId    | "marina"                                                         |
  | reviewerIds | [{"id": "joe", "type": "user"}, {"id": "graham", "type": "bot"}] |
  ----------------------------------------------------------------------------------
```



## Seed multiple records with a table

A more readable way of seeding multiple records over a JSON.

Use this step if you don't have nested attributes, otherwise use the JSON step.

* The model name will be camelCased.
* Accepts a table.
* The first row is a header, each item represents a key. Write them without quotes.
* Values are parsed as JSON. Some hints:
  * Don't forget to quote the strings.
  * For belongs-to relationship, use e. g. `productId` as a column header and `"1"` as a value.
  * For has-many relationship, use e. g. `productIds` as a column header and `["1", "2"]` as a value.
  * For polymorphic relationships, replace string ids `"1"` with identities: `{"id": "1", "type": "product-variant"}`.
  * Empty values are treated as `null`. ⚠ For empty has-many relationships, specify an empty array: `[]`.
  * Keys `trait` and `traits` are reserved for Mirage traits. Value should be a list of traits, comma-separated with optional space, no quotes.

**Signature**: `Given there are records of type $opinionatedModelName with the following properties:\n$opinionatedTable`

**Examples**:

```feature
Given there are records of type User with the following properties:
  ------------------------------------------
  | id     | name                  | trait |
  | "bloo" | "Blooregard Q. Kazoo" | admin |
  | "wilt" | "Wilt"                | user  |
  ------------------------------------------

And there are records of type Post with the following properties:
  -----------------------------------
  | id | title           | authorId |
  | 1  | "Hello, World!" | "bloo"   |
  | 2  | "Foo Bar Baz"   | "wilt"   |
  -----------------------------------

And there are records of type Post with the following properties:
  -----------------------------------------------------------
  | id  | title           | authorId                        |
  | 1   | "Hello, World!" | {"id": "bloo", "type": "user"}  |
  | 2   | "Foo Bar Baz"   | {"id": "wilt", "type": "user"}  |
  | "3" | "Zomg Lol Quux" | {"id": "cheese", "type": "bot"} |
  -----------------------------------------------------------
```

Note: Mirage automatically converts numeric ids to strings.



## Make a Mirage endpoint fail with an error

Useful for testing error states.

**Signature**: `Given there is a $opinionatedInteger error for the API $opinionatedString call to $opinionatedString'`

**Examples**:

```
Given there is a 500 error for the API "POST" call to "/posts"
```



## Adjust a config/environment param

Helps testing the app in different build modes.

**Signature**: `Given configuration property $opinionatedString is set to $opinionatedJSON`

**Examples**:

```
Given configuration property "theme" is set to "dark"
```



## Set a local storage value (single line)

**Signature**: `Given local storage key $opinionatedString is set to $opinionatedString`

Value is a string which can contain JSON or anything else.

Allows escaping double quotes.

**Example**:

```
Given local storage key "my-app-config" is set to "foo"
Given local storage key "my-app-config" is set to "{\\"id\\": \\"foo\\"}"
```



## Set a local storage value (multiline)

**Signature**: `Given local storage key $opinionatedString is set to the following value:\n$opinionatedText`

Value is a string which can contain JSON or anything else.

**Example**:

```
Given local storage key "my-app-config" is set to the following value:
  -----------------------------------------
  {
    "id": "foo",
    "createdAt": "2019-11-21T08:28:59.973Z"
  }
  -----------------------------------------
```



## Remove a local storage value

**Signature**: `Given local storage key $opinionatedString does not exist`

Value is a string which can contain JSON or anything else.

**Example**:

```
Given local storage key "my-app-config" does not exist
```



## Clear local storage

**Signature**: `Given local storage is empty`

**Example**:

```
Given local storage is empty
```
