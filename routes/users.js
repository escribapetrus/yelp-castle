const express = require("express");
const router = express.Router();
var User = require("../models/users.js");
var Castle = require("../models/castles.js")
const passport= require("passport");

router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req,res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email:req.body.email,
	});
	if(req.body.adminCode === "123mudei"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err);
			res.redirect("register");
		} else{
			passport.authenticate("local")(req,res, function(){
				req.flash ("success", "Successfully signed up as " + req.body.username + ". Welcome.")
				res.redirect("castles")
			})
		}
	})
});

router.get("/:id/profile", function(req,res){
	User.findById(req.params.id, function(err, user){
		if(err){
			req.flash("error", "User not found");
			res.redirect("/castles")
		} else {
			Castle.find().where("author.id").equals(user._id).exec(function(err,castles){
				if(err){
					req.flash("error", "Castles not found");
					res.redirect("/castles");
				} else {
					console.log(castles)
					res.render("profile", { user: user, castles: castles });
				}
			})
		}
	})
});


module.exports = router
