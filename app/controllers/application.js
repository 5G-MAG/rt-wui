'use strict';
const { wrap: async } = require('co');

exports.index = async(function*(req, res) {
  res.render('application/index', {
    active: "application",
    global: global,
    player: req.query.p,
    manifest: req.query.m
  });
});
