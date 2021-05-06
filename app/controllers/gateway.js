'use strict';
const { wrap: async } = require('co');

exports.index = async(function*(req, res) {
  res.render('gateway/index', {
    active: "gateway",
    global: global,
  });
});
