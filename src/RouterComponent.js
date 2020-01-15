import React from "react";
import App from './App';
import SignIn from './SignIn.js'
import {Redirect, Route, withRouter, BrowserRouter as Router } from 'react-router-dom'


function isLoggedIn() {
      console.log('Am intrat')
      console.log(localStorage.getItem('LoggedIn'))
      return localStorage.getItem('LoggedIn')!=null
    }

function RouterComponent(props) {

return (<Router >
                  <Route exact path="/calendar" render={() => (
                             isLoggedIn() ? (<App /> ) : ( <Redirect to="/signin"/>  ) )}/>

                     <Route exact path="/signin" component={SignIn} />
                     <Route exact path="/" render={() => (
                           isLoggedIn() ? (<Redirect to="/calendar"/>) : (<Redirect to="/signin"/>))}/>
                  </Router>);
}


export default withRouter(RouterComponent)
