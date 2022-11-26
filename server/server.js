/*******************************************************************************
* Run.js
*   - starts our server on the given port
*   - routes requests to the appropriate functions
*
* Contributors:Abhishek
*******************************************************************************/

// var globals = {
//     flag: "/opt/svc_zook/applications/pathfinder/webapp/dist/server/indexing.flag",
//     cache: {},
//     key: "LEXX_TECH"
// };

(function() {
    "use strict";

    /*****************************************************************************
    * Initialise & load dependencies
    *****************************************************************************/
    // Logging Transport
    const logger = require('./logs/log-init');

    // Express
    var express = require('express');
    var app = express.Router();

    // For filesystem and path names
    var path = require('path');

    // Favicon
    var favicon = require('serve-favicon');
    app.use(favicon(path.join(__dirname, '../client/images/favicon.ico')));

    // URL encoding/decoding
    // Doesn't do anything right now
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // Logging middleware
    app.use(require('./logs/log.js'));
    
    // Attach global variables
    app.use(function(req,res,next){
        req.globals = globals;
        next();
    });

    /*****************************************************************************
    * Routes
    *****************************************************************************/
    // Search
    app.get('/search', [ require('./validate.js'), require('./search.js') ]);
    // Download
    app.get('/download', require('./download.js'));
    // Cache
    app.get('/cache', require('./cache.js'));
    app.post('/cache/flag', require('./cacheFlag.js'));
    app.get('/cache/clear', require('./cacheClear.js'));
    // Feedback
    app.post('/feedback', require('./feedback.js'));
    // Declare location of static files
    app.use('/', express.static(path.join(__dirname, '../client/')));
    // Error Handling
    app.use(require('./errorHandler.js'));

    module.exports = app;

}());
