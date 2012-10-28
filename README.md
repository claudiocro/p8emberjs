# p8js [![Build Status](https://secure.travis-ci.org/claudiocro/p8emberjs.png)](http://secure.travis-ci.org/claudiocro/p8emberjs)

plus8.ch js framework

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/claudiocro/p8emberjs/master/dist/p8js-jquery.min.js
[max]: https://raw.github.com/claudiocro/p8emberjs/master/dist/p8js-jquery.js

In your web page:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="../libs/emberjs/handlebars-1.0.rc.1.js"></script>
<script src="../libs/emberjs/ember-1.0.beta.2.js"></script>
<script>
  MYNS.PersonModel = P8DS.Model.extend({
    properties : [ 'id', 'name', 'lastname', 'date']
  });
</script>
```

## Documentation
_(Coming soon)_

## Examples
Will be provided soon. In the meantime use the test sources located at https://github.com/claudiocro/p8emberjs/tree/master/test

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!_

## Release History
<ul>
<li>2012/10/28 - v0.5.3 - Introduce Apache license 2.0</li>
</ul>

## License
Copyright (c) 2012 Claudio Romano  
Licensed under the Apache License, Version 2.0.
