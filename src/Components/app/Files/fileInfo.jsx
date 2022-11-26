/*******************************************************************************
* Renders file information such as version, modified date, etc
*
* Contributors: James Gregory
*******************************************************************************/

import React from 'react';

import FileInfoPiece from './fileInfoPiece';

class FileInfo extends React.Component { 

  render() {
    var info = this.props.info;
    var rows = [];
    var title;
    for (var i = 0 ; i < info.length ; i++) {
      rows.push(<FileInfoPiece info={info[i]} key={info[0]+i}/>);
    }
    return(
      <div className='file-info-div'>
          {title}
          {rows}
      </div>
    );
  }
};

export default FileInfo;
