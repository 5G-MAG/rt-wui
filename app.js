const express = require('express'),
  expressLayouts = require('express-ejs-layouts'),
  routes = require('./app/routes'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  sassMiddleware = require('node-sass-middleware'),
  app = express();

app.use(expressLayouts);
app.set('layout', __dirname + '/app/views/layouts/application');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(
  sassMiddleware({
    src: __dirname + '/app/assets',
    dest: __dirname + '/public'
  })
);
app.use(cors());

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/hls.js/dist'));
app.use(express.static(__dirname + '/node_modules/dashjs/dist'));
app.use(express.static(__dirname + '/node_modules/player-chrome/dist/components'));
app.use(express.static(__dirname + '/app/assets'));
app.use(express.static(__dirname + '/public'));
app.use(routes);

const
      { spawnSync } = require( 'child_process' ),
      rp_version = spawnSync( 'rp', ['--version'] );
      gw_version = spawnSync( 'gw', ['--version'] );

global.versions = { 
  rp: rp_version.status == 0 ? "v" + rp_version.stdout.toString() : "n/a",
  gw: gw_version.status == 0 ? "v" + gw_version.stdout.toString() : "n/a"
};
global.rp_api = ":3010/rp-api/"
global.gw_api = ":3020/gw-api/"

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));
