/*******************************************************************************
* logger.js
*   - Contains logging configurations
*
* Contributors: Abhishek
*******************************************************************************/
"use strict";

const winston = require('winston');
const winstonSolr = require('./winston-solr-transport');
winston.add(winston.transports.Solr, { app: 'pathfinder' });
module.exports = winston;
