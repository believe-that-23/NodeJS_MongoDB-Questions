const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

// Set up view engine and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const routes = require('./routes');
app.use('/', routes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// const express=require("express"),ejs=require("ejs"),bodyParser=require("body-parser"),app=express(),routes=(app.set("view engine","ejs"),app.use(express.static("public")),app.use(bodyParser.urlencoded({extended:!0})),require("./routes")),port=(app.use("/",routes),3e3);app.listen(port,()=>{console.log("Server is running on http://localhost:"+port)});