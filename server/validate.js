/*******************************************************************************
* Sanitizes client inuputs.
* @inuputs - takes a client url/json object (query)
* @outputs - outputs a possibly modified url json object or null if whole query
*            must be thrown out
* Contributors: Abhishek
*******************************************************************************/

(function() {
  "use strict";

  // TODO: sanitize obj
  //  - currently not to sure what type of malicious request could be made
  module.exports =  function(req, res, next) {
    next();
  };

}());
