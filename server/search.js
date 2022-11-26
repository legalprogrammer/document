/*******************************************************************************
* Constructs solr queries and communicates with solr
*
* Contributors: Abhishek
*******************************************************************************/

(function() {
    "use strict";

    // Load dependencies
    var solr_client = require('solr-client');
    var results = require('./results');

    const winston = require('winston');

    // Create the solr client
    var options = {
        host: 'localhost',
        port: 8983,
        core: 'pathfinder'
    };
    var solr = solr_client.createClient(options);

    const facets = {
        facet: {
            applicability: {
                type: "terms",
                field: "applicability",
                mincount: 1
            },
            docList: {
                type: "terms",
                field: "docSet",
                mincount: 1,
                facet: {
                    docList: {
                        type: "terms",
                        field: "businessArea",
                        mincount: 1,
                        facet: {
                            docList: {
                                type: "terms",
                                field: "processGroup",
                                mincount: 1

                            }
                        }
                    }
                }
            }
        }
    };

    module.exports = function(req, res, next) {

      var logData = {
        event_s: 'search',
        query_s: req.query.q,
        ip_s: req.ip,
        remoteAddr_s: req.connection.remoteAddress
      };
      if (req.session) {
        logData.user_s = req.session.user;
      };

      if (req.query.start) logData.start_i = req.query.start;
      if (req.query.fq) logData.fq_ss = req.query.fq;

      // winston.info(logData);

      req.query.json = JSON.stringify(facets);

      solr.search(req.query, (err, obj) => {
          if(err) {
              return next(err);
          } else {
              // Case where no results were found but we have a suggestion
              logData.numFound_i = obj.response.numFound;
              winston.info(logData);
              if (obj.response.numFound === 0
                  && obj.spellcheck
                  && obj.spellcheck.collations
                  && obj.spellcheck.collations.length > 0) {
                      reSearch(req, res, obj);
              } else {
                  res.send(results(obj));
                  res.end();
              }
          }
      });
    };

    // In the case that there is no results found but an improved suggestion
    // automatically search on that suggestion.
    function reSearch(req, res, obj) {
        const originalQuery = req.query.q;
        const newQuery = { q: obj.spellcheck.collations[1].collationQuery , json: JSON.stringify(facets) };

        var logData = {
          event_s: 'nras',
          originalQuery_s: originalQuery,
          suggestedQuery_s: newQuery.q,
          ip_s: req.ip,
          remoteAddr_s: req.connection.remoteAddress
        };
        if (req.session) {
          logData.user_s = req.session.user;
        }

        solr.search(newQuery, (err, obj) => {
            if(err) {
                return next(err);
            } else {
              logData.numFound_i = obj.response.numFound;
              winston.info(logData);
              res.send(results(obj, { spellcheck: true, originalQuery }));
              res.end();
            }
        });
    }

    }());
