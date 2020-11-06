const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

const fixtures = [
  {
    desc: 'equivalent_hexes',
    input: '.foo { color: #888; } .bar { color: #888888; }',
    output: '.foo { color: $color_0; } .bar { color: $color_0; }',
  },
  {
    desc: 'name_vs_hex',
    input: '.classname {\n  background-image: url("image-white.png");\n  color: #fff;\n}',
    output: '.classname {\n  background-image: url("image-white.png");\n  color: $color_0;\n}',
  },
  {
    desc: 'comment',
    input: '/* This is a comment with #000000 in it */\n',
    output: '/* This is a comment with #000000 in it */\n',
  },
  {
    desc: 'named',
    input: '#crazy {\n  color: black;\n  /* a named color! */\n  background-color: rebeccapurple;\n}',
    output: '#crazy {\n  color: $color_0;\n  /* a named color! */\n  background-color: $color_1;\n}',
  },
  {
    desc: 'url_with_hash',
    input: '.weird-behavior {\n  behavior: url(#default#VML);\n}',
    output: '.weird-behavior {\n  behavior: url(#default#VML);\n}',
  },
  {
    desc: 'misleading_name',
    input: '.glyphicon {\n  -moz-osx-font-smoothing: grayscale;\n}',
    output: '.glyphicon {\n  -moz-osx-font-smoothing: grayscale;\n}',
  },
  {
    desc: 'tricky input',
    input: [
      '.classnameWithoutColorName .widget.button-widget {\n  margin: auto 2px;\n  border-color: #b1afb0;\n}\n',
      '.grey .widget.button-widget a:link, .grey .widget.button-widget a:hover {\n  color: #b1afb0;\n}'
    ].join(''),
    output: [
      '.classnameWithoutColorName .widget.button-widget {\n  margin: auto 2px;\n  border-color: $color_0;\n}\n',
      '.grey .widget.button-widget a:link, .grey .widget.button-widget a:hover {\n  color: $color_0;\n}'
    ].join(''),
  },
  {
    desc: 'background colour',
    input: '.classname {\n  background: url(image.png) white;\n}',
    output: '.classname {\n  background: url(image.png) $color_0;\n}',
  },
  {
    desc: 'two colours, one declaration',
    input: '.classname {\n  background-image: -webkit-linear-gradient(#000, #020202);\n  color: #000000;\n}',
    output: '.classname {\n  background-image: -webkit-linear-gradient($color_0, $color_1);\n  color: $color_0;\n}',
  },
  {
    desc: 'two colours, one declaration, extra parens',
    input: '.classname {\n  background-image: -webkit-linear-gradient(rgba(0,0,0,1), #020202);\n  color: #000000;\n}',
    output: '.classname {\n  background-image: -webkit-linear-gradient($color_0, $color_1);\n  color: $color_0;\n}',
  },
  {
    desc: 'name_vs_hex_2',
    input: '.classname {\n  background: url(image.png) white;\n  color: #fff;\n}',
    output: '.classname {\n  background: url(image.png) $color_0;\n  color: $color_0;\n}',
  },
  {
    desc: 'longer_comment',
    input: [
      '@-webkit-keyframes spin {\n',
      '  /* This comment used to break things */\n',
      '  0% {\n    -webkit-transform: rotate(0deg);\n    color: black;\n  }\n',
      '  100% {\n    -webkit-transform: rotate(360deg);\n    /* It should still pick this one up */\n    color: $FFA;\n',
      '  }\n}'
    ].join(''),
    output: [
      '@-webkit-keyframes spin {\n',
      '  /* This comment used to break things */\n',
      '  0% {\n    -webkit-transform: rotate(0deg);\n    color: $color_0;\n  }\n',
      '  100% {\n    -webkit-transform: rotate(360deg);\n    /* It should still pick this one up */\n    color: $color_1;\n',
      '  }\n}'
    ].join(''),
  }
]

fixtures.forEach(fixture => {
  it('can parse ' + fixture.desc, async () => {
    await run(
      fixture.input,
      fixture.output,
      {}
    )
  })
})
