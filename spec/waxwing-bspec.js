describe("mkel", function() {
  it("should create arbitrary elements", function () {
    const el1 = waxwing.mkel("div", "$foo bar baz", {other: "bat"})
    expect(el1.tagName).toBe("DIV")
    expect(el1.id).toBe("foo")
    expect(el1.attributes.anchor.value).toBe("foo")
    expect(el1.attributes.other.value).toBe("bat")
    expect(el1.classList.contains("bar")).toBeTrue()
    expect(el1.classList.contains("baz")).toBeTrue()
    const el2 = waxwing.mkel("dd", "#xxx @yyy zzz")
    expect(el2.tagName).toBe("DD")
    expect(el2.id).toBe("xxx")
    expect(el2.attributes.anchor.value).toBe("yyy")
    expect(el2.classList.contains("zzz")).toBeTrue()
    const el3 = waxwing.mkel("hr", {test: "true"})
    expect(el3.tagName).toBe("HR")
    expect(el3.attributes.test.value).toBe("true")
  })
  it("should create elements in arbitrary namespaces", function () {
    const el1 = waxwing.mkel(['http://www.w3.org/2000/svg', "rect"], "$foo bar baz", {other: "bat"})
    expect(el1.tagName).toBe("rect")
    expect(el1.id).toBe("foo")
    expect(el1.attributes.anchor.value).toBe("foo")
    expect(el1.attributes.other.value).toBe("bat")
    expect(el1.classList.contains("bar")).toBeTrue()
    expect(el1.classList.contains("baz")).toBeTrue()
  })
  it("should create hierarchies of elements", function () {
    const el1 = waxwing.mkel("div", c=> {
      c.h1("#title", c=> c("ALL ITEMS"))
      c.ul("#list", c=> {
        c.li("item", c=> c("item1"))
        c.li("item", c=> c("item2"))
        c.li("item", c=> c("item3"))
        c.li("item", c=> c("item4"))
      })
    })
    const el2 = el1.querySelector("#title")
    const el3 = el1.querySelector("#list")
    const el4 = el3.querySelectorAll("li.item")
    expect(el1.tagName).toBe("DIV")
    expect(el2.tagName).toBe("H1")
    expect(el3.tagName).toBe("UL")
    expect(el4.length).toBe(4)
  })
})

describe("context objects", function() {
  it("should create text elements", function () {
    const el1 = waxwing.mkel("div", c=> {
      c.text("t1 ")
      c.a("#link", {href: "example.com"}, c=> c("t2"))
      c(" t3 ")
      c.em("#last", c=> c.text("t4"))
    })
    const el2 = el1.querySelector("#link")
    const el3 = el1.querySelector("#last")
    expect(el1.tagName).toBe("DIV")
    expect(el2.tagName).toBe("A")
    expect(el2.attributes.href.value).toBe("example.com")
    expect(el3.tagName).toBe("EM")
    expect(el1.textContent).toBe("t1 t2 t3 t4")
    expect(el2.textContent).toBe("t2")
    expect(el3.textContent).toBe("t4")
  })
})

describe("start", function() {
  it("should anchor itself to the body by default", function () {
    const els = waxwing.start(c=> {
      c.p("$rise", c=> c("consider phlebas"))
      c.hr("$rule")
      c.p("$fall", c=> c("who was once handsome and tall as you"))
    })
    const el1 = document.getElementById("rise")
    const el2 = document.getElementById("rule")
    const el3 = document.getElementById("fall")
    expect(el1.tagName).toBe("P")
    expect(el1).toBe(els.rise)
    expect(el2.tagName).toBe("HR")
    expect(el2).toBe(els.rule)
    expect(el3.tagName).toBe("P")
    expect(el3).toBe(els.fall)
  })
  it("should anchor itself to any given element", function () {
    const root = document.createElement("div")
    const els = waxwing.start(root, c=> {
      c.p("$rise", c=> c("consider phlebas"))
      c.hr("$rule")
      c.p("$fall", c=> c("who was once handsome and tall as you"))
    })
    const el1 = root.querySelector("#rise")
    const el2 = root.querySelector("#rule")
    const el3 = root.querySelector("#fall")
    expect(el1.tagName).toBe("P")
    expect(el1).toBe(els.rise)
    expect(el2.tagName).toBe("HR")
    expect(el2).toBe(els.rule)
    expect(el3.tagName).toBe("P")
    expect(el3).toBe(els.fall)
  })
  it("should return all anchor elements", function () {
    const els = waxwing.start(c=> {
      c.div("@foo")
      c.span("$bar")
      c.script("@baz #bat quz")
    })
    expect(Object.keys(els).length).toBe(3)
    expect(els.foo.tagName).toBe("DIV")
    expect(els.bar.tagName).toBe("SPAN")
    expect(els.baz.tagName).toBe("SCRIPT")
  })
})