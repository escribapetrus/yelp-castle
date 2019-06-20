const express = require("express");
const router = express.Router();
var Castle = require("../models/castles")
var Comment = require("../models/comments")
var middleware = require("../middleware")
var NodeGeocoder= require("node-geocoder")
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODING, // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);

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
	geocoder.geocode(req.body.name)
		.then(function(data) {
			var lat = data[0].latitude;
			var lng = data[0].longitude;
			var location = data[0].formattedAddress;
			var newCastle = {name: name, year:year, location:location, lat:lat, lng:lng, image: image, description: description, author:author};
			Castle.create(newCastle, function(err, newC){
				if(err){
					console.log(err);
				} else {
					res.redirect("/castles")
				}
			});
		})
		.catch(function(err) {
			console.log(err);
			res.redirect("back");
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
	geocoder.geocode(req.body.castle.name)
		.then(function(data){
			req.body.castle.lat = data[0].latitude;
			req.body.castle.lng = data[0].longitude;
			req.body.castle.location = data[0].formattedAddress;
			Castle.findByIdAndUpdate(req.params.id, req.body.castle, function(err, updated){
				if(err) {
					res.redirect("/castles")
				} else {
					req.flash("success", `You have successfully edited ${req.body.castle.name}`)
					res.redirect("/castles/" + req.params.id);
				}
			})
		})
		.catch(function(err) {
			console.log(err);
			res.redirect("back");
		});	
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



module.exports = router