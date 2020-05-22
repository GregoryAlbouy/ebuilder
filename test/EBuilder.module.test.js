// const EBuilder = require('ebuilder-js')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const { window } = new JSDOM()
const EBuilder = require('ebuilder-js')

console.log(EBuilder('div'))