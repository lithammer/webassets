const request = require("supertest");
const uglifyJS = require("uglify-js");
const cleanCSS = require("clean-css");
const coffeeScript = require("coffeescript");

const app = require("../app");

describe("POST /api", function() {
  describe("Content-Type: text/css", function() {
    const css = "a { color: red; }\ndiv { color: black }";

    it("should return the same CSS that was passed in", function(done) {
      request(app)
        .post("/api")
        .type("text/css")
        .send(css)
        .expect(200, css)
        .end(done);
    });

    it("should return the compressed CSS", function(done) {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/css")
        .send(css)
        .expect(200, new cleanCSS().minify(css))
        .end(done);
    });
  });

  describe("Content-Type: text/less", function() {
    const parser = new (require("less")).Parser();

    const less = "@red: #ff0000;\na { color: #00ff00;\n.red { color: @red; }}";
    let cless; /* Compiled */
    let ccless; /* Compiled and compressed */

    parser.parse(less, function(e, tree) {
      cless = tree.toCSS();
      ccless = tree.toCSS({ compress: true });
    });

    it("should return the LESS compiled to CSS", function(done) {
      request(app)
        .post("/api")
        .type("text/less")
        .send(less)
        .expect(200, cless)
        .end(done);
    });

    it("should return the LESS compiled to CSS and compressed", function(done) {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/less")
        .send(less)
        .expect(200, ccless)
        .end(done);
    });

    it("should return http 400 on bad input", function(done) {
      request(app)
        .post("/api")
        .type("text/less")
        .send("some bad css")
        .expect(400)
        .end(done);
    });
  });

  describe("Content-Type: text/stylus", function() {
    const parser = require("stylus");
    const stylus = "form input\n  padding 5px\n  border 1px solid";
    let compiled;
    let compressed;

    parser(stylus).render(function(err, css) {
      compiled = css;
    });

    parser(stylus, { compress: true }).render(function(err, css) {
      compressed = css;
    });

    it("should return the Stylus compiled to CSS", function(done) {
      request(app)
        .post("/api")
        .type("text/stylus")
        .send(stylus)
        .expect(200, compiled)
        .end(done);
    });

    it("should return the Stylus compiled to CSS and compressed", function(done) {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/stylus")
        .send(stylus)
        .expect(200, compressed)
        .end(done);
    });

    it("should return http 400 on bad input", function(done) {
      request(app)
        .post("/api")
        .type("text/stylus")
        .send("some bad css")
        .expect(400)
        .end(done);
    });
  });

  describe("Content-Type: text/javascript", function() {
    const js = "var a = 123;\nfunction test(x) { return x; }";

    it("should return the same JavaScript that was passed in", function(done) {
      request(app)
        .post("/api")
        .type("text/javascript")
        .send(js)
        .expect(200, js)
        .end(done);
    });

    it("should return the compressed JavaScript", function(done) {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/javascript")
        .send(js)
        .expect(200, uglifyJS.minify(js, { fromString: true }).code)
        .end(done);
    });
  });

  describe("Content-Type: text/coffeescript", function() {
    const cs = 'alert "I knew it!" if elvis?';

    it("should return the CoffeeScript compiled to regular JavaScript", function(done) {
      request(app)
        .post("/api")
        .type("text/coffeescript")
        .send(cs)
        .expect(200, coffeeScript.compile(cs))
        .end(done);
    });

    it("should return the CoffeeScript compiled to regular JavaScript and compressed", function(done) {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/coffeescript")
        .send(cs)
        .expect(
          200,
          uglifyJS.minify(coffeeScript.compile(cs), { fromString: true }).code
        )
        .end(done);
    });
  });
});
