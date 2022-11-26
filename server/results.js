/*******************************************************************************
* Takes solr output and cleans it up to send back to the client
*
* Contributors:Abhishek
*******************************************************************************/

(function() {
    "use strict";

    const pretty = require('prettysize');

    module.exports = function(obj, nras) {
        var response = {
            params: {},
            numFound: 0,
            start: 0,
            docs: [],
            facets: {},
            nras: false,
            originalQuery: '',
            spellcheck: {}
        };

        var highlighting = obj.highlighting;

        // When there was no response and an automatic re query
        if (nras) {
            response.nras = nras.spellcheck || false;
            response.originalQuery = nras.originalQuery || false;
        // Otherwise regular spellchecking
        }
        if (obj.spellcheck) {
          response.spellcheck.correctlySpelled = true;
          // console.log(obj.spellcheck.suggestions);
          for (let i = 1 ; i<obj.spellcheck.suggestions.length ; i += 2) {
            // console.log(obj.spellcheck.suggestions[i]);
            if(obj.spellcheck.suggestions[i].origFreq < 5)
              response.spellcheck.correctlySpelled = false;
          }
          response.spellcheck.collations = [];
          for (let i = 1; i<obj.spellcheck.collations.length ; i+=2) {
            response.spellcheck.collations.push(obj.spellcheck.collations[i]);
          }
        }


        if (response.originalQuery) {
            response.originalQuery = response.originalQuery.replace(/{!.*} /, '');
        }
        // ADD PARAMS BACK INTO QUERY, AT LEAST THE 'q' ONE
        response.params = obj.responseHeader.params;

        response.params.q = response.params.q.replace(/{!.*} /, '');

        response.numFound = obj.response.numFound;
        response.start = obj.response.start;
        var docs = [];
        var responseDocs = obj.response.docs;
        for (var i = 0 ; i < responseDocs.length ; i++) {
            var doc = {};
            doc.title = responseDocs[i].title;
            doc.filename = responseDocs[i].filename;

            let docSet = '';
            let businessArea = '';
            let processGroup = '';
            if(responseDocs[i].docSet !== undefined) {
                docSet = responseDocs[i].docSet;
                if(responseDocs[i].businessArea !== undefined) {
                    businessArea = responseDocs[i].businessArea;
                    if(responseDocs[i].processGroup !== undefined) {
                        processGroup = responseDocs[i].processGroup;
                    }
                }
            }
            const version = `Version ${responseDocs[i].version}`;
            const info = [
                docSet,
                businessArea,
                processGroup,
                version
            ];
            doc.fileinfo = info;
            doc.applicability = responseDocs[i].applicability || [];
            doc.ext = responseDocs[i].filext;

            let snippets = highlighting[doc.filename];
            if (snippets && snippets.content && snippets.content.length > 0) {
                let content = snippets.content.join(' ... ');
                doc.content = content.replace(/(\n|\t)(\n|\t| )*/g, ' ');
                doc.content.trim();
            }

            docs.push(doc);
        }
        response.docs = docs;
        response.facets = obj.facets;



        return response;
    };
}());
