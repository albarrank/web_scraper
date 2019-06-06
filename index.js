// ============ REQUIRE NODE PACKAGES =====================
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
const article = require("./db/articleModel");

// ============= SET UP MONGOOSE TO USE MONGODB ===========
mongoose.connect("mongodb://localhost/kevDatabase", { 
    useNewUrlParser: true 
});
mongoose.set('useFindAndModify', false);

let PORT = 3000;

const app = express();

// ============= CONFIGURE "app" TO TAKE IN USER SUBMITTED DATA ===========
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// ============= CONFIGURE VIEW ENGINE TO USE "express-handlbars" ==========
app.engine("handlebars", exphbs({ defaultLayout : "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"))


// ============= SET UP POST ROUTES ================


// ============= SET UP GET ROUTES ================
app.get("/test", (req, res) => {
    res.render("index");
});

app.get("/home", (req, res) => {

    // ============= AXIOS REQUEST ================
    axios.get("https://www.theonion.com/").then((response) => {
       
        const $ = cheerio.load(response.data);
        
        
        $("h1.sc-759qgu-0").map((i, element) => {
            
            let heading = $(element).text();
            let url = $(element).parent().attr("href");
            let articleDocument = { "articleTitle" : heading, "urlLink" : url };
            

            article.find((err, articles) => {

                if (articleDocument.articleTitle === articles[i].articleTitle || articles[i] === undefined) {
                    console.log("article already exists") 
                } 
                else {
                    article.create(
                        articleDocument, 
                    ).then((data) => {
                        // console.log(data);
                    }).catch((error) =>{
                        if (error) {
                            throw error;
                        }
                    });
                }
            });

        });

        article.find((err, articles) => {
            if (err) {
                throw err;
            }
            console.log(articles);
            res.render("index", { articles : articles });
        });
    });

});

app.get("/article/:article", (req,res) => {
    let title = req.params.article;

    article.findOne({"articleTitle" : title }, (err, data) => {
        if (err) {
            throw err;
        }
            
    
        axios.get(data.urlLink).then((response) => {                
            const $ = cheerio.load(response.data);
            
            
            $("div.post-content").map((i, element) => {
                let summary = $(element).children("p").text();
                console.log(summary);

                let articleDocument = { "summary" : summary };
    
                article.findOneAndUpdate({ 
                   "articleTitle" : title,
                    "summary": summary
                }, (err, doc) => {
                    console.log(doc);
                    if (articles.summary === summary) {
                        console.log("article already exists") 
                    } else {
                        throw err;
                    }
                    res.render("article", {data: articles});
                });
    
    
            });
        });
    });
});

app.listen(PORT, () => {
    console.log("server is listening on port ", PORT);
});