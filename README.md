# PostCSS Css Compare

[PostCSS] plugin to compare css files.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
    color: black;
    background: #fff;
    border: 2px solid rgb(0 0 0);
}
```

```css
.foo {
    color: $color_0;
    background: $color_1;
    border: 2px solid $color_0;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-color-tokenizer
```

**Step 2:** Check your project for an existing PostCSS config: `postcss.config.js` in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-color-tokenizer'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
