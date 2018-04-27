const http = require("http");
const path = require("path");

const bodyParser = require("body-parser");
const cleanCSS = require("clean-css");
const coffeeScript = require("coffeescript");
const compression = require("compression");
const errorhandler = require("errorhandler");
const express = require("express");
const less = require("less");
const lessMiddleware = require("less-middleware");
const methodOverride = require("method-override");
const stylus = require("stylus");
const uglifyJS = require("uglify-js");

const app = express();
const textParser = bodyParser.text({
  type: [
    "text/coffeescript",
    "text/css",
    "text/javascript",
    "text/less",
    "text/stylus"
  ]
});

app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(compression());
app.use(methodOverride());
app.use(lessMiddleware(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "public")));

switch (process.env.NODE_ENV || "development") {
  case "development":
    app.use(errorhandler());
    break;
  case "production":
    break;
}

app.get("/", (req, res) => {
  res.render("index", { title: "Webassets" });
});

app.post("/api", textParser, function(req, res) {
  const compress = req.query.compress ? true : false;

  if (req.is("text/css")) {
    let body = req.body;

    if (compress) {
      body = new cleanCSS().minify(body);
    }
    res.type("text/css").send(body);
  }

  if (req.is("text/less")) {
    const parser = new less.Parser();

    parser.parse(req.body, function(err, tree) {
      if (err) {
        res.status(400).send();
      } else {
        const body = tree.toCSS({ compress: compress });
        res.type("text/css").send(body);
      }
    });
  }

  if (req.is("text/stylus")) {
    stylus(req.body, { compress: compress }).render((err, css) => {
      if (err) {
        res.status(400).send();
      } else {
        res.type("text/css").send(css);
      }
    });
  }

  if (req.is("text/javascript")) {
    let body = req.body;

    if (compress) {
      body = uglifyJS.minify(req.body, { fromString: true }).code;
    }

    res.type("text/javascript").send(body);
  }

  if (req.is("text/coffeescript")) {
    let body = coffeeScript.compile(req.body);

    if (compress) {
      body = uglifyJS.minify(body, { fromString: true }).code;
    }

    res.type("text/javascript").send(body);
  }
});

app.listen(app.get("port"), () =>
  console.log(`Express server listening on port ${app.get("port")}`)
);

module.exports = app;
