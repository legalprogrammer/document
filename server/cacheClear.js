/*******************************************************************************
* Indexes caches activities and clears the cache
*
* Contributors: Abhishek
*******************************************************************************/

// Load dependencies
const solr_client = require('solr-client');

// Create the solr client
const options = {
    host: 'localhost',
    port: 8983,
    core: 'pathfinder'
};
const solr = solr_client.createClient(options);

(function() {
    "use strict";

    module.exports = (req, res, next) => {
        if (req.body.hasOwnProperty("key") === false || req.body.key !== req.globals.key) {
            res.status(401).send("Unauthorized");
            return;
        }
        let atomicUpdates = [];
        Object.keys(req.globals.cache).forEach(function (key) {
            atomicUpdates.push({ id: key, activities: {"inc":req.globals.cache[key]}});
        });
        if (atomicUpdates.length > 0) {
            solr.add(atomicUpdates, (err, obj) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Updating Solr with cached activities failed");
                } 
                else {
                    // Clear cache
                    req.globals.cache = {};
                    res.status(200).end();
                }
            });
        }
        else {
            res.status(200).end();
        }
    };

}());