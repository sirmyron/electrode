import { expect } from "chai";
import { template as template1 } from "../data/template1";
import { template as template2 } from "../data/template2";
import { describe, it } from "mocha";

describe("tag template", function () {
  it("should create a TagTemplate from ES6 template literal strings", () => {
    expect(template1._templateTags[0].str).to.equal("<html>\n<head>");
    const ssrToken = template1.findTokensById(`ssr-content`);
    expect(ssrToken).to.exist;
  });

  describe("_findTokenIndex", function () {
    it("should validate and return index", () => {
      expect(template2._findTokenIndex(null, null, 0)).to.equal(0);
      expect(template2._findTokenIndex(null, null, 1)).to.equal(1);
      expect(template2._findTokenIndex(null, null, 2)).to.equal(2);
      expect(template2._findTokenIndex(null, null, 3)).to.equal(3);
    });

    it("should find token by id and return its index", () => {
      expect(template2._findTokenIndex("webapp-body-bundles")).to.equal(3);
    });

    it("should return false if token by id is not found", () => {
      expect(template2._findTokenIndex("foo-bar")).to.equal(false);
    });

    it("should find token by str and return its index", () => {
      const ix = template2._findTokenIndex(null, `console.log("test")`);
      expect(ix).to.be.above(0);
    });

    it("should return false if token by str is not found", () => {
      expect(template2._findTokenIndex(null, `foo-bar-test-blah-blah`)).to.equal(false);
      expect(template2._findTokenIndex(null, /foo-bar-test-blah-blah/)).to.equal(false);
    });

    it("should throw if id, str, and index are invalid", () => {
      /* @ts-ignore */
      expect(() => template2._findTokenIndex(null, null, "")).to.throw(
        `invalid id, str, and index`
      );
    });

    it("should return first token by default", () => {
      expect(template2._findTokenIndex()).equal(0);
    });

    it("should throw if index is out of range", () => {
      expect(() => template2._findTokenIndex(null, null, -1)).to.throw(`index -1 is out of range`);
      expect(() =>
        template2._findTokenIndex(null, null, template2._templateTags.length + 100)
      ).to.throw(` is out of range`);
    });
  });

  describe("findTokenByStr", function () {
    it("should find tokens by str and return result", () => {
      const x = template2.findTokensByStr(`html`, template2._templateTags.length);
      expect(x.length).to.equal(2);
      const x2 = template2.findTokensByStr(/html/, 1);
      expect(x2.length).to.equal(1);
      const x3 = template2.findTokensByStr(/html/, 0);
      expect(x3.length).to.equal(0);
    });

    it("should return false if token by str is not found", () => {
      expect(template2.findTokensByStr(`foo-bar-test-blah-blah`)).to.deep.equal([]);
      expect(template2.findTokensByStr(/foo-bar-test-blah-blah/, null)).to.deep.equal([]);
    });

    it("should throw if matcher is invalid", () => {
      expect(() => template2.findTokensByStr(null)).to.throw("matcher must be a string or RegExp");
    });
  });
});
