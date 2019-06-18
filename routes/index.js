const express = require("express");
const router = express.Router();
const passport= require("passport");
var User = require("../models/users")
router.get("/", function(req, res){
	res.render("home");
});

// AUTHENTICATION
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
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

router.get("/login", function(req,res){
	res.render("login")
});
router.post("/login", passport.authenticate("local", {
	successRedirect: "castles",
	failureRedirect: "/login",
}), function(req, res){	
});
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You signed out")
	res.redirect("/castles")
});

module.exports = router;