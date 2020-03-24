import React  from 'react';
import ReactDOM from 'react-dom';

import SelectableScoreWrapper from './containers/selectableScoreWrapper';

// Parameters for SelectableScore component
// ****************************************
// MEI_URI: Can be a full URI, e.g. obtained from the TROMPA Contributor Environment 
const MEI_URI = "test.mei" 
// vrvOptions: If not supplied to <SelectableScore>, will default to predefined options
const vrvOptions = {  
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  noFooter: 1,
  unit: 6
}

ReactDOM.render(
  <SelectableScoreWrapper uri = { MEI_URI } vrvOptions = { vrvOptions }/>
		, document.querySelector('.container')
);
