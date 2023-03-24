'use strict';
const { wrap: async } = require('co');
const http = require('http');

const baseUrl = '172.17.0.3';

function proxy_call(req, res, path) {
  var connector = http.request({
    host: baseUrl,
    port: 3020,
    path: path,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
  //    'Content-Length': req.body.length()
    }
  }, (resp) => {
  if(req.method == "PUT") {
  console.log(resp);
  }
    resp.pipe(res);
  });
  connector.on('error', (e) => {
    res.status(503).send("Process unavailable");
  });
  connector.write(JSON.stringify(req.body));
  req.pipe(connector);
}

exports.files = async(function*(req, res) {
  proxy_call(req, res, "/mw-api/files");
});
exports.services = async(function*(req, res) {
  proxy_call(req, res, "/mw-api/services");
});
exports.service_announcement = async(function*(req, res) {
  proxy_call(req, res, "/mw-api/service_announcement");
});
