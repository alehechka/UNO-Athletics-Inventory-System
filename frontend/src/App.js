import React from 'react';
import Login from './Login/Login';
import Reset from './Login/Reset';
import Signup from './Login/Signup'
import Dashboard from './Dashboard/Dashboard';
import { withSnackbar } from 'notistack';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Cookies from 'js-cookie';
import { getCredentials } from './api';

/**
 * This main component mainly does the authentication and routing.
 * 
 * State variables:
 * authorized - bool - user authorization.
 * authorization - string- contains the JWT value.
 * email - string- email address of the authorized user.
 * username - string - username of the authorized user.
 * role - JSON - role of the authorized user.
 * 
 * Props passed down from Snackbar provider.
 * 
 * enqueuesnackbar - function - shows a snackbar.
 * closesnackbar - function - closes a snackbar. 
 */
class App extends React.Component {
  /**
   * Initialize all state variables to default values.
   * 
   * @param {*} props props passed down to component
   */
  constructor(props) {
    super(props);
    this.state ={
      authorized: false,
      authorization: "",
      email: "",
      username: "",
      role: ""
    }
  }
  /**
   * showMessage
   * 
   * Displays a snackbar
   */
  showMessage = (msg, type = "success", duration = 30000, vertical = "top", horizontal = "center") =>{
    this.props.enqueueSnackbar(msg, {
      variant: type,
      anchorOrigin: {
          vertical,
          horizontal,
      },
      preventDuplicate: true,
      autoHideDuration: duration,
    });
  }
  /**
   * sets role based on JSON received
   *
   * @param {*} creds JSON response
   */
  setRole = (creds) => {
    let role = "athlete";
    if (creds.isAdmin){
      role = "admin";
    }
    else if (creds.isEmployee){
      role = "employee";
    }
    else if(creds.isCoach){
      role = "coach"
    }
    else if(creds.isAthlete){
      role ="athlete"
    }
    this.setState(Object.assign(this.state, {role}));
  }
  /**
   * Lifecycle method that is executed only once.
   * 
   * Get the cookies if they exist to get the jwt.
   * 
   * if user logging in for the first time validate jwt and store creds in session otherwise
   * Pass the get request along with the credentials to the backend for verifying jwt and save creds.
   * 
   * Stores the jwt response in react state and session storage.
   */
  componentDidMount() {
    const auth = Cookies.get('authorization');    

    //if cookie exists validate jwt stored in cookie. 
    if (auth) {
      //assume jwt is valid
      this.setState(Object.assign(this.state, {authorized: true}));

      let creds = sessionStorage.getItem('creds');

      //if jwt already validated get creds from session storage.
      if (creds) {
        creds = JSON.parse(creds);
        const newState = Object.assign({authorized: true, authorization: auth}, creds);
        this.setState(Object.assign(this.state, newState));
        this.setRole(creds);
      }
      else {
        getCredentials()
        .then(res => {
          sessionStorage.setItem('creds', JSON.stringify(res.data));
          const newState = Object.assign({authorized: true, authorization: auth}, res);
          this.setState(Object.assign(this.state, newState));
          this.setRole(res);
        }).catch(err =>{
          this.setState(Object.assign(this.state, {authorized: false}));
        });
      }
    }
  }
  render(){
    const dashboardApp = (
      <Dashboard
        showMessage ={this.showMessage} 
        authorization = {this.state.authorization}
        email = {this.state.email}
        username = {this.state.username}
        role = {this.state.role}
      />
    );
    const redir = (origin, end) => (
      <Redirect
        to={{
          pathname: end,
          state: { referrer: origin}
        }}
      />
    );
    return(
      <Router>
        <Switch>
            <Route path="/reset">
              {this.state.authorized ? redir("reset", "/") : <Reset showMessage ={this.showMessage}/>}
            </Route>
            <Route path="/login">
              {this.state.authorized ? redir("login", "/"): <Login showMessage ={this.showMessage}/>}
            </Route>
            <Route path="/signup">
              {this.state.authorized ? redir("signup", "/"): <Signup showMessage ={this.showMessage}/>}
            </Route>
            <Route path="/">
              {this.state.authorized? dashboardApp : <Login showMessage ={this.showMessage}/>}
            </Route>
          </Switch>
        </Router>
    );
  } 
}

export default withSnackbar(App);