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
app.get("/home", (req, res) => {
    article.find((err, articles) => {
        console.log(articles);
        res.render("index", { articles : articles });
    });
});

app.get("/", (req, res) => {

    // ============= AXIOS REQUEST ================
    axios.get("https://www.theonion.com/").then((response) => {
        const $ = cheerio.load(response.data);
        
        
        $("h1.sc-759qgu-0").map((i, element) => {
            let heading = $(element).text();
            let url = $(element).parent().attr("href");
            let articleDocument = { "articleTitle" : heading, "urlLink" : url };
            
            console.log(heading);
            console.log(url);

            article.create(
                articleDocument, 
            ).then((data) => {
                // console.log(data);
                article.find({}, (err, articles) => {
                    console.log(articles);
                });
                console.log(articleDocument);
            }).catch((error) => {
                console.log(error);
            });

        });

    });

    res.redirect("/home");
});

app.listen(PORT, () => {
    console.log("server is listening on port ", PORT);
});