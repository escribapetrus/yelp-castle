const mongoose = require("mongoose");
var Comment = require("./comments.js");

var castleSchema = new mongoose.Schema({
	name: String,
	image: String,
	year: Number,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: { type: Date, default: Date.now() },
	description: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		username: String,
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
var Castle = mongoose.model("Castle", castleSchema);

module.exports = Castle;