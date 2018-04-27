const mocha = require("mocha");
const request = require("supertest");

const describe = mocha.describe;
const it = mocha.it;

const app = require("../app");

describe("POST /api", () => {
  describe("Content-Type: text/css", () => {
    const input = "a { color: red; }\ndiv { color: black }";

    it("should return the same CSS that was passed in", done => {
      request(app)
        .post("/api")
        .type("text/css")
        .send(input)
        .expect(200, input)
        .end(done);
    });

    it("should return the compressed CSS", done => {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/css")
        .send(input)
        .expect(200, "a{color:red}div{color:#000}")
        .end(done);
    });
  });

  describe("Content-Type: text/less", () => {
    const input = "@red: #ff0000;\na { color: #00ff00;\n.red { color: @red; }}";

    it("should return the LESS compiled to CSS", done => {
      request(app)
        .post("/api")
        .type("text/less")
        .send(input)
        .expect(
          200,
          "a {\n  color: #00ff00;\n}\na .red {\n  color: #ff0000;\n}\n"
        )
        .end(done);
    });

    it("should return the LESS compiled to CSS and compressed", done => {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/less")
        .send(input)
        .expect(200, "a{color:#00ff00}a .red{color:#ff0000}")
        .end(done);
    });

    it("should return http 400 on bad input", done => {
      request(app)
        .post("/api")
        .type("text/less")
        .send("some bad css")
        .expect(400)
        .end(done);
    });
  });

  describe("Content-Type: text/stylus", () => {
    const input = "form input\n  padding 5px\n  border 1px solid";

    it("should return the Stylus compiled to CSS", done => {
      request(app)
        .post("/api")
        .type("text/stylus")
        .send(input)
        .expect(200, "form input {\n  padding: 5px;\n  border: 1px solid;\n}\n")
        .end(done);
    });

    it("should return the Stylus compiled to CSS and compressed", done => {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/stylus")
        .send(input)
        .expect(200, "form input{padding:5px;border:1px solid}")
        .end(done);
    });

    it("should return http 400 on bad input", done => {
      request(app)
        .post("/api")
        .type("text/stylus")
        .send("some bad css")
        .expect(400)
        .end(done);
    });
  });

  describe("Content-Type: text/javascript", () => {
    const input = "var a = 123;\nfunction test(x) { return x; }";

    it("should return the same JavaScript that was passed in", done => {
      request(app)
        .post("/api")
        .type("text/javascript")
        .send(input)
        .expect(200, input)
        .end(done);
    });

    it("should return the compressed JavaScript", done => {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/javascript")
        .send(input)
        .expect(200, "var a=123;function test(t){return t}")
        .end(done);
    });
  });

  describe("Content-Type: text/coffeescript", () => {
    const input = 'alert "I knew it!" if elvis?';

    it("should return the CoffeeScript compiled to regular JavaScript", done => {
      request(app)
        .post("/api")
        .type("text/coffeescript")
        .send(input)
        .expect(
          200,
          '(function() {\n  if (typeof elvis !== "undefined" && elvis !== null) {\n    alert("I knew it!");\n  }\n\n}).call(this);\n'
        )
        .end(done);
    });

    it("should return the CoffeeScript compiled to regular JavaScript and compressed", done => {
      request(app)
        .post("/api")
        .query({ compress: true })
        .type("text/coffeescript")
        .send(input)
        .expect(
          200,
          '(function(){"undefined"!=typeof elvis&&null!==elvis&&alert("I knew it!")}).call(this);'
        )
        .end(done);
    });
  });
});
