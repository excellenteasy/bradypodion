# Contributing to Bradypodion

* Sign our [Contributor License Agreement](CONTRIBUTOR_LICENSE_AGREEMENTS.md).
* Adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).
* Adhere to these [Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y) 

## Prerequisites

After cloning the repository…
```
git clone git@github.com:excellenteasy/bradypodion.git
cd bradypodion
```

…you should install global…
```bash
npm install -g bower grunt-cli
```

…and local dependencies.
```bash
npm install
bower install
```

## Development

During development you need to run the `serve` task. 
It builds and tests the source on change and serves the demo app on `http://localhost:9000`.

```bash
grunt serve
```

### Scripts

Write code that passes our [JSHint](.jshintrc) and [JSCS](.jscs.json) rules.
Write comments that describe why you're doing something, rather than what you're doing.
Write tests that cover the entire functionality you're adding.
Write documentation with [@ngdoc](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation).

### Styles

The CSS build relies on conventions. For a new module create a folder within [modules/styles](modules/styles), like so `modules/styles/@{type}/@{name}`.

There is a special treatment for files within those folders.
* `module.less`: Contains a mixin which is the actual module.
* `class.less`: Contains the code that actually causes real CSS output (i.e. calls the module's mixin).
* `@{platform}.less`(android|ios): Contains platform specific mixins.

Platforms will be namespaced whenever you build more than one.

So the rules in this imaginary file (`modules/styles/@{type}/@{name}/@{platform}.less`)…

```css
bg-button {
  background: green;
}
```

… will look like this, once compiled.
`bradypodion.css`

```css
.@{platform} bg-button {
  background: green;
}
```

Create and import as many other files within the module's folder as you like, but group them in platform folders.

Whenever you write color related styles [make them themeable](modules/styles/directives/navbar/ios/theme.less).
