/*******************************************************************************
* Cache route - provides flag and cache values
*
* Contributors: Abhishek
*******************************************************************************/

const fs = require("fs");

(function() {
    "use strict";

    module.exports = (req, res, next) => {
      fs.readFile(req.globals.flag, "utf8", (err, data) => {
        if (err) {
          res.status(500).send("Unable to read indexing.flag file");
        }
        else res.send({flag:data,cache:req.globals.cache});
      });
    };

}());
