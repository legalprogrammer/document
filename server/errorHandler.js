/*******************************************************************************
* Route for error handling
*
* Contributors: Abhishek
*******************************************************************************/
"use strict";

function errorHandler(err, req, res, next) {

  if (err.code === 'ENOENT') {
    return fileNotFound(err, res);
  } else if (err.code === 'ECONNREFUSED') {
    return solrNotFound(err, res);
  }

  return res.send(err);
}

/*******************************************************************************
* Error page for files that weren't found, usually from download
*
*******************************************************************************/
function fileNotFound(err, res) {
  res.status(404);
  res.send(`<h3>FILE NOT FOUND</h3><p>${err.path}</p>`);
}

/*******************************************************************************
* Error handling for no solr connection
*
*******************************************************************************/
function solrNotFound(err, res) {
  res.status(500);
  res.send({ address: err.address, port: err.port });
}

module.exports = errorHandler;
