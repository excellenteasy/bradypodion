# Contributing to Bradypodion

Adhere to these [commit message conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y).

## Prerequisites

Install the grunt CLI:
```bash
npm install -g grunt-cli
```
Clone the repository:
```
git clone git@github.com:excellenteasy/bradypodion.git
```
Install dependencies:
```bash
cd bradypodion
npm install
```

## Development

During development you need to run the `dev` task. It will install bower dependencies and build & test your files on change.
```bash
grunt dev
```

### Coffeescript

Adhere to the [coffeescript styleguide](https://github.com/excellenteasy/styleguides/blob/master/coffee.md).
Add unit tests and documentation for any new or changed functionality.

### Less
> Convention over Configuration

The build process relies on conventions.
You need to create a `less` folder within a directive.
`modules/directives/*/less/`
There is a special treatment for these files.
* `general.less`: Contains general styles for your directive.
* `$platform.less`(android|ios|ios7): Contains platform specific styles.

NOTE: Platforms will be namespaced whenever you build more than one.

`modules/directives/*/less/$platform.less`

```less
bg-button {
  background: green;
}
```

`bradypodion.css`

```css
.$platform bg-button {
  background: green;
}
```

You *can* create and import as many other files within the less folder as you like, but you are encouraged to group them in platform folders.
