/*jshint multistr: true */
var expect = require('chai').expect;
var plugin = require('../dist/rollup-plugin-msx.cjs');
var path = require('path');

function fakePath(filename) {
  return path.join(process.cwd(), 'fakepath', filename);
}

describe('rollup-plugin-msx', function() {

  describe('#transform()', function() {
    var instance;

    before(function() {
      instance = plugin();
    });

    after(function() {
      instance = null;
    });

    describe('import statements', function() {

      it('should handle import something from "somewhere" statement', function() {
        var source = 'import something from "./somewhere";\nsomething(function() { return <div>test</div>; });\n';
        var code = instance.transform(source, fakePath('fakefile.msx'));
        var expected = 'import something from "./somewhere";\nsomething(function() { return {tag: "div", attrs: {}, children: ["test"]}; });\n';
        expect(code).to.equal(expected);
      });

      it('should handle import * as something from "somewhere" statement', function() {
        var source = 'import * as something from "./somewhere";\nsomething.test(function() { return <div>test</div>; });\n';
        var code = instance.transform(source, fakePath('fakefile.msx'));
        var expected = 'import * as something from "./somewhere";\nsomething.test(function() { return {tag: "div", attrs: {}, children: ["test"]}; });\n';
        expect(code).to.equal(expected);
      });

      it('should handle import { something } from "somewhere" statement', function() {
        var source = 'import { something } from "./somewhere";\nsomething(function() { return <div>test</div>; });\n';
        var code = instance.transform(source, fakePath('fakefile.msx'));
        var expected = 'import { something } from "./somewhere";\nsomething(function() { return {tag: "div", attrs: {}, children: ["test"]}; });\n';
        expect(code).to.equal(expected);
      });

    });

    describe('export statements', function() {

      it('should handle handle export default something statement', function() {
        var source = 'function something() {\
  return <div>test</div>;\
}\
export default something;\
';
        var code = instance.transform(source, fakePath('fakefile.msx'));
        var expected = 'function something() {\
  return {tag: "div", attrs: {}, children: ["test"]};\
}\
export default something;\
';
        expect(code).to.equal(expected);
      });

      it('should handle handle export default function something() { ... } statement', function() {
        var source = 'export default function something() {\
  return <div>test</div>;\
}\
';
        var code = instance.transform(source, fakePath('fakefile.msx'));
        var expected = 'export default function something() {\
  return {tag: "div", attrs: {}, children: ["test"]};\
}\
';
        expect(code).to.equal(expected);
      });

      it('should handle handle export something statement', function() {
        var source = 'function something() {\
  return <div>test</div>;\
}\
export something;\
';
        var code = instance.transform(source, fakePath('fakefile.msx'));
        var expected = 'function something() {\
  return {tag: "div", attrs: {}, children: ["test"]};\
}\
export something;\
';
        expect(code).to.equal(expected);
      });

      it('should handle handle export { something, somethingElse } statement', function() {
        var source = 'function something() {\
  return <div>test</div>;\
}\
var somethingElse = true;\
export { something, somethingElse };\
';
        var code = instance.transform(source, fakePath('fakefile.msx'));
        var expected = 'function something() {\
  return {tag: "div", attrs: {}, children: ["test"]};\
}\
var somethingElse = true;\
export { something, somethingElse };\
';
        expect(code).to.equal(expected);
      });

    });

  });

  describe('#transform(options)', function() {

    describe('custom extension', function() {

      it('should transform files with matching custom extension', function() {
        var instance = plugin({ext: 'js'});
        var code = instance.transform('export default function something() { return <div>test</div>; }', fakePath('fakefile.js'));
        expect(code).to.not.be.null;
      });

      it('should not transform files with non-matching extension', function() {
        var instance = plugin({ext: 'js'});
        var code = instance.transform('export default function something() { return <div>test</div>; }', fakePath('fakefile.msx'));
        expect(code).to.be.null;
      });

    });

  });

});
