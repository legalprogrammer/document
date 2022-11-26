/*******************************************************************************
* Stream files to the user
*
* Contributors:Abhishek
*******************************************************************************/

"use strict";

// For filesystem and path names
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const axios = require('axios');
// Load dependencies
const solr_client = require('solr-client');
const results = require('./results.js');

// Create the solr client
const options = {
    host: 'localhost',
    port: 8983,
    core: 'pathfinder'
};
const solr = solr_client.createClient(options);

// Main download function
function download(req, res, next) {

  // Serve the popFile to the user
  const docAddress = req.query.filename;
  const rank = req.query.rank;
  const filepath = path.join(__dirname, '../../../files/filestore/', docAddress);

  if (docAddress == undefined) {
      console.log("Missing file parameter.");
      res.status(422);
      res.end();
      return;
  }
  const flag = fs.readFileSync(req.globals.flag, "utf8");
  if (flag === "false") {
    const atomicUpdate = [{ id: docAddress, activities: {"inc":1}}];
    solr.add(atomicUpdate, (err, obj) => {
          if (err) {
              console.log(err);
          } else {
              solr.softCommit();
          }
      }
    );
  }
  else {
    // Store activity in cache
    require("./cacheStore.js")(req.globals, docAddress);
  }

  if (fs.existsSync(filepath) == false) {
      console.log("File does not exist: " + docAddress);
      res.send(`
          <html>
          <head>
          <meta charset="utf-8">
          <title>Can't find file</title>
          </head>
          <body>
          <div style="font-family:Arial,Helvetica,sans-serif;text-align:center;margin-top:10%;font-size:24px;">
              <div style="color:red;font-size:50px;font-weight:bold;margin-bottom:60px;">
                  ERROR
              </div>
              Unable to find file:
              <span style="font-style:italic;padding-left:3px;">
                  "${docAddress}"
              </span>
          </div>
          </body>
          </html>`
      );
      return;
  }

  fs.stat(filepath, (err, stats) => {
    if (err)
      return next(err);
    if(stats.isFile()) {
      // Maybe change to sendFile
      res.download(filepath, docAddress, (err) => {
        if(err) {
          console.log('Error after attempting download', err);
          if (res.headersSent)
            return;
          else
            return next(err);
        } else {
          // Log download
          var logData = {
            event_s: 'download',
            filename_s: docAddress,
            rank_i: rank,
            ip_s: req.ip,
            remoteAddr_s: req.connection.remoteAddress
          };
          if (req.session) {
            logData.user_s = req.session.user;
          };
          winston.info("File was downloaded",
          logData);
          return;
        }
      });
    } else {
      return next('Not a file');
    }
  });
}

module.exports = download;
