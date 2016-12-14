var express = require('express'),
	passport = require('passport'),
	util = require('util'),
	session = require('express-session'),
	SteamStrategy = require('passport-steam').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: 'BC10A83E241BA0B9747C9596CB4807EB'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

var app = express();





app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your secret',
    name: 'name of session id',
    resave: true,
    saveUninitialized: true}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../../public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
	console.log(req.user);
  res.render('account', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}