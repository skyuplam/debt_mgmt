import App from './app/App.react';
import Home from './home/Page.react';
import NotFound from './notfound/Page.react';
import React from 'react';
import Debtors from './debtors/Page.react';
import Debtor from './debtors/Debtor.react';
import Login from './auth/Login.react';
import Users from './users/Users.react';
import Agencies from './agencies/Agencies.react';
import Portfolios from './portfolios/Portfolios.react';
import Boarding from './upload/Boarding.react';
import { IndexRoute, Route } from 'react-router';
import { LINKS } from '../common/app/actions';

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
    <Route component={App} path={LINKS.home} >
      <IndexRoute component={Home} onEnter={requireAuth} />
      <Route component={Login} path={LINKS.login} />
      <Route component={Debtors} onEnter={requireAuth} path={LINKS.debtors} >
        <Route component={Debtor} path={`/${LINKS.debtors}/:id`} />
      </Route>
      <Route component={Users} onEnter={requireManager} path={LINKS.users} />
      <Route component={Portfolios} onEnter={requireManager} path={LINKS.portfolios} />
      <Route component={Agencies} onEnter={requireManager} path={LINKS.agencies} />
      <Route component={Boarding} onEnter={requireManager} path={LINKS.boarding} />
      <Route component={NotFound} path="*" />
    </Route>
  );
}
