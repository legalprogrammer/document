/*******************************************************************************
* Renders the file title and filetype icon
*
* Contributors: James Gregory
*******************************************************************************/
import React from 'react';

class FileTitle extends React.Component { 
  render() {
    const filext = this.props.ext;
    let ext = filext;
    switch(filext) {
        case 'pdf':
            ext = 'pdf';
            break;
        case 'dotx':
        case 'docx':
        case 'doc':
            ext = 'word';
            break;
        case 'xlsx':
        case 'xls':
            ext = 'excel';
            break;
        case 'pptx':
        case 'potx':
        case 'ppt':
            ext = 'powerpoint';
            break;
        default:
            ext = 'text';
    }
    return(
        <span>
            <a className='file-title' target="_blank" rel="noreferrer"
                 href={`download?filename=${encodeURIComponent(this.props.filename)}`}
            >{this.props.title}</a>
            <i className={`exticon fa fa-file-${ext}-o`}></i>
        </span>
    );
  }
};

export default FileTitle;
