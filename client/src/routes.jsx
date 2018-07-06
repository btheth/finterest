import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Auth from './modules/Auth';

//logged out landing page
import Home from './components//views/home';

//user pages
import Login from './components//views/login';
import Register from './components//views/register';
import Build from './components//views/build';
import Cart from './components//views/cart';
import Checkout from './components//views/checkout';

//employee pages
import EmployeeHome from './components//views/employeehome';
import Inventory from './components//views/inventory';

const getUserType = () => {
  if (Auth.isUserAuthenticated()) {
    return fetch('/api/users/usertype/' + Auth.getToken())
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json.type)
      return json.type;
    });
  }
}

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

const unAuthRoute =
<Switch>
  <Route exact path='/' component={Home} />
  <Route path='/login' component={Login} />
  <Route path='/register' component={Register} />
  <Route path='*' render={() => <Redirect to='/' />} />
</Switch>;

const userRoute =
<Switch>
  <Route exact path='/' component={Build} />
  <Route path='/cart' component={Cart} />
  <Route path='/checkout' component={Checkout} />
  <Route path='*' render={() => <Redirect to='/' />} />
</Switch>;

const employeeRoute =
<Switch>
  <Route exact path='/' component={EmployeeHome} />
  <Route path='/inventory' component={Inventory} />
  <Route path='*' render={() => <Redirect to='/' />} />
</Switch>;

const adminRoute = 
<Switch>
  <Route exact path='/' component={EmployeeHome} />
  <Route path='*' render={() => <Redirect to='/' />} />
</Switch>;

const Routes = () => (
  <Switch>
    {
      (!Auth.isUserAuthenticated() ? unAuthRoute :
        ((Auth.getType() === "admin") ? adminRoute : 
          ((Auth.getType() === "employee") ? employeeRoute : userRoute)))
    }
  </Switch>
);

export default Routes;