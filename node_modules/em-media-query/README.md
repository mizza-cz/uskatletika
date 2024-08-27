# em-media-query

[![Build Status][ci-img]][ci]

Transform min/max-width/height media queries to ems.

This is a low-level module. You’re probably looking for [PostCSS][postcss-plugin] or [Babel][babel-plugin] plugin.

## Install

```sh
npm install em-media-query --save
```

## Usage

```js
const meMediaQuery = require('em-media-query');

console.log(emMediaQuery('screen and (min-width:600px)'));
// 'screen and (min-width:37.5em)'
```

## API

### emMediaQuery(str, [opts])

Returns: `String`

#### str

Type: `String`

Media query to convert.

#### opts

Type: `Object`

##### precision

Type: `Integer`  
Default: `5`

Rounding precision for values.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/em-media-query
[ci-img]: https://img.shields.io/travis/niksy/em-media-query.svg
[postcss-plugin]: https://github.com/niksy/postcss-em-media-query
[babel-plugin]: https://github.com/niksy/babel-plugin-em-media-query
