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
      // Transform each property declaration here
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
          const matchStr = match.match,
          re = RegExp(escapeRegex(matchStr), 'gi')

          console.log({found: matchStr, regex: re, value: decl.value})
          let more_matches = true
          while (more_matches) {
            decl.value.replace(match.match, colors[name])
            // if (matchPos === -1) {
            let matchPos = decl.value.indexOf(match.match)
            console.log(matchPos)
            // if (matchPos == -1) {
              more_matches = false
            // }
            // }
          }
          // declValue.replace(matchStr, colors[name])
          console.log({
            found: match.match,
            changed_to: colors[name],
            value_now: decl.value,
            decl_now: decl.toString(),
          })

        }
      })
    })
    // console.log('All colours:')
    // console.log(colors)
  }
})


module.exports.postcss = true
