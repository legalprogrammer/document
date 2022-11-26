/*******************************************************************************
* Log.js
* - Logging middleware, mostly logs express debug routing information
*
* Contributors: James Gregory
*******************************************************************************/
"use strict";

const logger = require('winston').loggers.get('pathfinder');

/*******************************************************************************
* Log a bunch of debug information
*******************************************************************************/
// Debug logging doesnt require all the postfixes
function debug(req, res, next) {
  if (!(req.path.match(/\/styles/) || req.path.match(/\/scripts/)
     || req.path.match(/\/images/) || req.path.match(/\/css/))) {
    logger.debug({
      path: req.path,
      body: req.body,
      params: req.query,
      ip: req.ip,
      remoteAddr: req.connection.remoteAddress,
      method: req.method,
      originalURL: req.originalURL,
      cookie: req.session
    });
  }
  next();
}

module.exports = debug;
