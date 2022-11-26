/*******************************************************************************
* Components for rendering docs returned by solr query. The outer most file
* component. Originally wasn't all split up.
*
* Contributors: James Gregory
*******************************************************************************/

import React from 'react';
import FileTitle from './fileTitle';
import FileInfo from './fileInfo';

// 2 types of file divs. One with applicability and one with out.
class FileDiv extends React.Component { 

  render() {
    var doc = this.props.doc;
    if (doc.applicability.length > 0) {
      var right_info =
        <div className='right-info'>
          <p className='file-info-title'>Categories:</p>
          <FileInfo info={doc.applicability} />
        </div>
    }

    if (doc.content) {
      var snippet_info =
        <div>
          <div className='file-line' />
          <div className='snippet'>
            <div className='file-info-div'>
              <p className='file-info' dangerouslySetInnerHTML={ { __html: doc.content } } />
            </div>
          </div>
        </div>
    }

    return(
    	<div className='file-div'>
        <FileTitle title={doc.title} ext={doc.ext} filename={doc.filename} />
        <div className='file-line' />
        <div className='left-info'>
          <FileInfo info={doc.fileinfo} />
        </div>
        {right_info}
        {snippet_info}
      </div>
    );
  }
};

export default FileDiv;
