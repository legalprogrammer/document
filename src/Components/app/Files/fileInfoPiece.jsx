/*******************************************************************************
* Renders file information such as version
* note: probably not needed as a seperate component. Written when just learning
* react.
*
* Contributors: James Gregory
*******************************************************************************/

import React from 'react';

class FileInfoPiece extends React.Component { 

  render() {
    return(
      <p className='file-info'>{this.props.info}</p>
    );
  }
};

export default FileInfoPiece;
