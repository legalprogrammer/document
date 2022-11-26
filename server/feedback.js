/*******************************************************************************
* Logs user feedback
*
* Contributors: Abhishek
*******************************************************************************/

(function() {
    "use strict";

    const logger = require('winston').loggers.get('pathfinder');

    module.exports = (req, res, next) => {
      logger.info({
        event: 'feedback',
        body: req.body,
        ip: req.ip,
        remoteAddr: req.connection.remoteAddress,
        cookie: req.session
      });
      next();
    }

}());
