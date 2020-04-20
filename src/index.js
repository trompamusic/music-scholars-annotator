import React  from 'react';
import ReactDOM from 'react-dom';
import useLoggedIn from './solid/hooks/useLoggedIn';
import useLoggedOut from './solid/hooks/useLoggedOut';
import useLDflex from './solid/hooks/useLDflex';
import useLDflexValue from './solid/hooks/useLDflexValue';
import LoggedIn from './solid/components/LoggedIn';
import LoggedOut from './solid/components/LoggedOut';
import LoginButton from './solid/components/LoginButton';
import LogoutButton from './solid/components/LogoutButton';
import AuthButton from './solid/components/AuthButton';
import Value from './solid/components/Value';
import Image from './solid/components/Image';
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

export{
  useLDflex,
  useLDflexValue,
  useLoggedIn,
  useLoggedOut,
  LoggedIn,
  LoggedOut,
  LoginButton,
  LogoutButton,
  AuthButton,
  Value,
  Image,
};
