/*******************************************************************************
* Components for displaying number of results and previous and next buttons
*
* Contributors: Abhishek
*******************************************************************************/

import React from 'react';
import Btn from './btn';


class Pagination extends React.Component { 
    render() {
    var start = this.props.start;
    var total = this.props.total;
    var to = (total-start > 10) ? start + 10 : total;
    var buttons = [];
    if (this.props.buttons) {
      if (start > 10) {
          buttons.push(<Btn name={'<< First'} start={0} key={'First'} changePage={this.props.changePage}/>);
      }
      if (start >= 10) {
          buttons.push(<Btn  name={'< Prev'} start={start-10} key={'Prev'} changePage={this.props.changePage}/>);
      }
      if (total-start > 10) {
          buttons.push(<Btn id= {'Next'} name={'Next >'} start={start+10} key={'Next'} changePage={this.props.changePage}/>);
      }
    }
    return(
      <div className={ this.props.buttons ? 'pager' : 'pager_top' }>
        <div id={ this.props.buttons ? 'howmany' : 'howmany_top' } >
          { this.props.buttons
              ? 'Displaying results ' + (start+1) + ' to ' + to + ' out of ' + total
              : 'Found ' + total + ' documents'
          }
        </div>
        <div className='pager-buttons'>
          {buttons}
        </div>
      </div>
    );
  }
};

export default Pagination;
