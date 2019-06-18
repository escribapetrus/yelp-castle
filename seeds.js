const mongoose = require("mongoose");
var Castle = 	require("./models/castles.js");
var Comment = require("./models/comments.js");

var data = [
	{
		name: "Castle 1",
		image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/5c/12/3f/newcastle-castle-the.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore porro quisquam iusto neque ea velit earum nesciunt adipisci consequuntur! Dolorem mollitia doloremque modi ullam beatae. Ratione explicabo dolorum, molestiae consectetur?",
	},
	{
		name: "Castle 2",
		image: "http://www.margamcountrypark.co.uk/media/9044/margamcastle1.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore porro quisquam iusto neque ea velit earum nesciunt adipisci consequuntur! Dolorem mollitia doloremque modi ullam beatae. Ratione explicabo dolorum, molestiae consectetur?",
	},
	{
		name: "Castle 3",
		image: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore porro quisquam iusto neque ea velit earum nesciunt adipisci consequuntur! Dolorem mollitia doloremque modi ullam beatae. Ratione explicabo dolorum, molestiae consectetur?"
	},
]


function seed(){
//REMOVE ALL CASTLES
	Castle.deleteMany({}, function(err,){
		if(err){
			console.log(err);
		} else {
		console.log("removed castles!")
		};
	});

	data.forEach(function(alpha){
		Castle.create(alpha, function(err, castle){
			if(err){
				console.log(err);
			} else {
				console.log("added a castle")
				//create a comment on this castle
				Comment.create({
					text: "This place is great.But is it really?",
					author: "A Traveller",
				}, function(err, comm){
					if(err){
						console.log(err)
					} else {
						console.log(comm);
						castle.comments.push(comm);
						castle.save(); 
					}
				})
			}
		})
	})
};

module.exports = seed;
