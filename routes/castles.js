const express = require("express");
const router = express.Router();
var Castle = require("../models/castles")
var Comment = require("../models/comments")
var middleware = require("../middleware")
router.get("/castles", function(req, res){
	Castle.find({}, function(err, allCastles){
		if(err){
			console.log(err)
		} else {
			res.render("castles/castles", {castles:allCastles});
		}
	});
});
//NEW CASTLE FORM
router.get("/castles/new", middleware.isLoggedIn, function(req, res){
	res.render("castles/new.ejs");	
});
//CREATE CASTLE
router.post("/castles", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var year = req.body.year;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCastle = {name: name, year:year, image: image, description: description, author:author};
    console.log(req.user);
	//create castle and save to DB
	Castle.create(newCastle, function(err, newC){
		if(err){
			console.log(err);
		} else {
			res.redirect("/castles")
		}
	});
});
//SHOW CASTLE INFO
router.get("/castles/:id", function(req, res){
	//FIND CASTLE WITH ID
	Castle.findById(req.params.id).populate("comments").exec(function(err, castle){
		if(err || !castle){
			req.flash("error", "Castle not found");
			return res.redirect("/castles")
		} else {
			res.render("castles/show", {castle: castle})
		}
	});
});
//EDIT CASTLE
router.get("/castles/:id/edit", middleware.isLoggedIn, middleware.checkCastleOwnership, function(req, res){
	res.render("castles/edit", {castle:req.castle});
});
//UPDATE CASTLE
router.put("/castles/:id", middleware.isLoggedIn, middleware.checkCastleOwnership, function(req, res){
	//find and update castle
	Castle.findByIdAndUpdate(req.params.id, req.body.castle, function(err, updated){
		if(err) {
			res.redirect("/castles")
		} else {
			req.flash("success", "You have successfully edited a castle.")
			res.redirect("/castles/" + req.params.id);
		}
	})
});
//DESTROY CASTLE
router.delete("/castles/:id", middleware.isLoggedIn, middleware.checkCastleOwnership, function(req,res){
	Castle.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/castles")
		} else {
			req.flash("success", "You have successfully destroyed a castle.")
			res.redirect("/castles")
		}
	})
})



module.exports = router;