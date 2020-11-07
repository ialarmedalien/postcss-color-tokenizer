const pipetteur = require('pipetteur'),
stripUrl = /url\(['|"]?.*?['|"]?\)/

function escapeRegex(string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = () => {
  return {
    postcssPlugin: 'postcss-colour-tokenizer',
    prepare() {
      let colors = {};
      return {
        Declaration(decl) {
          const cleanValue = decl.value.replace(stripUrl, ''),
          matches = pipetteur(cleanValue)
          matches.forEach(function (match) {
            const name = match.color.cssa();
            match.cssa = name
            if (!(name in colors)) {
              colors[name] = '$color_' + Object.keys(colors).length;
            }
            if (decl.value === match.match) {
              decl.value = colors[name]
            }
            else {
              let matchStrRegex = escapeRegex(match.match),
              re = RegExp(matchStrRegex, 'gi')
              decl.value = decl.value.replace(re, colors[name])
            }
          })
        },
        OnceExit() {
          console.log(colors);
          colors = {};
        },
      };
    },
  }
}

module.exports.postcss = true
