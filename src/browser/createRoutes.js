import App from './app/App.react';
import Home from './home/Page.react';
import NotFound from './notfound/Page.react';
import React from 'react';
import Debtors from './debtors/Page.react';
import Debtor from './debtors/Debtor.react';
import { Redirect, IndexRoute, Route } from 'react-router';

export default function createRoutes(getState) {
  return (
    <Route component={App} path="/">
      <IndexRoute component={Home} />
      <Route component={Debtors} path="debtorList">
        <Route component={Debtor} path="/debtors/:id" />
        <Redirect from="debtors/:id" to="/debtors/:id" />
      </Route>
      <Route component={NotFound} path="*" />
    </Route>
  );
}
