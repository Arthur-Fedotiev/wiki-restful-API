//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//+++++++++++Create & Connect new Database named wikiDB++++++++++++++

mongoose.connect(
  "mongodb+srv://admin-arthur:711067a711067a@cluster0.iwbim.mongodb.net/wikiDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.set("useFindAndModify", false);

//+++++++++++Create new Models & Schemas for documents++++++++++++++

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articlesSchema);

//-----------------------------REQUESTS targeting  ALL Articles----------------------
app
  .route("/articles")

  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully made post request.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//-----------------------REQUESTS targeting  a Specific Article---------------------------------
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (
      err,
      foundArticle
    ) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err, statusCode) {
        if (!err) {
          res.send("Successfully changed document");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    console.log(req.body);
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Success updated");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    console.log(req.params.articleTitle);
    Article.deleteOne({ title: req.params.articleTitle }, function (
      err,
      result
    ) {
      if (!err) {
        res.send("Article deleted");
        console.log(result);
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
