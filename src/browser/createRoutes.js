import App from './app/App.react';
import Home from './home/Page.react';
import NotFound from './notfound/Page.react';
import React from 'react';
import Debtors from './debtors/Page.react';
import Debtor from './debtors/Debtor.react';
import Login from './auth/Login.react';
import Users from './users/Users.react';
import { Redirect, IndexRoute, Route } from 'react-router';

export default function createRoutes(getState) {
  const requireAuth = (nextState, replace) => {
    const loggedInUser = getState().users.viewer;
    if (!loggedInUser) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  };

  const requireManager = (nextState, replace) => {
    const logginUser = getState().users.viewer;
    const loggedInUserRoles = logginUser ? logginUser.roles.reduce((prev, curr) =>
      prev.concat(curr.role), []) : undefined;
    if (!(logginUser &&
      (loggedInUserRoles.indexOf('admin') !== -1 ||
      loggedInUserRoles.indexOf('manager') !== -1))) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  };

  return (
    <Route component={App} path="/">
      <IndexRoute component={Home} onEnter={requireAuth} />
      <Route component={Login} path="/login" />
      <Route component={Debtors} onEnter={requireAuth} path="debtors">
        <Route component={Debtor} path="/debtors/:id" />
        <Redirect from="debtors/:id" to="/debtors/:id" />
      </Route>
      <Route component={Users} onEnter={requireManager} path="users" />
        <Route component={NotFound} path="*" />
    </Route>
  );
}
