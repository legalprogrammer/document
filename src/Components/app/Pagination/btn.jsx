/*******************************************************************************
* Button component
*
* Contributors: James Gregory
*******************************************************************************/

import React from 'react';
import { Button} from 'semantic-ui-react';

class Btn extends React.Component { 

  change() {
    this.props.changePage(this.props.start);
  }
  render() {
    return(
      <Button
        id={this.props.name}
        className='button-min'
        type='button'
        onClick={this.change}
      >{this.props.name}</Button>
    );
  }
};

export default Btn;
