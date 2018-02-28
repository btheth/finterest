import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './components//views/home';
import Usersearch from './components//views/usersearch';
import User from './components//views/user';
import Profile from './components//views/profile';
import Login from './components//views/login';
import Register from './components//views/register';

import Auth from './modules/Auth';

const NotLoggedInRoute = ({ component: Component, ...rest}) => (
  <Route {...rest}  render={(props) => {
    return Auth.isUserAuthenticated() ? (
        <Component {...props} />
      ):(
        <Redirect to={{
          pathname: '/'
        }} />
      )
    }
  } />
)

const LoggedInRoute = ({ component: Component, ...rest}) => (
  <Route {...rest}  render={(props) => {
    return !Auth.isUserAuthenticated() ? (
        <Component {...props} />
      ):(
        <Redirect to={{
          pathname: '/'
        }} />
      )
    }
  } />
)


const Routes = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route path='/usersearch' component={Usersearch} />
    <Route path='/user' component={User} />
    <NotLoggedInRoute path='/profile' component={Profile} />
    <LoggedInRoute path='/login' component={Login} />
    <LoggedInRoute path='/register' component={Register} />
    <Route path='*' render={() => <Redirect to='/' />} />
  </Switch>
);

export default Routes;