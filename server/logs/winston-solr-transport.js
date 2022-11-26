/*******************************************************************************
* winston-solr-transport
*   - Custom transport for winston that writes logs to solr
*   - see https://1ansah.atlassian.net/wiki/pages/viewpage.action?pageId=53706760
* Contributors: James Gregory
*******************************************************************************/
'use strict'

const util = require('util'),
      http = require('http'),
      winston = require('winston'),
      moment = require('moment');

// Initialization Function - Options takes:
// app: name of application (required)
// level: level to log at, default info
// collection: collection to post to, default logs
// host: host of solr instance, default localhost
// port: port of solr instance, default 8983
var Solr = winston.transports.Solr = function (options) {
  this.name = 'winstonSolr';
  this.app = options.app;
  this.level = options.level || 'info';
  this.collection = options.collection || 'logs';
  this.requestOptions = {
    host: options.host || 'localhost',
    port: options.port || 8983,
    path: `/solr/${this.collection}/update?wt=json`,
    method: 'POST'
  }

};

util.inherits(Solr, winston.Transport);

// Logs to solr. It requires the metafields to have data
// driven postfixes.
Solr.prototype.log = function (level, msg, meta, callback) {
  // Metadata should already have the correct postfixes
  var data = meta;
  // Add the level and message
  data.level_s = level;
  data.message_s = msg;
  // Add a timestamp
  data.date_dt = moment().toISOString();
  // Add application name
  data.app_s = this.app;
  data = JSON.stringify([data]);

  // Add headers
  this.requestOptions.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }

  // Write to solr
  var req = http.request(this.requestOptions, (res) => {
    res.on('end', () => {
      callback(null, true);
    });
  });

  req.on('error', (err) => {
    console.log(`Problem with request: ${err}`);
  });

  req.write(data);
  req.end();
};

module.exports = Solr;
