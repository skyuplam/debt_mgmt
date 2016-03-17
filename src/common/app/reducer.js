import { combineReducers } from 'redux';
import { reduxFields } from '../lib/redux-fields';
import { routerReducer as routing } from 'react-router-redux';

import auth from '../auth/reducer';
import config from '../config/reducer';
import device from '../device/reducer';
import intl from '../intl/reducer';
import todos from '../todos/reducer';
import ui from '../ui/reducer';
import users from '../users/reducer';
import debtors from '../debtors/reducer';
import loans from '../loans/reducer';
import repaymentPlans from '../repaymentPlans/reducer';
import repayments from '../repayments/reducer';
import contactNumbers from '../contactNumbers/reducer';

const appReducer = combineReducers({
  auth,
  config,
  device,
  intl,
  reduxFields,
  routing,
  todos,
  debtors,
  loans,
  repaymentPlans,
  repayments,
  contactNumbers,
  ui,
  users
});

export default appReducer;
