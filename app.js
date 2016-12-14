var express = require('express');

global.appCfg = require(__dirname + '/local/config');

var app = express();
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')


app.get('/', function (req, res) {
  res.render('index', { title : 'Home' });
})

app.use(express.static(__dirname + '/public'));
app.listen(appCfg.app_port);
