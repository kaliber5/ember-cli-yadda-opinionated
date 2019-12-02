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



## Seed record(s) with same properties/traits

It will simply pass provided properties and traits as-is to Mirage's `server.createList()`, with the following nuances:

* The model name will be camelCased.
* Property names and values are used as-is.
* Relationships will be automatically recognized by inspecting property types on the corresponding Mirage model.

    Values must be ids, without quotes, prefixed with `@`, e. g. `@1` or `@foo`.
  
    For a to-many relationship, use plural key and delimit ids with commas. This way you can populate one-to-one and one-to-many relationships (from the one side).

    Alternatively, you can use Mirage's default behavior and pass ids, e. g. `{"comment_ids": [1, 2]}`.

    For polymorphic relationships, you can optionally provide a type of each related record next to the id in parens: `@1(User), @2(Bot)`. You can also provide the default type in the key, e. g. `"authors(User)": "@1, @3)`. Both approaches can be mixed, the per-id type has priority. If the type is provided neither in key nor in id, then the base type of the polymorphic relationship will be used to create the related record.

**Signature**: `Given there(?: is a|'s a| are|'re) (?:(\\d+) )?records? of type (\\w+)(?: with)?(?: traits? (.+?))?(?: and)?(?: propert(?:y|ies) ({.+?}))?`

**Examples**:

```feature
Given there is a record of type Post
Given there's a record of type Post
Given there is a record of type Post with property {"id": "1"}
Given there is a record of type Post with properties {"id": "1", "title": "Foo", "author": "@mike"}
Given there is a record of type Post with properties {"id": "1", "title": "Foo", "author(User)": "@mike"}
Given there is a record of type Post with properties {"id": "1", "title": "Foo", "author": "@mike(User)"}
Given there is a record of type Post with properties {"id": "1", "title": "Foo", "authors": "@mike(User), @bob(Bot)"}
Given there is a record of type Post with properties {"id": "1", "title": "Foo", "authors(User)": "@mike, @bob(Bot)"}
Given there are 2 records of type Post with trait published
Given there is a record of type Post with traits published, pinned and commented
Given there is a record of type Post with traits published and commented and properties {"id": "1", "title": "Foo"}
```

Invalid example:

```feature
# Two records of the same type can't have the same id
Given there are 2 records of type Post with properties {"id": "1", "title": "Foo", author: "@mike"}
```



## Seed records with a table

Though this step is similar to the above, it has slightly different behavior:

* The model name will be camelCased.
* Keys (column headers) and values are trimmed.
* Property names are used as-is, except for names `trait` and `traits`, which are used for traits.
* Relationships will be automatically recognized by inspecting property types on the corresponding Mirage model.

    Values must be ids, without quotes, prefixed with `@`, e. g. `@1` or `@foo`.
  
    For a to-many relationship, use plural key and delimit ids with commas. This way you can populate one-to-one and one-to-many relationships (from the one side).

    Alternatively, you can use Mirage's default behavior and pass ids, e. g. `{"comment_ids": [1, 2]}`.

    For polymorphic relationships, you can optionally provide a type of each related record next to the id in parens: `@1(User), @2(Bot)`. You can also provide the default type in the key, e. g. `"authors(User)": "@1, @3)`. Both approaches can be mixed, the per-id type has priority. If the type is provided neither in key nor in id, then the base type of the polymorphic relationship will be used to create the related record.

* Empty cells are treated as `null`.

* Other values are parsed as JSON. Note that strings, numbers, booleans and `null` are JSON entries in their full right. :)

    This means that you must wrap strings in double quotes.

**Signature**: `Given there are records of type (\\w+) with the following properties:\n$opinionatedTable`

**Examples**:

```feature
Given there are records of type User with the following properties:
  ----------------------------------------
  | id     | name                  | trait |
  | "bloo" | "Blooregard Q. Kazoo" | admin |
  | "wilt" | "Wilt"                | user  |
  --------------------------------------
And there are records of type Post with the following properties:
  ---------------------------------
  | id | title           | author |
  | 1  | "Hello, World!" | @bloo  |
  | 2  | "Foo Bar Baz"   | @wilt  |
  ---------------------------------
And there are records of type Post with the following properties:
  ---------------------------------------
  | id | title           | author(User) |
  | 1  | "Hello, World!" | @bloo        |
  | 2  | "Foo Bar Baz"   | @wilt        |
  | 3  | "Zomg Lol Quux" | @cheese(Bot) |
  ---------------------------------------
```



## Make a Mirage endpoint fail with an error

Useful for testing error states.

**Signature**: `Given there is a $opinionatedInteger error for the API (.+) call to "(.+)"`

**Examples**:

```
Given there is a 500 error for the API POST call to "/posts"
```



## Adjust a config/environment param

Helps testing the app in different build modes.

**Signature**: `Given configuration property "(.+?)" is set to $opinionatedJSON`

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
