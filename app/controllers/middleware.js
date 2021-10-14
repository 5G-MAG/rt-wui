'use strict';
const { wrap: async } = require('co');

exports.index = async(function*(req, res) {
  res.render('middleware/index', {
    active: "middleware",
    global: global,
  });
});
