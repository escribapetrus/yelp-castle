const express = require("express");
const router = express.Router();
const passport= require("passport");

//HOME
router.get("/", function(req, res){
	res.render("home");
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