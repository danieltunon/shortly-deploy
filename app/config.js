var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.connect('mongodb://localhost/test');

module.exports = mongoose.connection;

