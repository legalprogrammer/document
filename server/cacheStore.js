/*******************************************************************************
* Stores an activity in the cache
*
* Contributors: Abhishek
*******************************************************************************/

(function() {
    "use strict";

    module.exports = (globals, filename) => {
        if (globals.cache.hasOwnProperty(filename) === true) {
            globals.cache[filename] += 1;
        }
        else {
            globals.cache[filename] = 1;
        }
    };

}());
