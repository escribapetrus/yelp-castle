//REQUESTS
var express = 		require("express");
var app = 			express();
var bodyParser = 	require("body-parser");
var mongoose = 		require("mongoose");
var flash = 		require("connect-flash")
var passport = require("passport");
LocalStrategy = require("passport-local");
methodOverride = require("method-override");
var expressSession = require("express-session")
var User = require("./models/users.js")
var commentRoutes = require("./routes/comments.js")
var castleRoutes = require("./routes/castles.js")
var indexRoutes = require("./routes/index.js")

//SETUPS
mongoose.connect("mongodb+srv://admin:123mudei@cluster0-mhvjw.gcp.mongodb.net/test?retryWrites=true&w=majority", { 
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("connected to mongodb atlas");
}).catch(err => {
	console.log("error", err.message);
});

mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
// seed();
//PASSPORT CONFIG
app.use(expressSession({
	secret: "Chinon Fortress is the best castle.",
	resave:false,
	saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next();
});
app.use(indexRoutes)
app.use(castleRoutes)
app.use(commentRoutes)

//ROUTES


//SERVER
app.listen(3000, function () {
  console.log('Yelp Castle listening on port 3000!')
})
