/*******************************************************************************
* Outer container that renders all the returned docs and handles pagination
*
* Contributors: James Gregory
*******************************************************************************/

import React from 'react';
import { findDOMNode } from 'react-dom';
import Pagination from '../Pagination/Pagination';
import FileDiv from '../Files/files';

class Results extends React.Component {
  componentDidUpdate() {
    findDOMNode(this).scrollTop = 0 ;
  }

	// Check if we need to create a NRAS component. Then create a file div for each document
	// in the response
  render() {
    var response = this.props.response;
    var rows = [];
    var docs = response.docs;
    var nras = response.nras ? <NRAS newQuery={response.params.q} originalQuery={response.originalQuery} /> : <div />;
    for (var i = 0 ; i < docs.length ; i++) {
      rows.push(<FileDiv doc={docs[i]} key={docs[i].filename} />);
    }
    let didYou;
    if(response.spellcheck && !response.spellcheck.correctlySpelled
      && response.spellcheck.collations.length > 0) {
      didYou = <DidYouMean suggestions={response.spellcheck.collations} query={(q) => this.props.query(q) } />
    }
  	return(
      <div id='results'>
        <Pagination start={response.start} total={response.numFound} changePage={this.props.changePage} buttons={false}/>
        {nras}
        {didYou}
        <div id='file-list'>
          {rows}
        </div>
        <Pagination start={response.start} total={response.numFound} changePage={this.props.changePage} buttons={true}/>
      </div>
    );
  }
};

// No Results Auto Suggest
// NRAS is the case where the query returned no results, but solr gave us a suggestion.
// In this case we display the results of the suggestion, and tell the user
// that this is what we've done
class NRAS extends React.Component { 
   render() {
    return(
        <div className='spellcheck-div'>
          <div className='spellcheck-info'>
            <p>No results for <b><i> "{this.props.originalQuery}" </i></b></p>
            <p>Showing results for similar query <b><i> "{this.props.newQuery}" </i></b></p>
          </div>
        </div>
    );
  }
};

class DidYouMean extends React.Component { 
render() {
    let suggestions = this.props.suggestions;
    let suggestionStrings = [];
    for(let i=0; i<3 && i<suggestions.length; i++) {
      let query = suggestions[i].collationQuery;
      let errors = suggestions[i].misspellingsAndCorrections;
      let qs = query.split(' ');
      let suggString = '<i>';
      if(qs.length*2 === errors.length) {
        for (let j=0; j<qs.length ; j++) {
          if(errors[2*j] === errors[2*j+1]) {
            suggString += `${qs[j]} `;
          } else {
            suggString += `<b>${qs[j]}</b> `;
          }
        }
      } else {
        suggString = `<i>${query}`;
      }
      suggString += ` (${suggestions[i].hits})</i>`
      suggestionStrings.push(<p className='didyou-info' key={`didyoumean-${i}`}
        onClick={()=>{this.props.query(query)}}
        dangerouslySetInnerHTML={{__html: suggString }}></p>);
    }
    return(
      <div className='spellcheck-div'>
        <p className='didyou'>Did you mean?</p>
        {suggestionStrings}
      </div>
    )
  }
};

export default Results;
