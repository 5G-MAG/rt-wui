'use strict';
const { wrap: async } = require('co');

exports.index = async(function*(req, res) {
  res.render('receiver/index', {
    active: "receiver",
    global: global,
  });
});
