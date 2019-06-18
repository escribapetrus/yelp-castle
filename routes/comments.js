const express = require("express");
const router = express.Router();
var Castle = require("../models/castles");
var Comment = require("../models/comments");
var middleware = require("../middleware");


router.get("/castles/:id/comments/new", middleware.isLoggedIn, function(req,res){
	Castle.findById(req.params.id, function(err, castle){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {castle:castle});

		}
	})
});
router.post("/castles/:id/comments", middleware.isLoggedIn, function(req, res){
	//find campground using id
	Castle.findById(req.params.id, function(err, castle){
		if (err) {
			req.flash("error", "Sorry, something went wrong.");
			res.redirect("/castles");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}	else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
					castle.comments.push(comment);
					castle.save();
					req.flash("success", "Yes! You created a comment.")
					res.redirect("/castles/" + castle._id);
				}
			})
		}
	})
});
//EDIT COMMENT
router.get("/castles/:id/comments/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req,res){
	res.render("comments/edit", {comment: req.comment, castle_id: req.params.id});
});
// UPDATE COMMENT
router.put("/castles/:id/comments/:comment_id/", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req, res){
	//find and update castle
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
		if(err) {
			res.redirect("back")
		} else {
			req.flash("success", "You have edited a comment")
			res.redirect("/castles/" + req.params.id);
		}
	})
});
//DESTROY COMMENT
router.delete("/castles/:id/comments/:comment_id/", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back")
		} else {
			req.flash("success", "You have deleted a comment")
			res.redirect("/castles/" + req.params.id)
		}
	})
})


module.exports = router;