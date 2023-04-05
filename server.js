/////////////////////////////////////////////////////////Key Package Requirements
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();


/////////////////////////////////////////////////////////Mongoose Related
const mongoose = require('mongoose');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');

const uri = "mongodb+srv://vjkarthik2987:9Feb2014@cluster0.k8jiadi.mongodb.net/?retryWrites=true&w=majority";

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(uri, connectionParams)
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    });

const client = new MongoClient(uri);

/////////////////////////////////////////////////////////Setting up the app
app.use(express.static("public"));
app.set("view engine", "ejs");

/////////////////////////////////////////////////////////Other variables
const chapters = require("./models/chapters");
const themes = require("./models/themes");
const areas = require("./models/areas");
const books = require("./models/books");
const websites = require("./models/websites");
const videos = require("./models/videos");
const podcasts = require("./models/podcasts");
const areaDetails = require("./models/areaDetails");

/////////////////////////////////////////////////////////Routes
//Home Route
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/examples", (req, res) => {
    res.render("examples", {
        trends: themes
    });
});

//Example by Theme
app.get("/examples/:theme", (req, res) => {
    const theme = req.params.theme;
    const trend = themes[theme][0];
    const desc = themes[theme][1];

    const database = client.db('theMainDB');
    const examples = database.collection('examples');

    examples.find({
        trend: trend
    }).sort({
        "sl": -1
    }).toArray(function (err, examples) {
        res.render("themeexamples", {
            examples: examples,
            trend: trend,
            desc: desc,
        });
    });
});

//All Examples
app.get("/allExamples", (req, res) => {
    const database = client.db('theMainDB');
    const examples = database.collection('examples');
    examples.find({}).sort({
        "sl": -1
    }).toArray(function (err, examples) {
        res.render("allExamples", {
            examples: examples
        });
    });
});

//Themes
app.get("/themes", (req, res) => {
    res.render("themes", {
        themes: themes
    });
});

//Individual Themes
app.get("/themes/:theme", (req, res) => {
    const theme = req.params.theme;
    const trend = themes[theme][0];
    const database = client.db('theMainDB');
    const examples = database.collection('examples');

    examples.find({
        trend: trend
    }).sort({
        "sl": -1
    }).limit(10).toArray(function (err, examples) {
        res.render("themepage", {
            examples: examples,
            trend: trend,
            themes: themes,
            theme: theme,
        });
    });
})

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/document", (req, res) => {
    res.render("document", {
        chapters: chapters
    });
});

//////////////Resources
app.get("/resources", (req, res) => {
    res.render("resources", {
        books: books,
        websites:websites,
        videos:videos,
        podcasts:podcasts
    });
});

//////////////Surveys
app.get("/surveys", (req, res) => {
    res.render("surveys", {
        areas: areas,
        areaDetails: areaDetails
    });
});

//////////////Contact us
app.get("/contact", (req, res) => {
    res.render("contact");
});

//////////////Share your story
app.get("/share", (req, res) => {
    res.render("share");
});

//////////////Blogs
app.get("/blogs", (req, res) => {
    res.render("blogs");
});

//////////////Services
app.get("/services", (req, res) => {
    res.render("services");
});

//////////////Areas
app.get("/areas", (req, res) => {
    res.render("area", {
        areas: areas
    })
});

/////////////////Area Details
app.get("/details/:area", (req,res) =>{
    const area = req.params.area
    const isIndex = areaDetails.findIndex((element) => element.Area === area);
    const areaName = areaDetails[isIndex]['Area'];
    const oneLiner = areaDetails[isIndex]['One Liner'];
    const aBitMore = areaDetails[isIndex]['A bit more'];
    const areasCovered = areaDetails[isIndex]['Areas Covered'];
    const audience = areaDetails[isIndex]['Ideal Audience']; 
    const details = areaDetails[isIndex]['Details'];
    const mainArea = areaDetails[isIndex]['MainArea'];
    res.render("areaDetail", {areaName: areaName,
                             oneLiner: oneLiner,
                             aBitMore: aBitMore,
                             areasCovered: areasCovered,
                             audience: audience, 
                             details: details,
                             mainArea: mainArea});
});

//////////////OKRs
app.get("/okrs", (req, res) => {
    res.render("okrs");
});

app.get("/surveyForm", (req,res) => {
    res.render("surveyForm");
})

//////////////Workshops
app.get("/workshops", (req, res) => {
    res.render("workshops");
});


//App Listen
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started successfully");
});
