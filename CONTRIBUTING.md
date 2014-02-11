# Contributing to BradyPodion

Adhere to these [commit message conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y) and our [code of conduct](CODE_OF_CONDUCT.md).

## Prerequisites

After cloning the repository…
```
git clone git@github.com:excellenteasy/bradypodion.git
```

…you should install global…
```bash
npm install -g bower grunt-cli
```

…and local dependencies.
```bash
npm install
```

## Development

During development you need to run the `server` task. It will build & test your files on change.
```bash
grunt server
```

### Coffeescript

Adhere to the [coffeescript styleguide](https://github.com/excellenteasy/styleguides/blob/master/coffee.md).
Add unit tests and documentation for any new or changed functionality.

### Less
> Convention over Configuration

The build process relies on conventions.
You need to create a new folder within [modules/styles](modules/styles), like so `modules/styles/$modulestype/$modulename`.

There is a special treatment for files within those folders.
* `module.less`: Contains a mixin which is the actual module.
* `class.less`: Contains the code that actually causes real CSS output (i.e. calls the module's mixin).
* `$platform.less`(android|ios): Contains platform specific mixins.

NOTE: Platforms will be namespaced whenever you build more than one.

So the rules in this imaginary file (`modules/styles/$modulestype/$modulename/$platform.less`)…

```css
bg-button {
  background: green;
}
```

… will look like this, once compiled.
`bradypodion.css`

```css
.$platform bg-button {
  background: green;
}
```

You *can* create and import as many other files within the module's folder as you like, but you are encouraged to group them in platform folders.
