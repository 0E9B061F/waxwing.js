# :bird: **waxwing.js** v0.3.5 'AGRIAS'
[![Version][icon-ver]][repo]
[![Series][icon-ser]][repo]
[![License][icon-lic]][license]
[![Maintenance][icon-mnt]][commits]<br/>
[![NPM][icon-npm]][pkg]

**waxwing.js** is a JS library for creating HTML with a simple, elegant syntax.

**waxwing** exposes two slightly different functions for building HTML elements. Using the higher-level `html.start` function:

```js
const html = require("waxwing.js")

// Create a tree of HTML documents and anchor them to `document.body`
// `document.body` could be ommitted; it is the default anchor if none is given
const els = html.start(document.body, c=> {
  c.div("#example-head", c=> {
    c.a("#title", {href: "https://github.com/0E9B061F/fantasma.js"}, c=> c("FANTASMA.JS"))
    c.a("#site", {href: "https://0E9B061F.github.io"}, c=> c("0E9B061F.github.io"))
  })
  c.div("#example-main smooth", c=> {
    // The `$name` syntax gives the element the id `name` and also creates a
    // named reference to the element. `html.start` will return an object
    // containing every named element. 
    c.div("$sq1 square")
    c.div("$sq2 square")
    c.div("$sq3 square")
    c.div("$sq4 square")
  })
})

console.log(els)
// Will print something like:
// {
//   sq1: HTMLDivElement {},
//   sq2: HTMLDivElement {},
//   sq3: HTMLDivElement {},
//   sq4: HTMLDivElement {}
// }
```

`html.start` will always anchor the created elements to another element (`document.body` if no element is given). It also creates no top-level element, but zero or more elements which will become children of the anchor element.

The second function **waxwing** exposes is `html.mkel`. `html.mkel` is similar to `html.start`, but it creates and returns a single top-level element without anchoring it to anything. You'll have to attach the element to the document yourself, if you intend to. Example usage:

```js
// Create a div element with an id, a class, and an attribute `bat`:
const foo = html.mkel("div", "#foo bar", {bat: "quz"})
// The created object will be like:
//   <div id="foo" class="bar" bat="quz"></div>

// You can also create HTML trees with `html.mkel`:
const foo = html.mkel("div", "#foo", c=> {
  c.h1("title", c=> c("Hello"))
  c.p(c=> c("Welcome to the website!"))
})
// The created tree will be like:
//   <div id="foo">
//     <h1 class="title">Hello</h1>
//     <p>Welcome to the website!</p>
//   </div>

```

# Installation

```sh
npm install waxwing.js
```

# Name Syntax

**waxwing** uses a simple syntax to attach IDs and classes to elements, and also to create named anchor elements. It takes the form of a string of space-seperated names with prefixes to distinguish them. Names with no prefix are classes, names prefixed with a `#` character are IDs, the `@` prefix creates a named anchor, and the `$` prefix creates both an ID and a named anchor.

```js
const els = html.start(c=> {
  c.div("info warn hide") // A div with 3 classes
  c.div("#top label")     // A div with an ID (top) and a class
  c.div("@button1")       // A div anchor element named "betton1"
  c.div("$login")         // A div anchor named "login" with the ID "login"
})
```

## Anchor Elements

Anchor elements are created using the `@` or `$` name syntax, as shown above. They are mostly useful when using `html.start`, which returns an object containing every named anchor element. This allows you to easily get refences to any element anywhere in the created tree. An example of this can be seen in the first example given above.

# License

Copyright 2019-2024 **[0E9B061F][gh]**<br/>
Available under the terms of the [MIT License][license].


[gh]:https://github.com/0E9B061F
[repo]:https://github.com/0E9B061F/waxwing.js
[license]:https://github.com/0E9B061F/waxwing.js/blob/master/LICENSE
[pkg]:https://www.npmjs.com/package/waxwing.js
[commits]:https://github.com/0E9B061F/waxwing.js/commits/main

[icon-ver]:https://img.shields.io/github/package-json/v/0E9B061F/waxwing.js.svg?style=flat-square&logo=github&color=%236e7fd2
[icon-ser]:https://img.shields.io/badge/dynamic/json?color=%236e7fd2&label=series&prefix=%27&query=series&suffix=%27&url=https%3A%2F%2Fraw.githubusercontent.com%2F0E9B061F%2Fwaxwing.js%2Fmaster%2Fpackage.json&style=flat-square
[icon-lic]:https://img.shields.io/github/license/0E9B061F/waxwing.js.svg?style=flat-square&color=%236e7fd2
[icon-mnt]:https://img.shields.io/maintenance/yes/2024.svg?style=flat-square
[icon-npm]:https://img.shields.io/npm/v/waxwing.js.svg?style=flat-square&logo=npm&color=%23de2657
