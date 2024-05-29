'use strict'

const tagnames = `div h1 h2 h3 h4 h5 h6 span
a article aside br details header hgroup hr footer nav p section summary
button datalist fieldset form input keygen label legend meter optgroup option
select textarea abbr accronym address b bdi bdo big blockquote cite code del
dfn em i ins kbd mark output pre progress q rp rt ruby s samp small strike
strong sub sup tt u var wbr dd dir dl dt li ol menu ul caption col colgroup
table tbody td tfoot thead th tr noscript script area audio canvas embed
figcaption figure frame frameset iframe img image map noframes object param source
time video`.split(/\s+/)
const svgtags = `svg g line`.split(/\s+/)

function mkel(t, names, attrs, block) {
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

    const idList = []
    const mixedList = []
    const anchorList = []
    const classList = []

    names.forEach(n=> {
      if (n[0] == '#') idList.push(n.slice(1))
      else if (n[0] == '$') mixedList.push(n.slice(1))
      else if (n[0] == '@') anchorList.push(n.slice(1))
      else classList.push(n)
    })

    if (idList.length > 1) throw 'Error: multiple IDs specified'
    if (mixedList.length > 1) throw 'Error: multiple anchor IDs specified'
    if (anchorList.length > 1) throw 'Error: multiple anchors specified'
    if (anchorList.length && mixedList.length) throw 'Error: multiple anchors specified'
    if (idList.length && mixedList.length) throw 'Error: multiple IDs specified'

    let id = mixedList[0] || idList[0]
    let classes = classList.length ? classList : false
    if (mixedList[0]) mixedList[0] = cc(mixedList[0])
    let anchor = mixedList[0] || anchorList[0]

    if (id) el.id = id
    if (classes) el.classList.add(...classes)
    if (anchor) el.setAttribute('anchor', anchor)
    if (t == 'input' && id) el.setAttribute('name', id)
  } else if (typeof(names) == 'object') {
    const akeys = Object.keys(names)
    let a
    for (let i = 0; i < akeys.length; i++) {
      a = akeys[i]
      el.setAttribute(a, names[a])
    }
  }
  if (typeof(attrs) == 'function') {
    block = attrs
    attrs = null
  } else if (typeof(attrs) == 'object') {
    const akeys = Object.keys(attrs)
    let a
    for (let i = 0; i < akeys.length; i++) {
      a = akeys[i]
      el.setAttribute(a, attrs[a])
    }
  }
  const ctx = context()
  if (block) block.call(ctx, ctx)
  ctx.els.forEach(e=> el.append(e))
  return el
}

function cc(s) {
  return s.replace(/-([a-z])/g, c=> c[1].toUpperCase())
}

function text(s) {
  return document.createTextNode(s)
}

function wrap(f, collection, ...args) {
  const o = f(...args)
  collection.push(o)
  return o
}

const tags = {
  text: function(...args) {
    return text(...args)
  }
}

tagnames.forEach(tn=> {
  tags[tn] = function(names, attrs, block) {
    return mkel(tn, names, attrs, block)
  }
})
svgtags.forEach(tn=> {
  tags[tn] = function(names, attrs, block) {
    return mkel(['http://www.w3.org/2000/svg', tn], names, attrs, block)
  }
})

function context() {
  const els = []
  function context(str) {
    return wrap(text, els, str)
  }
  context.mkel = function(...args) { return wrap(mkel, els, ...args) }
  Object.keys(tags).forEach(tag=> {
    context[tag] = function(...args) { return wrap(tags[tag], els, ...args) }
  })
  context.els = els
  return context
}

function start(anchor, block) {
  const anchors = {}
  if (typeof(anchor) == 'function') {
    block = anchor
    anchor = document.body
  }
  const ctx = context()
  if (block) block.call(ctx, ctx)
  ctx.els.forEach(e=> {
    if (e.hasAttribute('anchor')) anchors[e.getAttribute('anchor')] = e
    e.querySelectorAll('[anchor]').forEach(n=> {
      anchors[n.getAttribute('anchor')] = n
    })
    anchor.append(e)
  })
  return anchors
}

const html = { start, mkel }
tagnames.forEach(tn=> html[tn] = tags[tn])
svgtags.forEach(tn=> html[tn] = tags[tn])

module.exports = html
