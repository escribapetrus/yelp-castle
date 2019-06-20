var Castle = require("../models/castles.js")
var Comment = require("../models/comments.js")
var middlewareObj = {};


middlewareObj.checkCastleOwnership = function (req,res, next) {
	Castle.findById(req.params.id, function(err, castle){
		if(err || !castle){
			req.flash("error", "Castle not found")
			res.redirect("/castles/");
		} else if(castle.author.id.equals(req.user._id) || req.user.isAdmin){
			req.castle = castle;
			next();
		} else {
			req.flash("error", "Sorry, you cannot edit a castle registered by another user.")
			res.redirect("/castles/" + req.params.id);
		}
	});
}

middlewareObj.checkCommentOwnership = function (req,res, next) {
	Comment.findById(req.params.comment_id, function(err, comment){
		if(err || !comment){
			req.flash("error", "Comment not found")
			res.redirect("/castles");
		} else if(comment.author.id.equals(req.user._id) || req.user.isAdmin ){
			req.comment = comment		
			next();
		} else {
			req.flash("error", "Sorry, something went wrong.")
			res.redirect("back");
		}
	});
}

middlewareObj.isLoggedIn = function (req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("error", "Please log in")
		res.redirect("/login");
	}
}    

module.exports = middlewareObj;