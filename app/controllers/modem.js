'use strict';
const { wrap: async } = require('co');

exports.index = async(function*(req, res) {
  res.render('modem/index', {
    active: "modem",
    global: global,
  });
});
