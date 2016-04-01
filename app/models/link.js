var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var urlSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
}, { timestamps: { createdAt: 'created_at'} });

urlSchema.methods.initialize = function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
};

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;