const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let articleSchema = new Schema({
    articleTitle: {
        type: String,
        trim: true,
        // unique: true,
        // index: true
    },
    
    urlLink: {
        type: String,
        // unique: true,
        // index: true
    },
    summary: {
        type: String
    },

    comments: [{
        body: String,
        date: Date,
    }]
});

let articleModal = mongoose.model("myArticleCollection", articleSchema); 
module.exports = articleModal;