const pipetteur = require('pipetteur'),
postcss = require("postcss"),
stripUrl = /url\(['|"]?.*?['|"]?\)/

function escapeRegex(string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = postcss.plugin("postcss-colour-tokenizer", function() {
  return function(root) {
    let colors = {}
    root.walkDecls(decl => {
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
    })
    console.log(colors)
  }
})

module.exports.postcss = true
