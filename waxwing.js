'use strict'


const tagnames = `div h1 h2 h3 h4 h5 h6 span
a article aside br details header hgroup hr footer nav p section summary
button datalist fieldset form input keygen label legend meter optgroup option
select textarea abbr accronym address b bdi bdo big blockquote cite code del
dfn em i ins kbd mark output pre progress q rp rt ruby s samp small strike
strong sub sup tt u var wbr dd dir dl dt li ol menu ul caption col colgroup
table tbody td tfoot thead th tr noscript script area audio canvas embed
figcaption figure frame frameset iframe image map noframes object param source
time video`

const svgtags = `svg g line`


// div('foo')
// div('foo', c=>{})
// div(c=>{})
// div({id: 'foo', h: 100})
// div({id: 'foo', h: 100}, c=>{})

function mkel(t, names, block) {
  let el
  if (Array.isArray(t)) {
    el = document.createElementNS(t[0], t[1])
  } else {
    el = document.createElement(t)
  }
  if (typeof(names) == 'function') {
    block = names
    names = null
  } else if (typeof(names) == 'string') {
    names = names ? names.split(/\s+/) : []
    let id = false
    let classes = false
    if (names[0] && names[0][0] == '#') {
      id = names[0].slice(1)
      classes = names.slice(1)
      if (!id.length) id = false
      if (!classes.length) classes = false
    } else {
      classes = names.length ? names : false
    }
    if (id) el.id = id
    if (classes) el.classList.add(...classes)
  } else if (typeof(names) == 'object') {
    const attrs = Object.keys(names)
    let attr
    for (let i = 0; i < attrs.length; i++) {
      attr = attrs[i]
      el.setAttribute(attr, names[attr])
    }
  }
  const ctx = context()
  if (block) block.call(ctx, ctx)
  ctx.els.forEach(e=> el.append(e))
  return el
}

function text(s) {
  return document.createTextNode(s)
}

function wrap(f, collection, ...args) {
  collection.push(f(...args))
}

const tags = {
  text: function(...args) {
    return text(...args)
  }
}

tagnames.split(/\s+/).forEach(tn=> {
  tags[tn] = function(names, block) {
    return mkel(tn, names, block)
  }
})
svgtags.split(/\s+/).forEach(tn=> {
  tags[tn] = function(names, block) {
    return mkel(['http://www.w3.org/2000/svg', tn], names, block)
  }
})

function context() {
  const c = {}
  c.els = []
  c.mkel = function(...args) { wrap(mkel, c.els, ...args) }
  Object.keys(tags).forEach(tag=> {
    c[tag] = function(...args) { wrap(tags[tag], c.els, ...args) }
  })
  return c
}

function start(block) {
  const ctx = context()
  if (block) block.call(ctx, ctx)
  ctx.els.forEach(e=> document.body.append(e))
}

const html = { start, mkel }
tagnames.split(/\s+/).forEach(tn=> html[tn] = tags[tn])
svgtags.split(/\s+/).forEach(tn=> html[tn] = tags[tn])

module.exports = html
