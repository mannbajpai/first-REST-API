//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});

const articlesSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articlesSchema);

//For All the Articles

app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }

        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully Added a new Article.");
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("All the articles deleted successfully.")
            } else {
                res.send(err);
            }
        });
    });

// For a Particular Article

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("NO Article Found!");
            }
        })
    })
    .put((req, res) => {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            },
            (err) => {
                if (!err) {
                    res.send("Successfully Updated ")
                }
            }
        )
    })
    .patch((req, res) => {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: {
                    content: req.body.content
                }
            },
            (err) => {
                if (!err) {
                    res.send("Successfully Patched")
                }
            }
        )
    })
    .delete((req, res) => {
        Article.deleteOne({
                title: req.params.articleTitle
            },
            (err) => {
                if (!err) {
                    res.send("Successfully Deleted!")
                }
            }
        )
    });


app.listen(3000, function () {
    console.log("Server started on port 3000");
});