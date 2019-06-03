// ============ REQUIRE NODE PACKAGES =====================
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");

let PORT = 3000;

const app = express();

// ============= CONFIGURE "app" TO TAKE IN USER SUBMITTED DATA ===========
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// ============= CONFIGURE VIEW ENGINE TO USE "express-handlbars" ==========
app.engine("handlebars", exphbs({ defaultLayout : "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"))

// ============= SET UP GET ROUTES ================
app.get("/", function(req, res) {
    res.render("index");
});

app.listen(PORT, function() {
    console.log("server is listening on port ", PORT);
});