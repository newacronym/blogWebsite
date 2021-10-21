//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});


const homeStartingContent = " use /compose to go to writing mode and write your first ever blog. and the can use posts/titleName for going to that post";
const aboutContent = "Hi i am Harshit,I Love writing and creating";
const contactContent = "you can contact me @ itsharshit7@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title:String,
  content:String
};

const Post = mongoose.model("Post",postSchema);

app.get("/",function(req,res){
  Post.find({},function(err,posts){
    res.render("home",{
      startingContent:homeStartingContent,
      posts:posts
    });
  });
});
app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});
app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});
app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postId",function(req,res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id:requestedPostId},function(err,post){
    res.render("post",{
      title:post.title,
      content:post.content
    });
  });
});

app.post("/compose",function(req,res){
  const post = new Post({
    title: req.body.postTitle,
    content:req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
