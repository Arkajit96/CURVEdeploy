var express = require("express");
var router  = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");


//INDEX - show all blogs
router.get("/", function(req, res){
    // Get all blogs from DB
    Blog.find({"check": true}, function(err, allBlogs){
       if(err){
           console.log(err);
       } else {
           //res.send(allBlogs);
          res.send(allBlogs);
          //res.render("blogs/index",{blogs:allBlogs});
       }
    });
});

//CREATE - add new blog to admin and wait for checking by admin 
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to blogs array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    // new 2 lines!
    var check = false;
    var newBlog = {name: name, image: image, description: desc, author:author, check:check}
    // Create a new blog and save to DB
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to blogs page
            console.log(newlyCreated);
            res.redirect("/blogs");
        }
    });
});

//NEW - show form to create new blog
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("blogs/new"); 
});

// SHOW - shows more info about one blog
router.get("/:id", function(req, res){
    //find the blog with provided ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            console.log(foundBlog)
            //render show template with that blog
            res.send(foundBlog);
            //res.render("blogs/show", {blog: foundBlog});
        }
    });
});

// EDIT BLOG ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        res.render("blogs/edit", {blog: foundBlog});
    });
});

// UPDATE BLOG ROUTE
router.put("/:id",middleware.checkBlogOwnership, function(req, res){
    // find and update the correct blog
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           //redirect somewhere(show page)
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

// DESTROY BLOG ROUTE
router.delete("/:id",middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          console.log(err);
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   });
});


module.exports = router;

