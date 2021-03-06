import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack';

//Uncomment after adding api for pwd reset
//import axios from 'axios';

//const apiUrl = "http://localhost:5000/api/v1";

/**
 * TODO - This Component contains the password reset page along with reset logic. [Deprecated]
 * 
 * State variables:
 * email - string - email of the user 
 */
class Reset extends React.Component {
  /**
   * Initializes react state.
   * 
   * @param {Object} props - passed down from app.js
   * @param {Function} props.showMessage - helper function to display snackbar messages
   */
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    }
  }
   /**
   * Updates the email state variable
   * 
   * @param {Object} e - event triggered if textbox changes
   */ 
  handleEmailChange =(e) =>{
    this.setState(Object.assign(this.state, {email: e.target.value}));
  }
  /**
   * TODO
   * Email is sent to the API.
   * 
   * redirect back to login page if email valid.
   * 
   * @param {Object} e - event triggered when form is submitted.
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    const email = this.state.email;
    //Pwd Reset API code here

    this.props.history.push('/login/?email=' + email);
  }
  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style ={{ marginTop: "64px", display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
          <Avatar style ={{ marginBottom: "8px"}}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h2" variant="h6">
            Reset Password
          </Typography>
          <form style ={{ marginTop: "16px"}} onSubmit={this.handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value = {this.state.email}
              onChange ={this.handleEmailChange}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </Container>);
  }
}

export default withSnackbar(Reset);