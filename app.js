//jshint esversion: 6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
 
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articlesSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articlesSchema);

// Requests targeting all articles

app.route("/articles")
    .get((req, res)=>{

        Article.find({}, (err, foundArticles)=>{
            if(!err){
                res.send(foundArticles);
            } else {
                res.send(err)
            };
        });

    })
    .post((req, res)=>{

        const title = req.body.title;
        const content = req.body.content;
    
        const newArticle = new Article({
            title: title,
            content: content
        });

        newArticle.save((err)=>{
            if(!err){
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });

    })
    .delete((req, res)=>{

        Article.deleteMany({}, (err)=>{
            if(!err){
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            };  
        });

    });

// Requests targeting specific article

app.route("/articles/:articleTitle")
    .get((req, res)=>{

        Article.findOne({title: req.params.articleTitle}, (err, foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.")
            }
        });

    })
    .put((req, res)=>{

        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            (err) =>{
                if(!err) {
                    res.send("Successfully updated the requested article.")
                } else {
                    res.send(err);
                };
            }
        );

    })
    .patch((req, res)=>{

        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err)=>{
                if(!err){
                    res.send("Successfully replaced the article property/properties.");
                } else {
                    res.send(err);
                };
            }
        );

    })
    .delete((req, res)=>{

        Article.deleteOne(
            {title: req.params.articleTitle},
            (err)=>{
                if(!err){
                    res.send("Successfully deleted the specified article");
                } else {
                    res.send(err);
                };
            }
        );

    });

app.listen(3000, ()=>{
    console.log("Server is up and running on port 3000");
});