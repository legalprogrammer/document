/*******************************************************************************
* Sets the indexing flag to true/false
*
* Contributors: Abhishek
*******************************************************************************/

const fs = require('fs');

(function() {
    "use strict";

    module.exports = (req, res, next) => {
        if (req.body.hasOwnProperty("key") === false || req.body.key !== req.globals.key) {
            res.status(401).send("Unauthorized");
            return;
        }
        if (req.body.hasOwnProperty("set") === false || req.body.set === "") {
            res.status(400).send("Request is missing 'set' boolean parameter");
        }
        else {
            const set = req.body.set.toLowerCase();
            if (set === "true") {
                try {
                    fs.writeFile(req.globals.flag, "true", (err) => {
                        if (err) {
                            res.status(500).send("Error updating indexing.flag file");
                        }
                        else res.status(200).end();
                    });
                }
                catch (e) {
                    console.log(e);
                    res.status(500).send("Error updating indexing.flag file");
                }
            }
            else if (set === "false") {
                fs.writeFile(req.globals.flag, "false", (err) => {
                    if (err) {
                        res.status(500).send("Error updating indexing.flag file");
                    }
                    else res.status(200).end();
                });
            }
            else {
                res.status(400).send("Set parameter is not a valid boolean value, should be true or false");
            }
        }
    };

}());
