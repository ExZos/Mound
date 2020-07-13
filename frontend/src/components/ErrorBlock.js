import React from 'react';

import GeneralComponent from './GeneralComponent';
import '../styles/errorBlock.scss';

class ErrorBlock extends GeneralComponent {
  render() {
    if(this.props.show) {
      return(
        <div id="errorBlock">
          {this.props.message}
        </div>
      );
    }

    return(
      <div id="errorBlock">
        <br />
      </div>
    );
  }
}

export default ErrorBlock;
