const mongoose = require("mongoose");
var Comment = require("./comments.js");


var castleSchema = new mongoose.Schema({
	name: String,
	image: String,
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