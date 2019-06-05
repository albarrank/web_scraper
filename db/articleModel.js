const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let articleSchema = new Schema({
    articleTitle: {
        type: String,
        trim: true,
    },
    
    urlLink: {
        type: String
    },

    comments: [{
        body: String,
        date: Date
    }]
});

let articleModal = mongoose.model("myArticleCollection", articleSchema); 
module.exports = articleModal;