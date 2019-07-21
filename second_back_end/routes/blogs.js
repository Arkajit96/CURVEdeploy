var express = require("express");
var router  = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");


//INDEX - show all blogs
router.get("/", function(req, res){
    // Get all blogs from DB
    console.log("show blogs");
    Blog.find({"check": true}, function(err, allBlogs){
<<<<<<< HEAD
       if(err){
           console.log(err);
       } else {
           //res.send(allBlogs);
          res.send(allBlogs);
          //res.render("blogs/index",{blogs:allBlogs});
       }
=======
        if(err){
            req.flash("error", err.message);
            res.render("landing");
        } else {
            //res.send(allBlogs);
            res.render("blogs/index",{blogs:allBlogs});
        }
>>>>>>> 782cf0c457c20d5814beb0cd145ad6e9b519a845
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
        username: req.user.username,
        image: req.user.image
    };
    var time = new Date();
    time = time.toString();
    time = time.substring(0, time.length - 21);
    // new 2 lines!
    var check = false;
    var newBlog = {name: name, image: image, description: desc, author:author, check:check, time: time};
    // Create a new blog and save to DB
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            req.flash("error", err.message);
            res.render("landing");
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
            req.flash("error", err.message);
            res.render("landing");
        } else {
            console.log(foundBlog)
            //render show template with that blog
            res.send(foundBlog);
            //res.render("blogs/show", {blog: foundBlog});
        }
    });
});

router.get("/search/name", function(req, res){
    Blog.find({'name' : new RegExp(req.query.search, 'i')}, function(err, allBlogs){
        if(err){
            req.flash("error", err.message);
            res.render("landing");
        } else {
            res.send(allBlogs);
            // res.render("blogs/index",{blogs:allBlogs});
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
            req.flash("error", err.message);
            res.redirect("/blogs");
       } else {
           //redirect somewhere(show page)
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

router.put("/approve/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, {$set:{check:true}}, function(err, foundBlog) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/blogs");

        } else {
            res.redirect("back");
        }
    });
});

router.put("")


// DESTROY BLOG ROUTE
router.delete("/:id",middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
            req.flash("error", err.message);
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   });
});

module.exports = router;

