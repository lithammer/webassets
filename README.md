# Webassets

A webservice to compile and compress various web assets, e.g. LESS, JavaScript, CoffeeScript etc.

[![Build Status](https://travis-ci.org/renstrom/webassets.png)](https://travis-ci.org/renstrom/webassets)

## Usage

Some LESS code in a file.

```bash
$ cat style.less
@color-red: red;
@color-green: green;

a {
  color: @color-red;

  .green {
    color: @color-green;
  }
}
```

Simply do a POST request with `Content-Type: text/less` to compile LESS to regular CSS.

```bash
$ curl -X POST --data-binary @style.less -H "Content-Type: text/less" http://webassets.herokuapp.com/api/
a {
  color: #ff0000;
}
a .green {
  color: #008000;
}
```

Want it compressed as well? Add the `compress=true` query parameter.

```bash
$ curl -X POST --data-binary @style.less -H "Content-Type: text/less" http://webassets.herokuapp.com/api/?compress=true
a{color:#ff0000;}a .green{color:#008000;}
```

## Supported content-types

Content-type                                  | Header
--------------------------------------------- | ------------
CSS                                           | `text/css`
[LESS](http://lesscss.org/)                   | `text/less`
[Stylus](http://learnboost.github.io/stylus/) | `text/stylus`
JavaScript                                    | `text/javascript`
[CoffeeScript](http://coffeescript.org/)      | `text/coffeescript`

## Test

[Mocha](http://visionmedia.github.com/mocha/) is required to run tests, install
it globally with `npm install -g mocha` and start the test runner with any of
the following three:

```bash
$ mocha
$ mocha test/test.js
$ npm test
```
