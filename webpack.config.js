"use strict"


const path = require("path")

const MODE = process.env.NODE_ENV || "production"
const BUILD = process.env.HTAG_BUILD || "library"
let DIST = `./dist-${BUILD}-${MODE}`

let entry = "./build.js"
let rules = [
  { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
]

console.log(`BUILDING ${BUILD} IN ${MODE} TO ${DIST}`)

module.exports = {
  entry,
  mode: MODE,
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, DIST),
    filename: "waxwing.js",
    library: "waxwing",
    libraryTarget: "var",
  },
  module: { rules },
  resolve: {
    extensions: ['*', '.js']
  },
}
