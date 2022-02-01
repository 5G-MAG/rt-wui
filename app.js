const express = require('express'),
  expressLayouts = require('express-ejs-layouts'),
  routes = require('./app/routes'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  sassMiddleware = require('@gompa/node-sass-middleware'),
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
    dest: __dirname + '/public',
    debug: true 
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
app.use("/fa", express.static( __dirname + '/node_modules/@fortawesome/fontawesome-free'));
app.use("/prism", express.static( __dirname + '/node_modules/prismjs'));
app.use(routes);

const
      { spawnSync } = require( 'child_process' ),
      modem_version = spawnSync( 'modem', ['--version'] );
      mw_version = spawnSync( 'mw', ['--version'] );

global.versions = { 
  modem: modem_version.status == 0 ? "v" + modem_version.stdout.toString() : "n/a",
  mw: mw_version.status == 0 ? "v" + mw_version.stdout.toString() : "n/a"
};
global.modem_api = ":3010/modem-api/"
global.mw_api = ":3020/mw-api/"

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function (payload) {
    console.log(`Listing on port ${app.get('port')}`);
});
